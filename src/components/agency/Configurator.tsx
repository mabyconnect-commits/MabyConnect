"use client";

import { useMemo, useState, useTransition } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Loader2,
  RefreshCw,
  Sparkles,
} from "lucide-react";
import {
  capabilities,
  configSteps,
  estimateBands,
  process,
  type ConfigStep,
} from "@/lib/agency";
import { submitBrief, type SubmitState } from "@/app/agency/actions";
import { cn } from "@/lib/utils";

type Answers = Record<string, string[]>;

/** Score the answers and map them onto a budget band + recommended lanes. */
function buildSpec(answers: Answers) {
  let score = 0;
  const signalCount = new Map<string, number>();

  for (const step of configSteps) {
    const picked = answers[step.id] ?? [];
    for (const value of picked) {
      const option = step.options.find((o) => o.value === value);
      if (!option) continue;
      score += option.weight ?? 0;
      for (const s of option.signals ?? []) {
        signalCount.set(s, (signalCount.get(s) ?? 0) + 1);
      }
    }
  }

  const band =
    estimateBands.find((b) => score <= b.max) ??
    estimateBands[estimateBands.length - 1];

  const recommended = [...signalCount.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([slug]) => slug);

  return {
    score,
    estimate: { tier: band.tier, budget: band.label, weeks: band.weeks },
    // Always return at least one lane so the spec never looks empty.
    recommended: recommended.length ? recommended : ["web-product-engineering"],
  };
}

function ProgressBar({ current, total }: { current: number; total: number }) {
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

function OptionCard({
  label,
  hint,
  selected,
  multi,
  onSelect,
}: {
  label: string;
  hint?: string;
  selected: boolean;
  multi?: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
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
          multi ? "rounded-md" : "rounded-full",
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
          {label}
        </span>
        {hint && <span className="mt-1 block text-sm text-faint">{hint}</span>}
      </span>
    </button>
  );
}

export default function Configurator() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [contact, setContact] = useState({
    name: "",
    email: "",
    company: "",
    notes: "",
    website: "",
  });
  const [state, setState] = useState<SubmitState>({ status: "idle", message: "" });
  const [pending, startTransition] = useTransition();

  const total = configSteps.length;
  const onSpec = step >= total;
  const spec = useMemo(() => buildSpec(answers), [answers]);

  const current: ConfigStep | undefined = configSteps[step];
  const picked = current ? (answers[current.id] ?? []) : [];
  const canContinue = picked.length > 0;

  const select = (stepId: string, value: string, multi?: boolean) => {
    setAnswers((prev) => {
      const existing = prev[stepId] ?? [];
      if (!multi) return { ...prev, [stepId]: [value] };
      return {
        ...prev,
        [stepId]: existing.includes(value)
          ? existing.filter((v) => v !== value)
          : [...existing, value],
      };
    });
  };

  const restart = () => {
    setStep(0);
    setAnswers({});
    setState({ status: "idle", message: "" });
  };

  const send = () => {
    startTransition(async () => {
      const result = await submitBrief({
        ...contact,
        answers,
        estimate: spec.estimate,
        recommended: spec.recommended,
      });
      setState(result);
    });
  };

  /* ---------------- Success ---------------- */
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
        <h2 className="display mt-8 text-3xl text-white md:text-5xl">
          Brief received.
        </h2>
        <p className="mt-4 max-w-lg text-lg text-mist">{state.message}</p>

        {state.reference && (
          <p className="mt-8 font-mono text-xs tracking-widest text-faint uppercase">
            Reference{" "}
            <span className="text-gold">{state.reference}</span>
          </p>
        )}

        <div className="mt-10 rounded-2xl border border-line p-6">
          <p className="eyebrow mb-4">What happens next</p>
          <ol className="space-y-3">
            {[
              "We read the brief and sanity-check the estimate against what you actually described.",
              "You get a written scope with a fixed price and a delivery date — usually within 24 hours.",
              "If it looks right, we book the scoping session and start.",
            ].map((t, i) => (
              <li key={t} className="flex gap-4 text-sm text-white/80">
                <span className="font-mono text-[10px] text-gold">
                  {String(i + 1).padStart(2, "0")}
                </span>
                {t}
              </li>
            ))}
          </ol>
        </div>

        <div className="mt-10 flex flex-wrap gap-4">
          <Link
            href="/agency/book"
            className="inline-flex items-center gap-2 rounded-full bg-white px-7 py-3.5 text-sm font-medium text-ink transition-colors hover:bg-gold"
          >
            Book the call now
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="/agency"
            className="inline-flex items-center gap-2 rounded-full border border-line-strong px-7 py-3.5 text-sm text-white transition-colors hover:border-white"
          >
            Back to the agency
          </Link>
        </div>
      </motion.div>
    );
  }

  /* ---------------- Spec + contact ---------------- */
  if (onSpec) {
    const lanes = capabilities.filter((c) => spec.recommended.includes(c.slug));

    return (
      <div className="space-y-10">
        <ProgressBar current={total} total={total} />

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="flex items-center gap-3">
            <Sparkles className="h-4 w-4 text-gold" />
            <span className="eyebrow">Your build spec</span>
          </div>

          <h2 className="display mt-6 text-[clamp(2rem,6vw,4rem)] leading-[0.95] text-white">
            {spec.estimate.tier}.
          </h2>

          {/* Estimate */}
          <div className="mt-10 grid gap-px overflow-hidden rounded-3xl border border-line bg-line sm:grid-cols-3">
            {[
              { label: "Budget band", value: spec.estimate.budget },
              { label: "Build window", value: spec.estimate.weeks },
              { label: "Engagement", value: spec.estimate.tier },
            ].map((f) => (
              <div key={f.label} className="bg-ink p-6">
                <p className="font-mono text-[10px] tracking-[0.2em] text-faint uppercase">
                  {f.label}
                </p>
                <p className="display mt-3 text-2xl text-white">{f.value}</p>
              </div>
            ))}
          </div>

          <p className="mt-4 text-sm text-faint">
            An indicative range, not a quote. The scoping call turns this into a
            fixed price.
          </p>

          {/* Recommended lanes */}
          <div className="mt-12">
            <p className="eyebrow mb-5">Capabilities this needs</p>
            <div className="grid gap-4 sm:grid-cols-3">
              {lanes.map((c) => (
                <Link
                  key={c.slug}
                  href={`/agency/capabilities/${c.slug}`}
                  className="group rounded-2xl border border-line bg-surface/40 p-5 transition-colors hover:border-gold/40"
                >
                  <p className="font-mono text-[10px] text-gold">{c.index}</p>
                  <p className="mt-3 text-base text-white">{c.name}</p>
                  <p className="mt-2 text-sm text-faint">{c.timeline}</p>
                </Link>
              ))}
            </div>
          </div>

          {/* Phase plan */}
          <div className="mt-12">
            <p className="eyebrow mb-5">Your delivery plan</p>
            <div className="divide-y divide-line rounded-2xl border border-line">
              {process.map((p) => (
                <div key={p.phase} className="flex items-baseline gap-5 px-5 py-4">
                  <span className="font-mono text-[10px] text-gold">{p.phase}</span>
                  <span className="flex-1 text-sm text-white/85">{p.name}</span>
                  <span className="font-mono text-[10px] tracking-widest text-faint uppercase">
                    {p.duration}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div className="mt-14 rounded-3xl border border-line bg-surface/40 p-8 md:p-10">
            <h3 className="display text-2xl text-white md:text-3xl">
              Send this brief to us.
            </h3>
            <p className="mt-3 max-w-md text-mist">
              We&apos;ll come back with a written scope and a fixed price, usually
              within 24 hours.
            </p>

            <div className="mt-8 grid gap-5 sm:grid-cols-2">
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
                placeholder="Email address"
                type="email"
                autoComplete="email"
                className="w-full rounded-xl border border-line bg-ink px-4 py-3.5 text-white placeholder-faint outline-none transition-colors focus:border-gold"
              />
              <input
                value={contact.company}
                onChange={(e) => setContact({ ...contact, company: e.target.value })}
                placeholder="Company (optional)"
                autoComplete="organization"
                className="w-full rounded-xl border border-line bg-ink px-4 py-3.5 text-white placeholder-faint outline-none transition-colors focus:border-gold sm:col-span-2"
              />
              <textarea
                value={contact.notes}
                onChange={(e) => setContact({ ...contact, notes: e.target.value })}
                placeholder="Anything else we should know?"
                rows={4}
                className="w-full resize-none rounded-xl border border-line bg-ink px-4 py-3.5 text-white placeholder-faint outline-none transition-colors focus:border-gold sm:col-span-2"
              />
              {/* Honeypot */}
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

            <div className="mt-8 flex flex-wrap items-center gap-4">
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
                    Send my brief
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => setStep(total - 1)}
                className="inline-flex items-center gap-2 text-sm text-faint transition-colors hover:text-white"
              >
                <ArrowLeft className="h-4 w-4" /> Change my answers
              </button>

              <button
                type="button"
                onClick={restart}
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

  /* ---------------- Questions ---------------- */
  return (
    <div className="space-y-10">
      <ProgressBar current={step} total={total} />

      <AnimatePresence mode="wait">
        <motion.div
          key={current!.id}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -16 }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
        >
          <h2 className="display max-w-3xl text-[clamp(1.9rem,5.5vw,3.5rem)] leading-[0.98] text-white">
            {current!.question}
          </h2>
          <p className="mt-5 max-w-xl text-mist">{current!.helper}</p>

          <div
            className={cn(
              "mt-10 grid gap-3",
              current!.options.length > 5 ? "sm:grid-cols-2" : "sm:grid-cols-2",
            )}
          >
            {current!.options.map((o) => (
              <OptionCard
                key={o.value}
                label={o.label}
                hint={o.hint}
                multi={current!.multi}
                selected={picked.includes(o.value)}
                onSelect={() => {
                  select(current!.id, o.value, current!.multi);
                  // Single-choice steps advance on their own — it feels quicker.
                  if (!current!.multi) {
                    setTimeout(() => setStep((s) => s + 1), 220);
                  }
                }}
              />
            ))}
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

            {current!.multi && (
              <button
                type="button"
                onClick={() => setStep((s) => s + 1)}
                disabled={!canContinue}
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
