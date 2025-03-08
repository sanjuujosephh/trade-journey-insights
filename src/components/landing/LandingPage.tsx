
import { Button } from "@/components/ui/button";
import { AuthForm } from "@/components/auth/AuthForm";
import { ArrowRight, BarChart3, BookOpenText, BrainCircuit, ChartLine, Clock, LineChart, Share2 } from "lucide-react";
import { DailyLeaderboard } from "./DailyLeaderboard";
import { PriceComparison } from "./PriceComparison";

export function LandingPage() {
  return <div className="bg-background min-h-screen">
      {/* Hero Section */}
      <div className="container mx-auto py-16 md:py-24">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h1 className="text-4xl font-bold tracking-tight mb-6 md:text-6xl">This trading journal that helps you build habit.</h1>
          <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
            Track your trades, analyze your performance, and become a more profitable trader with our comprehensive suite of tools.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="gap-2 text-lg">
              Get Started <ArrowRight className="h-4 w-4" />
            </Button>
            <Button size="lg" variant="outline" className="text-lg">
              View Demo
            </Button>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid md:grid-cols-5 gap-6 items-start">
          {/* Left Content - Leaderboard and Features */}
          <div className="md:col-span-3 space-y-8">
            {/* Leaderboard Section - Moved to the top */}
            <DailyLeaderboard />
            
            {/* Features Section - Moved below leaderboard */}
            <div className="bg-card border rounded-lg p-8 shadow-sm">
              <h2 className="text-2xl font-semibold mb-6">Why traders choose us</h2>
              <div className="grid sm:grid-cols-2 gap-6">
                <FeatureItem icon={<LineChart className="h-5 w-5" />} title="Advanced Analytics" description="Visualize your performance with detailed charts and metrics" />
                <FeatureItem icon={<BrainCircuit className="h-5 w-5" />} title="AI-Powered Analysis" description="Get AI-generated insights to improve your trading" />
                <FeatureItem icon={<Clock className="h-5 w-5" />} title="Real-Time Tracking" description="Log your trades in real-time to capture all details" />
                <FeatureItem icon={<ChartLine className="h-5 w-5" />} title="Performance Metrics" description="Track your win rate, P/L ratio, and other key indicators" />
              </div>
            </div>
            
            {/* Testimonial Section */}
            <div className="bg-card border rounded-lg p-8 shadow-sm">
              <h2 className="text-2xl font-semibold mb-6">What traders are saying</h2>
              <div className="grid gap-6">
                <blockquote className="border-l-2 border-primary pl-4 italic">
                  "This journal has completely transformed how I approach trading. The analytics helped me identify patterns I couldn't see before."
                  <footer className="mt-2 text-sm font-medium">— Rajesh K, Options Trader</footer>
                </blockquote>
                <blockquote className="border-l-2 border-primary pl-4 italic">
                  "Finally a trading journal that focuses on improvement, not just tracking. The AI analysis is like having a mentor review my trades."
                  <footer className="mt-2 text-sm font-medium">— Priya S, Day Trader</footer>
                </blockquote>
              </div>
            </div>
          </div>

          {/* Right Content - Auth Form */}
          <div className="md:col-span-2 space-y-6 sticky top-24">
            <div className="bg-card border rounded-lg p-6 shadow-sm">
              <h2 className="text-2xl font-bold mb-6">Start Tracking</h2>
              <AuthForm />
            </div>
            
            {/* Price Comparison Section - Added below auth form */}
            <PriceComparison />
          </div>
        </div>
      </div>

      {/* Secondary Features */}
      <div className="bg-muted/50 py-16">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Everything you need to improve your trading</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard icon={<BookOpenText className="h-8 w-8" />} title="Learning Resources" description="Access our library of trading resources and educational content to improve your skills." />
            <FeatureCard icon={<BarChart3 className="h-8 w-8" />} title="Pattern Recognition" description="Identify recurring patterns in your trading behavior and market conditions." />
            <FeatureCard icon={<Share2 className="h-8 w-8" />} title="Trade Templates" description="Create templates for your favorite strategies to quickly log similar trades." />
          </div>
        </div>
      </div>
    </div>;
}

interface FeatureItemProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}
function FeatureItem({
  icon,
  title,
  description
}: FeatureItemProps) {
  return <div className="flex gap-4">
      <div className="mt-1 text-primary">{icon}</div>
      <div>
        <h3 className="font-medium">{title}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    </div>;
}
function FeatureCard({
  icon,
  title,
  description
}: FeatureItemProps) {
  return <div className="bg-card border rounded-lg p-6 flex flex-col items-center text-center shadow-sm">
      <div className="mb-4 text-primary">{icon}</div>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>;
}
