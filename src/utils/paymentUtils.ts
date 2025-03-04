
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

/**
 * Validates if a Razorpay subscription is active
 * @param subscriptionId The Razorpay subscription ID to validate
 * @returns Whether the subscription is active
 */
export const validateSubscription = async (subscriptionId: string) => {
  if (!subscriptionId) return false;
  
  try {
    // In production, this would call an edge function to check subscription status with Razorpay API
    // For now, we'll just check our local database
    const { data, error } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('razorpay_subscription_id', subscriptionId)
      .eq('status', 'active')
      .maybeSingle();
      
    if (error) {
      console.error('Error validating subscription:', error);
      return false;
    }
    
    return !!data;
  } catch (error) {
    console.error('Failed to validate subscription:', error);
    return false;
  }
};

/**
 * Mock payment function for testing when Razorpay key is not available
 * @param userName User's name
 * @param userEmail User's email
 * @param amount Amount to charge in paise (Indian currency)
 * @param description Description of the purchase
 * @returns Payment ID
 */
export const processTestPayment = async (
  userName: string,
  userEmail: string,
  amount: number,
  description: string
) => {
  console.log('Processing test payment for:', userName);
  console.log('Amount:', amount/100, 'INR');
  console.log('Description:', description);

  // Simulate payment processing delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Generate a mock payment ID
  const mockPaymentId = 'test_pay_' + Math.random().toString(36).substring(2, 15);
  
  console.log('Test payment successful, generated payment ID:', mockPaymentId);
  return mockPaymentId;
};

/**
 * Creates a subscription record in the database
 * @param userId User ID
 * @param paymentId Payment ID
 * @param amount Amount in paise
 * @returns Created subscription data
 */
export const createSubscriptionRecord = async (userId: string, paymentId: string, amount: number) => {
  console.log('Creating subscription record for user:', userId);
  console.log('Payment ID:', paymentId);
  console.log('Amount:', amount/100, 'INR');
  
  if (!userId) {
    throw new Error('User ID is required to create a subscription');
  }

  const { data, error } = await supabase
    .from('subscriptions')
    .insert([{
      user_id: userId,
      payment_id: paymentId,
      amount: amount,
      status: 'active',
      current_period_start: new Date().toISOString(),
      current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
      end_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // 30 days from now
    }])
    .select();

  if (error) {
    console.error('Error creating subscription:', error);
    throw error;
  }
  
  console.log('Subscription created successfully:', data);
  return data;
};

