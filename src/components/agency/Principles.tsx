"use client";

import Reveal from "@/components/ui/Reveal";
import Counter from "@/components/ui/Counter";
import { agencyStats, principles } from "@/lib/agency";

/** How we operate — the terms, stated before anyone has to ask. */
export default function Principles() {
  return (
    <section className="relative border-t border-line py-24 md:py-32">
      <div className="container-x">
        <Reveal className="flex items-center gap-4">
          <span className="font-mono text-xs text-gold">006</span>
          <span className="h-px w-10 bg-line-strong" />
          <span className="eyebrow">How we operate</span>
        </Reveal>
        <Reveal delay={0.1}>
          <h2 className="display mt-6 max-w-3xl text-[clamp(2.2rem,7vw,5rem)] text-white">
            The terms, up front.
          </h2>
        </Reveal>

        <div className="mt-16 grid gap-10 md:grid-cols-2 md:gap-x-16 md:gap-y-14">
          {principles.map((p, i) => (
            <Reveal key={p.title} delay={Math.min(i * 0.07, 0.28)}>
              <div className="flex gap-6">
                <span className="font-mono text-xs text-gold">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div>
                  <h3 className="display text-2xl text-white md:text-3xl">
                    {p.title}
                  </h3>
                  <p className="mt-4 max-w-md text-base leading-relaxed text-mist">
                    {p.body}
                  </p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        {/* Numbers */}
        <div className="mt-20 grid grid-cols-2 gap-y-10 border-t border-line pt-14 md:grid-cols-4">
          {agencyStats.map((s, i) => (
            <Reveal
              key={s.label}
              delay={i * 0.08}
              className="flex flex-col gap-2 border-l border-line pl-6"
            >
              <span className="display text-[clamp(2rem,5vw,3.5rem)] text-white">
                <Counter value={s.value} suffix={s.suffix} />
              </span>
              <span className="text-sm text-mist">{s.label}</span>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
