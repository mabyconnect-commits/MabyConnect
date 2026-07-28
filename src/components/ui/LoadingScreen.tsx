"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Logo from "@/components/ui/Logo";

/**
 * Premium first-load screen. Shows once per browser session.
 * Counts a percentage while the brand mark reveals, then curtains up.
 */
export default function LoadingScreen() {
  const [done, setDone] = useState(false);
  const [count, setCount] = useState(0);
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const seen = sessionStorage.getItem("maby-intro");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    // Intro state depends on sessionStorage / media query — client-only.
    /* eslint-disable react-hooks/set-state-in-effect */
    if (seen || reduced) {
      setDone(true);
      return;
    }
    setShow(true);
    /* eslint-enable react-hooks/set-state-in-effect */
    sessionStorage.setItem("maby-intro", "1");
    document.body.style.overflow = "hidden";

    let raf = 0;
    const start = performance.now();
    const dur = 1900;
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / dur);
      // ease-out
      const eased = 1 - Math.pow(1 - p, 3);
      setCount(Math.round(eased * 100));
      if (p < 1) raf = requestAnimationFrame(tick);
      else setTimeout(() => setDone(true), 350);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  useEffect(() => {
    if (done) document.body.style.overflow = "";
  }, [done]);

  if (!show) return null;

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-ink"
          exit={{ y: "-100%" }}
          transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1] }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="mb-8"
          >
            <Logo className="h-16 w-16 md:h-20 md:w-20" />
          </motion.div>

          <div className="overflow-hidden">
            <motion.div
              initial={{ y: "110%" }}
              animate={{ y: 0 }}
              transition={{ duration: 0.9, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="flex items-baseline gap-3"
            >
              <span className="display text-[clamp(2.5rem,9vw,6rem)] text-gold">
                Maby
              </span>
              <span className="display text-[clamp(2.5rem,9vw,6rem)] text-white">
                Connect
              </span>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mt-8 flex w-[min(80vw,26rem)] items-center justify-between"
          >
            <span className="eyebrow">Building the future</span>
            <span className="font-mono text-sm tabular-nums text-white/70">
              {String(count).padStart(3, "0")}
            </span>
          </motion.div>

          <div className="mt-3 h-px w-[min(80vw,26rem)] overflow-hidden bg-white/10">
            <motion.div
              className="h-full bg-gradient-to-r from-white to-gold"
              style={{ width: `${count}%` }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
