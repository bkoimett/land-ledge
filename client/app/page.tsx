import LandingNavbar from "@/components/landing/LandingNavbar";
import HeroSection from "@/components/landing/HeroSection";
import FeaturesBentoGrid from "@/components/landing/FeaturesBentoGrid";
import HackathonContext from "@/components/landing/HackathonContext";
import FinalCTA from "@/components/landing/FinalCTA";
import LandingFooter from "@/components/landing/LandingFooter";

export default function LandingPage() {
  return (
    <>
      <LandingNavbar />
      <main>
        <HeroSection />
        <FeaturesBentoGrid />
        <HackathonContext />
        <FinalCTA />
      </main>
      <LandingFooter />
    </>
  );
}