
import { Button } from "@/components/ui/button";
import { AuthForm } from "@/components/auth/AuthForm";
import { ArrowRight, BarChart3, BookOpenText, BrainCircuit, ChartLine, Clock, LineChart, Share2, MessageCircleQuestion } from "lucide-react";
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
          
          {/* App Screenshot with Enhanced Gradient Fade and Absolute Positioned Buttons */}
          <div className="relative w-full max-w-[110%] mx-auto mb-8">
            <div className="w-full rounded-lg overflow-hidden">
              <img 
                src="/lovable-uploads/da846476-9055-4a83-97db-8b1e1202f77b.png" 
                alt="Trading Journal Dashboard" 
                className="w-full"
              />
              <div className="absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-background to-transparent"></div>
            </div>
            
            {/* Buttons positioned on top of the faded area */}
            <div className="absolute bottom-20 left-0 right-0 flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="gap-2 text-lg">
                Get Started <ArrowRight className="h-4 w-4" />
              </Button>
              <Button size="lg" variant="outline" className="text-lg">
                View Demo
              </Button>
            </div>
          </div>
        </div>

        {/* Main Content Grid - Swapped positions */}
        <div className="grid md:grid-cols-5 gap-6 items-start">
          {/* Auth Form - Now on the left */}
          <div className="md:col-span-2 space-y-6 sticky top-24">
            <div className="bg-card border rounded-lg p-6 shadow-sm">
              <h2 className="text-2xl font-bold mb-6 text-center">Start Journaling &amp; Build Habit</h2>
              <AuthForm />
            </div>
            
            {/* Price Comparison Section - below auth form */}
            <PriceComparison />
          </div>
          
          {/* Leaderboard and Features - Now on the right */}
          <div className="md:col-span-3 space-y-8">
            {/* Leaderboard Section */}
            <DailyLeaderboard />
            
            {/* Features Section */}
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

      {/* FAQ Section */}
      <div className="py-16 bg-background">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Frequently Asked Questions</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Get answers to common questions about our trading journal platform
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <FaqItem 
              question="How does the daily streak system work?" 
              answer="Our streak system tracks your consecutive days of journaling trades. Each day you log at least one trade or journal entry, your streak increases. This helps build consistency in your trading practice."
            />
            <FaqItem 
              question="Can I import my trades from other platforms?" 
              answer="Yes! You can import trades from popular brokers and platforms. We support CSV imports from most major trading platforms, making it easy to transition to our journal."
            />
            <FaqItem 
              question="Is my trading data secure?" 
              answer="Absolutely. We use bank-level encryption to protect your data. Your information is never shared with third parties, and we don't have access to your brokerage accounts."
            />
            <FaqItem 
              question="What payment methods do you accept?" 
              answer="We accept all major credit cards, PayPal, and select cryptocurrency payments. All payments are processed securely through our payment partners."
            />
            <FaqItem 
              question="Can I cancel my subscription anytime?" 
              answer="Yes, you can cancel your subscription at any time. Your access will continue until the end of your billing period, and we don't charge any cancellation fees."
            />
            <FaqItem 
              question="How does the AI analysis work?" 
              answer="Our AI analyzes your trading patterns, win/loss ratios, psychological states, and market conditions to identify correlations and opportunities for improvement in your trading approach."
            />
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

function FaqItem({
  question,
  answer
}: {
  question: string;
  answer: string;
}) {
  return (
    <div className="bg-card border rounded-lg p-6 shadow-sm hover:border-primary transition-colors">
      <div className="flex gap-3 items-start">
        <MessageCircleQuestion className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
        <div>
          <h3 className="font-semibold text-lg mb-2">{question}</h3>
          <p className="text-muted-foreground">{answer}</p>
        </div>
      </div>
    </div>
  );
}
