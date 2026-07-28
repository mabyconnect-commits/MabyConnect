"use client";

import { cn } from "@/lib/utils";

type Props = {
  items: readonly string[];
  duration?: number;
  className?: string;
  separator?: string;
  outline?: boolean;
};

function MarqueeGroup({
  items,
  separator,
  outline,
  ariaHidden,
}: {
  items: readonly string[];
  separator: string;
  outline: boolean;
  ariaHidden?: boolean;
}) {
  return (
    <div className="flex shrink-0 items-center" aria-hidden={ariaHidden || undefined}>
      {items.map((item, i) => (
        <span key={i} className="flex items-center">
          <span
            className={cn(
              "display px-6 text-[clamp(2rem,7vw,5rem)] whitespace-nowrap",
              outline ? "text-outline" : "text-white/90",
            )}
          >
            {item}
          </span>
          <span className="text-gold/70 text-2xl">{separator}</span>
        </span>
      ))}
    </div>
  );
}

/**
 * Seamless infinite marquee. The content group is duplicated inside a
 * single track that translates -50%, so the loop is perfectly continuous.
 */
export default function Marquee({
  items,
  duration = 40,
  className,
  separator = "•",
  outline = false,
}: Props) {
  return (
    <div
      className={cn("relative flex overflow-hidden", className)}
      style={{ ["--marquee-duration" as string]: `${duration}s` }}
    >
      <div className="animate-marquee flex w-max shrink-0 items-center">
        <MarqueeGroup items={items} separator={separator} outline={outline} />
        <MarqueeGroup items={items} separator={separator} outline={outline} ariaHidden />
      </div>
    </div>
  );
}
