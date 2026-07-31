import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import Reveal from "@/components/ui/Reveal";
import AnimatedText from "@/components/ui/AnimatedText";
import MagneticButton from "@/components/ui/MagneticButton";
import ArrowLink from "@/components/ui/ArrowLink";
import CompanyLogo from "@/components/ui/CompanyLogo";
import { companies } from "@/lib/data";

export function generateStaticParams() {
  return companies.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const company = companies.find((c) => c.slug === slug);
  if (!company) return {};
  return {
    title: company.name,
    description: company.summary,
  };
}

export default async function CompanyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const company = companies.find((c) => c.slug === slug);
  if (!company) notFound();

  const index = companies.findIndex((c) => c.slug === slug);
  const next = companies[(index + 1) % companies.length];

  const facts = [
    { label: "Category", value: company.category },
    { label: "Founded", value: company.year },
    { label: "Status", value: company.status },
    ...(company.role ? [{ label: "Role", value: company.role }] : []),
    ...(company.url
      ? [{ label: "Website", value: company.url.replace(/^https?:\/\//, "") }]
      : []),
  ];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: company.name,
    description: company.summary,
    ...(company.url ? { url: company.url } : {}),
    ...(company.year ? { foundingDate: company.year.replace(/\D/g, "") } : {}),
    knowsAbout: company.category.split("·").map((c) => c.trim()),
  };

  return (
    <article>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <header className="container-x pt-36 pb-16 md:pt-48 md:pb-20">
        <Reveal>
          <Link
            href="/companies"
            className="inline-flex items-center gap-2 text-sm text-faint transition-colors hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" /> All companies
          </Link>
        </Reveal>

        <div className="mt-10 flex flex-wrap items-center gap-3">
          <span className="rounded-full border border-line px-3 py-1 font-mono text-[10px] tracking-widest text-gold uppercase">
            {company.status}
          </span>
          <span className="font-mono text-xs text-faint">
            {company.role ? `${company.role} · ` : ""}
            {company.category} · Est. {company.year}
          </span>
        </div>

        <h1 className="display mt-8 text-[clamp(2.5rem,9vw,7rem)] leading-[0.9] text-white">
          <AnimatedText text={company.name} />
        </h1>

        <Reveal delay={0.2}>
          <p className="mt-8 max-w-2xl text-xl leading-relaxed text-mist md:text-2xl">
            {company.tagline}
          </p>
        </Reveal>

        {company.url && (
          <Reveal delay={0.3} className="mt-6">
            <ArrowLink href={company.url} external>
              {company.url.replace(/^https?:\/\//, "")}
            </ArrowLink>
          </Reveal>
        )}
      </header>

      {/* Visual band */}
      <Reveal>
        <div className="container-x">
          <div className="relative flex aspect-[16/7] items-center justify-center overflow-hidden rounded-3xl border border-line bg-surface">
            <div className="absolute left-1/2 top-1/2 h-[60%] w-[60%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold/[0.08] blur-[100px]" />
            {company.logo ? (
              <CompanyLogo
                name={company.name}
                logo={company.logo}
                size={140}
                className="rounded-3xl shadow-2xl shadow-black/40"
              />
            ) : (
              <span className="display px-6 text-center text-[clamp(2rem,7vw,5rem)] text-outline">
                {company.name.split(" ")[0]}
              </span>
            )}
            <div className="absolute inset-0 rounded-3xl ring-1 ring-inset ring-white/10" />
          </div>
        </div>
      </Reveal>

      {/* Body */}
      <section className="container-x grid gap-12 py-20 md:grid-cols-[1fr_0.7fr] md:gap-20 md:py-28">
        <div className="space-y-6 text-lg leading-relaxed text-mist">
          {company.description.map((p, i) => (
            <Reveal key={i} delay={i * 0.05}>
              <p className={i === 0 ? "text-white" : ""}>{p}</p>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.1} className="h-fit md:sticky md:top-28">
          <p className="eyebrow mb-6">At a glance</p>
          <dl className="mb-12 divide-y divide-line rounded-2xl border border-line">
            {facts.map((f) => (
              <div
                key={f.label}
                className="flex items-baseline justify-between gap-6 px-5 py-3.5"
              >
                <dt className="font-mono text-[10px] tracking-widest text-faint uppercase">
                  {f.label}
                </dt>
                <dd className="text-right text-sm text-white/80">{f.value}</dd>
              </div>
            ))}
          </dl>

          <p className="eyebrow mb-6">Highlights</p>
          <ul className="space-y-4">
            {company.highlights.map((h) => (
              <li key={h} className="flex items-start gap-3">
                <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-gold-soft">
                  <Check className="h-3 w-3 text-gold" />
                </span>
                <span className="text-white/80">{h}</span>
              </li>
            ))}
          </ul>
          <div className="mt-10 flex flex-wrap gap-3">
            {company.href ? (
              <MagneticButton href={company.href} variant="solid" cursorLabel="Enter">
                Enter the agency
              </MagneticButton>
            ) : (
              company.url && (
                <MagneticButton href={company.url} variant="solid" cursorLabel="Visit">
                  Visit website
                </MagneticButton>
              )
            )}
            <MagneticButton href="/contact" variant="outline">
              Work with us
            </MagneticButton>
          </div>
        </Reveal>
      </section>

      {/* Next */}
      <section className="border-t border-line">
        <Link
          href={`/companies/${next.slug}`}
          className="group container-x flex flex-col gap-2 py-16 md:py-20"
        >
          <span className="eyebrow">Next company</span>
          <div className="flex items-center justify-between gap-6">
            <h2 className="display text-[clamp(2rem,6vw,4.5rem)] text-white/70 transition-colors group-hover:text-white">
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
