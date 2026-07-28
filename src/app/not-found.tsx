import Link from "next/link";
import MagneticButton from "@/components/ui/MagneticButton";

export default function NotFound() {
  return (
    <section className="flex min-h-dvh flex-col items-center justify-center px-6 text-center">
      <p className="eyebrow">Error 404</p>
      <h1 className="display mt-6 text-[clamp(4rem,18vw,14rem)] leading-none text-outline">
        Lost
      </h1>
      <p className="mt-6 max-w-sm text-mist">
        This page wandered off. But the work continues — let&apos;s get you back.
      </p>
      <div className="mt-10 flex items-center gap-4">
        <MagneticButton href="/" variant="solid">
          Back home
        </MagneticButton>
        <Link
          href="/contact"
          className="text-sm text-white/60 transition-colors hover:text-white"
        >
          Contact
        </Link>
      </div>
    </section>
  );
}
