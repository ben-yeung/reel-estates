import Hero from "@/components/sections/Hero";
import ReelPreview from "@/components/sections/ReelPreview";
import { SectionPlaceholder } from "@/components/sections/SectionPlaceholder";

export default function Home() {
  return (
    <>
      <Hero />
      <ReelPreview />
      <SectionPlaceholder id="properties" eyebrow="The Collection" title="Featured Properties" />
      <SectionPlaceholder id="locations" eyebrow="Where We Build" title="Locations" />
      <SectionPlaceholder id="agents" eyebrow="Meet The Team" title="Agents" />
      <SectionPlaceholder id="contact" eyebrow="Get In Touch" title="Contact" />
    </>
  );
}
