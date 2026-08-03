import { NextResponse } from "next/server";
import { isConfigured, respond } from "@/lib/assistant/engine";
import { appendTurn, resetSession } from "@/lib/assistant/sessions";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/* ============================================================
   Telegram webhook.

   Setup (once, from a terminal):

     curl -X POST "https://api.telegram.org/bot<TOKEN>/setWebhook" \
       -d "url=https://mabyconnect.site/api/telegram" \
       -d "secret_token=<TELEGRAM_WEBHOOK_SECRET>"

   Environment:
     TELEGRAM_BOT_TOKEN      — from @BotFather
     TELEGRAM_WEBHOOK_SECRET — any long random string; Telegram echoes
                               it back in a header so we can prove the
                               request really came from Telegram
   ============================================================ */

const API = "https://api.telegram.org";

type TelegramUpdate = {
  message?: {
    chat?: { id?: number };
    from?: { first_name?: string };
    text?: string;
  };
};

async function send(chatId: number, text: string) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  if (!token) return;

  // Telegram hard-caps messages at 4096 characters.
  const body = text.length > 4000 ? `${text.slice(0, 3990)}…` : text;

  const res = await fetch(`${API}/bot${token}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: chatId,
      text: body,
      disable_web_page_preview: true,
    }),
  });

  if (!res.ok) {
    console.error("[telegram] send failed", res.status, await res.text());
  }
}

async function sendTyping(chatId: number) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  if (!token) return;
  await fetch(`${API}/bot${token}/sendChatAction`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: chatId, action: "typing" }),
  }).catch(() => {});
}

export async function POST(request: Request) {
  const secret = process.env.TELEGRAM_WEBHOOK_SECRET;
  if (
    secret &&
    request.headers.get("x-telegram-bot-api-secret-token") !== secret
  ) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  let update: TelegramUpdate;
  try {
    update = await request.json();
  } catch {
    return NextResponse.json({ ok: true });
  }

  const chatId = update.message?.chat?.id;
  const text = update.message?.text?.trim();

  // Always 200 to Telegram — a non-200 makes it retry the same update.
  if (!chatId || !text) return NextResponse.json({ ok: true });

  try {
    if (text === "/start" || text === "/help") {
      resetSession(`tg:${chatId}`);
      const name = update.message?.from?.first_name;
      await send(
        chatId,
        `${name ? `Hi ${name} — ` : ""}I'm Maby AI, the AI arm of Maby Connect.\n\nAsk me about anything Matthew builds: the companies, the agency, Maby Academy or the communities. If you want something built or want in on a venture, tell me and I'll pass your details straight to him.\n\nSend /reset any time to start over.`,
      );
      return NextResponse.json({ ok: true });
    }

    if (text === "/reset") {
      resetSession(`tg:${chatId}`);
      await send(chatId, "Cleared — we're starting fresh. What can I help with?");
      return NextResponse.json({ ok: true });
    }

    if (!isConfigured()) {
      await send(
        chatId,
        "I'm not connected to my brain right now. Email hello@mabyconnect.com and a human will pick this up.",
      );
      return NextResponse.json({ ok: true });
    }

    await sendTyping(chatId);

    const key = `tg:${chatId}`;
    const history = appendTurn(key, { role: "user", content: text.slice(0, 2000) });
    const reply = await respond(history, "telegram");

    appendTurn(key, { role: "assistant", content: reply });
    await send(chatId, reply);
  } catch (err) {
    console.error("[telegram] handler failed", err);
    await send(
      chatId,
      "Something went wrong on my end. Try again in a moment, or email hello@mabyconnect.com.",
    ).catch(() => {});
  }

  return NextResponse.json({ ok: true });
}

/** Lets you confirm the route is deployed before pointing Telegram at it. */
export async function GET() {
  return NextResponse.json({
    channel: "telegram",
    ready: Boolean(process.env.TELEGRAM_BOT_TOKEN) && isConfigured(),
    hasBotToken: Boolean(process.env.TELEGRAM_BOT_TOKEN),
    hasWebhookSecret: Boolean(process.env.TELEGRAM_WEBHOOK_SECRET),
    hasApiKey: isConfigured(),
  });
}
