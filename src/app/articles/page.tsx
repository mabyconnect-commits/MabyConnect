import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import PageHeader from "@/components/ui/PageHeader";
import Reveal from "@/components/ui/Reveal";
import { articles } from "@/lib/data";

export const metadata: Metadata = {
  title: "Articles",
  description:
    "Writing from Matthew Adeleye on building, faith, crypto, product and impact.",
};

function formatDate(d: string) {
  return new Date(d).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function ArticlesPage() {
  const [feature, ...rest] = articles;

  return (
    <>
      <PageHeader
        index="/ 07"
        eyebrow="Articles"
        title="Notes on building."
        intro="Occasional writing on faith, companies, crypto and impact — the thinking behind the work."
      />

      <section className="container-x pb-32">
        {/* Featured */}
        <Reveal>
          <Link
            href={`/articles/${feature.slug}`}
            className="group grid gap-8 border-y border-line py-12 md:grid-cols-[1fr_1fr] md:items-center md:py-16"
          >
            <div className="relative flex aspect-[16/10] items-center justify-center overflow-hidden rounded-3xl border border-line bg-surface">
              <div className="absolute left-1/2 top-1/2 h-[55%] w-[55%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold/[0.08] blur-[90px]" />
              <span className="display px-6 text-center text-[clamp(1.5rem,4vw,2.5rem)] text-outline">
                {feature.category}
              </span>
            </div>
            <div>
              <div className="flex items-center gap-3 font-mono text-xs text-faint">
                <span className="text-gold">Featured</span>
                <span>·</span>
                <span>{formatDate(feature.date)}</span>
                <span>·</span>
                <span>{feature.readingTime}</span>
              </div>
              <h2 className="display mt-6 text-[clamp(1.8rem,4vw,3rem)] leading-tight text-white transition-colors">
                {feature.title}
              </h2>
              <p className="mt-5 max-w-lg leading-relaxed text-mist">
                {feature.excerpt}
              </p>
              <span className="mt-8 inline-flex items-center gap-2 text-sm text-white/70 transition-colors group-hover:text-white">
                Read article
                <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </span>
            </div>
          </Link>
        </Reveal>

        {/* Rest */}
        <div className="mt-4">
          {rest.map((a, i) => (
            <Reveal key={a.slug} delay={i * 0.05}>
              <Link
                href={`/articles/${a.slug}`}
                className="group grid grid-cols-1 gap-4 border-b border-line py-8 md:grid-cols-[auto_1fr_auto] md:items-center md:gap-10"
              >
                <span className="font-mono text-xs text-gold">
                  {a.category}
                </span>
                <div>
                  <h3 className="text-xl text-white/80 transition-colors group-hover:text-white md:text-3xl">
                    {a.title}
                  </h3>
                  <p className="mt-2 max-w-xl text-sm text-mist">{a.excerpt}</p>
                </div>
                <span className="font-mono text-xs text-faint">
                  {formatDate(a.date)} · {a.readingTime}
                </span>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>
    </>
  );
}
