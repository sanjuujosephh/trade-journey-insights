
import { MessageCircleQuestion } from "lucide-react";
import { FaqItem } from "../ui/FaqItem";

export function FAQSection() {
  return (
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
  );
}
