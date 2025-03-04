
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { loadRazorpayScript } from "./razorpayLoader";
import { processTestPayment, createSubscriptionRecord } from "@/utils/paymentUtils";

/**
 * Hook to handle payment processing logic
 */
export function usePaymentProcessor(razorpayKey: string | undefined, refetchSubscription: () => Promise<any>) {
  const { user } = useAuth();
  
  const handlePayment = async (item: any, isFullPackage = false) => {
    console.log('Payment initiated for:', isFullPackage ? 'Full Package' : item?.title);
    
    if (!user) {
      toast.error("Please login to make a purchase");
      console.error('Payment aborted: User not logged in');
      return;
    }

    try {
      const amount = (isFullPackage ? 499 : item?.price || 499) * 100; // Amount in paise
      const userName = user?.email?.split('@')[0] || "Trader";
      const userEmail = user?.email || "trader@example.com";
      const description = isFullPackage ? 
        "Monthly Subscription - All Trading Strategies" : 
        item?.title ? `Monthly Subscription - ${item.title}` : "Monthly Subscription";
      
      console.log('User details for payment:', { name: userName, email: userEmail });
      console.log('Payment amount:', amount/100, 'INR');
      console.log('Is Razorpay key available:', !!razorpayKey);
      
      // If Razorpay key is not available, use mock payment for testing
      if (!razorpayKey) {
        console.log('Using mock payment process since Razorpay key is unavailable');
        try {
          toast.loading("Processing payment...");
          
          // Process mock payment
          const paymentId = await processTestPayment(userName, userEmail, amount, description);
          
          // Create subscription record
          await createSubscriptionRecord(user.id, paymentId, amount);
          
          toast.dismiss();
          toast.success("Subscription activated successfully!");
          
          // Refetch subscription status
          await refetchSubscription();
          
          // Reload the page to refresh subscription status in all components
          window.location.reload();
        } catch (error) {
          toast.dismiss();
          console.error('Error in test payment flow:', error);
          toast.error("Payment processed but subscription activation failed. Please contact support.");
        }
        return;
      }

      // Standard Razorpay flow when key is available
      // Check if Razorpay script is already loaded
      if (!(window as any).Razorpay) {
        console.log('Razorpay script not loaded, loading now...');
        await loadRazorpayScript();
      }

      console.log('Initializing payment with key:', razorpayKey);
      
      const options = {
        key: razorpayKey,
        amount: amount,
        currency: "INR",
        name: "Trading Resources",
        description: description,
        handler: async function(response: any) {
          console.log('Payment success, payment ID:', response.razorpay_payment_id);
          try {
            await createSubscriptionRecord(user.id, response.razorpay_payment_id, amount);
            toast.success("Subscription activated successfully!");
            // Reload the page to refresh subscription status
            window.location.reload();
          } catch (error) {
            console.error('Error activating subscription:', error);
            toast.error("Payment processed but subscription activation failed. Please contact support.");
          }
        },
        prefill: {
          name: userName,
          email: userEmail
        },
        theme: {
          color: "#6366f1"
        },
        modal: {
          ondismiss: function() {
            console.log('Payment modal dismissed by user');
            toast.info("Payment canceled.");
          }
        }
      };

      console.log('Creating Razorpay instance with options:', JSON.stringify(options, null, 2));
      const razorpay = new (window as any).Razorpay(options);
      console.log('Opening Razorpay payment modal');
      razorpay.open();
    } catch (error) {
      console.error("Payment initialization error:", error);
      toast.error("Could not initialize payment. Please try again later.");
    }
  };
  
  return { handlePayment };
}
