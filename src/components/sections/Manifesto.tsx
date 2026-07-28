"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Reveal from "@/components/ui/Reveal";
import { buildValues } from "@/lib/data";

/**
 * A large statement section. Words highlight as they scroll through
 * a focal band — the manifesto reads itself into focus.
 */
const statement =
  "First, a lover of God. Everything I build comes from that foundation. I build companies. I build communities. I build opportunities. I build people.";

export default function Manifesto() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.85", "end 0.35"],
  });

  const words = statement.split(" ");

  return (
    <section className="relative py-28 md:py-40">
      <div className="container-x">
        <Reveal className="mb-14 flex items-center gap-4">
          <span className="font-mono text-xs text-gold">001</span>
          <span className="h-px w-10 bg-line-strong" />
          <span className="eyebrow">The Foundation</span>
        </Reveal>

        <p
          ref={ref}
          className="display max-w-5xl text-[clamp(1.75rem,4.4vw,3.6rem)] leading-[1.12] tracking-tight"
        >
          {words.map((w, i) => {
            const start = i / words.length;
            const end = start + 1 / words.length;
            return <Word key={i} progress={scrollYProgress} range={[start, end]}>{w}</Word>;
          })}
        </p>

        {/* Build ledger */}
        <div className="mt-20 grid grid-cols-1 gap-px overflow-hidden rounded-3xl border border-line sm:grid-cols-2 lg:grid-cols-4">
          {buildValues.map((b, i) => (
            <Reveal
              key={b.v}
              delay={i * 0.08}
              className="group relative bg-surface/40 p-8 transition-colors duration-500 hover:bg-surface"
            >
              <p className="font-mono text-xs tracking-widest text-faint">
                0{i + 1} — {b.k}
              </p>
              <p className="display mt-6 text-3xl text-white transition-colors group-hover:text-gradient-gold md:text-4xl">
                {b.v}
              </p>
              <div className="mt-6 h-px w-full origin-left scale-x-0 bg-gold transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-x-100" />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function Word({
  children,
  progress,
  range,
}: {
  children: string;
  progress: ReturnType<typeof useScroll>["scrollYProgress"];
  range: [number, number];
}) {
  const opacity = useTransform(progress, range, [0.16, 1]);
  return (
    <span className="relative mr-[0.28em] inline-block">
      <span className="absolute inset-0 opacity-10">{children}</span>
      <motion.span style={{ opacity }}>{children}</motion.span>
    </span>
  );
}
