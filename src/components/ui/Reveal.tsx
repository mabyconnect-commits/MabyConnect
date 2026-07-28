"use client";

import { motion, type Variants } from "framer-motion";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type Props = {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  blur?: boolean;
  once?: boolean;
  as?: "div" | "section" | "li" | "span";
};

/**
 * Fade + rise (+ optional blur) as an element scrolls into view.
 */
export default function Reveal({
  children,
  className,
  delay = 0,
  y = 26,
  blur = true,
  once = true,
  as = "div",
}: Props) {
  const MotionTag = motion[as];
  const variants: Variants = {
    hidden: {
      opacity: 0,
      y,
      filter: blur ? "blur(10px)" : "blur(0px)",
    },
    show: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: {
        duration: 0.9,
        delay,
        ease: [0.16, 1, 0.3, 1],
      },
    },
  };

  return (
    <MotionTag
      className={cn(className)}
      variants={variants}
      initial="hidden"
      whileInView="show"
      viewport={{ once, margin: "-10% 0px -10% 0px" }}
    >
      {children}
    </MotionTag>
  );
}
