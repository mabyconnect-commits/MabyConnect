"use client";

import { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";

/**
 * Counts from 0 to `value` when scrolled into view.
 *
 * Guards against the counter being caught displaying a misleading "0":
 * - triggers as soon as ~30% of the element is visible (no negative margin
 *   that could leave it sitting visible at zero on tall pages)
 * - once the animation is running it never shows 0 for a positive target
 * - honours prefers-reduced-motion by showing the final value immediately
 */
export default function Counter({
  value,
  prefix = "",
  suffix = "",
  duration = 1300,
  display,
}: {
  value: number;
  prefix?: string;
  suffix?: string;
  duration?: number;
  display?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });
  const [n, setN] = useState(0);

  useEffect(() => {
    if (display || !inView) return;

    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      // Skip the animation entirely for reduced-motion users.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setN(value);
      return;
    }

    const floor = value > 0 ? 1 : 0;
    let raf = 0;
    const start = performance.now();
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setN(Math.max(floor, Math.round(eased * value)));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, value, duration, display]);

  return (
    <span ref={ref} className="tabular-nums">
      {display ?? `${prefix}${n}${suffix}`}
    </span>
  );
}
