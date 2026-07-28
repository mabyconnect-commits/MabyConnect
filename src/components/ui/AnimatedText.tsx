"use client";

import { motion, type Variants } from "framer-motion";
import { cn } from "@/lib/utils";

type Props = {
  text: string;
  className?: string;
  wordClassName?: string;
  delay?: number;
  once?: boolean;
  stagger?: number;
};

/**
 * Word-by-word reveal — each word rises from behind a clipping mask.
 * Ideal for large display headings.
 */
export default function AnimatedText({
  text,
  className,
  wordClassName,
  delay = 0,
  once = true,
  stagger = 0.055,
}: Props) {
  const words = text.split(" ");

  const container: Variants = {
    hidden: {},
    show: {
      transition: { staggerChildren: stagger, delayChildren: delay },
    },
  };
  const word: Variants = {
    hidden: { y: "115%" },
    show: {
      y: 0,
      transition: { duration: 0.85, ease: [0.16, 1, 0.3, 1] },
    },
  };

  return (
    <motion.span
      className={cn("inline-flex flex-wrap", className)}
      variants={container}
      initial="hidden"
      whileInView="show"
      viewport={{ once, margin: "-8% 0px" }}
      aria-label={text}
    >
      {words.map((w, i) => (
        <span
          key={i}
          className="mr-[0.25em] inline-flex overflow-hidden pb-[0.12em] last:mr-0"
          aria-hidden
        >
          <motion.span variants={word} className={cn("inline-block", wordClassName)}>
            {w}
          </motion.span>
        </span>
      ))}
    </motion.span>
  );
}
