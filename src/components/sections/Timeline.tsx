"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Reveal from "@/components/ui/Reveal";
import { timeline } from "@/lib/data";

export default function Timeline() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.6", "end 0.7"],
  });
  const height = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <div ref={ref} className="relative mt-10">
      {/* Rail */}
      <div className="absolute left-0 top-0 h-full w-px bg-line md:left-[calc(20%-0.5px)]">
        <motion.div
          style={{ height }}
          className="w-full bg-gradient-to-b from-gold to-white"
        />
      </div>

      <div className="space-y-16 md:space-y-24">
        {timeline.map((item, i) => (
          <div
            key={i}
            className="relative grid grid-cols-1 gap-4 pl-8 md:grid-cols-[20%_1fr] md:gap-10 md:pl-0"
          >
            {/* Node */}
            <span className="absolute left-0 top-2 h-3 w-3 -translate-x-[5.5px] rounded-full border border-gold bg-ink md:left-[20%]" />

            <Reveal className="md:pr-10 md:text-right">
              <span className="font-mono text-xs tracking-widest text-gold uppercase">
                {item.year}
              </span>
            </Reveal>

            <Reveal delay={0.1}>
              <h3 className="display text-2xl text-white md:text-3xl">
                {item.title}
              </h3>
              <p className="mt-4 max-w-xl leading-relaxed text-mist">
                {item.body}
              </p>
            </Reveal>
          </div>
        ))}
      </div>
    </div>
  );
}
