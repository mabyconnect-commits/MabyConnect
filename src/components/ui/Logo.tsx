import { cn } from "@/lib/utils";

/**
 * The Maby Connect brand mark — a white "C" (Connect) cradling a gold "M" (Maby).
 * Inline SVG so it stays crisp at any size and animates cleanly.
 */
export default function Logo({
  className,
  title = "Maby Connect",
}: {
  className?: string;
  title?: string;
}) {
  return (
    <svg
      viewBox="0 0 120 120"
      role="img"
      aria-label={title}
      className={cn("block", className)}
    >
      <path
        d="M 93.7 31.7 A 44 44 0 1 0 93.7 88.3"
        fill="none"
        stroke="#FFFFFF"
        strokeWidth={9}
        strokeLinecap="round"
      />
      <path
        d="M 41 78 L 50 47 L 60 66 L 70 47 L 79 78"
        fill="none"
        stroke="#D6B35A"
        strokeWidth={8}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
