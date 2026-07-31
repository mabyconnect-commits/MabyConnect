"use server";

import { agencyInbox, sendAll } from "@/lib/email";
import { site } from "@/lib/site";

export type ContactState = {
  status: "idle" | "success" | "error";
  message: string;
};

/**
 * Server Action for the contact form.
 *
 * Validates the enquiry, then emails it on — a notification to the inbox
 * (reply-to the sender) and a confirmation back to them. Delivery is
 * best-effort; see src/lib/email.ts for the environment variables needed.
 */
export async function submitContact(
  _prev: ContactState,
  formData: FormData,
): Promise<ContactState> {
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const topic = String(formData.get("topic") ?? "").trim();
  const message = String(formData.get("message") ?? "").trim();

  // Honeypot — bots fill hidden fields
  if (String(formData.get("company") ?? "").length > 0) {
    return { status: "success", message: "Thank you — your message is on its way." };
  }

  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  if (!name || !emailValid || !message) {
    return {
      status: "error",
      message: "Please add your name, a valid email and a short message.",
    };
  }

  try {
    console.info("[contact] new enquiry", { name, email, topic, length: message.length });

    await sendAll([
      {
        to: agencyInbox(),
        replyTo: email,
        subject: `New enquiry — ${name}${topic ? ` · ${topic}` : ""}`,
        text: [
          `Name: ${name}`,
          `Email: ${email}`,
          topic ? `Topic: ${topic}` : "",
          "",
          message,
        ]
          .filter(Boolean)
          .join("\n"),
      },
      {
        to: email,
        replyTo: agencyInbox(),
        subject: "Thanks for reaching out — Maby Connect",
        text: [
          `Hi ${name.split(" ")[0]},`,
          "",
          "Thanks for getting in touch. Your message has landed and I'll come back to you personally, usually within 24 hours.",
          "",
          "— Matthew Adeleye",
          site.name,
        ].join("\n"),
      },
    ]);

    return {
      status: "success",
      message: "Thank you, " + name.split(" ")[0] + ". I'll be in touch soon.",
    };
  } catch {
    return {
      status: "error",
      message: "Something went wrong. Please email hello@mabyconnect.com directly.",
    };
  }
}
