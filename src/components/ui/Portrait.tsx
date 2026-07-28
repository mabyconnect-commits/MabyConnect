"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

/**
 * Portrait frame with a graceful skeleton + fallback.
 *
 * Drop a real photo at `public/portrait.jpg` (or pass `src`) and it will
 * automatically replace the designed placeholder — no code change needed.
 */
export default function Portrait({
  src = "/portrait.jpg",
  className,
  priority = false,
}: {
  src?: string;
  className?: string;
  priority?: boolean;
}) {
  const placeholder = "/portrait-placeholder.svg";
  const [current, setCurrent] = useState(placeholder);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    // Probe for a real portrait; swap in only if it actually loads.
    const img = new window.Image();
    img.onload = () => {
      setCurrent(src);
      setLoaded(true);
    };
    img.onerror = () => setLoaded(true);
    img.src = src;
    // Placeholder counts as loaded quickly either way
    const t = setTimeout(() => setLoaded(true), 600);
    return () => clearTimeout(t);
  }, [src]);

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-[1.5rem] bg-surface",
        className,
      )}
    >
      {!loaded && <div className="skeleton absolute inset-0" />}
      <motion.img
        src={current}
        alt="Matthew Adeleye — founder of Maby Connect"
        loading={priority ? "eager" : "lazy"}
        onLoad={() => setLoaded(true)}
        className="h-full w-full object-cover"
        initial={{ scale: 1.08, opacity: 0 }}
        animate={loaded ? { scale: 1, opacity: 1 } : {}}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
      />
      {/* Subtle top-down vignette for text legibility */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-ink/20" />
      <div className="pointer-events-none absolute inset-0 rounded-[1.5rem] ring-1 ring-inset ring-white/10" />
    </div>
  );
}
