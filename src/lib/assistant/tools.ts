/* ============================================================
   Maby AI — tools.

   Every tool is executed server-side and its result fed back to the
   model. The model NEVER emits tool syntax into the chat: if a call
   fails we return an error result and let it recover in words.
   ============================================================ */

import type Anthropic from "@anthropic-ai/sdk";
import { companies, communities, channels } from "@/lib/data";
import { capabilities, callTypes } from "@/lib/agency";
import { guidedPaths } from "@/lib/paths";
import { agencyInbox, sendAll } from "@/lib/email";
import { site } from "@/lib/site";

export const tools: Anthropic.Tool[] = [
  {
    name: "capture_lead",
    description:
      "Record someone's interest and pass it to Matthew. Call this the moment a person expresses real intent — wanting something built, wanting to invest, wanting to join, wanting to be contacted — AND has given you a name plus an email or phone number. Do not call it speculatively, and never invent contact details: ask for them first. After it succeeds, confirm in your own words and tell them the reference.",
    input_schema: {
      type: "object",
      properties: {
        name: { type: "string", description: "The person's name as they gave it" },
        contact: {
          type: "string",
          description: "Their email address or phone number, exactly as given",
        },
        interest: {
          type: "string",
          enum: [
            "agency-build",
            "real-estate",
            "surlink",
            "ttip-crypto",
            "groceries",
            "academy",
            "community",
            "partnership",
            "other",
          ],
          description: "Which part of Maby Connect they're interested in",
        },
        summary: {
          type: "string",
          description:
            "One or two sentences in your own words: what they want, and anything useful you learned (budget, timeline, experience level)",
        },
      },
      required: ["name", "contact", "interest", "summary"],
      additionalProperties: false,
    },
  },
  {
    name: "lookup",
    description:
      "Look up current, exact details about Maby Connect — a company, an agency capability, the community join links, or the guided paths. Use this whenever you need specifics you are not completely certain of, especially prices, links and statuses. Prefer calling this over guessing.",
    input_schema: {
      type: "object",
      properties: {
        topic: {
          type: "string",
          enum: ["companies", "capabilities", "communities", "paths", "calls"],
          description: "What to look up",
        },
      },
      required: ["topic"],
      additionalProperties: false,
    },
  },
  {
    name: "recommend_path",
    description:
      "Get the link to a tailored question flow for someone who knows what they want but not how to start. Use it when a person is exploring rather than ready to commit — it gives them a route that fits their budget and timeline.",
    input_schema: {
      type: "object",
      properties: {
        path: {
          type: "string",
          enum: [...guidedPaths.map((p) => p.slug), "build"],
          description: "Which guided path fits; use 'build' for agency projects",
        },
      },
      required: ["path"],
      additionalProperties: false,
    },
  },
];

/* ------------------------------------------------------------
   Execution
   ------------------------------------------------------------ */

function reference() {
  const chars = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";
  let out = "";
  for (let i = 0; i < 5; i += 1) out += chars[Math.floor(Math.random() * chars.length)];
  return `AI-${out}`;
}

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phonePattern = /^[+\d][\d\s()-]{6,}$/;

async function captureLead(
  input: Record<string, unknown>,
  channel: string,
): Promise<string> {
  const name = String(input.name ?? "").trim();
  const contact = String(input.contact ?? "").trim();
  const interest = String(input.interest ?? "other");
  const summary = String(input.summary ?? "").trim();

  if (!name || !contact) {
    return "Error: name and contact are both required. Ask the person for whichever is missing before calling again.";
  }

  const isEmail = emailPattern.test(contact);
  if (!isEmail && !phonePattern.test(contact)) {
    return `Error: "${contact}" does not look like a valid email or phone number. Ask them to confirm it.`;
  }

  const ref = reference();

  console.info("[maby-ai] lead captured", { ref, name, contact, interest, channel });

  await sendAll([
    {
      to: agencyInbox(),
      ...(isEmail ? { replyTo: contact } : {}),
      subject: `Maby AI lead — ${name} (${interest}) · ${ref}`,
      text: [
        `Reference: ${ref}`,
        `Channel: ${channel}`,
        "",
        `Name: ${name}`,
        `Contact: ${contact}`,
        `Interest: ${interest}`,
        "",
        "--- What Maby AI learned ---",
        summary,
      ].join("\n"),
    },
  ]);

  return `Lead recorded successfully. Reference ${ref}. Matthew will follow up within 24 hours. Tell the person this in your own words and give them the reference.`;
}

function lookup(topic: string): string {
  switch (topic) {
    case "companies":
      return companies
        .map(
          (c) =>
            `${c.name} — ${c.status}. ${c.summary}${c.url ? ` Site: ${c.url}` : ""} Page: ${site.url}/companies/${c.slug}`,
        )
        .join("\n");
    case "capabilities":
      return capabilities
        .map(
          (c) =>
            `${c.name} — from ${c.from}, ${c.timeline}. Builds: ${c.builds.join(", ")}. Page: ${site.url}/agency/capabilities/${c.slug}`,
        )
        .join("\n");
    case "communities":
      return [
        ...communities.map((c) => `${c.name} (${c.channel}) — ${c.purpose} Join: ${c.href}`),
        ...channels.map((c) => `${c.name} (${c.platform}) — ${c.description} Join: ${c.href}`),
      ].join("\n");
    case "paths":
      return guidedPaths
        .map((p) => `"${p.intent}" — ${p.steps.length} questions. ${site.url}/start/${p.slug}`)
        .join("\n");
    case "calls":
      return callTypes
        .map((c) => `${c.name} (${c.duration}) — ${c.summary} Book: ${site.url}/agency/book`)
        .join("\n");
    default:
      return `Unknown topic "${topic}".`;
  }
}

function recommendPath(path: string): string {
  if (path === "build") {
    return `Agency project configurator: ${site.url}/agency/start — six questions, returns a budget band, a timeline and the capabilities the build needs. To talk first instead: ${site.url}/agency/book`;
  }
  const found = guidedPaths.find((p) => p.slug === path);
  if (!found) return `No path called "${path}".`;
  return `"${found.intent}" — ${found.steps.length} questions covering ${found.steps
    .map((s) => s.id)
    .join(", ")}. Link: ${site.url}/start/${found.slug}`;
}

/** Runs a tool and always returns a string the model can reason about. */
export async function runTool(
  name: string,
  input: Record<string, unknown>,
  channel: string,
): Promise<string> {
  try {
    switch (name) {
      case "capture_lead":
        return await captureLead(input, channel);
      case "lookup":
        return lookup(String(input.topic ?? ""));
      case "recommend_path":
        return recommendPath(String(input.path ?? ""));
      default:
        return `Error: no tool named "${name}".`;
    }
  } catch (err) {
    console.error("[maby-ai] tool failed", name, err);
    return "Error: that lookup failed. Answer from what you already know and offer to connect them with Matthew directly.";
  }
}
