
import { useAuth } from "@/contexts/AuthContext";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { usePayment } from "@/components/strategies/hooks/usePayment";
import { SubscriptionInfo } from "@/components/pricing/SubscriptionInfo";
import { PricingPlanCard } from "@/components/pricing/PricingPlanCard";
import { PricingAlerts } from "@/components/pricing/PricingAlerts";

export default function Pricing() {
  const { user } = useAuth();
  const { handlePayment, subscription, isPaymentConfigured, paymentConfigError, isTestMode } = usePayment();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (paymentConfigError) {
      console.error("Payment configuration error:", paymentConfigError);
    }
  }, [paymentConfigError]);

  const handleSubscribe = async (planType: 'monthly' | 'lifetime') => {
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
      // Initialize payment with the selected plan type
      await handlePayment(null, true, planType);
    } catch (error) {
      console.error("Subscription error:", error);
      toast.error("Could not process subscription request");
    } finally {
      setIsLoading(false);
    }
  };

  // If user already has an active subscription, show different content
  if (subscription) {
    return <SubscriptionInfo subscription={subscription} />;
  }

  const monthlyFeatures = [
    "Unlimited Trade Entries",
    "Advanced Analytics",
    "AI-Powered Trade Analysis",
    "Behaviour Analysis",
    "Custom Feature Requests"
  ];

  const lifetimeFeatures = [
    "Everything in Monthly",
    "Never Pay Again",
    "Future Feature Updates",
    "Access To Trading Strategies",
    "Access To JOT Indicator Suite",
    "Access To Trading Templates",
    "Priority Feature Requests"
  ];

  return (
    <div className="container max-w-6xl py-12">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold tracking-tight mb-4">
          Choose Your Plan
        </h1>
        <p className="text-xl text-muted-foreground mb-8">
          Start your trading journey with our premium features
        </p>
        
        <PricingAlerts 
          paymentConfigError={paymentConfigError} 
          isTestMode={isTestMode} 
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
        {/* Monthly Subscription Card */}
        <PricingPlanCard
          title="Monthly Subscription"
          price="₹199"
          period="/month"
          features={monthlyFeatures}
          onSubscribe={() => handleSubscribe('monthly')}
          isLoading={isLoading}
          isPaymentConfigured={isPaymentConfigured}
          isTestMode={isTestMode}
        />

        {/* Lifetime Subscription Card */}
        <PricingPlanCard
          title="Lifetime Access"
          price="₹2499"
          period=" one-time"
          features={lifetimeFeatures}
          onSubscribe={() => handleSubscribe('lifetime')}
          isLoading={isLoading}
          isPaymentConfigured={isPaymentConfigured}
          isTestMode={isTestMode}
          isBestValue={true}
          buttonText={isLoading ? "Processing..." : isTestMode ? "Get Lifetime Access (Test)" : "Get Lifetime Access"}
        />
      </div>

      {!user && (
        <p className="text-sm text-center mt-8 text-muted-foreground">
          Please <a href="/auth" className="text-primary hover:underline">login</a> to subscribe
        </p>
      )}
    </div>
  );
}
