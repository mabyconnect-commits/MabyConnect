import type { Metadata } from "next";
import PageHeader from "@/components/ui/PageHeader";
import Reveal from "@/components/ui/Reveal";
import { projects } from "@/lib/data";

export const metadata: Metadata = {
  title: "Projects",
  description:
    "Products and projects built by Maby Connect across crypto, web3, product, strategy, consulting and community.",
};

export default function ProjectsPage() {
  return (
    <>
      <PageHeader
        index="/ 03"
        eyebrow="Projects"
        title="Things I've built."
        intro="Launchpads and on-chain research. Product sprints and brand systems. Growth strategy and community. A selection of the work behind the companies."
      />

      <section className="container-x pb-32">
        <div className="grid gap-6 md:grid-cols-2">
          {projects.map((p, i) => (
            <Reveal
              key={p.title}
              delay={(i % 2) * 0.08}
              className="group relative flex min-h-[15rem] flex-col justify-between overflow-hidden rounded-3xl border border-line bg-surface/40 p-8 transition-colors duration-500 hover:border-line-strong md:p-10"
            >
              <div className="pointer-events-none absolute -right-20 -top-20 h-48 w-48 rounded-full bg-gold/[0.05] blur-3xl opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
              <div className="flex items-center justify-between">
                <span className="rounded-full border border-line px-3 py-1 font-mono text-[10px] tracking-widest text-gold uppercase">
                  {p.domain}
                </span>
                <span className="font-mono text-xs text-faint">{p.year}</span>
              </div>
              <div>
                <h2 className="display text-3xl text-white md:text-4xl">
                  {p.title}
                </h2>
                <p className="mt-4 max-w-md text-sm leading-relaxed text-mist">
                  {p.blurb}
                </p>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-16 rounded-3xl border border-line bg-surface/30 p-10 text-center md:p-16">
          <p className="eyebrow">Have something in mind?</p>
          <p className="display mx-auto mt-6 max-w-3xl text-[clamp(1.6rem,4vw,2.8rem)] leading-tight text-white text-balance">
            I partner with founders to build products, refine strategy and
            launch ideas that matter.
          </p>
        </Reveal>
      </section>
    </>
  );
}
