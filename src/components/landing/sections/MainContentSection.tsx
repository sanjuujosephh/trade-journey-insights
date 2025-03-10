
import { AuthForm } from "@/components/auth/AuthForm";
import { DailyLeaderboard } from "../DailyLeaderboard";
import { PriceComparison } from "../PriceComparison";
import { FeatureSection } from "./FeatureSection";
import { TestimonialSection } from "./TestimonialSection";
import { FounderStorySection } from "./FounderStorySection";

export function MainContentSection() {
  return (
    <div className="container mx-auto">
      <div className="grid md:grid-cols-5 gap-6 items-start">
        {/* Auth Form - Now on the left */}
        <div className="md:col-span-2 space-y-6 sticky top-24">
          <div className="bg-card border rounded-lg p-6 shadow-sm">
            <h2 className="text-2xl font-bold mb-6 text-center">Start Journaling &amp; Build Habit</h2>
            <AuthForm />
          </div>
        </div>
        
        {/* Leaderboard and Features - Now on the right */}
        <div className="md:col-span-3 space-y-8">
          {/* Leaderboard Section */}
          <DailyLeaderboard />
          
          {/* Founder's Story Section */}
          <FounderStorySection />
          
          {/* Price Comparison - Moved below Our Journey section */}
          <PriceComparison />
          
          {/* Features Section */}
          <FeatureSection />
          
          {/* Testimonial Section */}
          <TestimonialSection />
        </div>
      </div>
    </div>
  );
}
