/* ============================================================
   The Maby Brain.

   Composes the hand-written identity (./identity.ts) with every
   factual source already on the site — companies, agency, academy,
   communities, socials — into one system prompt.

   Facts live in exactly one place. Change src/lib/data.ts and the
   assistant knows about it on the next request; there is no second
   copy to drift.
   ============================================================ */

import { companies, communities, channels, projects } from "@/lib/data";
import { capabilities, engagements, agency, callTypes } from "@/lib/agency";
import { site, socials } from "@/lib/site";
import {
  assistant,
  founder,
  guardrails,
  philosophy,
  principles,
  voice,
} from "./identity";

export { assistant, founder } from "./identity";

/* ------------------------------------------------------------
   Fact sections
   ------------------------------------------------------------ */

function companiesSection() {
  return companies
    .map((c) => {
      const lines = [
        `### ${c.name} — ${c.status}`,
        `${c.category} · Est. ${c.year}${c.role ? ` · Matthew's role: ${c.role}` : ""}`,
        c.url ? `Site: ${c.url}` : "No public site yet.",
        c.summary,
        `Key points: ${c.highlights.join("; ")}`,
        `Detail page: ${site.url}/companies/${c.slug}`,
      ];
      return lines.join("\n");
    })
    .join("\n\n");
}

function agencySection() {
  const lanes = capabilities
    .map(
      (c) =>
        `- ${c.name} (from ${c.from}, ${c.timeline}): ${c.tagline} Builds: ${c.builds.join(", ")}. Page: ${site.url}/agency/capabilities/${c.slug}`,
    )
    .join("\n");

  const models = engagements
    .map((e) => `- ${e.name}: ${e.price} / ${e.unit}. Best for ${e.best.toLowerCase()}. ${e.summary}`)
    .join("\n");

  const calls = callTypes
    .map((c) => `- ${c.name} (${c.duration}): ${c.summary}`)
    .join("\n");

  return [
    `Maby Agency is the build arm — the same team that built the companies above takes on outside work.`,
    `Promise: ${agency.promise}`,
    `Contact: ${agency.email}. Response time: ${agency.responseTime}.`,
    "",
    "**Capabilities**",
    lanes,
    "",
    "**How clients engage**",
    models,
    "",
    "**Call types available at " + site.url + "/agency/book**",
    calls,
    "",
    `Anyone unsure of scope should use the project configurator at ${site.url}/agency/start — six questions, and it returns a budget band, a timeline and the capabilities their build needs.`,
    `Existing clients track their build at ${site.url}/agency/portal.`,
  ].join("\n");
}

function communitiesSection() {
  const rooms = communities
    .map((c) => `- ${c.name} (${c.channel}): ${c.purpose} ${c.description} Join: ${c.href}`)
    .join("\n");
  const rest = channels
    .map((c) => `- ${c.name} (${c.platform}): ${c.description} Join: ${c.href}`)
    .join("\n");
  const social = socials.map((s) => `- ${s.label}: ${s.handle} — ${s.href}`).join("\n");

  return [
    "**Communities**",
    rooms,
    "",
    "**Channels**",
    rest,
    "",
    "**Socials**",
    social,
  ].join("\n");
}

function projectsSection() {
  return projects
    .map((p) => `- ${p.title} (${p.domain}, ${p.year}): ${p.blurb}`)
    .join("\n");
}

/* ------------------------------------------------------------
   System prompt
   ------------------------------------------------------------ */

export type Channel = "web" | "telegram" | "whatsapp";

const channelNotes: Record<Channel, string> = {
  web: "You are in a chat widget on the Maby Connect website. The person can click links, so include them when useful. Markdown links render.",
  telegram:
    "You are in Telegram. Plain text only — no markdown tables or headings. Put bare URLs on their own line. Keep messages short; long ones get truncated.",
  whatsapp:
    "You are on WhatsApp. Plain text only. Use *bold* sparingly. Bare URLs on their own line. Keep it very short — this is a messaging app, not a webpage.",
};

/**
 * Builds the full system prompt.
 *
 * Deliberately stable: no timestamps, no per-request values, so the whole
 * thing sits behind one cache breakpoint and every conversation after the
 * first pays cache-read rates for it.
 */
export function buildSystemPrompt(channel: Channel = "web"): string {
  return `You are ${assistant.name}, ${assistant.tagline}.

You represent ${founder.name} (known online as ${founder.known}) — ${founder.role}, based in ${founder.based}.

${founder.short}

# Your job
Help people understand and engage with what Matthew builds: the companies, Maby Agency, Maby Academy and the communities. Point them to the right place, capture their details when they show real intent, and be genuinely useful.

# How you speak
You are:
${voice.is.map((v) => `- ${v}`).join("\n")}

You are not:
${voice.isNot.map((v) => `- ${v}`).join("\n")}

# Rules — these are absolute
${guardrails.map((g, i) => `${i + 1}. ${g}`).join("\n")}

# Advising principles
${principles.map((p) => `- ${p}`).join("\n")}

# The philosophy behind the work
${philosophy.map((p) => `**${p.title}** — ${p.body}`).join("\n\n")}

# The companies
${companiesSection()}

# Maby Agency
${agencySection()}

# Other projects
${projectsSection()}

# Communities and channels
${communitiesSection()}

# Contact
Email: ${site.email}
Phone: ${site.phone}
Site: ${site.url}
Location: ${site.location}

# Guided paths
The site has tailored question flows for people who know what they want but not how to start — real estate, service marketplace, crypto, food, learning to build. Send them to ${site.url}/start and name the one that fits.

# Channel
${channelNotes[channel]}

Answer in at most three short paragraphs unless asked for more. When someone is ready to act, use your tools rather than only describing what they could do.`;
}

/** Cheap sanity check used by the health route and tests. */
export function brainStats() {
  const prompt = buildSystemPrompt("web");
  return {
    characters: prompt.length,
    approxTokens: Math.round(prompt.length / 3.6),
    companies: companies.length,
    capabilities: capabilities.length,
    communities: communities.length + channels.length,
  };
}
