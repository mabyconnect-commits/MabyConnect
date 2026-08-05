"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Plus } from "lucide-react";
import Reveal from "@/components/ui/Reveal";
import { faqs } from "@/lib/agency";
import { cn } from "@/lib/utils";

export default function FaqAccordion() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="relative border-t border-line py-24 md:py-32">
      <div className="container-x grid gap-12 md:grid-cols-[0.8fr_1.2fr] md:gap-20">
        <div>
          <Reveal className="flex items-center gap-4">
            <span className="font-mono text-xs text-gold">007</span>
            <span className="h-px w-10 bg-line-strong" />
            <span className="eyebrow">Questions</span>
          </Reveal>
          <Reveal delay={0.1}>
            <h2 className="display mt-6 text-[clamp(2.2rem,6vw,4rem)] text-white">
              Straight answers.
            </h2>
          </Reveal>
        </div>

        <div className="border-t border-line">
          {faqs.map((f, i) => {
            const isOpen = open === i;
            return (
              <Reveal key={f.q} delay={Math.min(i * 0.04, 0.2)}>
                <div className="border-b border-line">
                  <button
                    onClick={() => setOpen(isOpen ? null : i)}
                    aria-expanded={isOpen}
                    className="group flex w-full items-center justify-between gap-6 py-6 text-left"
                  >
                    <span
                      className={cn(
                        "text-lg transition-colors md:text-xl",
                        isOpen ? "text-white" : "text-white/70 group-hover:text-white",
                      )}
                    >
                      {f.q}
                    </span>
                    <Plus
                      className={cn(
                        "h-5 w-5 shrink-0 text-faint transition-all duration-500",
                        isOpen && "rotate-45 text-gold",
                      )}
                    />
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                        className="overflow-hidden"
                      >
                        <p className="max-w-xl pb-7 text-base leading-relaxed text-mist">
                          {f.a}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
