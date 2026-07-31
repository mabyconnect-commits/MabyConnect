"use client";

import { useRef } from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import Reveal from "@/components/ui/Reveal";
import { process } from "@/lib/agency";
import { cn } from "@/lib/utils";

/**
 * The five phases, tracked by a gold rail that fills as the section
 * scrolls — so the process visually completes as you read it.
 * Mobile keeps a single left rail; desktop alternates sides.
 */
export default function ProcessRail() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 70%", "end 70%"],
  });
  const scaleY = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 26,
    restDelta: 0.001,
  });

  return (
    <section className="relative border-t border-line py-24 md:py-32">
      <div className="container-x">
        <Reveal className="flex items-center gap-4">
          <span className="font-mono text-xs text-gold">003</span>
          <span className="h-px w-10 bg-line-strong" />
          <span className="eyebrow">How we work</span>
        </Reveal>
        <Reveal delay={0.1}>
          <h2 className="display mt-6 max-w-3xl text-[clamp(2.2rem,7vw,5rem)] text-white">
            Five phases. No surprises.
          </h2>
        </Reveal>

        <div ref={ref} className="relative mt-20">
          {/* Rail */}
          <div className="absolute top-2 bottom-2 left-[3px] w-px bg-line md:left-1/2">
            <motion.div
              style={{ scaleY, originY: 0 }}
              className="absolute inset-0 w-px bg-gold"
            />
          </div>

          <div className="space-y-14 md:space-y-20">
            {process.map((p, i) => {
              const left = i % 2 === 0;
              return (
                <Reveal key={p.phase} className="relative pl-10 md:pl-0">
                  {/* Node */}
                  <span className="absolute top-2 left-0 h-[7px] w-[7px] rounded-full bg-gold ring-4 ring-ink md:left-1/2 md:-translate-x-1/2" />

                  <div className="md:grid md:grid-cols-2 md:gap-16">
                    <div
                      className={cn(
                        left ? "md:pr-16 md:text-right" : "md:col-start-2 md:pl-16",
                      )}
                    >
                      <div
                        className={cn(
                          "flex flex-wrap items-baseline gap-3",
                          left && "md:justify-end",
                        )}
                      >
                        <span className="font-mono text-xs text-gold">{p.phase}</span>
                        <span className="font-mono text-[10px] tracking-widest text-faint uppercase">
                          {p.duration}
                        </span>
                      </div>

                      <h3 className="display mt-4 text-3xl text-white md:text-4xl">
                        {p.name}
                      </h3>
                      <p className="mt-3 text-lg text-white/80">{p.summary}</p>
                      <p
                        className={cn(
                          "mt-4 max-w-md text-base leading-relaxed text-mist",
                          left && "md:ml-auto",
                        )}
                      >
                        {p.detail}
                      </p>

                      <div
                        className={cn(
                          "mt-6 flex flex-wrap gap-2",
                          left && "md:justify-end",
                        )}
                      >
                        {p.outputs.map((o) => (
                          <span
                            key={o}
                            className="rounded-full border border-line px-3 py-1 font-mono text-[10px] tracking-wider text-white/60 uppercase"
                          >
                            {o}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
