import Hero from "@/components/sections/Hero";
import ReelPreview from "@/components/sections/ReelPreview";
import FeaturedProperties from "@/components/sections/FeaturedProperties";
import Locations from "@/components/sections/Locations";
import MeetTheTeam from "@/components/sections/MeetTheTeam";
import ConsultationBooking from "@/components/sections/ConsultationBooking";

export default function Home() {
  return (
    <>
      <Hero />
      <ReelPreview />
      <FeaturedProperties />
      <Locations />
      <MeetTheTeam />
      <ConsultationBooking />
    </>
  );
}
