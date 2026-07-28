import AnimatedText from "@/components/ui/AnimatedText";
import Reveal from "@/components/ui/Reveal";

export default function PageHeader({
  index,
  eyebrow,
  title,
  intro,
}: {
  index: string;
  eyebrow: string;
  title: string;
  intro?: string;
}) {
  return (
    <header className="container-x pt-36 pb-16 md:pt-48 md:pb-24">
      <div className="flex items-center gap-4">
        <span className="font-mono text-xs text-gold">{index}</span>
        <span className="h-px w-10 bg-line-strong" />
        <span className="eyebrow">{eyebrow}</span>
      </div>
      <h1 className="display mt-8 text-[clamp(3rem,12vw,10rem)] leading-[0.86] text-white">
        <AnimatedText text={title} />
      </h1>
      {intro && (
        <Reveal delay={0.2} className="mt-8 max-w-2xl">
          <p className="text-lg leading-relaxed text-mist text-balance md:text-xl">
            {intro}
          </p>
        </Reveal>
      )}
    </header>
  );
}
