import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import Reveal from "@/components/ui/Reveal";
import AnimatedText from "@/components/ui/AnimatedText";
import MagneticButton from "@/components/ui/MagneticButton";
import { capabilities } from "@/lib/agency";
import { site } from "@/lib/site";

export function generateStaticParams() {
  return capabilities.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const c = capabilities.find((x) => x.slug === slug);
  if (!c) return {};
  return {
    title: `${c.name} — Maby Agency`,
    description: c.tagline,
    alternates: { canonical: `/agency/capabilities/${c.slug}` },
    openGraph: {
      title: `${c.name} — Maby Agency`,
      description: c.tagline,
      url: `${site.url}/agency/capabilities/${c.slug}`,
    },
  };
}

export default async function CapabilityPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const capability = capabilities.find((c) => c.slug === slug);
  if (!capability) notFound();

  const i = capabilities.findIndex((c) => c.slug === slug);
  const next = capabilities[(i + 1) % capabilities.length];

  const facts = [
    { label: "Typical timeline", value: capability.timeline },
    { label: "Starting from", value: capability.from },
    { label: "Engagement", value: "Sprint or full build" },
    { label: "Code ownership", value: "Yours, from commit one" },
  ];

  return (
    <article>
      <header className="container-x pt-36 pb-16 md:pt-48 md:pb-20">
        <Reveal>
          <Link
            href="/agency#capabilities"
            className="inline-flex items-center gap-2 text-sm text-faint transition-colors hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" /> All capabilities
          </Link>
        </Reveal>

        <div className="mt-10 flex flex-wrap items-center gap-3">
          <span className="rounded-full border border-line px-3 py-1 font-mono text-[10px] tracking-widest text-gold uppercase">
            {capability.index} · Maby Agency
          </span>
          <span className="font-mono text-xs text-faint">
            {capability.timeline} · from {capability.from}
          </span>
        </div>

        <h1 className="display mt-8 max-w-4xl text-[clamp(2.4rem,8vw,6rem)] leading-[0.9] text-white">
          <AnimatedText text={capability.name} />
        </h1>

        <Reveal delay={0.2}>
          <p className="mt-8 max-w-2xl text-xl leading-relaxed text-mist md:text-2xl">
            {capability.tagline}
          </p>
        </Reveal>
      </header>

      {/* What we build in this lane */}
      <section className="border-t border-line py-20 md:py-28">
        <div className="container-x">
          <Reveal>
            <p className="eyebrow">What we build here</p>
          </Reveal>
          <div className="mt-10 grid gap-px overflow-hidden rounded-3xl border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
            {capability.builds.map((b, idx) => (
              <Reveal
                key={b}
                delay={Math.min(idx * 0.04, 0.24)}
                className="group flex items-center gap-4 bg-ink p-6 transition-colors duration-500 hover:bg-surface"
              >
                <span className="font-mono text-[10px] text-gold">
                  {String(idx + 1).padStart(2, "0")}
                </span>
                <span className="text-base text-white/85">{b}</span>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Body + facts */}
      <section className="container-x grid gap-12 border-t border-line py-20 md:grid-cols-[1fr_0.7fr] md:gap-20 md:py-28">
        <div className="space-y-6 text-lg leading-relaxed text-mist">
          {capability.description.map((p, idx) => (
            <Reveal key={idx} delay={idx * 0.05}>
              <p className={idx === 0 ? "text-white" : ""}>{p}</p>
            </Reveal>
          ))}

          <Reveal delay={0.15}>
            <div className="pt-6">
              <p className="eyebrow mb-6">What you get</p>
              <ul className="space-y-4">
                {capability.deliverables.map((d) => (
                  <li key={d} className="flex items-start gap-3">
                    <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-gold-soft">
                      <Check className="h-3 w-3 text-gold" />
                    </span>
                    <span className="text-base text-white/80">{d}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>

        <Reveal delay={0.1} className="h-fit md:sticky md:top-28">
          <p className="eyebrow mb-6">At a glance</p>
          <dl className="mb-10 divide-y divide-line rounded-2xl border border-line">
            {facts.map((f) => (
              <div
                key={f.label}
                className="flex items-baseline justify-between gap-6 px-5 py-3.5"
              >
                <dt className="font-mono text-[10px] tracking-widest text-faint uppercase">
                  {f.label}
                </dt>
                <dd className="text-right text-sm text-white/85">{f.value}</dd>
              </div>
            ))}
          </dl>

          <p className="eyebrow mb-5">Stack</p>
          <div className="flex flex-wrap gap-2">
            {capability.stack.map((s) => (
              <span
                key={s}
                className="rounded-full border border-line px-3 py-1.5 font-mono text-[11px] text-white/70"
              >
                {s}
              </span>
            ))}
          </div>

          <div className="mt-10 flex flex-wrap gap-3">
            <MagneticButton href="/agency/start" variant="solid" cursorLabel="Start">
              Scope this build
            </MagneticButton>
            <MagneticButton href="/agency/book" variant="outline">
              Book a call
            </MagneticButton>
          </div>
        </Reveal>
      </section>

      {/* Next capability */}
      <section className="border-t border-line">
        <Link
          href={`/agency/capabilities/${next.slug}`}
          className="group container-x flex flex-col gap-2 py-16 md:py-20"
        >
          <span className="eyebrow">Next capability</span>
          <div className="flex items-center justify-between gap-6">
            <h2 className="display text-[clamp(1.8rem,5vw,4rem)] text-white/70 transition-colors group-hover:text-white">
              {next.name}
            </h2>
            <span className="inline-flex items-center gap-1.5 text-sm text-white/80">
              View
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </span>
          </div>
        </Link>
      </section>
    </article>
  );
}
