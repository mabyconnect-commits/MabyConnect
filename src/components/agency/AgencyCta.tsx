import Link from "next/link";
import { ArrowRight, CalendarDays, Compass } from "lucide-react";
import Reveal from "@/components/ui/Reveal";
import { agency } from "@/lib/agency";

const routes = [
  {
    href: "/agency/start",
    icon: Compass,
    label: "Build your spec",
    body: "Answer six questions and get a scope, a timeline and a budget band in about two minutes.",
    cta: "Start the configurator",
  },
  {
    href: "/agency/book",
    icon: CalendarDays,
    label: "Book a call",
    body: "Pick a slot and talk to the person who'll actually build it. No sales team in between.",
    cta: "See available times",
  },
];

/** Closing CTA — two doors, both leading into the pipeline. */
export default function AgencyCta() {
  return (
    <section className="relative overflow-hidden border-t border-line py-24 md:py-32">
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute bottom-0 left-1/2 h-[40vw] w-[70vw] -translate-x-1/2 translate-y-1/3 rounded-full bg-gold/[0.07] blur-[130px]" />
      </div>

      <div className="container-x">
        <Reveal>
          <p className="eyebrow">Ready when you are</p>
        </Reveal>
        <Reveal delay={0.1}>
          <h2 className="display mt-6 max-w-4xl text-[clamp(2.4rem,8vw,6rem)] leading-[0.92] text-white">
            Tell us what you&apos;re building.
          </h2>
        </Reveal>
        <Reveal delay={0.2}>
          <p className="mt-6 max-w-lg text-lg text-mist">
            Two ways in. Both reach the same inbox, and both get an answer in{" "}
            {agency.responseTime.toLowerCase()}.
          </p>
        </Reveal>

        <div className="mt-14 grid gap-6 md:grid-cols-2">
          {routes.map((r, i) => (
            <Reveal key={r.href} delay={0.25 + i * 0.08}>
              <Link
                href={r.href}
                className="group flex h-full flex-col rounded-3xl border border-line bg-surface/40 p-8 transition-colors duration-500 hover:border-gold/40 hover:bg-surface md:p-10"
              >
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gold-soft">
                  <r.icon className="h-5 w-5 text-gold" />
                </span>
                <h3 className="display mt-8 text-2xl text-white md:text-3xl">
                  {r.label}
                </h3>
                <p className="mt-4 flex-1 text-base leading-relaxed text-mist">
                  {r.body}
                </p>
                <span className="mt-8 inline-flex items-center gap-2 text-sm text-white/80 transition-colors group-hover:text-gold">
                  {r.cta}
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </span>
              </Link>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.4}>
          <p className="mt-12 text-sm text-faint">
            Prefer email?{" "}
            <a
              href={`mailto:${agency.email}`}
              className="text-white/80 underline decoration-line-strong underline-offset-4 transition-colors hover:text-gold"
            >
              {agency.email}
            </a>
          </p>
        </Reveal>
      </div>
    </section>
  );
}
