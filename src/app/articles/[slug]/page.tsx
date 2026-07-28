import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import Reveal from "@/components/ui/Reveal";
import AnimatedText from "@/components/ui/AnimatedText";
import { articles } from "@/lib/data";

export function generateStaticParams() {
  return articles.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = articles.find((a) => a.slug === slug);
  if (!article) return {};
  return {
    title: article.title,
    description: article.excerpt,
    openGraph: { type: "article", title: article.title, description: article.excerpt },
  };
}

function formatDate(d: string) {
  return new Date(d).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = articles.find((a) => a.slug === slug);
  if (!article) notFound();

  const index = articles.findIndex((a) => a.slug === slug);
  const next = articles[(index + 1) % articles.length];

  return (
    <article>
      <header className="container-x pt-36 pb-12 md:pt-48 md:pb-16">
        <Reveal>
          <Link
            href="/articles"
            className="inline-flex items-center gap-2 text-sm text-faint transition-colors hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" /> All articles
          </Link>
        </Reveal>

        <div className="mt-10 flex items-center gap-3 font-mono text-xs text-faint">
          <span className="text-gold">{article.category}</span>
          <span>·</span>
          <span>{formatDate(article.date)}</span>
          <span>·</span>
          <span>{article.readingTime} read</span>
        </div>

        <h1 className="display mt-8 max-w-4xl text-[clamp(2.2rem,7vw,5.5rem)] leading-[0.92] text-white">
          <AnimatedText text={article.title} />
        </h1>
      </header>

      {/* Body — Medium-like reading experience */}
      <div className="container-x pb-24">
        <div className="mx-auto max-w-2xl space-y-7 text-lg leading-[1.8] text-mist md:text-xl md:leading-[1.85]">
          {article.body.map((p, i) => (
            <Reveal key={i} delay={Math.min(i, 3) * 0.04}>
              <p
                className={
                  i === 0
                    ? "text-2xl leading-relaxed text-white first-letter:float-left first-letter:mr-3 first-letter:font-medium first-letter:text-[3.5rem] first-letter:leading-[0.8] first-letter:text-gold md:text-3xl"
                    : ""
                }
              >
                {p}
              </p>
            </Reveal>
          ))}

          <div className="!mt-16 flex items-center gap-3">
            <span className="h-px flex-1 bg-line" />
            <span className="font-mono text-xs tracking-widest text-faint">
              MABY CONNECT
            </span>
            <span className="h-px flex-1 bg-line" />
          </div>
        </div>
      </div>

      {/* Next */}
      <section className="border-t border-line">
        <Link
          href={`/articles/${next.slug}`}
          className="group container-x flex flex-col gap-2 py-16 md:py-20"
        >
          <span className="eyebrow">Next article</span>
          <div className="flex items-center justify-between gap-6">
            <h2 className="display max-w-3xl text-[clamp(1.6rem,5vw,3.5rem)] leading-tight text-white/70 transition-colors group-hover:text-white">
              {next.title}
            </h2>
            <ArrowRight className="h-6 w-6 shrink-0 text-faint transition-all group-hover:translate-x-1 group-hover:text-gold" />
          </div>
        </Link>
      </section>
    </article>
  );
}
