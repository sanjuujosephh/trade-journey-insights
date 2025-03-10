
import { HeroSection } from "./sections/HeroSection";
import { MainContentSection } from "./sections/MainContentSection";
import { SecondaryFeaturesSection } from "./sections/SecondaryFeaturesSection";
import { ComparisonTableSection } from "./sections/ComparisonTableSection";
import { FAQSection } from "./sections/FAQSection";

export function LandingPage() {
  return (
    <div className="bg-background min-h-screen">
      {/* Hero Section */}
      <HeroSection />

      {/* Main Content Grid */}
      <MainContentSection />

      {/* Secondary Features */}
      <SecondaryFeaturesSection />

      {/* Comparison Table */}
      <ComparisonTableSection />

      {/* FAQ Section */}
      <FAQSection />
    </div>
  );
}
