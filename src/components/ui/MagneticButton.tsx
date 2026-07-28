"use client";

import Link from "next/link";
import { useRef, type ReactNode } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { cn } from "@/lib/utils";

type Props = {
  children: ReactNode;
  href?: string;
  onClick?: () => void;
  variant?: "solid" | "outline" | "ghost";
  className?: string;
  strength?: number;
  cursorLabel?: string;
};

/**
 * A button that gently pulls toward the cursor (magnetic effect)
 * and slides an accent fill on hover.
 */
export default function MagneticButton({
  children,
  href,
  onClick,
  variant = "outline",
  className,
  strength = 0.35,
  cursorLabel,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const x = useSpring(mx, { stiffness: 220, damping: 18, mass: 0.4 });
  const y = useSpring(my, { stiffness: 220, damping: 18, mass: 0.4 });

  const onMove = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const relX = e.clientX - (rect.left + rect.width / 2);
    const relY = e.clientY - (rect.top + rect.height / 2);
    mx.set(relX * strength);
    my.set(relY * strength);
  };
  const reset = () => {
    mx.set(0);
    my.set(0);
  };

  const base =
    "group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-full px-7 py-3.5 text-sm font-medium tracking-tight transition-colors duration-500";
  const variants = {
    solid: "bg-white text-ink hover:text-white",
    outline: "border border-line-strong text-white hover:border-transparent",
    ghost: "text-white/70 hover:text-white",
  } as const;

  const inner = (
    <motion.div
      ref={ref}
      style={{ x, y }}
      onMouseMove={onMove}
      onMouseLeave={reset}
      className={cn(base, variants[variant], className)}
      data-cursor-label={cursorLabel}
    >
      {variant !== "ghost" && (
        <span className="absolute inset-0 z-0 translate-y-full rounded-full bg-gold transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-y-0" />
      )}
      <span className="relative z-10 flex items-center gap-2">{children}</span>
    </motion.div>
  );

  if (href) {
    const external = href.startsWith("http");
    return external ? (
      <a href={href} target="_blank" rel="noopener noreferrer" className="inline-block">
        {inner}
      </a>
    ) : (
      <Link href={href} className="inline-block">
        {inner}
      </Link>
    );
  }

  return (
    <button type="button" onClick={onClick} className="inline-block">
      {inner}
    </button>
  );
}
