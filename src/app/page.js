import HeroSection from "./Components/home/heroSection";
import LineageSection from "./Components/home/lineagesection";
import InspirationSection from "./Components/home/inspirationSection";
import CoursesSection from "./Components/home/coursesSection";
import ArtworkSection from "./Components/home/artWorks";
import SubscribeSection from "./Components/home/subscribeSection";
import CollaboratorsSection from "./Components/home/collaboratorsSection";
import HomeExperience, { MarqueeDivider } from "./Components/home/HomeExperience";
import StudioStats from "./Components/home/StudioStats";
import ScrollShowcase from "./Components/home/ScrollShowcase";

export default function Home() {
  return (
    <HomeExperience>
      <HeroSection />
      <MarqueeDivider />
      <ScrollShowcase />
      <StudioStats />
      <CollaboratorsSection />
      <LineageSection />
      <MarqueeDivider />
      <CoursesSection />
      <ArtworkSection />
      <InspirationSection />
      <SubscribeSection />
    </HomeExperience>
  );
}
