import { Check } from "lucide-react";
import Reveal from "@/components/ui/Reveal";
import MagneticButton from "@/components/ui/MagneticButton";
import { engagements } from "@/lib/agency";
import { cn } from "@/lib/utils";

/** How clients buy: a sprint, a whole build, or us embedded monthly. */
export default function EngagementModels() {
  return (
    <section id="engagements" className="relative border-t border-line py-24 md:py-32">
      <div className="container-x">
        <Reveal className="flex items-center gap-4">
          <span className="font-mono text-xs text-gold">004</span>
          <span className="h-px w-10 bg-line-strong" />
          <span className="eyebrow">Engagements</span>
        </Reveal>
        <Reveal delay={0.1}>
          <h2 className="display mt-6 max-w-3xl text-[clamp(2.2rem,7vw,5rem)] text-white">
            Three ways to work with us.
          </h2>
        </Reveal>
        <Reveal delay={0.2}>
          <p className="mt-6 max-w-xl text-mist">
            Every number below is a starting point, fixed at the scoping call.
            You&apos;ll never get an invoice you didn&apos;t agree to.
          </p>
        </Reveal>

        <div className="mt-16 grid gap-6 lg:grid-cols-3">
          {engagements.map((e, i) => (
            <Reveal
              key={e.name}
              delay={Math.min(i * 0.08, 0.24)}
              className={cn(
                "relative flex flex-col rounded-3xl border p-8 transition-colors duration-500 md:p-10",
                e.featured
                  ? "border-gold/40 bg-gold-soft"
                  : "border-line bg-surface/40 hover:border-line-strong",
              )}
            >
              {e.featured && (
                <span className="absolute -top-3 left-8 rounded-full bg-gold px-3 py-1 font-mono text-[10px] tracking-widest text-ink uppercase">
                  Most chosen
                </span>
              )}

              <p className="font-mono text-[10px] tracking-[0.22em] text-faint uppercase">
                Best for {e.best.toLowerCase()}
              </p>
              <h3 className="display mt-4 text-3xl text-white md:text-4xl">
                {e.name}
              </h3>

              <div className="mt-5 flex items-baseline gap-2">
                <span className="display text-2xl text-gold">{e.price}</span>
                <span className="font-mono text-xs text-faint">/ {e.unit}</span>
              </div>

              <p className="mt-5 text-base leading-relaxed text-mist">{e.summary}</p>

              <ul className="mt-8 space-y-3 border-t border-line pt-8">
                {e.includes.map((inc) => (
                  <li key={inc} className="flex items-start gap-3">
                    <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-gold-soft">
                      <Check className="h-2.5 w-2.5 text-gold" />
                    </span>
                    <span className="text-sm text-white/80">{inc}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-10 pt-2">
                <MagneticButton
                  href="/agency/start"
                  variant={e.featured ? "solid" : "outline"}
                >
                  Start here
                </MagneticButton>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
