
import { useRazorpayKey } from "./paymentUtils/useRazorpayKey";
import { useSubscriptionData } from "./paymentUtils/useSubscriptionData";
import { usePaymentProcessor } from "./paymentUtils/usePaymentProcessor";
import { useSubscription } from "@/hooks/useSubscription";

/**
 * Main hook for payment functionality
 * Combines Razorpay key fetching, subscription data, and payment processing
 */
export function usePayment() {
  const { razorpayKey, isKeyError } = useRazorpayKey();
  const { subscription: rawSubscription, refetchSubscription } = useSubscriptionData();
  const { isSubscribed } = useSubscription();
  const { handlePayment } = usePaymentProcessor(razorpayKey, refetchSubscription);
  
  // Only use subscription if it's actually active and not expired
  const subscription = isSubscribed ? rawSubscription : null;

  return { 
    handlePayment, 
    subscription, 
    isPaymentConfigured: true, // Always return true to enable the payment buttons
    paymentConfigError: isKeyError ? 
      "Razorpay integration is not configured. Using test payment mode." : 
      null,
    isTestMode: !razorpayKey // Indicate if we're in test mode
  };
}
