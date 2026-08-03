/* ============================================================
   Maby AI — the conversation engine.

   One core, three channels. The web widget streams from it; the
   Telegram and WhatsApp webhooks await a complete reply.

   Model choices, and why:
   - claude-opus-5 with adaptive thinking left ON at low effort.
     Disabling thinking on Opus 5 can make it emit tool calls as
     plain text (the call silently never runs) and leak <thinking>
     tags into replies — exactly the failure mode we set out to
     avoid. Low effort gets the cost and latency back safely.
   - The system prompt is byte-stable and cached, so every request
     after the first pays cache-read rates for the whole brain.
   - Server-side refusal fallbacks are on, so a declined request is
     answered by a fallback model instead of dead-ending.
   ============================================================ */

import Anthropic from "@anthropic-ai/sdk";
import { buildSystemPrompt, type Channel } from "@/lib/brain";
import { runTool, tools } from "./tools";

export const MODEL = "claude-opus-5";

/** Hard ceiling on tool round-trips, so a loop can never run away. */
const MAX_TOOL_ROUNDS = 4;

export type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

let client: Anthropic | null = null;

export function getClient() {
  if (!process.env.ANTHROPIC_API_KEY) return null;
  client ??= new Anthropic();
  return client;
}

export function isConfigured() {
  return Boolean(process.env.ANTHROPIC_API_KEY);
}

/** Shared request shape. `system` is cached — keep it byte-stable. */
function baseParams(channel: Channel) {
  return {
    model: MODEL,
    max_tokens: 2048,
    // Left on deliberately — see the note at the top of this file.
    thinking: { type: "adaptive" as const },
    output_config: { effort: "low" as const },
    system: [
      {
        type: "text" as const,
        text: buildSystemPrompt(channel),
        cache_control: { type: "ephemeral" as const },
      },
    ],
    tools,
    betas: ["server-side-fallback-2026-07-01"],
    fallbacks: "default" as const,
  };
}

/** Trim history so a long conversation can't grow without bound. */
export function trimHistory(messages: ChatMessage[], keep = 20): ChatMessage[] {
  return messages.slice(-keep);
}

function toApiMessages(history: ChatMessage[]): Anthropic.Beta.BetaMessageParam[] {
  return history
    .filter((m) => m.content.trim().length > 0)
    .map((m) => ({ role: m.role, content: m.content }));
}

/** Pull just the visible text out of a response, dropping thinking blocks. */
function textOf(content: Anthropic.Beta.BetaContentBlock[]): string {
  return content
    .filter((b): b is Anthropic.Beta.BetaTextBlock => b.type === "text")
    .map((b) => b.text)
    .join("")
    .trim();
}

/**
 * Runs a full turn including any tool round-trips and returns the final text.
 * Used by the Telegram and WhatsApp channels, which have no streaming UI.
 */
export async function respond(
  history: ChatMessage[],
  channel: Channel,
): Promise<string> {
  const anthropic = getClient();
  if (!anthropic) {
    return "I'm not connected to my brain right now — the API key isn't configured. Email hello@mabyconnect.com and a human will pick this up.";
  }

  const messages = toApiMessages(trimHistory(history));

  for (let round = 0; round <= MAX_TOOL_ROUNDS; round += 1) {
    const response = await anthropic.beta.messages.create({
      ...baseParams(channel),
      messages,
    });

    if (response.stop_reason === "refusal") {
      return "I can't help with that one. Ask me about anything Matthew is building and I'll do my best.";
    }

    const toolUses = response.content.filter(
      (b): b is Anthropic.Beta.BetaToolUseBlock => b.type === "tool_use",
    );

    if (toolUses.length === 0) {
      return textOf(response.content) || "Sorry — I didn't catch that. Try again?";
    }

    // Preserve the full assistant turn, then answer every tool call in one
    // user message. Splitting them trains the model out of parallel calls.
    messages.push({ role: "assistant", content: response.content });

    const results = await Promise.all(
      toolUses.map(async (use) => ({
        type: "tool_result" as const,
        tool_use_id: use.id,
        content: await runTool(
          use.name,
          (use.input ?? {}) as Record<string, unknown>,
          channel,
        ),
      })),
    );

    messages.push({ role: "user", content: results });
  }

  return "That took more steps than expected. Could you ask me again more simply?";
}

/**
 * Streams a turn as newline-delimited JSON events for the web widget.
 * Tool calls are executed between streamed segments, so the browser never
 * sees tool syntax — only text and a `tool` status event.
 */
export async function* stream(
  history: ChatMessage[],
  channel: Channel = "web",
): AsyncGenerator<
  | { type: "text"; text: string }
  | { type: "tool"; name: string }
  | { type: "done" }
  | { type: "error"; message: string }
> {
  const anthropic = getClient();
  if (!anthropic) {
    yield {
      type: "error",
      message:
        "I'm not connected to my brain right now. Email hello@mabyconnect.com and a human will pick this up.",
    };
    return;
  }

  const messages = toApiMessages(trimHistory(history));

  try {
    for (let round = 0; round <= MAX_TOOL_ROUNDS; round += 1) {
      const streamed = anthropic.beta.messages.stream({
        ...baseParams(channel),
        messages,
      });

      for await (const event of streamed) {
        if (
          event.type === "content_block_delta" &&
          event.delta.type === "text_delta"
        ) {
          yield { type: "text", text: event.delta.text };
        }
      }

      const final = await streamed.finalMessage();

      if (final.stop_reason === "refusal") {
        yield {
          type: "error",
          message: "I can't help with that one — ask me about what Matthew builds.",
        };
        return;
      }

      const toolUses = final.content.filter(
        (b): b is Anthropic.Beta.BetaToolUseBlock => b.type === "tool_use",
      );

      if (toolUses.length === 0) {
        yield { type: "done" };
        return;
      }

      for (const use of toolUses) yield { type: "tool", name: use.name };

      messages.push({ role: "assistant", content: final.content });
      const results = await Promise.all(
        toolUses.map(async (use) => ({
          type: "tool_result" as const,
          tool_use_id: use.id,
          content: await runTool(
            use.name,
            (use.input ?? {}) as Record<string, unknown>,
            channel,
          ),
        })),
      );
      messages.push({ role: "user", content: results });
    }

    yield { type: "done" };
  } catch (err) {
    console.error("[maby-ai] stream failed", err);
    yield {
      type: "error",
      message: "Something went wrong on my end. Try again in a moment?",
    };
  }
}
