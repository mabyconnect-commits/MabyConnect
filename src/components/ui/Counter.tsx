"use client";

import { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";

/**
 * Counts from 0 to `value` when scrolled into view.
 */
export default function Counter({
  value,
  prefix = "",
  suffix = "",
  duration = 1600,
  display,
}: {
  value: number;
  prefix?: string;
  suffix?: string;
  duration?: number;
  display?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-20%" });
  const [n, setN] = useState(0);

  useEffect(() => {
    if (!inView || display) return;
    let raf = 0;
    const start = performance.now();
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setN(Math.round(eased * value));
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
