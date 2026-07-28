"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowDown } from "lucide-react";
import MagneticButton from "@/components/ui/MagneticButton";
import Portrait from "@/components/ui/Portrait";
import { site } from "@/lib/site";

const lines = ["Building Companies.", "Building Communities.", "Building People."];

export default function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const yText = useTransform(scrollYProgress, [0, 1], [0, -120]);
  const yImg = useTransform(scrollYProgress, [0, 1], [0, 90]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <section
      ref={ref}
      className="relative flex min-h-dvh items-center overflow-hidden pt-28 pb-16"
    >
      {/* Ambient animated background */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="animate-drift absolute -top-1/4 left-1/2 h-[60vw] w-[60vw] -translate-x-1/2 rounded-full bg-gold/[0.07] blur-[120px]" />
        <div className="animate-drift-slow absolute bottom-0 right-0 h-[45vw] w-[45vw] rounded-full bg-white/[0.03] blur-[120px]" />
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "linear-gradient(to right, #fff 1px, transparent 1px), linear-gradient(to bottom, #fff 1px, transparent 1px)",
            backgroundSize: "80px 80px",
            maskImage:
              "radial-gradient(ellipse 70% 60% at 50% 40%, black, transparent)",
          }}
        />
      </div>

      <div className="container-x grid w-full items-center gap-12 lg:grid-cols-[1.35fr_1fr]">
        {/* Copy */}
        <motion.div style={{ y: yText, opacity }} className="order-2 lg:order-1">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mb-8 flex items-center gap-3"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-gold opacity-70" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-gold" />
            </span>
            <span className="eyebrow">Maby Connect — {site.role}</span>
          </motion.div>

          <h1 className="display text-[clamp(2.7rem,7.5vw,6.5rem)] leading-[0.92] text-white">
            {lines.map((line, i) => (
              <span key={line} className="block overflow-hidden">
                <motion.span
                  initial={{ y: "110%" }}
                  animate={{ y: 0 }}
                  transition={{
                    duration: 1,
                    delay: 0.35 + i * 0.12,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  className={i === 2 ? "block text-gradient-gold" : "block"}
                >
                  {line}
                </motion.span>
              </span>
            ))}
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.85 }}
            className="mt-8 max-w-md text-base leading-relaxed text-mist md:text-lg"
          >
            I&apos;m Matthew Adeleye. A builder of companies, communities and
            people — creating products that solve real problems and help people
            grow financially, spiritually and personally.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 1 }}
            className="mt-10 flex flex-wrap items-center gap-4"
          >
            <MagneticButton href="/companies" variant="solid" cursorLabel="View">
              Explore My Work
            </MagneticButton>
            <MagneticButton href="/contact" variant="outline">
              Let&apos;s Connect
            </MagneticButton>
          </motion.div>
        </motion.div>

        {/* Portrait */}
        <motion.div
          style={{ y: yImg }}
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="order-1 mx-auto w-full max-w-sm lg:order-2 lg:max-w-none"
        >
          <div className="relative">
            <Portrait
              priority
              className="aspect-[4/5] w-full lg:aspect-[3/4]"
            />
            {/* Floating caption chip */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2 }}
              className="glass absolute -bottom-5 -left-4 rounded-2xl px-5 py-3 md:-left-8"
            >
              <p className="font-mono text-[10px] tracking-widest text-faint">
                FOUNDER
              </p>
              <p className="text-sm text-white">Matthew Adeleye</p>
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Scroll cue */}
      <motion.div
        style={{ opacity }}
        className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 md:flex"
      >
        <span className="eyebrow">Scroll</span>
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
