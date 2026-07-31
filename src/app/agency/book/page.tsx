import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import BookingFlow from "@/components/agency/BookingFlow";
import Reveal from "@/components/ui/Reveal";
import { agency } from "@/lib/agency";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Book a call — Maby Agency",
  description:
    "Pick a slot and talk to the people who'll build it. Intro calls, scoping sessions, technical reviews and partnerships.",
  alternates: { canonical: "/agency/book" },
  openGraph: {
    title: "Book a call — Maby Agency",
    description: "Pick a slot and talk to the people who'll build it.",
    url: `${site.url}/agency/book`,
  },
};

export default function BookPage() {
  return (
    <div className="relative min-h-dvh">
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="animate-drift-slow absolute -top-1/4 left-0 h-[45vw] w-[45vw] rounded-full bg-gold/[0.06] blur-[130px]" />
      </div>

      <header className="container-x pt-36 pb-12 md:pt-44 md:pb-16">
        <Reveal>
          <Link
            href="/agency"
            className="inline-flex items-center gap-2 text-sm text-faint transition-colors hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" /> Maby Agency
          </Link>
        </Reveal>

        <div className="mt-10 flex items-center gap-4">
          <span className="font-mono text-xs text-gold">/ Booking</span>
          <span className="h-px w-10 bg-line-strong" />
          <span className="eyebrow">Replies in {agency.responseTime.toLowerCase()}</span>
        </div>

        <Reveal delay={0.1}>
          <h1 className="display mt-8 max-w-4xl text-[clamp(2.4rem,8vw,6rem)] leading-[0.9] text-white">
            Book a call.
          </h1>
        </Reveal>
        <Reveal delay={0.2}>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-mist">
            You&apos;ll speak to the person who would actually build it — not a
            salesperson reading a script.
          </p>
        </Reveal>
      </header>

      <section className="container-x pb-32">
        <BookingFlow />
      </section>
    </div>
  );
}
