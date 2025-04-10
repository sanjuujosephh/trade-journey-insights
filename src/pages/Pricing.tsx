
import { useEffect } from "react";
import { PricingContainer } from "@/components/pricing/PricingContainer";
import { usePayment } from "@/components/strategies/hooks/usePayment";
import { useSubscription } from "@/hooks/useSubscription";

export default function Pricing() {
  const { paymentConfigError } = usePayment();
  const { subscription, isSubscribed } = useSubscription();

  useEffect(() => {
    if (paymentConfigError) {
      console.error("Payment configuration error:", paymentConfigError);
    }
    
    // Log subscription status for debugging
    console.log("Subscription status:", {
      hasSubscription: !!subscription,
      isActive: subscription?.status === 'active',
      isSubscribed,
      endDate: subscription?.current_period_end,
      isExpired: subscription?.current_period_end ? new Date(subscription.current_period_end) < new Date() : false
    });
  }, [paymentConfigError, subscription, isSubscribed]);

  return <PricingContainer />;
}
