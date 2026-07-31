"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useScroll, useTransform } from "framer-motion";
import { ArrowDown } from "lucide-react";
import MagneticButton from "@/components/ui/MagneticButton";
import { agency } from "@/lib/agency";

/** The word that cycles in the headline. Kept short so the line never wraps oddly. */
const rotating = [
  "web apps.",
  "blockchains.",
  "bank apps.",
  "marketplaces.",
  "mobile apps.",
  "AI agents.",
  "your idea.",
];

export default function AgencyHero() {
  const ref = useRef<HTMLElement>(null);
  const [i, setI] = useState(0);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [0, -110]);
  const opacity = useTransform(scrollYProgress, [0, 0.75], [1, 0]);

  useEffect(() => {
    const id = setInterval(() => setI((v) => (v + 1) % rotating.length), 2200);
    return () => clearInterval(id);
  }, []);

  return (
    <section
      ref={ref}
      className="relative flex min-h-dvh items-center overflow-hidden pt-32 pb-20"
    >
      {/* Ambient field */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="animate-drift absolute -top-1/3 left-[15%] h-[55vw] w-[55vw] rounded-full bg-gold/[0.09] blur-[130px]" />
        <div className="animate-drift-slow absolute -right-[10%] bottom-[5%] h-[45vw] w-[45vw] rounded-full bg-white/[0.035] blur-[120px]" />
        <div
          className="absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage:
              "linear-gradient(to right, #fff 1px, transparent 1px), linear-gradient(to bottom, #fff 1px, transparent 1px)",
            backgroundSize: "64px 64px",
            maskImage:
              "radial-gradient(ellipse 75% 65% at 40% 45%, black, transparent)",
          }}
        />
      </div>

      <motion.div style={{ y, opacity }} className="container-x w-full">
        {/* Availability chip */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.15 }}
          className="mb-10 inline-flex items-center gap-3 rounded-full border border-line px-4 py-2"
        >
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-gold opacity-70" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-gold" />
          </span>
          <span className="font-mono text-[10px] tracking-[0.22em] text-white/70 uppercase">
            Taking new projects
          </span>
          <span className="h-3 w-px bg-line-strong" />
          <span className="font-mono text-[10px] tracking-[0.22em] text-faint uppercase">
            Replies in {agency.responseTime.toLowerCase()}
          </span>
        </motion.div>

        {/* Headline */}
        <h1 className="display max-w-5xl text-[clamp(2.8rem,9vw,8rem)] leading-[0.88] text-white">
          <span className="block overflow-hidden">
            <motion.span
              initial={{ y: "110%" }}
              animate={{ y: 0 }}
              transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="block"
            >
              We build
            </motion.span>
          </span>

          {/* Rotating line */}
          <span className="relative block h-[1.05em] overflow-hidden">
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.span
                key={rotating[i]}
                initial={{ y: "110%", opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: "-110%", opacity: 0 }}
                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                className="text-gradient-gold absolute inset-0 block"
              >
                {rotating[i]}
              </motion.span>
            </AnimatePresence>
          </span>
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.9 }}
          className="mt-10 max-w-xl text-base leading-relaxed text-mist md:text-lg"
        >
          {agency.promise}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 1.05 }}
          className="mt-12 flex flex-wrap items-center gap-4"
        >
          <MagneticButton href="/agency/start" variant="solid" cursorLabel="Start">
            Start a project
          </MagneticButton>
          <MagneticButton href="/agency/book" variant="outline">
            Book a call
          </MagneticButton>
        </motion.div>

        {/* Capability ticker */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.3 }}
          className="mt-20 flex flex-wrap items-center gap-x-8 gap-y-3 border-t border-line pt-8"
        >
          {[
            "Blockchains from scratch",
            "Bank-grade fintech",
            "Marketplaces",
            "Mobile apps",
            "AI agents",
          ].map((t) => (
            <span key={t} className="font-mono text-[11px] tracking-widest text-faint uppercase">
              {t}
            </span>
          ))}
        </motion.div>
      </motion.div>

      <motion.div
        style={{ opacity }}
        className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 md:flex"
      >
        <span className="eyebrow">What we build</span>
        <motion.span
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
        >
          <ArrowDown className="h-4 w-4 text-faint" />
        </motion.span>
      </motion.div>
    </section>
  );
}
