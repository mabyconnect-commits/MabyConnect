import { cn } from "@/lib/utils";

/**
 * The official "MABY CONNECT" wordmark lockup: stacked on two lines,
 * all-caps, widely tracked, with the gold "O" in CONNECT — matching the
 * brand logo.
 *
 * `tone` sets the letter colour: "light" (white — for dark backgrounds,
 * the default) or "dark" (near-black — for light backgrounds). The gold
 * accent stays fixed in both. Size is controlled via `className`.
 */
export default function Wordmark({
  tone = "light",
  className,
}: {
  tone?: "light" | "dark";
  className?: string;
}) {
  return (
    <span
      className={cn(
        "font-sans font-bold uppercase leading-[0.95] tracking-[0.24em]",
        tone === "dark" ? "text-ink" : "text-white",
        className,
      )}
      aria-label="Maby Connect"
    >
      <span className="block">Maby</span>
      <span className="block">
        C<span className="text-gold">o</span>nnect
      </span>
    </span>
  );
}
