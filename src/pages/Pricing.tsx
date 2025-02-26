
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { usePayment } from "@/components/strategies/hooks/usePayment";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";

export default function Pricing() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { handlePayment, subscription } = usePayment();

  const handleSubscribe = async () => {
    if (!user) {
      toast.error("Please login to subscribe");
      return;
    }

    try {
      // Initialize payment with the full package price
      await handlePayment(null, true);
    } catch (error) {
      console.error("Subscription error:", error);
      toast.error("Failed to process subscription. Please try again.");
    }
  };

  return (
    <div className="container max-w-6xl py-12">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold tracking-tight mb-4">
          Choose Your Plan
        </h1>
        <p className="text-xl text-muted-foreground mb-8">
          Start your trading journey with our premium features
        </p>
      </div>

      <div className="max-w-md mx-auto border rounded-lg p-8 shadow-sm">
        <h2 className="text-2xl font-semibold mb-4">Premium Plan</h2>
        <div className="mb-6">
          <span className="text-4xl font-bold">₹499</span>
          <span className="text-muted-foreground">/month</span>
        </div>
        
        <ul className="space-y-3 mb-8">
          <li className="flex items-center gap-2">
            <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Unlimited Trade Entries
          </li>
          <li className="flex items-center gap-2">
            <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Advanced Analytics
          </li>
          <li className="flex items-center gap-2">
            <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            AI-Powered Trade Analysis
          </li>
          <li className="flex items-center gap-2">
            <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Priority Support
          </li>
        </ul>

        <Button 
          className="w-full"
          size="lg" 
          onClick={handleSubscribe}
        >
          Subscribe Now
        </Button>
      </div>
    </div>
  );
}
