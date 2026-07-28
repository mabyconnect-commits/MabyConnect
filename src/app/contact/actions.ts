"use server";

export type ContactState = {
  status: "idle" | "success" | "error";
  message: string;
};

/**
 * Server Action for the contact form.
 *
 * This validates input and (for now) logs the enquiry on the server.
 * To make it live, wire an email/CRM provider where indicated below
 * (e.g. Resend, Postmark, or a Notion/Sheets webhook).
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
    // TODO: integrate a real delivery mechanism here.
    // await resend.emails.send({ ... })
    console.info("[contact] new enquiry", { name, email, topic, length: message.length });

    // Small delay so the UI transition feels intentional.
    await new Promise((r) => setTimeout(r, 600));

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
