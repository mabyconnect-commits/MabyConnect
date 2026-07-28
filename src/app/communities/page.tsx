import type { Metadata } from "next";
import { Send, MessageCircle } from "lucide-react";
import PageHeader from "@/components/ui/PageHeader";
import Reveal from "@/components/ui/Reveal";
import MagneticButton from "@/components/ui/MagneticButton";
import { communities, channels } from "@/lib/data";

export const metadata: Metadata = {
  title: "Communities",
  description:
    "Join the Maby Connect communities — AllRound Growth, The Praying Community, online updates and the crypto rooms — on WhatsApp and Telegram.",
};

const channelIcon = {
  Telegram: Send,
  WhatsApp: MessageCircle,
} as const;

export default function CommunitiesPage() {
  return (
    <>
      <PageHeader
        index="/ 04"
        eyebrow="Communities"
        title="Grow, together."
        intro="I build people, not just products. These are the rooms where that happens — communities to grow your faith, finances, business, health and relationships alongside people going somewhere."
      />

      <section className="container-x pb-20">
        <div className="grid gap-6 lg:grid-cols-2">
          {communities.map((c, i) => {
            const Icon = channelIcon[c.channel];
            return (
              <Reveal
                key={c.name}
                delay={i * 0.1}
                className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-line bg-surface/40 p-10 transition-colors duration-500 hover:border-line-strong md:p-12"
              >
                <div className="pointer-events-none absolute -right-24 -top-24 h-56 w-56 rounded-full bg-gold/[0.06] blur-3xl" />
                <div>
                  <div className="flex items-center gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-full border border-line">
                      <Icon className="h-4 w-4 text-gold" />
                    </span>
                    <span className="font-mono text-[10px] tracking-widest text-faint uppercase">
                      {c.channel}
                    </span>
                  </div>
                  <h2 className="display mt-8 text-4xl text-white md:text-5xl">
                    {c.name}
                  </h2>
                  <p className="mt-4 text-lg text-gold/90">{c.purpose}</p>
                  <p className="mt-5 max-w-md leading-relaxed text-mist">
                    {c.description}
                  </p>
                </div>
                <div className="mt-12">
                  <MagneticButton href={c.href} variant="solid" cursorLabel="Join">
                    {c.cta}
                  </MagneticButton>
                </div>
              </Reveal>
            );
          })}
        </div>
      </section>

      {/* More rooms — updates & crypto */}
      <section className="border-t border-line py-24">
        <div className="container-x">
          <Reveal>
            <h2 className="display max-w-3xl text-[clamp(1.8rem,5vw,3.4rem)] text-white text-balance">
              More rooms. Updates, markets and everything Maby.
            </h2>
          </Reveal>

          <div className="mt-12 overflow-hidden rounded-3xl border border-line">
            {channels.map((ch, i) => {
              const Icon = channelIcon[ch.platform];
              return (
                <Reveal key={ch.name} delay={i * 0.06}>
                  <a
                    href={ch.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    data-cursor-label="Join"
                    className="group grid grid-cols-[auto_1fr_auto] items-center gap-5 border-b border-line bg-surface/40 p-6 transition-colors duration-500 last:border-b-0 hover:bg-surface md:gap-8 md:p-8"
                  >
                    <span className="flex h-11 w-11 items-center justify-center rounded-full border border-line transition-colors group-hover:border-gold/40">
                      <Icon className="h-4 w-4 text-gold" />
                    </span>
                    <div>
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                        <h3 className="text-xl text-white/90 transition-colors group-hover:text-white md:text-2xl">
                          {ch.name}
                        </h3>
                        <span className="font-mono text-[10px] tracking-widest text-faint uppercase">
                          {ch.platform}
                        </span>
                      </div>
                      <p className="mt-1.5 max-w-xl text-sm leading-relaxed text-mist">
                        {ch.description}
                      </p>
                    </div>
                    <span className="font-mono text-xs text-faint transition-colors group-hover:text-gold">
                      Join&nbsp;→
                    </span>
                  </a>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}
