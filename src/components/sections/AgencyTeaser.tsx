"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Reveal from "@/components/ui/Reveal";
import ArrowLink from "@/components/ui/ArrowLink";
import { capabilities } from "@/lib/agency";

/**
 * Homepage doorway into Maby Agency — the build arm. Sits after the
 * companies index, where "who builds this?" is the natural next question.
 */
export default function AgencyTeaser() {
  return (
    <section className="relative overflow-hidden border-t border-line py-24 md:py-32">
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="animate-drift absolute top-1/2 -right-[10%] h-[45vw] w-[45vw] -translate-y-1/2 rounded-full bg-gold/[0.06] blur-[130px]" />
      </div>

      <div className="container-x">
        <Reveal className="flex items-center gap-4">
          <span className="font-mono text-xs text-gold">003</span>
          <span className="h-px w-10 bg-line-strong" />
          <span className="eyebrow">Maby Agency</span>
        </Reveal>

        <div className="mt-8 grid gap-12 lg:grid-cols-[1.25fr_1fr] lg:gap-20">
          <div>
            <Reveal>
              <h2 className="display max-w-2xl text-[clamp(2.2rem,7vw,5rem)] leading-[0.94] text-white">
                We build for others,
                <span className="text-gradient-gold block">too.</span>
              </h2>
            </Reveal>
            <Reveal delay={0.15}>
              <p className="mt-8 max-w-lg text-lg leading-relaxed text-mist">
                The team behind Channels Realty, Surlink, Ttip and Groceries
                takes on outside work. Web platforms, blockchains from scratch,
                bank-grade fintech, mobile apps and AI — scoped with a fixed
                price and a delivery date before anyone signs anything.
              </p>
            </Reveal>

            <Reveal delay={0.25}>
              <div className="mt-10 flex flex-wrap items-center gap-6">
                <Link
                  href="/agency"
                  className="group inline-flex items-center gap-2 rounded-full bg-white px-7 py-3.5 text-sm font-medium text-ink transition-colors hover:bg-gold"
                >
                  Enter the agency
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
                <ArrowLink href="/agency/start">Get a scope in 2 minutes</ArrowLink>
              </div>
            </Reveal>
          </div>

          {/* Capability list */}
          <Reveal delay={0.2} className="h-fit">
            <ul className="divide-y divide-line border-y border-line">
              {capabilities.slice(0, 6).map((c) => (
                <li key={c.slug}>
                  <Link
                    href={`/agency/capabilities/${c.slug}`}
                    className="group flex items-center justify-between gap-6 py-4"
                  >
                    <span className="flex items-baseline gap-4">
                      <span className="font-mono text-[10px] text-faint">
                        {c.index}
                      </span>
                      <motion.span className="text-base text-white/70 transition-colors duration-300 group-hover:text-white">
                        {c.name}
                      </motion.span>
                    </span>
                    <span className="font-mono text-[10px] tracking-widest text-faint uppercase transition-colors group-hover:text-gold">
                      {c.from}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
