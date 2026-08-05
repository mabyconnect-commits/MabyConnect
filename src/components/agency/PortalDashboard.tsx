"use client";

import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import {
  CalendarClock,
  Check,
  CircleDashed,
  Download,
  ExternalLink,
} from "lucide-react";
import { signOut } from "@/app/agency/portal/auth-actions";
import type { Workspace } from "@/lib/portal";
import { cn } from "@/lib/utils";

type Tab = "overview" | "deliverables" | "billing" | "activity";

const tabs: { id: Tab; label: string }[] = [
  { id: "overview", label: "Overview" },
  { id: "deliverables", label: "Deliverables" },
  { id: "billing", label: "Billing" },
  { id: "activity", label: "Activity" },
];

function Overview({ w }: { w: Workspace }) {
  return (
    <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
      <div className="rounded-3xl border border-line bg-surface/40 p-8">
        <p className="eyebrow mb-8">Milestones</p>
        <ol className="relative space-y-7 border-l border-line pl-8">
          {w.milestones.map((m) => (
            <li key={m.name} className="relative">
              <span
                className={cn(
                  "absolute top-1 -left-[38px] flex h-5 w-5 items-center justify-center rounded-full border",
                  m.status === "done" && "border-gold bg-gold",
                  m.status === "active" && "border-gold bg-gold-soft",
                  m.status === "upcoming" && "border-line bg-ink",
                )}
              >
                {m.status === "done" && <Check className="h-3 w-3 text-ink" />}
                {m.status === "active" && (
                  <CircleDashed className="h-3 w-3 animate-spin text-gold [animation-duration:3s]" />
                )}
              </span>

              <div className="flex flex-wrap items-baseline justify-between gap-3">
                <span
                  className={cn(
                    "text-base",
                    m.status === "upcoming" ? "text-white/50" : "text-white",
                  )}
                >
                  {m.name}
                </span>
                <span
                  className={cn(
                    "font-mono text-[10px] tracking-widest uppercase",
                    m.status === "active" ? "text-gold" : "text-faint",
                  )}
                >
                  {m.date}
                </span>
              </div>
              <p className="mt-1.5 text-sm text-mist">{m.detail}</p>
            </li>
          ))}
        </ol>
      </div>

      <div className="space-y-6">
        <div className="rounded-3xl border border-line bg-surface/40 p-8">
          <p className="eyebrow mb-6">Progress</p>
          <div className="flex items-baseline gap-2">
            <span className="display text-5xl text-white">{w.progress}</span>
            <span className="display text-2xl text-gold">%</span>
          </div>
          <div className="mt-5 h-1.5 overflow-hidden rounded-full bg-line">
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: w.progress / 100 }}
              transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
              style={{ originX: 0 }}
              className="h-full rounded-full bg-gold"
            />
          </div>
          <dl className="mt-8 space-y-3">
            {[
              { k: "Engagement", v: w.engagement },
              { k: "Started", v: w.started },
              { k: "Target launch", v: w.launch },
              { k: "Lead", v: w.lead },
            ].map((r) => (
              <div key={r.k} className="flex items-baseline justify-between gap-4">
                <dt className="font-mono text-[10px] tracking-widest text-faint uppercase">
                  {r.k}
                </dt>
                <dd className="text-sm text-white/85">{r.v}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="rounded-3xl border border-gold/25 bg-gold-soft p-8">
          <div className="flex items-center gap-2">
            <CalendarClock className="h-4 w-4 text-gold" />
            <p className="font-mono text-[10px] tracking-widest text-gold uppercase">
              {w.nextCall.label}
            </p>
          </div>
          <p className="display mt-4 text-2xl text-white">{w.nextCall.date}</p>
          <p className="mt-1 text-sm text-mist">{w.nextCall.time}</p>
        </div>

        <a
          href={w.staging}
          target="_blank"
          rel="noopener noreferrer"
          className="group flex items-center justify-between rounded-3xl border border-line bg-surface/40 p-8 transition-colors hover:border-line-strong"
        >
          <div>
            <p className="eyebrow">Staging environment</p>
            <p className="mt-2 text-sm text-white/85">See this week&apos;s build</p>
          </div>
          <ExternalLink className="h-4 w-4 text-faint transition-colors group-hover:text-gold" />
        </a>
      </div>
    </div>
  );
}

function Deliverables({ w }: { w: Workspace }) {
  return (
    <div className="overflow-hidden rounded-3xl border border-line">
      {w.deliverables.map((d) => (
        <div
          key={d.name}
          className="group flex items-center justify-between gap-6 border-b border-line px-6 py-5 transition-colors last:border-b-0 hover:bg-surface"
        >
          <div className="min-w-0">
            <p className="truncate text-base text-white">{d.name}</p>
            <p className="mt-1 font-mono text-[10px] tracking-widest text-faint uppercase">
              {d.type} · {d.size} · {d.date}
            </p>
          </div>
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-line text-faint transition-colors group-hover:border-gold group-hover:text-gold">
            <Download className="h-4 w-4" />
          </span>
        </div>
      ))}
    </div>
  );
}

function Billing({ w }: { w: Workspace }) {
  return (
    <div className="overflow-hidden rounded-3xl border border-line">
      {w.invoices.map((inv) => (
        <div
          key={inv.ref}
          className="flex items-center justify-between gap-6 border-b border-line px-6 py-5 last:border-b-0"
        >
          <div>
            <p className="font-mono text-sm text-white">{inv.ref}</p>
            <p className="mt-1 font-mono text-[10px] tracking-widest text-faint uppercase">
              Due {inv.due}
            </p>
          </div>
          <div className="flex items-center gap-5">
            <span className="display text-lg text-white">{inv.amount}</span>
            <span
              className={cn(
                "rounded-full px-3 py-1 font-mono text-[10px] tracking-widest uppercase",
                inv.status === "Paid" && "bg-gold-soft text-gold",
                inv.status === "Due" && "bg-white/10 text-white",
                inv.status === "Scheduled" && "border border-line text-faint",
              )}
            >
              {inv.status}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}

function ActivityFeed({ w }: { w: Workspace }) {
  return (
    <div className="rounded-3xl border border-line bg-surface/40 p-8">
      <ol className="space-y-6">
        {w.activity.map((a, i) => (
          <li key={i} className="flex gap-5">
            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gold" />
            <div>
              <p className="text-sm text-white/85">
                <span className="text-white">{a.who}</span> {a.what}
              </p>
              <p className="mt-1 font-mono text-[10px] tracking-widest text-faint uppercase">
                {a.when}
              </p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}

export default function PortalDashboard({ workspace }: { workspace: Workspace }) {
  const [tab, setTab] = useState<Tab>("overview");

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="flex flex-wrap items-start justify-between gap-6 border-b border-line pb-8">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            {workspace.demo && (
              <span className="rounded-full border border-gold/30 bg-gold-soft px-3 py-1 font-mono text-[10px] tracking-widest text-gold uppercase">
                Demo workspace
              </span>
            )}
            <span className="font-mono text-[10px] tracking-widest text-faint uppercase">
              {workspace.client}
            </span>
          </div>
          <h1 className="display mt-5 text-[clamp(1.8rem,5vw,3.5rem)] leading-tight text-white">
            {workspace.project}
          </h1>
        </div>

        <form action={signOut}>
          <button
            type="submit"
            className="text-sm text-faint transition-colors hover:text-white"
          >
            Sign out
          </button>
        </form>
      </div>

      <div className="mt-8 flex flex-wrap gap-1">
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={cn(
              "relative rounded-full px-4 py-2 text-sm transition-colors",
              tab === t.id ? "text-ink" : "text-white/60 hover:text-white",
            )}
          >
            {tab === t.id && (
              <motion.span
                layoutId="portal-tab"
                className="absolute inset-0 rounded-full bg-white"
                transition={{ type: "spring", stiffness: 380, damping: 32 }}
              />
            )}
            <span className="relative z-10">{t.label}</span>
          </button>
        ))}
      </div>

      <div className="mt-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={tab}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          >
            {tab === "overview" && <Overview w={workspace} />}
            {tab === "deliverables" && <Deliverables w={workspace} />}
            {tab === "billing" && <Billing w={workspace} />}
            {tab === "activity" && <ActivityFeed w={workspace} />}
          </motion.div>
        </AnimatePresence>
      </div>

      {workspace.demo && (
        <p className="mt-14 border-t border-line pt-8 text-sm text-faint">
          This is a sample workspace with placeholder data.{" "}
          <Link href="/agency/start" className="text-white/80 hover:text-gold">
            Start a project
          </Link>{" "}
          and you&apos;ll get a real one at kickoff.
        </p>
      )}
    </motion.div>
  );
}
