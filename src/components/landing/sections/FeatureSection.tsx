
import { LineChart, BrainCircuit, Clock, ChartLine } from "lucide-react";
import { FeatureItem } from "../ui/FeatureItem";

export function FeatureSection() {
  return (
    <div className="bg-card border rounded-lg p-8 shadow-sm">
      <h2 className="text-2xl font-semibold mb-6">Why traders choose us</h2>
      <div className="grid sm:grid-cols-2 gap-6">
        <FeatureItem 
          icon={<LineChart className="h-5 w-5" />} 
          title="Advanced Analytics" 
          description="Visualize your performance with detailed charts and metrics" 
        />
        <FeatureItem 
          icon={<BrainCircuit className="h-5 w-5" />} 
          title="AI-Powered Analysis" 
          description="Get AI-generated insights to improve your trading" 
        />
        <FeatureItem 
          icon={<Clock className="h-5 w-5" />} 
          title="Real-Time Tracking" 
          description="Log your trades in real-time to capture all details" 
        />
        <FeatureItem 
          icon={<ChartLine className="h-5 w-5" />} 
          title="Performance Metrics" 
          description="Track your win rate, P/L ratio, and other key indicators" 
        />
      </div>
    </div>
  );
}
