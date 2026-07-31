import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import Reveal from "@/components/ui/Reveal";
import CompanyLogo from "@/components/ui/CompanyLogo";
import ArrowLink from "@/components/ui/ArrowLink";
import { companies } from "@/lib/data";

/**
 * Proof, not testimonials. Every company under Maby Connect was built
 * by this team — that's the portfolio.
 */
export default function ProofStrip() {
  const built = companies.filter((c) => c.logo);

  return (
    <section className="relative border-t border-line py-24 md:py-32">
      <div className="container-x">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <Reveal className="flex items-center gap-4">
              <span className="font-mono text-xs text-gold">005</span>
              <span className="h-px w-10 bg-line-strong" />
              <span className="eyebrow">Proof</span>
            </Reveal>
            <Reveal delay={0.1}>
              <h2 className="display mt-6 max-w-3xl text-[clamp(2.2rem,7vw,5rem)] text-white">
                We build for ourselves first.
              </h2>
            </Reveal>
            <Reveal delay={0.2}>
              <p className="mt-6 max-w-xl text-mist">
                Every product below is ours — funded, built and shipped in-house.
                We&apos;re not an agency that read about marketplaces; we run one.
              </p>
            </Reveal>
          </div>
          <Reveal delay={0.25}>
            <ArrowLink href="/companies">See all companies</ArrowLink>
          </Reveal>
        </div>

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {built.map((c, i) => (
            <Reveal key={c.slug} delay={Math.min(i * 0.06, 0.3)}>
              <Link
                href={`/companies/${c.slug}`}
                className="group flex h-full flex-col rounded-3xl border border-line bg-surface/40 p-7 transition-colors duration-500 hover:border-line-strong hover:bg-surface"
              >
                <div className="flex items-start justify-between">
                  <CompanyLogo name={c.name} logo={c.logo} size={52} />
                  <ArrowUpRight className="h-5 w-5 text-faint transition-all duration-300 group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-gold" />
                </div>

                <h3 className="display mt-6 text-xl text-white">{c.name}</h3>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-mist">
                  {c.tagline}
                </p>

                <div className="mt-6 flex items-center gap-3 border-t border-line pt-4">
                  <span className="font-mono text-[10px] tracking-widest text-gold uppercase">
                    {c.status}
                  </span>
                  <span className="font-mono text-[10px] tracking-widest text-faint uppercase">
                    {c.category}
                  </span>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
