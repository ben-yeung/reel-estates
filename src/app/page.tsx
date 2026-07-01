import Hero from "@/components/sections/Hero";
import ReelPreview from "@/components/sections/ReelPreview";
import FeaturedProperties from "@/components/sections/FeaturedProperties";
import MeetTheTeam from "@/components/sections/MeetTheTeam";
import ConsultationBooking from "@/components/sections/ConsultationBooking";
import { SectionPlaceholder } from "@/components/sections/SectionPlaceholder";

export default function Home() {
  return (
    <>
      <Hero />
      <ReelPreview />
      <FeaturedProperties />
      <SectionPlaceholder id="locations" eyebrow="Where We Build" title="Locations" />
      <MeetTheTeam />
      <ConsultationBooking />
    </>
  );
}
