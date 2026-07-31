import Reveal from "@/components/ui/Reveal";
import { stackGroups } from "@/lib/agency";

/**
 * The tools we reach for, grouped by layer. Deliberately specific —
 * technical founders read this section first.
 */
export default function StackGrid() {
  return (
    <section className="relative border-t border-line py-24 md:py-32">
      <div className="container-x">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <Reveal className="flex items-center gap-4">
              <span className="font-mono text-xs text-gold">002</span>
              <span className="h-px w-10 bg-line-strong" />
              <span className="eyebrow">The stack</span>
            </Reveal>
            <Reveal delay={0.1}>
              <h2 className="display mt-6 max-w-3xl text-[clamp(2.2rem,7vw,5rem)] text-white">
                Boring tools. Ambitious products.
              </h2>
            </Reveal>
          </div>
          <Reveal delay={0.2} className="max-w-sm">
            <p className="text-mist">
              We pick technology you can hire for and we can defend — not
              whatever trended this week.
            </p>
          </Reveal>
        </div>

        <div className="mt-16 grid gap-px overflow-hidden rounded-3xl border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
          {stackGroups.map((g, i) => (
            <Reveal
              key={g.label}
              delay={Math.min(i * 0.05, 0.25)}
              className="bg-ink p-8 transition-colors duration-500 hover:bg-surface"
            >
              <p className="font-mono text-[10px] tracking-[0.22em] text-gold uppercase">
                {g.label}
              </p>
              <ul className="mt-6 space-y-2.5">
                {g.items.map((item) => (
                  <li
                    key={item}
                    className="flex items-center gap-2.5 text-sm text-white/75"
                  >
                    <span className="h-1 w-1 shrink-0 rounded-full bg-gold/60" />
                    {item}
                  </li>
                ))}
              </ul>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
