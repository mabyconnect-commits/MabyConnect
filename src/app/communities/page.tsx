import type { Metadata } from "next";
import { Send, MessageCircle, Hash } from "lucide-react";
import PageHeader from "@/components/ui/PageHeader";
import Reveal from "@/components/ui/Reveal";
import MagneticButton from "@/components/ui/MagneticButton";
import { communities } from "@/lib/data";

export const metadata: Metadata = {
  title: "Communities",
  description:
    "Join the Maby Connect communities — AllRound Growth and The Praying Community — on Telegram, WhatsApp and Discord.",
};

const channelIcon = {
  Telegram: Send,
  WhatsApp: MessageCircle,
  Discord: Hash,
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
                  <MagneticButton href="/contact" variant="solid">
                    {c.cta}
                  </MagneticButton>
                </div>
              </Reveal>
            );
          })}
        </div>
      </section>

      {/* Channels */}
      <section className="border-t border-line py-24">
        <div className="container-x">
          <Reveal>
            <h2 className="display max-w-3xl text-[clamp(1.8rem,5vw,3.4rem)] text-white text-balance">
              Wherever you are, there&apos;s a room for you.
            </h2>
          </Reveal>
          <div className="mt-12 grid gap-px overflow-hidden rounded-3xl border border-line sm:grid-cols-3">
            {(["Telegram", "WhatsApp", "Discord"] as const).map((ch, i) => {
              const Icon = channelIcon[ch];
              return (
                <Reveal
                  key={ch}
                  delay={i * 0.08}
                  className="group flex items-center justify-between bg-surface/40 p-8 transition-colors duration-500 hover:bg-surface"
                >
                  <div className="flex items-center gap-4">
                    <Icon className="h-5 w-5 text-gold" />
                    <span className="text-lg text-white">{ch}</span>
                  </div>
                  <span className="font-mono text-xs text-faint transition-colors group-hover:text-gold">
                    Join →
                  </span>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}
