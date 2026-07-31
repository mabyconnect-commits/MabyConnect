"use server";

/**
 * Server Actions for the Maby Agency pipeline.
 *
 * Both actions validate input and log a structured record on the server.
 * To take them live, wire a delivery mechanism where marked below —
 * e.g. Resend/Postmark for email, or a webhook into Notion, Sheets or a CRM.
 * Nothing else in the UI needs to change when you do.
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

  try {
    // TODO: deliver the brief (email / CRM / webhook).
    console.info("[agency] new project brief", {
      name,
      email,
      company: input.company,
      estimate: input.estimate,
      recommended: input.recommended,
      answers: input.answers,
    });

    await new Promise((r) => setTimeout(r, 700));

    return {
      status: "success",
      message: `Thanks ${name.split(" ")[0]} — your brief is with us.`,
      reference: reference("MA"),
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

  try {
    // TODO: create the calendar event and send an invite.
    console.info("[agency] new booking", {
      name,
      email,
      company: input.company,
      callType: input.callType,
      date: input.date,
      time: input.time,
      timezone: input.timezone,
    });

    await new Promise((r) => setTimeout(r, 700));

    return {
      status: "success",
      message: `You're booked, ${name.split(" ")[0]}. A calendar invite is on its way.`,
      reference: reference("MC"),
    };
  } catch {
    return {
      status: "error",
      message: "Something went wrong. Email build@mabyconnect.com and we'll sort it.",
    };
  }
}
