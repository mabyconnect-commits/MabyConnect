"use server";

import { agencyInbox, sendAll } from "@/lib/email";
import { findPath } from "@/lib/paths";

/**
 * Guided path submissions. Same delivery contract as the agency actions:
 * validate, notify the inbox with reply-to set to the enquirer, confirm to
 * them, and never reject a submission because email is unavailable.
 */

export type SubmitState = {
  status: "idle" | "success" | "error";
  message: string;
  reference?: string;
};

export type PathInput = {
  name: string;
  /** Email or phone — people arriving from WhatsApp often prefer a number. */
  email: string;
  note?: string;
  path: string;
  pathTitle: string;
  outcome: string;
  answers: Record<string, string[]>;
  website?: string;
};

function reference() {
  const chars = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";
  let out = "";
  for (let i = 0; i < 5; i += 1) out += chars[Math.floor(Math.random() * chars.length)];
  return `MP-${out}`;
}

/** Turn stored answer values back into their human labels. */
function readable(pathSlug: string, answers: Record<string, string[]>) {
  const path = findPath(pathSlug);
  if (!path) return JSON.stringify(answers, null, 2);

  return path.steps
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

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phonePattern = /^[+\d][\d\s()-]{6,}$/;

export async function submitPath(input: PathInput): Promise<SubmitState> {
  if (input.website) {
    return { status: "success", message: "Received.", reference: reference() };
  }

  const name = input.name.trim();
  const contact = input.email.trim();
  const contactValid = emailPattern.test(contact) || phonePattern.test(contact);

  if (!name || !contactValid) {
    return {
      status: "error",
      message: "Please add your name and an email or phone number we can reach you on.",
    };
  }

  const ref = reference();
  const isEmail = emailPattern.test(contact);

  try {
    console.info("[path] new guided enquiry", {
      ref,
      name,
      contact,
      path: input.path,
      outcome: input.outcome,
    });

    const messages = [
      {
        to: agencyInbox(),
        ...(isEmail ? { replyTo: contact } : {}),
        subject: `${input.pathTitle} — ${name} · ${ref}`,
        text: [
          `Reference: ${ref}`,
          "",
          `Name: ${name}`,
          `Contact: ${contact}`,
          `Path: ${input.pathTitle}`,
          `Recommended route: ${input.outcome}`,
          "",
          "--- Answers ---",
          readable(input.path, input.answers),
          "",
          input.note ? `--- Notes ---\n${input.note}` : "",
        ]
          .filter(Boolean)
          .join("\n"),
      },
    ];

    // Only send a confirmation when we actually have an email address.
    if (isEmail) {
      messages.push({
        to: contact,
        replyTo: agencyInbox(),
        subject: `Your ${input.pathTitle.toLowerCase()} answers — ${ref}`,
        text: [
          `Hi ${name.split(" ")[0]},`,
          "",
          `Thanks for going through the questions. Based on your answers, the route that fits is: ${input.outcome}.`,
          "",
          "Someone will reach out personally to walk you through it — usually within 24 hours.",
          "",
          `Reference: ${ref}`,
          "",
          "— Maby Connect",
        ].join("\n"),
      });
    }

    await sendAll(messages);

    return {
      status: "success",
      message: `Thanks ${name.split(" ")[0]} — we'll be in touch about ${input.outcome.toLowerCase()}.`,
      reference: ref,
    };
  } catch {
    return {
      status: "error",
      message: "Something went wrong. Email hello@mabyconnect.com and we'll pick it up.",
    };
  }
}
