import Image from "next/image";
import { cn } from "@/lib/utils";

/**
 * Renders a company's brand logo tile (square) with a subtle ring so it
 * sits cleanly on the dark UI. Falls back to the company's initial when
 * no logo has been added yet, keeping layout consistent for every company.
 */
export default function CompanyLogo({
  name,
  logo,
  size = 56,
  className,
}: {
  name: string;
  logo?: string;
  size?: number;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-line bg-surface",
        className,
      )}
      style={{ width: size, height: size }}
    >
      {logo ? (
        <Image
          src={logo}
          alt={`${name} logo`}
          width={size}
          height={size}
          className="h-full w-full object-cover"
        />
      ) : (
        <span className="display text-lg text-white/50">{name.charAt(0)}</span>
      )}
      <span className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/10" />
    </span>
  );
}
