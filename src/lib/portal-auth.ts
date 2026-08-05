/* ============================================================
   Client portal authentication — server only.

   Access codes are checked on the server and exchanged for an
   HMAC-signed, httpOnly session cookie. Nothing about which
   workspaces exist, or what their codes are, reaches the browser.

   Clients are configured through the environment so no database is
   needed for a handful of active projects:

     PORTAL_SESSION_SECRET — long random string; signs the session cookie
     PORTAL_CLIENTS        — JSON array of { code, workspace, label }
     PORTAL_DISABLE_DEMO   — set to "1" to switch the demo login off

   Example:
     PORTAL_CLIENTS='[{"code":"NW-4821","workspace":"northwind","label":"Northwind Labs"}]'

   When the client list outgrows an env var, replace `clients()` and
   `verifyCode()` with database lookups — nothing else has to change.
   ============================================================ */

import { createHmac, timingSafeEqual } from "node:crypto";
import { DEMO_ACCESS_CODE, DEMO_WORKSPACE_ID } from "@/lib/portal";

export type PortalClient = {
  code: string;
  /** Key into the workspace registry in src/lib/portal.ts */
  workspace: string;
  label?: string;
};

export type PortalSession = {
  workspace: string;
  expires: number;
};

const COOKIE_NAME = "maby_portal";
const SESSION_DAYS = 7;

export function sessionCookieName() {
  return COOKIE_NAME;
}

export function sessionMaxAge() {
  return SESSION_DAYS * 24 * 60 * 60;
}

function secret() {
  const fromEnv = process.env.PORTAL_SESSION_SECRET;
  if (fromEnv && fromEnv.length >= 16) return fromEnv;

  // Development fallback. Sessions signed with this are still tamper-proof
  // within a single deployment, but set the real variable in production.
  if (process.env.NODE_ENV === "production") {
    console.warn(
      "[portal] PORTAL_SESSION_SECRET is unset or too short — portal sessions are using a default key.",
    );
  }
  return "maby-portal-development-signing-key";
}

/** The configured clients, plus the demo login unless it's disabled. */
function clients(): PortalClient[] {
  const list: PortalClient[] = [];

  const raw = process.env.PORTAL_CLIENTS;
  if (raw) {
    try {
      const parsed: unknown = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        for (const entry of parsed) {
          if (
            entry &&
            typeof entry === "object" &&
            typeof (entry as PortalClient).code === "string" &&
            typeof (entry as PortalClient).workspace === "string"
          ) {
            list.push(entry as PortalClient);
          }
        }
      }
    } catch {
      console.error("[portal] PORTAL_CLIENTS is not valid JSON — ignoring it.");
    }
  }

  if (process.env.PORTAL_DISABLE_DEMO !== "1") {
    list.push({
      code: DEMO_ACCESS_CODE,
      workspace: DEMO_WORKSPACE_ID,
      label: "Demo workspace",
    });
  }

  return list;
}

/** Whether the demo login is available — the UI only hints at it when it is. */
export function demoEnabled() {
  return process.env.PORTAL_DISABLE_DEMO !== "1";
}

/** Constant-time string compare that tolerates differing lengths. */
function safeEqual(a: string, b: string) {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) return false;
  return timingSafeEqual(bufA, bufB);
}

/** Resolve an access code to a workspace id, or null if it doesn't match. */
export function verifyCode(input: string): string | null {
  const candidate = input.trim().toUpperCase();
  if (!candidate) return null;

  for (const client of clients()) {
    if (safeEqual(candidate, client.code.trim().toUpperCase())) {
      return client.workspace;
    }
  }
  return null;
}

function sign(payload: string) {
  return createHmac("sha256", secret()).update(payload).digest("base64url");
}

/** Build a signed cookie value for a workspace. */
export function createSession(workspace: string): string {
  const expires = Date.now() + sessionMaxAge() * 1000;
  const payload = `${workspace}.${expires}`;
  return `${payload}.${sign(payload)}`;
}

/** Validate a cookie value. Returns null when missing, tampered or expired. */
export function readSession(value: string | undefined): PortalSession | null {
  if (!value) return null;

  const parts = value.split(".");
  if (parts.length !== 3) return null;

  const [workspace, expiresRaw, signature] = parts;
  const payload = `${workspace}.${expiresRaw}`;

  if (!safeEqual(signature, sign(payload))) return null;

  const expires = Number(expiresRaw);
  if (!Number.isFinite(expires) || expires < Date.now()) return null;

  return { workspace, expires };
}
