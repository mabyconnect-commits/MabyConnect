"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Loader2, ArrowRight } from "lucide-react";
import { submitContact, type ContactState } from "./actions";
import { contactTopics } from "@/lib/data";

const initial: ContactState = { status: "idle", message: "" };

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      data-cursor-label="Send"
      className="group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-full bg-white px-8 py-4 text-sm font-medium text-ink transition-colors hover:text-white disabled:opacity-70"
    >
      <span className="absolute inset-0 translate-y-full bg-gold transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-y-0" />
      <span className="relative z-10 flex items-center gap-2">
        {pending ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" /> Sending
          </>
        ) : (
          <>
            Send message
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </>
        )}
      </span>
    </button>
  );
}

export default function ContactForm() {
  const [state, formAction] = useActionState(submitContact, initial);

  const fieldClass =
    "peer w-full border-b border-line bg-transparent py-4 text-lg text-white placeholder-transparent outline-none transition-colors focus:border-white";
  const labelClass =
    "pointer-events-none absolute left-0 top-4 text-lg text-faint transition-all peer-focus:-top-3 peer-focus:text-xs peer-focus:text-gold peer-[:not(:placeholder-shown)]:-top-3 peer-[:not(:placeholder-shown)]:text-xs";

  return (
    <AnimatePresence mode="wait">
      {state.status === "success" ? (
        <motion.div
          key="success"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-start gap-6 rounded-3xl border border-line bg-surface/40 p-10 md:p-12"
        >
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-gold-soft">
            <Check className="h-6 w-6 text-gold" />
          </span>
          <div>
            <h3 className="display text-3xl text-white">Message received.</h3>
            <p className="mt-3 max-w-md text-mist">{state.message}</p>
          </div>
        </motion.div>
      ) : (
        <motion.form
          key="form"
          action={formAction}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-10"
        >
          {/* Honeypot */}
          <input
            type="text"
            name="company"
            tabIndex={-1}
            autoComplete="off"
            className="absolute left-[-9999px] h-0 w-0 opacity-0"
            aria-hidden
          />

          <div className="grid gap-10 md:grid-cols-2">
            <div className="relative">
              <input
                id="name"
                name="name"
                type="text"
                placeholder="Name"
                required
                className={fieldClass}
              />
              <label htmlFor="name" className={labelClass}>
                Your name
              </label>
            </div>
            <div className="relative">
              <input
                id="email"
                name="email"
                type="email"
                placeholder="Email"
                required
                className={fieldClass}
              />
              <label htmlFor="email" className={labelClass}>
                Email address
              </label>
            </div>
          </div>

          <div>
            <p className="eyebrow mb-4">What&apos;s it about?</p>
            <div className="flex flex-wrap gap-3">
              {contactTopics.map((t, i) => (
                <label key={t} className="cursor-pointer">
                  <input
                    type="radio"
                    name="topic"
                    value={t}
                    defaultChecked={i === 0}
                    className="peer sr-only"
                  />
                  <span className="inline-block rounded-full border border-line px-5 py-2 text-sm text-white/70 transition-colors peer-checked:border-gold peer-checked:bg-gold-soft peer-checked:text-gold hover:text-white">
                    {t}
                  </span>
                </label>
              ))}
            </div>
          </div>

          <div className="relative">
            <textarea
              id="message"
              name="message"
              rows={4}
              placeholder="Message"
              required
              className={`${fieldClass} resize-none`}
            />
            <label htmlFor="message" className={labelClass}>
              Tell me about it
            </label>
          </div>

          {state.status === "error" && (
            <p className="text-sm text-gold">{state.message}</p>
          )}

          <SubmitButton />
        </motion.form>
      )}
    </AnimatePresence>
  );
}
