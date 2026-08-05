import { createHmac, timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";
import { isConfigured, respond } from "@/lib/assistant/engine";
import { toWhatsAppText } from "@/lib/assistant/format";
import { appendTurn, resetSession } from "@/lib/assistant/sessions";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/* ============================================================
   WhatsApp Cloud API webhook.

   Setup:
     1. Meta Business account → create an app → add WhatsApp
     2. Add a phone number and get its Phone Number ID
     3. Webhook URL: https://mabyconnect.site/api/whatsapp
        Verify token: whatever you set as WHATSAPP_VERIFY_TOKEN
     4. Subscribe the app to the `messages` field
     5. Submit for review to message people outside your test list

   Environment:
     WHATSAPP_TOKEN           — permanent access token
     WHATSAPP_PHONE_NUMBER_ID — the sending number's ID
     WHATSAPP_VERIFY_TOKEN    — any string; Meta echoes it on setup
     WHATSAPP_APP_SECRET      — app secret, used to verify signatures
   ============================================================ */

const GRAPH = "https://graph.facebook.com/v21.0";

type WhatsAppPayload = {
  entry?: Array<{
    changes?: Array<{
      value?: {
        messages?: Array<{
          from?: string;
          type?: string;
          text?: { body?: string };
        }>;
      };
    }>;
  }>;
};

async function send(to: string, text: string) {
  const token = process.env.WHATSAPP_TOKEN;
  const phoneId = process.env.WHATSAPP_PHONE_NUMBER_ID;
  if (!token || !phoneId) return;

  // WhatsApp caps text bodies at 4096 characters. Trim before converting,
  // so a cut can't land inside a link we're about to flatten.
  const trimmed = text.length > 4000 ? `${text.slice(0, 3990)}…` : text;
  const body = toWhatsAppText(trimmed);

  const res = await fetch(`${GRAPH}/${phoneId}/messages`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      messaging_product: "whatsapp",
      to,
      type: "text",
      text: { preview_url: false, body },
    }),
  });

  if (!res.ok) {
    console.error("[whatsapp] send failed", res.status, await res.text());
  }
}

/** Meta signs every delivery with the app secret. */
function verifySignature(raw: string, header: string | null) {
  const secret = process.env.WHATSAPP_APP_SECRET;
  if (!secret) return true; // Not configured — don't block local testing.
  if (!header?.startsWith("sha256=")) return false;

  const expected = `sha256=${createHmac("sha256", secret).update(raw).digest("hex")}`;
  const a = Buffer.from(header);
  const b = Buffer.from(expected);
  return a.length === b.length && timingSafeEqual(a, b);
}

/** Meta's one-time webhook verification handshake. */
export async function GET(request: Request) {
  const url = new URL(request.url);
  const mode = url.searchParams.get("hub.mode");
  const token = url.searchParams.get("hub.verify_token");
  const challenge = url.searchParams.get("hub.challenge");

  if (mode === "subscribe" && token && token === process.env.WHATSAPP_VERIFY_TOKEN) {
    return new Response(challenge ?? "", {
      status: 200,
      headers: { "Content-Type": "text/plain" },
    });
  }

  // No handshake params — report readiness so you can check the deploy.
  if (!mode) {
    return NextResponse.json({
      channel: "whatsapp",
      ready:
        Boolean(process.env.WHATSAPP_TOKEN) &&
        Boolean(process.env.WHATSAPP_PHONE_NUMBER_ID) &&
        isConfigured(),
      hasToken: Boolean(process.env.WHATSAPP_TOKEN),
      hasPhoneNumberId: Boolean(process.env.WHATSAPP_PHONE_NUMBER_ID),
      hasVerifyToken: Boolean(process.env.WHATSAPP_VERIFY_TOKEN),
      hasAppSecret: Boolean(process.env.WHATSAPP_APP_SECRET),
      hasApiKey: isConfigured(),
    });
  }

  return new Response("Verification failed", { status: 403 });
}

export async function POST(request: Request) {
  const raw = await request.text();

  if (!verifySignature(raw, request.headers.get("x-hub-signature-256"))) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  let payload: WhatsAppPayload;
  try {
    payload = JSON.parse(raw);
  } catch {
    return NextResponse.json({ ok: true });
  }

  const message = payload.entry?.[0]?.changes?.[0]?.value?.messages?.[0];
  const from = message?.from;

  // Always 200 — Meta retries anything else, and status callbacks
  // (delivered/read) arrive on this same endpoint with no message.
  if (!from) return NextResponse.json({ ok: true });

  if (message?.type !== "text" || !message.text?.body) {
    await send(
      from,
      "I can only read text messages at the moment — send me a message and I'll help.",
    ).catch(() => {});
    return NextResponse.json({ ok: true });
  }

  const text = message.text.body.trim();

  try {
    if (/^(reset|start over|restart)$/i.test(text)) {
      resetSession(`wa:${from}`);
      await send(from, "Cleared — starting fresh. What can I help with?");
      return NextResponse.json({ ok: true });
    }

    if (!isConfigured()) {
      await send(
        from,
        "I'm not connected to my brain right now. Email hello@mabyconnect.com and a human will pick this up.",
      );
      return NextResponse.json({ ok: true });
    }

    const key = `wa:${from}`;
    const history = appendTurn(key, { role: "user", content: text.slice(0, 2000) });
    const reply = await respond(history, "whatsapp");

    appendTurn(key, { role: "assistant", content: reply });
    await send(from, reply);
  } catch (err) {
    console.error("[whatsapp] handler failed", err);
    await send(
      from,
      "Something went wrong on my end. Try again shortly, or email hello@mabyconnect.com.",
    ).catch(() => {});
  }

  return NextResponse.json({ ok: true });
}
