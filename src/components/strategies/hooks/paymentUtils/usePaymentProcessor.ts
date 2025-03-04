
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { loadRazorpayScript } from "./razorpayLoader";
import { handleRazorpayPayment } from "./razorpayPaymentHandler";
import { handleTestPayment } from "./testPaymentHandler";
import { preparePaymentData } from "./paymentDataPreparer";

/**
 * Hook to handle payment processing logic
 */
export function usePaymentProcessor(razorpayKey: string | undefined, refetchSubscription: () => Promise<any>) {
  const { user } = useAuth();
  
  const handlePayment = async (item: any, isFullPackage = false, planType = 'monthly') => {
    console.log('Payment initiated for:', isFullPackage ? 'Full Package' : item?.title, 'Plan type:', planType);
    
    if (!user) {
      toast.error("Please login to make a purchase");
      console.error('Payment aborted: User not logged in');
      return;
    }

    try {
      // Prepare payment data
      const { amount, userName, userEmail, description } = preparePaymentData(user, item, isFullPackage, planType);
      console.log('Is Razorpay key available:', !!razorpayKey);
      
      // If Razorpay key is not available, use mock payment for testing
      if (!razorpayKey) {
        await handleTestPayment(userName, userEmail, amount, description, user.id, planType);
        
        // Refetch subscription status
        await refetchSubscription();
        
        // Reload the page to refresh subscription status in all components
        window.location.reload();
        return;
      }

      // Standard Razorpay flow when key is available
      // Check if Razorpay script is already loaded
      if (!(window as any).Razorpay) {
        console.log('Razorpay script not loaded, loading now...');
        await loadRazorpayScript();
      }

      // Process Razorpay payment
      await handleRazorpayPayment(
        razorpayKey,
        userName,
        userEmail,
        amount,
        description,
        user.id,
        planType
      );
      
      // Reload the page to refresh subscription status
      window.location.reload();
      
    } catch (error) {
      console.error("Payment processing error:", error);
      if (error instanceof Error && error.message === 'Payment cancelled by user') {
        // User cancelled the payment, already handled in the Razorpay modal
        return;
      }
      toast.error("Could not process payment. Please try again later.");
    }
  };
  
  return { handlePayment };
}
