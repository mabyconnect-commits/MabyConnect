import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Compass } from "lucide-react";
import PageHeader from "@/components/ui/PageHeader";
import Reveal from "@/components/ui/Reveal";
import { guidedPaths } from "@/lib/paths";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Where do you want to start?",
  description:
    "Tailored guides into everything Maby Connect builds — real estate, services, crypto, food and learning to build. Answer a few questions and get a route that actually fits.",
  alternates: { canonical: "/start" },
  openGraph: {
    title: "Where do you want to start? — Maby Connect",
    description:
      "Answer a few questions and get a tailored route into real estate, services, crypto, food or learning to build.",
    url: `${site.url}/start`,
  },
};

export default function StartHubPage() {
  return (
    <>
      <PageHeader
        index="/ 00"
        eyebrow="Start here"
        title="What do you want to do?"
        intro="Most people know what they want but not how to begin. Pick the one that sounds like you — a few questions later you'll have a route that actually fits your situation, your budget and your timeline."
      />

      <section className="container-x pb-32">
        <div className="grid gap-6 md:grid-cols-2">
          {guidedPaths.map((p, i) => (
            <Reveal key={p.slug} delay={Math.min(i * 0.07, 0.28)}>
              <Link
                href={`/start/${p.slug}`}
                className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-line bg-surface/40 p-8 transition-colors duration-500 hover:border-line-strong hover:bg-surface md:p-10"
              >
                {/* Venture accent */}
                <span
                  aria-hidden
                  className="absolute inset-x-0 top-0 h-px opacity-60"
                  style={{
                    background: `linear-gradient(to right, transparent, ${p.accent}, transparent)`,
                  }}
                />

                <span
                  className="font-mono text-[10px] tracking-[0.22em] uppercase"
                  style={{ color: p.accent }}
                >
                  {p.eyebrow}
                </span>

                <h2 className="display mt-6 text-2xl leading-tight text-white md:text-3xl">
                  “{p.intent}”
                </h2>

                <p className="mt-4 flex-1 text-base leading-relaxed text-mist">
                  {p.intro}
                </p>

                <span className="mt-8 inline-flex items-center gap-2 text-sm text-white/80 transition-colors group-hover:text-gold">
                  {p.steps.length} questions
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </span>
              </Link>
            </Reveal>
          ))}

          {/* Agency route */}
          <Reveal delay={0.35}>
            <Link
              href="/agency/start"
              className="group flex h-full flex-col rounded-3xl border border-gold/30 bg-gold-soft p-8 transition-colors duration-500 hover:border-gold/50 md:p-10"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gold-soft">
                <Compass className="h-5 w-5 text-gold" />
              </span>
              <h2 className="display mt-6 text-2xl leading-tight text-white md:text-3xl">
                “I want something built”
              </h2>
              <p className="mt-4 flex-1 text-base leading-relaxed text-mist">
                Web apps, blockchains, bank apps, marketplaces, mobile, AI. The
                agency configurator returns a scope, a timeline and a budget band.
              </p>
              <span className="mt-8 inline-flex items-center gap-2 text-sm text-white/80 transition-colors group-hover:text-gold">
                6 questions
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </span>
            </Link>
          </Reveal>
        </div>

        <Reveal delay={0.4}>
          <p className="mt-14 max-w-2xl text-sm leading-relaxed text-faint">
            None of these quite fit?{" "}
            <Link href="/contact" className="text-white/80 underline decoration-line-strong underline-offset-4 hover:text-gold">
              Just tell us what you&apos;re trying to do
            </Link>{" "}
            — a person reads every message.
          </p>
        </Reveal>
      </section>
    </>
  );
}
