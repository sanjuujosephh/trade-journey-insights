
import { Card } from "@/components/ui/card";
import { BarChart3, BookOpenText, BrainCircuit, ChartLine, Clock, CopyCheck, LineChart, Share2 } from "lucide-react";
import { AuthForm } from "@/components/auth/AuthForm";
import { Leaderboard } from "@/components/Leaderboard";

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <Card className="p-6">
      <div className="mb-4 text-primary">{icon}</div>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </Card>
  );
}

export function LandingPage() {
  return (
    <div className="w-full overflow-auto">
      <div className="container py-8">
        <div className="mx-auto max-w-5xl text-center mb-16">
          <h1 className="text-4xl font-bold tracking-tight mb-6">
            Your Complete Trading Journal & Analytics Platform
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            Track your trades, analyze your performance, and become a better trader with
            our comprehensive suite of tools.
          </p>
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full">
            <span className="font-semibold">Special Launch Offer:</span>
            <span className="text-2xl font-bold">₹199</span>
            <span className="text-sm text-muted-foreground">/month</span>
          </div>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 mb-16">
          <FeatureCard
            icon={<LineChart className="h-8 w-8" />}
            title="Advanced Analytics"
            description="Get detailed insights into your trading patterns with our comprehensive analytics dashboard."
          />
          <FeatureCard
            icon={<BrainCircuit className="h-8 w-8" />}
            title="AI-Powered Analysis"
            description="Leverage AI to analyze your trades and get personalized recommendations for improvement."
          />
          <FeatureCard
            icon={<Clock className="h-8 w-8" />}
            title="Real-Time Tracking"
            description="Log your trades in real-time and keep track of your positions with ease."
          />
          <FeatureCard
            icon={<ChartLine className="h-8 w-8" />}
            title="Performance Metrics"
            description="Track your win rate, profit/loss ratio, and other key performance indicators."
          />
          <FeatureCard
            icon={<BookOpenText className="h-8 w-8" />}
            title="Learning Resources"
            description="Access our library of trading resources and educational content to improve your skills."
          />
          <FeatureCard
            icon={<Share2 className="h-8 w-8" />}
            title="Community Insights"
            description="Learn from top performers and share your success with the trading community."
          />
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          <Card className="p-6">
            <h2 className="text-2xl font-bold mb-6">Start Your Journey</h2>
            <AuthForm />
          </Card>
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Top Performers</h2>
              <BarChart3 className="h-6 w-6 text-muted-foreground" />
            </div>
            <Leaderboard />
          </Card>
        </div>

        <div className="mt-16 text-center">
          <h2 className="text-2xl font-bold mb-4">Why Choose Our Platform?</h2>
          <div className="grid gap-4 md:grid-cols-3 mt-8">
            <div className="flex flex-col items-center p-4">
              <CopyCheck className="h-12 w-12 text-primary mb-4" />
              <h3 className="font-semibold mb-2">Easy to Use</h3>
              <p className="text-muted-foreground">Intuitive interface designed for both beginners and professionals</p>
            </div>
            <div className="flex flex-col items-center p-4">
              <LineChart className="h-12 w-12 text-primary mb-4" />
              <h3 className="font-semibold mb-2">Data-Driven</h3>
              <p className="text-muted-foreground">Make informed decisions based on your historical performance</p>
            </div>
            <div className="flex flex-col items-center p-4">
              <BrainCircuit className="h-12 w-12 text-primary mb-4" />
              <h3 className="font-semibold mb-2">AI-Enhanced</h3>
              <p className="text-muted-foreground">Get personalized insights powered by artificial intelligence</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
