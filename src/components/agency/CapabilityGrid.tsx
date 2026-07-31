"use client";

import Link from "next/link";
import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import Reveal from "@/components/ui/Reveal";
import { capabilities } from "@/lib/agency";
import { cn } from "@/lib/utils";

/**
 * The capability index. Each row expands its "we build" list on hover
 * (desktop) so the page stays scannable but the depth is one gesture away.
 */
export default function CapabilityGrid() {
  const [active, setActive] = useState<string | null>(null);

  return (
    <section id="capabilities" className="relative border-t border-line py-24 md:py-32">
      <div className="container-x">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <Reveal className="flex items-center gap-4">
              <span className="font-mono text-xs text-gold">001</span>
              <span className="h-px w-10 bg-line-strong" />
              <span className="eyebrow">Capabilities</span>
            </Reveal>
            <Reveal delay={0.1}>
              <h2 className="display mt-6 max-w-3xl text-[clamp(2.2rem,7vw,5rem)] text-white">
                If it can be built, it&apos;s on this list.
              </h2>
            </Reveal>
          </div>
          <Reveal delay={0.2} className="max-w-sm">
            <p className="text-mist">
              Eight disciplines under one roof — so your product doesn&apos;t get
              handed between four vendors who&apos;ve never met.
            </p>
          </Reveal>
        </div>

        <div className="mt-16 border-t border-line" onMouseLeave={() => setActive(null)}>
          {capabilities.map((c, i) => (
            <Reveal key={c.slug} delay={Math.min(i * 0.04, 0.24)}>
              <Link
                href={`/agency/capabilities/${c.slug}`}
                onMouseEnter={() => setActive(c.slug)}
                className="group block border-b border-line py-8 transition-colors md:py-10"
              >
                <div className="grid gap-5 md:grid-cols-[auto_1fr_auto] md:items-center md:gap-10">
                  <span className="font-mono text-xs text-faint">{c.index}</span>

                  <div>
                    <div className="flex flex-wrap items-baseline gap-4">
                      <h3 className="display text-2xl text-white/75 transition-colors duration-300 group-hover:text-white md:text-4xl">
                        {c.name}
                      </h3>
                      <span className="font-mono text-[11px] tracking-widest text-gold uppercase">
                        {c.from}
                      </span>
                    </div>
                    <p className="mt-3 max-w-xl text-base leading-relaxed text-mist">
                      {c.tagline}
                    </p>

                    {/* Expanding build list */}
                    <motion.div
                      initial={false}
                      animate={{
                        height: active === c.slug ? "auto" : 0,
                        opacity: active === c.slug ? 1 : 0,
                      }}
                      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                      className="hidden overflow-hidden md:block"
                    >
                      <div className="flex flex-wrap gap-2 pt-5">
                        {c.builds.map((b) => (
                          <span
                            key={b}
                            className="rounded-full border border-line px-3 py-1 font-mono text-[10px] tracking-wider text-white/60 uppercase"
                          >
                            {b}
                          </span>
                        ))}
                      </div>
                    </motion.div>

                    {/* Mobile: always show a trimmed list */}
                    <div className="mt-4 flex flex-wrap gap-2 md:hidden">
                      {c.builds.slice(0, 4).map((b) => (
                        <span
                          key={b}
                          className="rounded-full border border-line px-3 py-1 font-mono text-[10px] tracking-wider text-white/60 uppercase"
                        >
                          {b}
                        </span>
                      ))}
                      {c.builds.length > 4 && (
                        <span className="rounded-full border border-line px-3 py-1 font-mono text-[10px] tracking-wider text-gold uppercase">
                          +{c.builds.length - 4} more
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-4 md:flex-col md:items-end md:gap-2">
                    <span className="font-mono text-[11px] tracking-widest text-faint uppercase">
                      {c.timeline}
                    </span>
                    <ArrowUpRight
                      className={cn(
                        "h-6 w-6 text-faint transition-all duration-300",
                        "group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-gold",
                      )}
                    />
                  </div>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
