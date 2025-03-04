
import { toast } from "sonner";
import { createSubscriptionRecord } from "@/utils/paymentUtils";

/**
 * Initializes and opens the Razorpay payment modal
 */
export const handleRazorpayPayment = async (
  razorpayKey: string,
  userName: string,
  userEmail: string,
  amount: number,
  description: string,
  userId: string,
  planType = 'monthly'
) => {
  console.log('Initializing Razorpay payment with key:', razorpayKey);
  
  return new Promise((resolve, reject) => {
    try {
      const options = {
        key: razorpayKey,
        amount: amount,
        currency: "INR",
        name: "Trading Resources",
        description: description,
        handler: async function(response: any) {
          console.log('Payment success, payment ID:', response.razorpay_payment_id);
          try {
            await createSubscriptionRecord(userId, response.razorpay_payment_id, amount, planType);
            toast.success("Subscription activated successfully!");
            resolve(response.razorpay_payment_id);
          } catch (error) {
            console.error('Error activating subscription:', error);
            toast.error("Payment processed but subscription activation failed. Please contact support.");
            reject(error);
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
            reject(new Error('Payment cancelled by user'));
          }
        }
      };

      console.log('Creating Razorpay instance with options:', JSON.stringify(options, null, 2));
      const razorpay = new (window as any).Razorpay(options);
      console.log('Opening Razorpay payment modal');
      razorpay.open();
    } catch (error) {
      console.error("Razorpay payment initialization error:", error);
      reject(error);
    }
  });
};
