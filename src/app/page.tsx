import Hero from "@/components/sections/Hero";
import Manifesto from "@/components/sections/Manifesto";
import StatsBand from "@/components/sections/StatsBand";
import CompaniesPreview from "@/components/sections/CompaniesPreview";
import AgencyTeaser from "@/components/sections/AgencyTeaser";
import FoundationTeaser from "@/components/sections/FoundationTeaser";
import CommunitiesPreview from "@/components/sections/CommunitiesPreview";
import Marquee from "@/components/ui/Marquee";
import { disciplines } from "@/lib/data";

export default function Home() {
  return (
    <>
      <Hero />

      <div className="border-y border-line py-8 md:py-10">
        <Marquee items={disciplines} duration={45} outline />
      </div>

      <Manifesto />
      <StatsBand />
      <CompaniesPreview />
      <AgencyTeaser />
      <FoundationTeaser />
      <CommunitiesPreview />
    </>
  );
}
