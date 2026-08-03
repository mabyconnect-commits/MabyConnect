import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import GuidedPathFlow from "@/components/paths/GuidedPathFlow";
import Reveal from "@/components/ui/Reveal";
import { findPath, guidedPaths } from "@/lib/paths";
import { site } from "@/lib/site";

export function generateStaticParams() {
  return guidedPaths.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const path = findPath(slug);
  if (!path) return {};
  return {
    title: `${path.intent} — Maby Connect`,
    description: path.intro,
    alternates: { canonical: `/start/${path.slug}` },
    openGraph: {
      title: `${path.intent} — Maby Connect`,
      description: path.intro,
      url: `${site.url}/start/${path.slug}`,
    },
  };
}

export default async function GuidedPathPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const path = findPath(slug);
  if (!path) notFound();

  return (
    <div className="relative min-h-dvh">
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div
          className="animate-drift absolute -top-1/4 right-0 h-[45vw] w-[45vw] rounded-full blur-[130px] opacity-[0.07]"
          style={{ background: path.accent }}
        />
      </div>

      <header className="container-x pt-36 pb-12 md:pt-44 md:pb-16">
        <Reveal>
          <Link
            href="/start"
            className="inline-flex items-center gap-2 text-sm text-faint transition-colors hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" /> All paths
          </Link>
        </Reveal>

        <div className="mt-10 flex flex-wrap items-center gap-4">
          <span
            className="font-mono text-xs tracking-widest uppercase"
            style={{ color: path.accent }}
          >
            {path.eyebrow}
          </span>
          <span className="h-px w-10 bg-line-strong" />
          <span className="eyebrow">{path.steps.length} questions</span>
        </div>

        <Reveal delay={0.1}>
          <h1 className="display mt-8 max-w-4xl text-[clamp(2.2rem,7vw,5rem)] leading-[0.95] text-white">
            {path.title}
          </h1>
        </Reveal>
        <Reveal delay={0.2}>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-mist">
            {path.intro}
          </p>
        </Reveal>
      </header>

      <section className="container-x pb-32">
        <div className="max-w-3xl">
          <GuidedPathFlow path={path} />
        </div>
      </section>
    </div>
  );
}
