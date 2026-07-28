import type { Metadata } from "next";
import Reveal from "@/components/ui/Reveal";
import AnimatedText from "@/components/ui/AnimatedText";
import MagneticButton from "@/components/ui/MagneticButton";
import { Heart, Users, Sprout, HandHeart } from "lucide-react";

export const metadata: Metadata = {
  title: "Foundation",
  description:
    "The Jenmec Foundation — feeding the hungry, supporting children and creating opportunity. Inspired by Ubuntu: I am because we are.",
};

const pillars = [
  { icon: HandHeart, title: "Feeding the hungry", body: "Meeting the most basic human need with dignity and consistency." },
  { icon: Users, title: "Supporting children", body: "Investing in the young — because a child supported is a future secured." },
  { icon: Sprout, title: "Creating opportunity", body: "Opening doors where there were none, so people can rise on their own." },
  { icon: Heart, title: "Helping people", body: "Quiet, practical help — the kind that changes a single life at a time." },
];

export default function FoundationPage() {
  return (
    <>
      {/* Emotional hero */}
      <section className="relative flex min-h-[92dvh] items-center overflow-hidden">
        <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
          <div className="animate-drift absolute left-1/2 top-1/3 h-[70vh] w-[70vh] -translate-x-1/2 rounded-full bg-gold/[0.08] blur-[140px]" />
        </div>
        <div className="container-x">
          <Reveal className="flex items-center gap-4">
            <span className="font-mono text-xs text-gold">/ 05</span>
            <span className="h-px w-10 bg-line-strong" />
            <span className="eyebrow">Jenmec Foundation</span>
          </Reveal>

          <h1 className="display mt-10 text-[clamp(3rem,13vw,11rem)] leading-[0.85] text-white">
            <AnimatedText text="I am because" />
            <span className="block text-gradient-gold">
              <AnimatedText text="we are." delay={0.2} />
            </span>
          </h1>

          <Reveal delay={0.3}>
            <p className="mt-10 max-w-2xl text-xl leading-relaxed text-mist">
              Inspired by Ubuntu — the belief that my humanity is bound up in
              yours. The Jenmec Foundation is where conviction becomes action.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Statement */}
      <section className="border-t border-line py-28 md:py-40">
        <div className="container-x">
          <Reveal>
            <p className="display max-w-5xl text-[clamp(1.6rem,4.4vw,3.4rem)] leading-[1.15] text-white text-balance">
              Business and impact were never two separate tracks. The companies
              fund the mission. The mission gives the companies their meaning.
              <span className="text-mist">
                {" "}
                Profit with purpose — that is the whole idea.
              </span>
            </p>
          </Reveal>
        </div>
      </section>

      {/* Pillars */}
      <section className="border-t border-line py-24 md:py-32">
        <div className="container-x">
          <Reveal>
            <h2 className="display text-[clamp(2rem,6vw,4rem)] text-white">
              How we help.
            </h2>
          </Reveal>
          <div className="mt-14 grid grid-cols-1 gap-px overflow-hidden rounded-3xl border border-line sm:grid-cols-2 lg:grid-cols-4">
            {pillars.map((p, i) => {
              const Icon = p.icon;
              return (
                <Reveal
                  key={p.title}
                  delay={i * 0.08}
                  className="group bg-surface/40 p-8 transition-colors duration-500 hover:bg-surface"
                >
                  <Icon className="h-6 w-6 text-gold" />
                  <h3 className="display mt-8 text-2xl text-white">
                    {p.title}
                  </h3>
                  <p className="mt-4 text-sm leading-relaxed text-mist">
                    {p.body}
                  </p>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-line py-28 text-center">
        <div className="container-x">
          <Reveal>
            <p className="mx-auto max-w-3xl text-[clamp(1.4rem,4vw,2.6rem)] leading-tight text-white text-balance">
              If you&apos;d like to give, partner or simply learn more —
              you&apos;re welcome here.
            </p>
          </Reveal>
          <Reveal delay={0.15} className="mt-10">
            <MagneticButton href="/contact" variant="solid">
              Get involved
            </MagneticButton>
          </Reveal>
        </div>
      </section>
    </>
  );
}
