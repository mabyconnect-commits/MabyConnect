import { NextResponse } from "next/server";
import { isConfigured, stream, type ChatMessage } from "@/lib/assistant/engine";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/* ------------------------------------------------------------
   Rate limiting.

   In-memory and therefore per-instance — enough to stop one browser
   hammering the endpoint, not a substitute for a shared limiter if
   this ever gets real abuse. Swap the Map for Redis/Upstash then.
   ------------------------------------------------------------ */

const WINDOW_MS = 60_000;
const MAX_PER_WINDOW = 12;
const hits = new Map<string, number[]>();

function rateLimited(key: string) {
  const now = Date.now();
  const recent = (hits.get(key) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(key, recent);

  // Opportunistic cleanup so the Map can't grow forever.
  if (hits.size > 500) {
    for (const [k, v] of hits) {
      if (v.every((t) => now - t > WINDOW_MS)) hits.delete(k);
    }
  }

  return recent.length > MAX_PER_WINDOW;
}

const MAX_MESSAGE_CHARS = 2000;

export async function POST(request: Request) {
  if (!isConfigured()) {
    return NextResponse.json(
      { error: "The assistant isn't configured yet." },
      { status: 503 },
    );
  }

  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    request.headers.get("x-real-ip") ??
    "anonymous";

  if (rateLimited(ip)) {
    return NextResponse.json(
      { error: "You're sending messages very quickly — give it a moment." },
      { status: 429 },
    );
  }

  let body: { messages?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  if (!Array.isArray(body.messages) || body.messages.length === 0) {
    return NextResponse.json({ error: "No messages provided." }, { status: 400 });
  }

  const history: ChatMessage[] = [];
  for (const raw of body.messages.slice(-24)) {
    if (!raw || typeof raw !== "object") continue;
    const { role, content } = raw as Partial<ChatMessage>;
    if (role !== "user" && role !== "assistant") continue;
    if (typeof content !== "string" || !content.trim()) continue;
    history.push({ role, content: content.slice(0, MAX_MESSAGE_CHARS) });
  }

  if (history.length === 0) {
    return NextResponse.json({ error: "No usable messages." }, { status: 400 });
  }

  const encoder = new TextEncoder();
  const body$ = new ReadableStream({
    async start(controller) {
      try {
        for await (const event of stream(history, "web")) {
          controller.enqueue(encoder.encode(`${JSON.stringify(event)}\n`));
        }
      } catch (err) {
        console.error("[assistant] stream error", err);
        controller.enqueue(
          encoder.encode(
            `${JSON.stringify({ type: "error", message: "Something went wrong." })}\n`,
          ),
        );
      } finally {
        controller.close();
      }
    },
  });

  return new Response(body$, {
    headers: {
      "Content-Type": "application/x-ndjson; charset=utf-8",
      "Cache-Control": "no-store, no-transform",
      "X-Accel-Buffering": "no",
    },
  });
}
