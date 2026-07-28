import type { Metadata } from "next";
import PageHeader from "@/components/ui/PageHeader";
import Reveal from "@/components/ui/Reveal";
import { mediaItems } from "@/lib/data";
import { Mic, Play, Newspaper, Radio } from "lucide-react";

export const metadata: Metadata = {
  title: "Media",
  description:
    "Talks, podcasts, interviews and features with Matthew Adeleye — Maby Connect.",
};

const typeIcon = {
  Podcast: Radio,
  Talk: Mic,
  Feature: Newspaper,
  Interview: Play,
} as const;

export default function MediaPage() {
  return (
    <>
      <PageHeader
        index="/ 06"
        eyebrow="Media"
        title="In conversation."
        intro="Talks, podcasts and features on building companies from faith, the future of ownership, and impact done with intention."
      />

      <section className="container-x pb-32">
        <div className="border-t border-line">
          {mediaItems.map((m, i) => {
            const Icon = typeIcon[m.type];
            return (
              <Reveal key={i}>
                <div className="group grid grid-cols-[auto_1fr_auto] items-center gap-6 border-b border-line py-7 transition-colors md:py-8">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full border border-line text-gold transition-colors group-hover:border-gold/40">
                    <Icon className="h-4 w-4" />
                  </span>
                  <div>
                    <h2 className="text-lg text-white/80 transition-colors group-hover:text-white md:text-2xl">
                      {m.title}
                    </h2>
                    <p className="mt-1 font-mono text-xs text-faint">
                      {m.type} · {m.outlet}
                    </p>
                  </div>
                  <span className="font-mono text-xs text-faint">{m.date}</span>
                </div>
              </Reveal>
            );
          })}
        </div>

        <Reveal className="mt-16">
          <p className="text-sm text-faint">
            For press, speaking or podcast invitations, reach out via the{" "}
            <a href="/contact" className="text-gold hover:underline">
              contact page
            </a>
            .
          </p>
        </Reveal>
      </section>
    </>
  );
}
