
import { BookOpenText, BarChart3, Share2 } from "lucide-react";
import { FeatureCard } from "../ui/FeatureCard";

export function SecondaryFeaturesSection() {
  return (
    <div className="bg-muted/50 py-16">
      <div className="container mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12">Everything you need to improve your trading</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <FeatureCard 
            icon={<BookOpenText className="h-8 w-8" />} 
            title="Learning Resources" 
            description="Access our library of trading resources and educational content to improve your skills." 
          />
          <FeatureCard 
            icon={<BarChart3 className="h-8 w-8" />} 
            title="Pattern Recognition" 
            description="Identify recurring patterns in your trading behavior and market conditions." 
          />
          <FeatureCard 
            icon={<Share2 className="h-8 w-8" />} 
            title="Trade Templates" 
            description="Create templates for your favorite strategies to quickly log similar trades." 
          />
        </div>
      </div>
    </div>
  );
}
