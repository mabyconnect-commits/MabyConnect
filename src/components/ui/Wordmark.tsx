import { cn } from "@/lib/utils";

/**
 * The official "MABY CONNECT" wordmark lockup: stacked on two lines,
 * all-caps, widely tracked, with the gold "O" in CONNECT — matching the
 * brand logo. Size and colour are controlled via `className`; the gold
 * accent stays fixed. Pass `text-ink` (etc.) for use on light surfaces.
 */
export default function Wordmark({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "font-sans font-bold uppercase leading-[0.95] tracking-[0.24em] text-white",
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
