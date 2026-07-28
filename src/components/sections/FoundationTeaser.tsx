"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Reveal from "@/components/ui/Reveal";
import MagneticButton from "@/components/ui/MagneticButton";

export default function FoundationTeaser() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["-12%", "12%"]);

  return (
    <section
      ref={ref}
      className="relative overflow-hidden border-t border-line py-32 md:py-44"
    >
      {/* Parallax emotive backdrop */}
      <motion.div
        aria-hidden
        style={{ y }}
        className="pointer-events-none absolute inset-0 -z-10"
      >
        <div className="absolute left-1/2 top-1/2 h-[70vh] w-[70vh] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold/[0.06] blur-[130px]" />
      </motion.div>

      <div className="container-x text-center">
        <Reveal className="mx-auto flex w-fit items-center gap-4">
          <span className="font-mono text-xs text-gold">003</span>
          <span className="h-px w-10 bg-line-strong" />
          <span className="eyebrow">Jenmec Foundation</span>
        </Reveal>

        <Reveal delay={0.1}>
          <p className="mx-auto mt-10 max-w-4xl text-[clamp(1.6rem,5vw,3.4rem)] leading-[1.15] tracking-tight text-white text-balance">
            <span className="text-mist">Feeding the hungry. Supporting children.
            Creating opportunity. </span>
            Because
            <span className="text-gradient-gold"> I am because we are.</span>
          </p>
        </Reveal>

        <Reveal delay={0.25}>
          <p className="mx-auto mt-8 max-w-xl text-base text-mist">
            Inspired by Ubuntu — a philosophy that binds my humanity to yours.
            Impact is not a side project. It is the point.
          </p>
        </Reveal>

        <Reveal delay={0.35} className="mt-12">
          <MagneticButton href="/foundation" variant="outline">
            Explore the Foundation
          </MagneticButton>
        </Reveal>
      </div>
    </section>
  );
}
