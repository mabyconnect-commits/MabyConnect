import type { Metadata } from "next";
import AgencyHero from "@/components/agency/AgencyHero";
import CapabilityGrid from "@/components/agency/CapabilityGrid";
import StackGrid from "@/components/agency/StackGrid";
import ProcessRail from "@/components/agency/ProcessRail";
import EngagementModels from "@/components/agency/EngagementModels";
import ProofStrip from "@/components/agency/ProofStrip";
import Principles from "@/components/agency/Principles";
import FaqAccordion from "@/components/agency/FaqAccordion";
import AgencyCta from "@/components/agency/AgencyCta";
import Marquee from "@/components/ui/Marquee";
import { agency, capabilities, faqs } from "@/lib/agency";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Maby Agency — We build web, blockchain, fintech & AI products",
  description: agency.promise,
  alternates: { canonical: "/agency" },
  openGraph: {
    title: "Maby Agency",
    description: agency.promise,
    url: `${site.url}/agency`,
  },
};

const marqueeItems = capabilities.map((c) => c.short);

/** Structured data so the agency surfaces as a service provider in search. */
function StructuredData() {
  const json = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: agency.name,
    url: `${site.url}/agency`,
    email: agency.email,
    description: agency.promise,
    parentOrganization: { "@type": "Organization", name: agency.parent },
    areaServed: "Worldwide",
    knowsAbout: capabilities.map((c) => c.name),
    makesOffer: capabilities.map((c) => ({
      "@type": "Offer",
      itemOffered: { "@type": "Service", name: c.name, description: c.tagline },
    })),
    mainEntity: {
      "@type": "FAQPage",
      mainEntity: faqs.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(json) }}
    />
  );
}

export default function AgencyPage() {
  return (
    <>
      <StructuredData />
      <AgencyHero />

      <div className="border-y border-line py-8 md:py-10">
        <Marquee items={marqueeItems} duration={38} outline />
      </div>

      <CapabilityGrid />
      <StackGrid />
      <ProcessRail />
      <EngagementModels />
      <ProofStrip />
      <Principles />
      <FaqAccordion />
      <AgencyCta />
    </>
  );
}
