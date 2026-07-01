import Hero from "@/components/sections/Hero";
import ReelPreview from "@/components/sections/ReelPreview";
import FeaturedProperties from "@/components/sections/FeaturedProperties";
import Locations from "@/components/sections/Locations";
import { SectionPlaceholder } from "@/components/sections/SectionPlaceholder";

export default function Home() {
  return (
    <>
      <Hero />
      <ReelPreview />
      <FeaturedProperties />
      <Locations />
      <SectionPlaceholder id="agents" eyebrow="Meet The Team" title="Agents" />
      <SectionPlaceholder id="contact" eyebrow="Get In Touch" title="Contact" />
    </>
  );
}
