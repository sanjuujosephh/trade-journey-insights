
import { useState } from "react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { usePayment } from "@/components/strategies/hooks/usePayment";
import { SubscriptionInfo } from "./SubscriptionInfo";
import { PricingPlanCard } from "./PricingPlanCard";
import { PricingAlerts } from "./PricingAlerts";
import { TrialRequestForm } from "./TrialRequestForm";
import { PRICING_PLANS, PlanType } from "./constants";
import { useSubscription } from "@/hooks/useSubscription";

export function PricingContainer() {
  const { user } = useAuth();
  const { handlePayment, isPaymentConfigured, paymentConfigError, isTestMode } = usePayment();
  const { subscription, isSubscribed } = useSubscription();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubscribe = async (planType: PlanType) => {
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

  // If user has an active subscription, show different content
  // Only show subscription info if the subscription is active and not expired
  if (subscription && isSubscribed) {
    return <SubscriptionInfo subscription={subscription} />;
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
        
        <PricingAlerts 
          paymentConfigError={paymentConfigError} 
          isTestMode={isTestMode} 
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {PRICING_PLANS.map((plan) => (
          <PricingPlanCard
            key={plan.id}
            title={plan.title}
            price={plan.price}
            period={plan.period}
            features={plan.features}
            onSubscribe={() => handleSubscribe(plan.id as PlanType)}
            isLoading={isLoading}
            isPaymentConfigured={isPaymentConfigured}
            isTestMode={isTestMode}
            isBestValue={plan.isBestValue}
            planId={plan.id}
            buttonText={
              plan.id === 'yearly' 
                ? (isLoading ? "Processing..." : isTestMode ? "Subscribe Yearly (Test)" : "Subscribe Yearly")
                : undefined
            }
          />
        ))}
        
        {/* Trial Request Form */}
        <TrialRequestForm />
      </div>
    </div>
  );
}
