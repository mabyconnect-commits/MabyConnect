"use client";

import Link from "next/link";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import Reveal from "@/components/ui/Reveal";
import ArrowLink from "@/components/ui/ArrowLink";
import CompanyLogo from "@/components/ui/CompanyLogo";
import { companies } from "@/lib/data";

/**
 * An interactive index of companies. Hovering a row reveals a
 * floating preview panel — editorial, not card-heavy.
 */
export default function CompaniesPreview() {
  const [active, setActive] = useState<number | null>(null);

  return (
    <section className="relative border-t border-line py-24 md:py-32">
      <div className="container-x">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <Reveal className="flex items-center gap-4">
              <span className="font-mono text-xs text-gold">003</span>
              <span className="h-px w-10 bg-line-strong" />
              <span className="eyebrow">The Companies</span>
            </Reveal>
            <Reveal delay={0.1}>
              <h2 className="display mt-6 text-[clamp(2.2rem,7vw,5rem)] text-white">
                Companies I build.
              </h2>
            </Reveal>
          </div>
          <Reveal delay={0.2}>
            <ArrowLink href="/companies">All companies</ArrowLink>
          </Reveal>
        </div>

        <div
          className="relative mt-16"
          onMouseLeave={() => setActive(null)}
        >
          {companies.map((c, i) => (
            <Reveal key={c.slug} delay={i * 0.05}>
              <Link
                href={`/companies/${c.slug}`}
                onMouseEnter={() => setActive(i)}
                className="group grid grid-cols-[auto_1fr_auto] items-center gap-6 border-b border-line py-7 transition-colors md:py-9"
              >
                <span className="font-mono text-xs text-faint">
                  0{i + 1}
                </span>
                <div className="flex flex-col gap-1 md:flex-row md:items-baseline md:gap-5">
                  <h3 className="display text-2xl text-white/70 transition-colors duration-300 group-hover:text-white md:text-4xl">
                    {c.name}
                  </h3>
                  <span className="text-sm text-faint md:opacity-0 md:transition-opacity md:duration-300 md:group-hover:opacity-100">
                    {c.category}
                  </span>
                </div>
                <ArrowUpRight className="h-6 w-6 text-faint transition-all duration-300 group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-gold" />
              </Link>
            </Reveal>
          ))}

          {/* Floating preview */}
          <div className="pointer-events-none absolute right-[8%] top-0 hidden h-full w-72 items-center justify-end lg:flex">
            <AnimatePresence mode="wait">
              {active !== null && (
                <motion.div
                  key={active}
                  initial={{ opacity: 0, scale: 0.92, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.92, y: -20 }}
                  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  className="glass w-full rounded-2xl p-6"
                >
                  <CompanyLogo
                    name={companies[active].name}
                    logo={companies[active].logo}
                    size={48}
                    className="mb-5"
                  />
                  <div className="flex items-center justify-between">
                    <span className="rounded-full bg-gold-soft px-3 py-1 font-mono text-[10px] tracking-widest text-gold uppercase">
                      {companies[active].status}
                    </span>
                    <span className="font-mono text-xs text-faint">
                      {companies[active].year}
                    </span>
                  </div>
                  <p className="mt-5 text-sm leading-relaxed text-mist">
                    {companies[active].tagline}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
