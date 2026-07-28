"use client";

import Reveal from "@/components/ui/Reveal";
import ArrowLink from "@/components/ui/ArrowLink";
import { communities } from "@/lib/data";
import { MessageCircle } from "lucide-react";

export default function CommunitiesPreview() {
  return (
    <section className="border-t border-line py-24 md:py-32">
      <div className="container-x">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <Reveal className="flex items-center gap-4">
              <span className="font-mono text-xs text-gold">004</span>
              <span className="h-px w-10 bg-line-strong" />
              <span className="eyebrow">The Communities</span>
            </Reveal>
            <Reveal delay={0.1}>
              <h2 className="display mt-6 max-w-3xl text-[clamp(2.2rem,7vw,5rem)] text-white">
                Grow with people who are going somewhere.
              </h2>
            </Reveal>
          </div>
          <Reveal delay={0.2}>
            <ArrowLink href="/communities">Join a community</ArrowLink>
          </Reveal>
        </div>

        <div className="mt-16 grid gap-6 md:grid-cols-2">
          {communities.map((c, i) => (
            <Reveal
              key={c.name}
              delay={i * 0.1}
              className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-line bg-surface/40 p-8 transition-colors duration-500 hover:border-line-strong md:p-10"
            >
              <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-gold/[0.06] blur-3xl transition-opacity duration-500 group-hover:opacity-100 opacity-40" />
              <div>
                <div className="flex items-center gap-2">
                  <MessageCircle className="h-4 w-4 text-gold" />
                  <span className="font-mono text-[10px] tracking-widest text-faint uppercase">
                    {c.channel}
                  </span>
                </div>
                <h3 className="display mt-6 text-3xl text-white md:text-4xl">
                  {c.name}
                </h3>
                <p className="mt-3 text-gold/90">{c.purpose}</p>
                <p className="mt-4 max-w-md text-sm leading-relaxed text-mist">
                  {c.description}
                </p>
              </div>
              <div className="mt-10">
                <ArrowLink href="/communities">{c.cta}</ArrowLink>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
