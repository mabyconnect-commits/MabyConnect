"use client";

import Reveal from "@/components/ui/Reveal";
import Counter from "@/components/ui/Counter";
import { stats } from "@/lib/data";

export default function StatsBand() {
  return (
    <section className="border-t border-line py-20 md:py-24">
      <div className="container-x grid grid-cols-2 gap-y-12 md:grid-cols-4">
        {stats.map((s, i) => (
          <Reveal
            key={s.label}
            delay={i * 0.08}
            className="flex flex-col gap-2 border-l border-line pl-6"
          >
            <span className="display text-[clamp(2.5rem,6vw,4.5rem)] text-white">
              <Counter
                value={s.value}
                suffix={"suffix" in s ? s.suffix : ""}
                display={"display" in s ? s.display : undefined}
              />
            </span>
            <span className="text-sm text-mist">{s.label}</span>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
