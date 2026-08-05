import { NextResponse } from "next/server";
import crypto from "crypto";
import { site } from "@/lib/site";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/* ============================================================
   Register the Telegram webhook — from a browser.

   Telegram only delivers messages to a URL you've explicitly told it
   about. Setting TELEGRAM_BOT_TOKEN is not enough: without this call
   the bot receives your messages and silently drops them, which looks
   exactly like a broken bot.

   The usual way to do this is a curl from a terminal. That is awkward
   from a phone, and it puts the bot token in your shell history and
   URL bar. This route does it server-side instead, using the token
   already in the environment, so the token never leaves Vercel.

   Visit, once:
     /api/telegram/setup?secret=<TELEGRAM_WEBHOOK_SECRET>

   The webhook URL is derived here and never taken from the query, so
   even a leaked secret cannot point the bot at somebody else's server
   — the worst it can do is re-register the URL we already use.
   ============================================================ */

const API = "https://api.telegram.org";

/** Constant-time compare that tolerates differing lengths. */
function secretMatches(given: string, expected: string) {
  const a = crypto.createHash("sha256").update(given).digest();
  const b = crypto.createHash("sha256").update(expected).digest();
  return crypto.timingSafeEqual(a, b);
}

async function telegram(token: string, method: string, body?: unknown) {
  const res = await fetch(`${API}/bot${token}/${method}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body ?? {}),
    cache: "no-store",
  });
  return (await res.json().catch(() => ({}))) as {
    ok?: boolean;
    result?: unknown;
    description?: string;
  };
}

export async function GET(request: Request) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const secret = process.env.TELEGRAM_WEBHOOK_SECRET;

  if (!token || !secret) {
    return NextResponse.json(
      {
        ok: false,
        error:
          "Set TELEGRAM_BOT_TOKEN and TELEGRAM_WEBHOOK_SECRET in the environment, redeploy, then open this again.",
        hasBotToken: Boolean(token),
        hasWebhookSecret: Boolean(secret),
      },
      { status: 503 },
    );
  }

  const given = new URL(request.url).searchParams.get("secret") ?? "";
  if (!given || !secretMatches(given, secret)) {
    // Same shape either way — don't confirm whether the secret was close.
    return NextResponse.json({ ok: false, error: "Not found." }, { status: 404 });
  }

  const webhookUrl = `${site.url}/api/telegram`;

  const set = await telegram(token, "setWebhook", {
    url: webhookUrl,
    secret_token: secret,
    allowed_updates: ["message"],
    // Messages sent while the webhook was unset are long stale by now;
    // replying to them would be confusing rather than helpful.
    drop_pending_updates: true,
  });

  if (!set.ok) {
    return NextResponse.json(
      { ok: false, error: set.description ?? "Telegram rejected the webhook.", webhookUrl },
      { status: 502 },
    );
  }

  const [me, info] = await Promise.all([
    telegram(token, "getMe"),
    telegram(token, "getWebhookInfo"),
  ]);

  const bot = me.result as { username?: string; first_name?: string } | undefined;
  const hook = info.result as
    | { url?: string; pending_update_count?: number; last_error_message?: string }
    | undefined;

  return NextResponse.json({
    ok: true,
    message: `Webhook registered. Message @${bot?.username ?? "your bot"} on Telegram and send /start.`,
    bot: bot?.username ? `@${bot.username}` : null,
    webhookUrl,
    registeredUrl: hook?.url ?? null,
    pendingUpdates: hook?.pending_update_count ?? 0,
    lastError: hook?.last_error_message ?? null,
  });
}
