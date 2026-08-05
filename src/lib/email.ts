/* ============================================================
   Transactional email — server only.

   Talks to Resend's REST API directly, so there's no SDK to install
   or keep up to date. When RESEND_API_KEY is absent the sender logs
   the message instead of throwing, which keeps local development and
   preview deploys working without credentials.

   Required to go live:
     RESEND_API_KEY      — from resend.com/api-keys
     AGENCY_FROM_EMAIL   — a verified sender, e.g. "Maby Agency <build@mabyconnect.com>"
     AGENCY_NOTIFY_EMAIL — where new enquiries land (defaults to the from address)
   ============================================================ */

export type EmailMessage = {
  to: string;
  subject: string;
  /** Plain text body. Rendered into a minimal HTML wrapper as well. */
  text: string;
  replyTo?: string;
};

export type EmailResult = { delivered: boolean; skipped?: boolean };

const ENDPOINT = "https://api.resend.com/emails";

export function agencyInbox() {
  return (
    process.env.AGENCY_NOTIFY_EMAIL ??
    process.env.AGENCY_FROM_EMAIL ??
    "build@mabyconnect.com"
  );
}

/** Wraps plain text in a dark, brand-consistent HTML shell. */
function toHtml(text: string) {
  const body = text
    .split("\n")
    .map((line) =>
      line.trim()
        ? `<p style="margin:0 0 12px;line-height:1.6">${escapeHtml(line)}</p>`
        : "",
    )
    .join("");

  return `<div style="font-family:ui-sans-serif,system-ui,sans-serif;font-size:15px;color:#111">${body}</div>`;
}

function escapeHtml(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/**
 * Sends one email. Never throws — callers treat email as best-effort so a
 * provider outage can't lose an enquiry that was otherwise accepted.
 */
export async function sendEmail(message: EmailMessage): Promise<EmailResult> {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.AGENCY_FROM_EMAIL;

  if (!apiKey || !from) {
    console.info("[email] not configured — would have sent", {
      to: message.to,
      subject: message.subject,
    });
    return { delivered: false, skipped: true };
  }

  try {
    const res = await fetch(ENDPOINT, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: [message.to],
        subject: message.subject,
        text: message.text,
        html: toHtml(message.text),
        ...(message.replyTo ? { reply_to: message.replyTo } : {}),
      }),
    });

    if (!res.ok) {
      console.error("[email] send failed", res.status, await res.text());
      return { delivered: false };
    }

    return { delivered: true };
  } catch (err) {
    console.error("[email] send threw", err);
    return { delivered: false };
  }
}

/** Fire several emails without letting one failure block the others. */
export async function sendAll(messages: EmailMessage[]) {
  return Promise.all(messages.map((m) => sendEmail(m)));
}
