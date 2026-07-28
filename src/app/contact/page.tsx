import type { Metadata } from "next";
import PageHeader from "@/components/ui/PageHeader";
import Reveal from "@/components/ui/Reveal";
import ArrowLink from "@/components/ui/ArrowLink";
import ContactForm from "./ContactForm";
import { site, socials } from "@/lib/site";
import { contactTopics } from "@/lib/data";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Let's build something great together. Business enquiries, speaking, partnerships, investments and consulting — reach Matthew Adeleye.",
};

export default function ContactPage() {
  return (
    <>
      <PageHeader
        index="/ 08"
        eyebrow="Contact"
        title="Let's build something great together."
        intro="Whether it's a business enquiry, a partnership, an investment or a conversation — this is where it starts."
      />

      <section className="container-x grid gap-16 pb-32 lg:grid-cols-[1fr_0.6fr] lg:gap-24">
        <div>
          <ContactForm />
        </div>

        <aside className="space-y-12">
          <Reveal>
            <p className="eyebrow mb-4">Direct</p>
            <a
              href={`mailto:${site.email}`}
              className="text-xl text-white transition-colors hover:text-gold"
            >
              {site.email}
            </a>
          </Reveal>

          <Reveal delay={0.05}>
            <p className="eyebrow mb-4">I work on</p>
            <ul className="space-y-2">
              {contactTopics.map((t) => (
                <li key={t} className="text-white/80">
                  {t}
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal delay={0.1}>
            <p className="eyebrow mb-4">Elsewhere</p>
            <ul className="space-y-2.5">
              {socials.map((s) => (
                <li key={s.label}>
                  <ArrowLink href={s.href} external>
                    {s.label}
                  </ArrowLink>
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal delay={0.15}>
            <p className="eyebrow mb-4">Based</p>
            <p className="text-white/80">{site.location}</p>
          </Reveal>
        </aside>
      </section>
    </>
  );
}
