
import { useRazorpayKey } from "./paymentUtils/useRazorpayKey";
import { useSubscriptionData } from "./paymentUtils/useSubscriptionData";
import { usePaymentProcessor } from "./paymentUtils/usePaymentProcessor";

/**
 * Main hook for payment functionality
 * Combines Razorpay key fetching, subscription data, and payment processing
 */
export function usePayment() {
  const { razorpayKey, isKeyError } = useRazorpayKey();
  const { subscription, refetchSubscription } = useSubscriptionData();
  const { handlePayment } = usePaymentProcessor(razorpayKey, refetchSubscription);

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
