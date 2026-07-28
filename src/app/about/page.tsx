import type { Metadata } from "next";
import PageHeader from "@/components/ui/PageHeader";
import Reveal from "@/components/ui/Reveal";
import Portrait from "@/components/ui/Portrait";
import Timeline from "@/components/sections/Timeline";
import Marquee from "@/components/ui/Marquee";
import { disciplines, cryptoRoles } from "@/lib/data";

export const metadata: Metadata = {
  title: "About",
  description:
    "The story of Matthew Adeleye — a graduate of the University of Calabar building companies, communities and products across crypto, technology, real estate and faith.",
};

export default function AboutPage() {
  return (
    <>
      <PageHeader
        index="/ 01"
        eyebrow="About"
        title="A builder, first a believer."
        intro="People online know me as Maby Connect. A graduate of the University of Calabar, I now work across crypto, technology, real estate, community and product — building things that solve real problems and help people grow."
      />

      {/* Story + portrait */}
      <section className="container-x grid gap-12 pb-24 lg:grid-cols-[1fr_0.8fr] lg:gap-20">
        <div className="space-y-6 text-lg leading-relaxed text-mist">
          <Reveal>
            <p>
              My name is Matthew Adeleye. I studied Applied Geophysics — a
              science of reading complex systems and finding signal in noise.
              It quietly shaped the way I build everything since.
            </p>
          </Reveal>
          <Reveal delay={0.05}>
            <p>
              Today I work across many industries at once: crypto and web3,
              technology, real estate, commerce, community, project management
              and business strategy. Different surfaces, one intention —{" "}
              <span className="text-white">
                create products that solve real problems while helping people
                grow financially, spiritually and personally.
              </span>
            </p>
          </Reveal>
          <Reveal delay={0.1}>
            <p>
              But before any of it, I am a lover of God. Everything I build
              comes from that foundation. It is the reason philanthropy is not
              an afterthought and impact is not a marketing line — it is the
              point of the work.
            </p>
          </Reveal>
        </div>

        <Reveal delay={0.15} className="lg:sticky lg:top-28 lg:h-fit">
          <Portrait className="aspect-[3/4] w-full" />
        </Reveal>
      </section>

      {/* Disciplines marquee */}
      <div className="border-y border-line py-8">
        <Marquee items={disciplines} duration={50} outline />
      </div>

      {/* Timeline */}
      <section className="container-x py-24 md:py-32">
        <Reveal className="flex items-center gap-4">
          <span className="font-mono text-xs text-gold">The Journey</span>
          <span className="h-px w-10 bg-line-strong" />
          <span className="eyebrow">Foundation → Future</span>
        </Reveal>
        <Reveal delay={0.1}>
          <h2 className="display mt-6 text-[clamp(2rem,6vw,4rem)] text-white">
            How the story unfolds.
          </h2>
        </Reveal>
        <Timeline />
      </section>

      {/* Crypto */}
      <section className="border-t border-line py-24 md:py-32">
        <div className="container-x">
          <Reveal className="flex items-center gap-4">
            <span className="font-mono text-xs text-gold">On-chain</span>
            <span className="h-px w-10 bg-line-strong" />
            <span className="eyebrow">Crypto & Web3</span>
          </Reveal>
          <Reveal delay={0.1}>
            <h2 className="display mt-6 max-w-4xl text-[clamp(2rem,6vw,4rem)] text-white">
              At the frontier of what money is becoming.
            </h2>
          </Reveal>
          <div className="mt-14 grid grid-cols-1 gap-px overflow-hidden rounded-3xl border border-line sm:grid-cols-2 lg:grid-cols-3">
            {cryptoRoles.map((role, i) => (
              <Reveal
                key={role}
                delay={i * 0.05}
                className="group bg-surface/40 p-8 transition-colors duration-500 hover:bg-surface"
              >
                <span className="font-mono text-xs text-faint">
                  0{i + 1}
                </span>
                <p className="display mt-6 text-2xl text-white/80 transition-colors group-hover:text-white">
                  {role}
                </p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
