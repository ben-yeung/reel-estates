import Hero from "@/components/sections/Hero";
import ReelPreview from "@/components/sections/ReelPreview";
import FeaturedProperties from "@/components/sections/FeaturedProperties";
import ConsultationBooking from "@/components/sections/ConsultationBooking";
import { SectionPlaceholder } from "@/components/sections/SectionPlaceholder";

export default function Home() {
  return (
    <>
      <Hero />
      <ReelPreview />
      <FeaturedProperties />
      <SectionPlaceholder id="locations" eyebrow="Where We Build" title="Locations" />
      <SectionPlaceholder id="agents" eyebrow="Meet The Team" title="Agents" />
      <ConsultationBooking />
    </>
  );
}
