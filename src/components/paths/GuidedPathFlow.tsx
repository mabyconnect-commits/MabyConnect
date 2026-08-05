"use client";

import { useMemo, useState, useTransition } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Check, Info, Loader2, RefreshCw } from "lucide-react";
import { resolveOutcome, type GuidedPath } from "@/lib/paths";
import { submitPath, type SubmitState } from "@/app/start/actions";
import { cn } from "@/lib/utils";

type Answers = Record<string, string[]>;

export default function GuidedPathFlow({ path }: { path: GuidedPath }) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [contact, setContact] = useState({ name: "", email: "", note: "", website: "" });
  const [state, setState] = useState<SubmitState>({ status: "idle", message: "" });
  const [pending, startTransition] = useTransition();

  const total = path.steps.length;
  const done = step >= total;
  const current = path.steps[step];
  const picked = current ? (answers[current.id] ?? []) : [];
  const outcome = useMemo(() => resolveOutcome(path, answers), [path, answers]);

  const select = (id: string, value: string, multi?: boolean) => {
    setAnswers((prev) => {
      const existing = prev[id] ?? [];
      if (!multi) return { ...prev, [id]: [value] };
      return {
        ...prev,
        [id]: existing.includes(value)
          ? existing.filter((v) => v !== value)
          : [...existing, value],
      };
    });
  };

  const send = () => {
    startTransition(async () => {
      setState(
        await submitPath({
          ...contact,
          path: path.slug,
          pathTitle: path.intent,
          outcome: outcome.title,
          answers,
        }),
      );
    });
  };

  /* ---------- Sent ---------- */
  if (state.status === "success") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-3xl border border-line bg-surface/40 p-10 md:p-14"
      >
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-gold-soft">
          <Check className="h-6 w-6 text-gold" />
        </span>
        <h2 className="display mt-8 text-3xl text-white md:text-5xl">Got it.</h2>
        <p className="mt-4 max-w-lg text-lg text-mist">{state.message}</p>
        {state.reference && (
          <p className="mt-8 font-mono text-xs tracking-widest text-faint uppercase">
            Reference <span className="text-gold">{state.reference}</span>
          </p>
        )}
        <div className="mt-10 flex flex-wrap gap-4">
          <a
            href={path.cta.href}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-white px-7 py-3.5 text-sm font-medium text-ink transition-colors hover:bg-gold"
          >
            {path.cta.label}
            <ArrowRight className="h-4 w-4" />
          </a>
          <Link
            href="/start"
            className="inline-flex items-center gap-2 rounded-full border border-line-strong px-7 py-3.5 text-sm text-white transition-colors hover:border-white"
          >
            Explore another path
          </Link>
        </div>
      </motion.div>
    );
  }

  /* ---------- Result ---------- */
  if (done) {
    return (
      <div className="space-y-10">
        <Progress current={total} total={total} />

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <p className="eyebrow">Your route</p>
          <h2 className="display mt-5 text-[clamp(2rem,6vw,4rem)] leading-[0.95] text-white">
            {outcome.title}
          </h2>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-mist">
            {outcome.summary}
          </p>

          <div className="mt-10">
            <p className="eyebrow mb-5">How it works</p>
            <ol className="divide-y divide-line rounded-2xl border border-line">
              {outcome.steps.map((s, i) => (
                <li key={s} className="flex gap-5 px-5 py-4">
                  <span className="font-mono text-[10px] text-gold">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="text-sm leading-relaxed text-white/85">{s}</span>
                </li>
              ))}
            </ol>
          </div>

          {outcome.note && (
            <div className="mt-6 flex gap-3 rounded-2xl border border-gold/25 bg-gold-soft p-5">
              <Info className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
              <p className="text-sm leading-relaxed text-white/80">{outcome.note}</p>
            </div>
          )}

          {/* Contact */}
          <div className="mt-12 rounded-3xl border border-line bg-surface/40 p-8 md:p-10">
            <h3 className="display text-2xl text-white md:text-3xl">
              Want us to walk you through it?
            </h3>
            <p className="mt-3 max-w-md text-mist">
              Leave your details and someone from {path.companyName} will reach out
              personally — no automated sequence.
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <input
                value={contact.name}
                onChange={(e) => setContact({ ...contact, name: e.target.value })}
                placeholder="Your name"
                autoComplete="name"
                className="w-full rounded-xl border border-line bg-ink px-4 py-3.5 text-white placeholder-faint outline-none transition-colors focus:border-gold"
              />
              <input
                value={contact.email}
                onChange={(e) => setContact({ ...contact, email: e.target.value })}
                placeholder="Email or phone"
                autoComplete="email"
                className="w-full rounded-xl border border-line bg-ink px-4 py-3.5 text-white placeholder-faint outline-none transition-colors focus:border-gold"
              />
              <textarea
                value={contact.note}
                onChange={(e) => setContact({ ...contact, note: e.target.value })}
                placeholder="Anything else we should know?"
                rows={3}
                className="w-full resize-none rounded-xl border border-line bg-ink px-4 py-3.5 text-white placeholder-faint outline-none transition-colors focus:border-gold sm:col-span-2"
              />
              <input
                value={contact.website}
                onChange={(e) => setContact({ ...contact, website: e.target.value })}
                tabIndex={-1}
                autoComplete="off"
                aria-hidden
                className="hidden"
              />
            </div>

            {state.status === "error" && (
              <p className="mt-5 text-sm text-gold">{state.message}</p>
            )}

            <div className="mt-8 flex flex-wrap items-center gap-5">
              <button
                type="button"
                onClick={send}
                disabled={pending}
                className="group inline-flex items-center gap-2 rounded-full bg-white px-8 py-4 text-sm font-medium text-ink transition-colors hover:bg-gold disabled:opacity-70"
              >
                {pending ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" /> Sending
                  </>
                ) : (
                  <>
                    Send my answers
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={() => setStep(total - 1)}
                className="inline-flex items-center gap-2 text-sm text-faint transition-colors hover:text-white"
              >
                <ArrowLeft className="h-4 w-4" /> Change answers
              </button>
              <button
                type="button"
                onClick={() => {
                  setStep(0);
                  setAnswers({});
                }}
                className="inline-flex items-center gap-2 text-sm text-faint transition-colors hover:text-white"
              >
                <RefreshCw className="h-3.5 w-3.5" /> Start over
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  /* ---------- Questions ---------- */
  return (
    <div className="space-y-10">
      <Progress current={step} total={total} />

      <AnimatePresence mode="wait">
        <motion.div
          key={current.id}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -16 }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
        >
          <h2 className="display max-w-3xl text-[clamp(1.8rem,5vw,3.2rem)] leading-[1] text-white">
            {current.question}
          </h2>
          <p className="mt-5 max-w-xl text-mist">{current.helper}</p>

          <div className="mt-10 grid gap-3 sm:grid-cols-2">
            {current.options.map((o) => {
              const selected = picked.includes(o.value);
              return (
                <button
                  key={o.value}
                  type="button"
                  onClick={() => {
                    select(current.id, o.value, current.multi);
                    if (!current.multi) setTimeout(() => setStep((s) => s + 1), 220);
                  }}
                  aria-pressed={selected}
                  className={cn(
                    "group flex w-full items-start gap-4 rounded-2xl border p-5 text-left transition-all duration-300",
                    selected
                      ? "border-gold/50 bg-gold-soft"
                      : "border-line bg-surface/40 hover:border-line-strong hover:bg-surface",
                  )}
                >
                  <span
                    className={cn(
                      "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center border transition-colors",
                      current.multi ? "rounded-md" : "rounded-full",
                      selected ? "border-gold bg-gold" : "border-line-strong",
                    )}
                  >
                    {selected && <Check className="h-3 w-3 text-ink" />}
                  </span>
                  <span>
                    <span
                      className={cn(
                        "block text-base transition-colors",
                        selected ? "text-white" : "text-white/80 group-hover:text-white",
                      )}
                    >
                      {o.label}
                    </span>
                    {o.hint && (
                      <span className="mt-1 block text-sm text-faint">{o.hint}</span>
                    )}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="mt-10 flex items-center gap-5">
            {step > 0 && (
              <button
                type="button"
                onClick={() => setStep((s) => s - 1)}
                className="inline-flex items-center gap-2 text-sm text-faint transition-colors hover:text-white"
              >
                <ArrowLeft className="h-4 w-4" /> Back
              </button>
            )}
            {current.multi && (
              <button
                type="button"
                onClick={() => setStep((s) => s + 1)}
                disabled={picked.length === 0}
                className="group inline-flex items-center gap-2 rounded-full bg-white px-7 py-3.5 text-sm font-medium text-ink transition-colors hover:bg-gold disabled:opacity-40"
              >
                Continue
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </button>
            )}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

function Progress({ current, total }: { current: number; total: number }) {
  return (
    <div className="flex items-center gap-4">
      <div className="h-px flex-1 bg-line">
        <motion.div
          className="h-px bg-gold"
          initial={false}
          animate={{ scaleX: current / total }}
          style={{ originX: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        />
      </div>
      <span className="font-mono text-[10px] tracking-widest text-faint uppercase">
        {String(Math.min(current, total)).padStart(2, "0")} / {String(total).padStart(2, "0")}
      </span>
    </div>
  );
}
