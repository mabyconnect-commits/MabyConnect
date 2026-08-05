"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  createSession,
  sessionCookieName,
  sessionMaxAge,
  verifyCode,
} from "@/lib/portal-auth";

export type PortalAuthState = {
  status: "idle" | "error";
  message: string;
};

/**
 * Exchanges an access code for a signed session cookie.
 *
 * The code never round-trips to the client and no workspace data is sent
 * until the cookie is set, so a wrong code reveals nothing.
 */
export async function signIn(
  _prev: PortalAuthState,
  formData: FormData,
): Promise<PortalAuthState> {
  const code = String(formData.get("code") ?? "");
  const workspace = verifyCode(code);

  if (!workspace) {
    // Slow failed attempts slightly to blunt brute-force guessing.
    await new Promise((r) => setTimeout(r, 600));
    return {
      status: "error",
      message: "That code isn't recognised. Check it and try again.",
    };
  }

  const store = await cookies();
  store.set(sessionCookieName(), createSession(workspace), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/agency/portal",
    maxAge: sessionMaxAge(),
  });

  redirect("/agency/portal");
}

export async function signOut() {
  const store = await cookies();
  store.delete({ name: sessionCookieName(), path: "/agency/portal" });
  redirect("/agency/portal");
}
