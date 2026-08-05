import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import Configurator from "@/components/agency/Configurator";
import Reveal from "@/components/ui/Reveal";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Start a project — Maby Agency",
  description:
    "Answer six questions and get an indicative scope, timeline and budget band for your build — in about two minutes.",
  alternates: { canonical: "/agency/start" },
  openGraph: {
    title: "Start a project — Maby Agency",
    description:
      "Answer six questions and get an indicative scope, timeline and budget band for your build.",
    url: `${site.url}/agency/start`,
  },
};

export default function StartPage() {
  return (
    <div className="relative min-h-dvh">
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="animate-drift absolute -top-1/4 right-0 h-[45vw] w-[45vw] rounded-full bg-gold/[0.06] blur-[130px]" />
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
          <span className="font-mono text-xs text-gold">/ Configurator</span>
          <span className="h-px w-10 bg-line-strong" />
          <span className="eyebrow">About 2 minutes</span>
        </div>

        <Reveal delay={0.1}>
          <h1 className="display mt-8 max-w-4xl text-[clamp(2.4rem,8vw,6rem)] leading-[0.9] text-white">
            Let&apos;s scope it.
          </h1>
        </Reveal>
        <Reveal delay={0.2}>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-mist">
            Six questions. At the end you&apos;ll see the capabilities your build
            needs, a realistic timeline and a budget band — before you talk to
            anyone.
          </p>
        </Reveal>
      </header>

      <section className="container-x pb-32">
        <div className="max-w-3xl">
          <Configurator />
        </div>
      </section>
    </div>
  );
}
