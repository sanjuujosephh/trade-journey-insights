
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { usePayment } from "@/components/strategies/hooks/usePayment";
import { toast } from "sonner";
import { useState, useEffect } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, CheckCircle2, Info } from "lucide-react";

export default function Pricing() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { handlePayment, subscription, isPaymentConfigured, paymentConfigError, isTestMode } = usePayment();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (paymentConfigError) {
      console.error("Payment configuration error:", paymentConfigError);
    }
  }, [paymentConfigError]);

  const handleSubscribe = async () => {
    if (!user) {
      toast.error("Please login to subscribe");
      return;
    }

    if (!isPaymentConfigured) {
      toast.error("Payment system is not configured properly");
      return;
    }

    setIsLoading(true);
    
    try {
      // Initialize payment with the full package price
      await handlePayment(null, true);
    } catch (error) {
      console.error("Subscription error:", error);
      toast.error("Could not process subscription request");
    } finally {
      setIsLoading(false);
    }
  };

  // If user already has an active subscription, show different content
  if (subscription) {
    return (
      <div className="container max-w-6xl py-12">
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center w-12 h-12 rounded-full bg-green-100 mb-4">
            <CheckCircle2 className="h-6 w-6 text-green-600" />
          </div>
          <h1 className="text-4xl font-bold tracking-tight mb-4">
            You're already subscribed!
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            You have access to all premium features
          </p>
          <div className="mb-8 p-4 bg-green-50 border border-green-100 rounded-lg text-green-800">
            <p className="font-medium">Subscription details:</p>
            <p className="text-sm">Active until: {new Date(subscription.current_period_end).toLocaleDateString()}</p>
            <p className="text-sm">Payment ID: {subscription.payment_id}</p>
            {subscription.amount && (
              <p className="text-sm">Amount: ₹{subscription.amount / 100}</p>
            )}
          </div>
          <Button onClick={() => navigate('/')}>
            Go to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container max-w-6xl py-12">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold tracking-tight mb-4">
          Choose Your Plan
        </h1>
        <p className="text-xl text-muted-foreground mb-8">
          Start your trading journey with our premium features
        </p>
        
        {paymentConfigError && (
          <Alert variant="destructive" className="mb-6 max-w-md mx-auto">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {paymentConfigError}
            </AlertDescription>
          </Alert>
        )}
        
        {isTestMode && (
          <Alert className="mb-6 max-w-md mx-auto bg-yellow-50 border-yellow-200">
            <Info className="h-4 w-4 text-yellow-600" />
            <AlertDescription className="text-yellow-800">
              Using test payment mode. Subscriptions will be created without actual payment processing.
            </AlertDescription>
          </Alert>
        )}
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
          disabled={isLoading || !isPaymentConfigured}
        >
          {isLoading ? "Processing..." : isTestMode ? "Subscribe (Test Mode)" : "Subscribe Now"}
        </Button>
        
        {!user && (
          <p className="text-sm text-center mt-4 text-muted-foreground">
            Please <a href="/auth" className="text-primary hover:underline">login</a> to subscribe
          </p>
        )}
      </div>
    </div>
  );
}
