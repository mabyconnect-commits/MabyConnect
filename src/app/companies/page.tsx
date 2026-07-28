import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import PageHeader from "@/components/ui/PageHeader";
import Reveal from "@/components/ui/Reveal";
import { companies } from "@/lib/data";

export const metadata: Metadata = {
  title: "Companies",
  description:
    "The companies built under Maby Connect — Channels Realty Innovation, Surlink, Groceries and the ventures still in motion.",
};

export default function CompaniesPage() {
  return (
    <>
      <PageHeader
        index="/ 02"
        eyebrow="Companies"
        title="Companies I build."
        intro="Each company begins with a real problem and a real person it's meant to serve. Accessible real estate. Trusted local services. Food that reaches home. And what comes next."
      />

      <section className="container-x pb-32">
        <div className="border-t border-line">
          {companies.map((c, i) => (
            <Reveal key={c.slug}>
              <Link
                href={`/companies/${c.slug}`}
                className="group grid grid-cols-1 gap-6 border-b border-line py-10 md:grid-cols-[auto_1fr_auto] md:items-center md:gap-10 md:py-14"
              >
                <span className="font-mono text-xs text-faint">
                  0{i + 1}
                </span>

                <div>
                  <div className="flex flex-wrap items-center gap-3">
                    <h2 className="display text-3xl text-white/80 transition-colors duration-300 group-hover:text-white md:text-5xl">
                      {c.name}
                    </h2>
                    <span className="rounded-full border border-line px-3 py-1 font-mono text-[10px] tracking-widest text-gold uppercase">
                      {c.status}
                    </span>
                  </div>
                  <p className="mt-4 max-w-xl text-base leading-relaxed text-mist">
                    {c.summary}
                  </p>
                  <div className="mt-5 flex flex-wrap gap-x-6 gap-y-1 font-mono text-xs text-faint">
                    <span>{c.category}</span>
                    <span>Est. {c.year}</span>
                  </div>
                </div>

                <ArrowUpRight className="h-7 w-7 text-faint transition-all duration-300 group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-gold" />
              </Link>
            </Reveal>
          ))}
        </div>
      </section>
    </>
  );
}
