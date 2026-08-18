import { NextResponse } from "next/server";
import { isConfigured } from "@/lib/assistant/engine";
import { agencyInbox } from "@/lib/email";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/* ============================================================
   Is anything silently dropping on the floor?

   Every form on this site is deliberately forgiving: an enquiry is
   accepted and confirmed even when email is unavailable, because
   losing someone's details to a provider outage is worse than a
   delayed notification.

   That forgiveness has a cost. With RESEND_API_KEY unset the site
   still tells people "we'll be in touch" while the enquiry only ever
   reaches the server logs — a promise nobody can keep, and nothing
   on the site looks wrong.

   This reports what is actually wired, so that gap is visible without
   reading the source or digging through logs.
   ============================================================ */

export async function GET() {
  const hasResendKey = Boolean(process.env.RESEND_API_KEY);
  const hasFromAddress = Boolean(process.env.AGENCY_FROM_EMAIL);
  const emailWorking = hasResendKey && hasFromAddress;

  const assistantConfigured = isConfigured();
  const hasBotToken = Boolean(process.env.TELEGRAM_BOT_TOKEN);

  return NextResponse.json({
    // The question that costs real money when the answer is wrong.
    enquiries: {
      delivered: emailWorking,
      destination: emailWorking ? agencyInbox() : null,
      warning: emailWorking
        ? null
        : "Form submissions are accepted and confirmed but NOT delivered — they exist only in the server logs, and log retention is finite. Search the logs for '[path] new guided enquiry' or '[maby-ai] lead captured' to recover recent ones.",
      missing: [
        !hasResendKey && "RESEND_API_KEY",
        !hasFromAddress && "AGENCY_FROM_EMAIL",
      ].filter(Boolean),
      affects: emailWorking
        ? []
        : [
            "/start/* guided paths",
            "/agency/start project briefs",
            "/agency/book appointment requests",
            "/contact",
            "Maby AI lead capture (web, Telegram, WhatsApp)",
          ],
    },

    assistant: {
      configured: assistantConfigured,
      // Whether the key actually works needs a live call — that's a
      // separate endpoint so this one stays free and instant.
      liveCheck: "/api/assistant/health",
    },

    channels: {
      web: assistantConfigured,
      telegram: hasBotToken && assistantConfigured,
      whatsapp:
        Boolean(process.env.WHATSAPP_TOKEN) &&
        Boolean(process.env.WHATSAPP_PHONE_NUMBER_ID) &&
        assistantConfigured,
    },
  });
}
