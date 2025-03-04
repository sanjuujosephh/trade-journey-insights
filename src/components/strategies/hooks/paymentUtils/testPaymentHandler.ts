
import { toast } from "sonner";
import { processTestPayment, createSubscriptionRecord } from "@/utils/paymentUtils";

/**
 * Process a test payment when Razorpay is not available
 */
export const handleTestPayment = async (
  userName: string,
  userEmail: string,
  amount: number,
  description: string,
  userId: string
) => {
  console.log('Using mock payment process since Razorpay key is unavailable');
  
  try {
    toast.loading("Processing payment...");
    
    // Process mock payment
    const paymentId = await processTestPayment(userName, userEmail, amount, description);
    
    // Create subscription record
    await createSubscriptionRecord(userId, paymentId, amount);
    
    toast.dismiss();
    toast.success("Subscription activated successfully!");
    
    return paymentId;
  } catch (error) {
    toast.dismiss();
    console.error('Error in test payment flow:', error);
    toast.error("Payment processed but subscription activation failed. Please contact support.");
    throw error;
  }
};
