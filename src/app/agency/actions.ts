"use server";

import { agencyInbox, sendAll } from "@/lib/email";
import { configSteps } from "@/lib/agency";

/**
 * Server Actions for the Maby Agency pipeline.
 *
 * Each submission sends two emails: a notification to the agency inbox
 * (reply-to set to the enquirer, so hitting reply just works) and a
 * confirmation to the person who submitted. Email is best-effort — if the
 * provider is down or unconfigured the submission is still accepted and
 * logged, so nothing is lost.
 *
 * See src/lib/email.ts for the environment variables required to go live.
 */

export type SubmitState = {
  status: "idle" | "success" | "error";
  message: string;
  /** Human-quotable reference shown on the confirmation screen. */
  reference?: string;
};

export type BriefInput = {
  name: string;
  email: string;
  company?: string;
  notes?: string;
  /** Raw configurator answers, keyed by step id. */
  answers: Record<string, string[]>;
  estimate: { tier: string; budget: string; weeks: string };
  recommended: string[];
  /** Honeypot — must stay empty. */
  website?: string;
};

export type BookingInput = {
  name: string;
  email: string;
  company?: string;
  notes?: string;
  callType: string;
  date: string;
  time: string;
  timezone: string;
  website?: string;
};

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Short, readable reference: MA-4F9K2. */
function reference(prefix: string) {
  const chars = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";
  let out = "";
  for (let i = 0; i < 5; i += 1) {
    out += chars[Math.floor(Math.random() * chars.length)];
  }
  return `${prefix}-${out}`;
}

/** Turn configurator answer values back into their human labels. */
function readableAnswers(answers: Record<string, string[]>) {
  return configSteps
    .map((step) => {
      const picked = answers[step.id] ?? [];
      if (!picked.length) return null;
      const labels = picked
        .map((v) => step.options.find((o) => o.value === v)?.label ?? v)
        .join(", ");
      return `${step.question}\n  ${labels}`;
    })
    .filter(Boolean)
    .join("\n\n");
}

export async function submitBrief(input: BriefInput): Promise<SubmitState> {
  // Honeypot — bots fill hidden fields.
  if (input.website) {
    return { status: "success", message: "Brief received.", reference: reference("MA") };
  }

  const name = input.name.trim();
  const email = input.email.trim();

  if (!name || !emailPattern.test(email)) {
    return {
      status: "error",
      message: "Please add your name and a valid email so we can send the scope back.",
    };
  }

  const ref = reference("MA");

  try {
    console.info("[agency] new project brief", {
      ref,
      name,
      email,
      company: input.company,
      estimate: input.estimate,
      recommended: input.recommended,
    });

    await sendAll([
      {
        to: agencyInbox(),
        replyTo: email,
        subject: `New project brief — ${name}${input.company ? ` (${input.company})` : ""} · ${ref}`,
        text: [
          `Reference: ${ref}`,
          "",
          `Name: ${name}`,
          `Email: ${email}`,
          input.company ? `Company: ${input.company}` : "",
          "",
          `Estimate: ${input.estimate.tier} · ${input.estimate.budget} · ${input.estimate.weeks}`,
          `Capabilities: ${input.recommended.join(", ")}`,
          "",
          "--- Answers ---",
          readableAnswers(input.answers),
          "",
          input.notes ? `--- Notes ---\n${input.notes}` : "",
        ]
          .filter(Boolean)
          .join("\n"),
      },
      {
        to: email,
        replyTo: agencyInbox(),
        subject: `Your Maby Agency brief — ${ref}`,
        text: [
          `Hi ${name.split(" ")[0]},`,
          "",
          "Thanks for sending your brief through. Here's what we have:",
          "",
          `  Engagement: ${input.estimate.tier}`,
          `  Budget band: ${input.estimate.budget}`,
          `  Build window: ${input.estimate.weeks}`,
          `  Reference: ${ref}`,
          "",
          "That range is indicative, not a quote. We'll read the brief properly and come back within 24 hours with a written scope and a fixed price.",
          "",
          "If you'd rather talk it through first, you can book a call here:",
          "https://mabyconnect.site/agency/book",
          "",
          "— Maby Agency",
        ].join("\n"),
      },
    ]);

    return {
      status: "success",
      message: `Thanks ${name.split(" ")[0]} — your brief is with us.`,
      reference: ref,
    };
  } catch {
    return {
      status: "error",
      message: "Something went wrong. Email build@mabyconnect.com and we'll pick it up.",
    };
  }
}

export async function submitBooking(input: BookingInput): Promise<SubmitState> {
  if (input.website) {
    return { status: "success", message: "Booking confirmed.", reference: reference("MC") };
  }

  const name = input.name.trim();
  const email = input.email.trim();

  if (!name || !emailPattern.test(email)) {
    return {
      status: "error",
      message: "Please add your name and a valid email so we can send the invite.",
    };
  }

  if (!input.callType || !input.date || !input.time) {
    return {
      status: "error",
      message: "Please choose a call type, a date and a time.",
    };
  }

  const ref = reference("MC");

  try {
    console.info("[agency] new booking", {
      ref,
      name,
      email,
      callType: input.callType,
      date: input.date,
      time: input.time,
    });

    await sendAll([
      {
        to: agencyInbox(),
        replyTo: email,
        subject: `Call booked — ${input.callType}, ${input.date} ${input.time} · ${ref}`,
        text: [
          `Reference: ${ref}`,
          "",
          `Name: ${name}`,
          `Email: ${email}`,
          input.company ? `Company: ${input.company}` : "",
          "",
          `Call: ${input.callType}`,
          `When: ${input.date} at ${input.time} (${input.timezone})`,
          "",
          input.notes ? `--- What they want to build ---\n${input.notes}` : "",
        ]
          .filter(Boolean)
          .join("\n"),
      },
      {
        to: email,
        replyTo: agencyInbox(),
        subject: `Confirmed: ${input.callType} on ${input.date}`,
        text: [
          `Hi ${name.split(" ")[0]},`,
          "",
          "Your call is booked:",
          "",
          `  ${input.callType}`,
          `  ${input.date} at ${input.time}`,
          `  ${input.timezone}`,
          `  Reference: ${ref}`,
          "",
          "A calendar invite follows shortly. If you need to move it, just reply to this email.",
          "",
          "Want us to come prepared? Send your project spec ahead of the call:",
          "https://mabyconnect.site/agency/start",
          "",
          "— Maby Agency",
        ].join("\n"),
      },
    ]);

    return {
      status: "success",
      message: `You're booked, ${name.split(" ")[0]}. A confirmation is on its way.`,
      reference: ref,
    };
  } catch {
    return {
      status: "error",
      message: "Something went wrong. Email build@mabyconnect.com and we'll sort it.",
    };
  }
}
