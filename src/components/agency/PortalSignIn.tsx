"use client";

import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";
import { motion } from "framer-motion";
import { ArrowRight, KeyRound, Loader2, LockKeyhole } from "lucide-react";
import Logo from "@/components/ui/Logo";
import { signIn, type PortalAuthState } from "@/app/agency/portal/auth-actions";

const initial: PortalAuthState = { status: "idle", message: "" };

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="group inline-flex w-full items-center justify-center gap-2 rounded-full bg-white px-7 py-3.5 text-sm font-medium text-ink transition-colors hover:bg-gold disabled:opacity-60"
    >
      {pending ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" /> Checking
        </>
      ) : (
        <>
          Enter portal
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </>
      )}
    </button>
  );
}

export default function PortalSignIn({
  demoCode,
}: {
  /** Present only while the demo login is enabled. */
  demoCode?: string;
}) {
  const [state, formAction] = useActionState(signIn, initial);
  const [code, setCode] = useState("");

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="mx-auto w-full max-w-md"
    >
      <div className="rounded-3xl border border-line bg-surface/40 p-8 md:p-10">
        <div className="flex items-center gap-3">
          <Logo className="h-8 w-8" />
          <div>
            <p className="display text-lg text-white">Client Portal</p>
            <p className="font-mono text-[10px] tracking-widest text-faint uppercase">
              Maby Agency
            </p>
          </div>
        </div>

        <h1 className="display mt-10 text-3xl text-white">Sign in.</h1>
        <p className="mt-3 text-sm leading-relaxed text-mist">
          Track your build, download deliverables and see exactly where your
          money went.
        </p>

        <form action={formAction} className="mt-8 space-y-3">
          <input
            name="email"
            type="email"
            required
            placeholder="Email address"
            autoComplete="email"
            className="w-full rounded-xl border border-line bg-ink px-4 py-3.5 text-sm text-white placeholder-faint outline-none transition-colors focus:border-gold"
          />
          <div className="relative">
            <KeyRound className="absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-faint" />
            <input
              name="code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              required
              placeholder="Access code"
              autoComplete="off"
              className="w-full rounded-xl border border-line bg-ink py-3.5 pr-4 pl-11 text-sm tracking-widest text-white uppercase placeholder-faint placeholder:normal-case placeholder:tracking-normal outline-none transition-colors focus:border-gold"
            />
          </div>

          {state.status === "error" && (
            <p className="text-sm text-gold">{state.message}</p>
          )}

          <SubmitButton />
        </form>

        {demoCode && (
          <div className="mt-8 rounded-2xl border border-gold/25 bg-gold-soft p-5">
            <p className="font-mono text-[10px] tracking-widest text-gold uppercase">
              Demo access
            </p>
            <p className="mt-2 text-sm text-white/80">
              Use any email with the code{" "}
              <button
                type="button"
                onClick={() => setCode(demoCode)}
                className="font-mono text-gold underline decoration-gold/40 underline-offset-4 transition-colors hover:decoration-gold"
              >
                {demoCode}
              </button>{" "}
              to tour a sample project workspace.
            </p>
          </div>
        )}
      </div>

      <p className="mt-6 flex items-center justify-center gap-2 text-xs text-faint">
        <LockKeyhole className="h-3 w-3" />
        Client accounts are issued at project kickoff.
      </p>
    </motion.div>
  );
}
