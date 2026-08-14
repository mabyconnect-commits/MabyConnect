import { NextResponse } from "next/server";
import crypto from "crypto";
import { getClient, isConfigured, MODEL } from "@/lib/assistant/engine";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/* ============================================================
   Why is Maby AI silent?

   When the model call fails, every channel shows the same friendly
   line — "Something went wrong on my end" — because a visitor should
   never read a stack trace. But that leaves no way to tell an expired
   key from an exhausted balance from a rate limit, and the real error
   only exists in the Vercel logs.

   This makes the smallest possible real call (one token) and reports
   what actually came back.

   Public response: whether it works, and a coarse reason.
   With ?secret=<TELEGRAM_WEBHOOK_SECRET>: the provider's own message.

   The distinction matters because provider errors can name the
   account. The coarse reason is enough to act on; the detail is not
   something to hand to anyone who finds the URL.
   ============================================================ */

/** Constant-time compare that tolerates differing lengths. */
function secretMatches(given: string, expected: string) {
  const a = crypto.createHash("sha256").update(given).digest();
  const b = crypto.createHash("sha256").update(expected).digest();
  return crypto.timingSafeEqual(a, b);
}

/** Map a provider failure to something the operator can act on. */
function diagnose(status: number | undefined, message: string) {
  const m = message.toLowerCase();

  // Arrives as a 400 invalid_request_error, not a 401, so it has to be
  // matched on the message or it falls through to "unknown" — which is
  // exactly what happened the first time this fired in production.
  if (m.includes("organization has been disabled") || m.includes("account has been disabled")) {
    return {
      reason: "account_disabled",
      fix: "The Anthropic organization behind this key has been disabled — neither the key nor the credit balance is the problem. Sign in at console.anthropic.com and contact Anthropic support; no change to Vercel will fix it.",
    };
  }
  if (m.includes("credit balance") || m.includes("insufficient")) {
    return {
      reason: "no_credit",
      fix: "The API account has no credit. Add funds at console.anthropic.com/settings/billing — the key itself is fine.",
    };
  }
  if (status === 401 || m.includes("authentication") || m.includes("invalid x-api-key")) {
    return {
      reason: "bad_key",
      fix: "ANTHROPIC_API_KEY is rejected. Re-copy it from console.anthropic.com/settings/keys, update it in Vercel, and redeploy.",
    };
  }
  if (status === 429 || m.includes("rate limit")) {
    return {
      reason: "rate_limited",
      fix: "Rate limited. This clears on its own; if it persists, check usage limits on the API account.",
    };
  }
  if (status === 404 || m.includes("model")) {
    return {
      reason: "model_unavailable",
      fix: "The configured model isn't available to this API account.",
    };
  }
  return { reason: "unknown", fix: "See the provider message (add ?secret= to reveal it) or the Vercel logs." };
}

export async function GET(request: Request) {
  if (!isConfigured()) {
    return NextResponse.json(
      {
        ok: false,
        reason: "not_configured",
        fix: "Set ANTHROPIC_API_KEY in Vercel and redeploy.",
      },
      { status: 503 },
    );
  }

  const secret = process.env.TELEGRAM_WEBHOOK_SECRET;
  const given = new URL(request.url).searchParams.get("secret") ?? "";
  const detailed = Boolean(secret && given && secretMatches(given, secret));

  const client = getClient();
  if (!client) {
    return NextResponse.json({ ok: false, reason: "not_configured" }, { status: 503 });
  }

  const started = Date.now();
  try {
    // Deliberately tiny: this runs on demand and shouldn't cost anything real.
    await client.messages.create({
      model: MODEL,
      max_tokens: 1,
      messages: [{ role: "user", content: "hi" }],
    });

    return NextResponse.json({
      ok: true,
      reason: "healthy",
      latencyMs: Date.now() - started,
    });
  } catch (err) {
    const e = err as { status?: number; message?: string };
    const message = e?.message ?? String(err);
    const { reason, fix } = diagnose(e?.status, message);

    console.error("[maby-ai] health check failed", e?.status, message);

    return NextResponse.json(
      {
        ok: false,
        reason,
        fix,
        status: e?.status ?? null,
        latencyMs: Date.now() - started,
        ...(detailed ? { providerMessage: message } : {}),
      },
      { status: 200 }, // 200 so the body is readable in a browser rather than an error page.
    );
  }
}
