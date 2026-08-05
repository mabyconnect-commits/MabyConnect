"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Reveal from "@/components/ui/Reveal";
import { guidedPaths } from "@/lib/paths";

/**
 * Homepage doorway into the guided paths. Sits high on the page because
 * "I want X but don't know how" is the most common reason people arrive.
 */
export default function StartHere() {
  return (
    <section className="relative border-t border-line py-24 md:py-32">
      <div className="container-x">
        <Reveal className="flex items-center gap-4">
          <span className="font-mono text-xs text-gold">002</span>
          <span className="h-px w-10 bg-line-strong" />
          <span className="eyebrow">Start here</span>
        </Reveal>

        <Reveal delay={0.1}>
          <h2 className="display mt-6 max-w-3xl text-[clamp(2.2rem,7vw,5rem)] leading-[0.95] text-white">
            Know what you want.
            <span className="text-gradient-gold block">Not sure how to start?</span>
          </h2>
        </Reveal>

        <Reveal delay={0.2}>
          <p className="mt-8 max-w-xl text-lg leading-relaxed text-mist">
            Pick the sentence that sounds like you. A few questions later you&apos;ll
            have a route that fits your actual budget, timeline and experience —
            before you talk to anyone.
          </p>
        </Reveal>

        <div className="mt-14 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {guidedPaths.map((p, i) => (
            <Reveal key={p.slug} delay={Math.min(0.25 + i * 0.05, 0.5)}>
              <Link
                href={`/start/${p.slug}`}
                className="group flex h-full items-start justify-between gap-4 rounded-2xl border border-line bg-surface/40 p-6 transition-colors duration-500 hover:border-line-strong hover:bg-surface"
              >
                <span>
                  <span
                    className="font-mono text-[10px] tracking-[0.2em] uppercase"
                    style={{ color: p.accent }}
                  >
                    {p.eyebrow}
                  </span>
                  <motion.span className="mt-3 block text-base leading-snug text-white/85 transition-colors group-hover:text-white">
                    “{p.intent}”
                  </motion.span>
                </span>
                <ArrowRight className="mt-1 h-4 w-4 shrink-0 text-faint transition-all duration-300 group-hover:translate-x-1 group-hover:text-gold" />
              </Link>
            </Reveal>
          ))}

          <Reveal delay={0.5}>
            <Link
              href="/start"
              className="group flex h-full items-center justify-between gap-4 rounded-2xl border border-gold/30 bg-gold-soft p-6 transition-colors duration-500 hover:border-gold/50"
            >
              <span className="text-base text-white">See every path</span>
              <ArrowRight className="h-4 w-4 shrink-0 text-gold transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
