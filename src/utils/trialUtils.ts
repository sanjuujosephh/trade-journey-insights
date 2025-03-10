
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

/**
 * Creates a trial subscription for a user
 * @param userId The user's ID
 * @param durationDays Number of days for the trial (7 or 30)
 * @returns Result of the operation
 */
export const createTrialSubscription = async (
  userId: string, 
  durationDays: 7 | 30
): Promise<{ success: boolean; message: string }> => {
  if (!userId) {
    return { success: false, message: "User ID is required" };
  }

  try {
    // Calculate end date
    const startDate = new Date();
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + durationDays);
    
    // Create a mock payment ID for the trial
    const trialPaymentId = `trial_${durationDays}_days_${Date.now()}`;
    
    // Check if user already has an active subscription
    const { data: existingSubscription, error: checkError } = await supabase
      .from('subscriptions')
      .select('id, status')
      .eq('user_id', userId)
      .eq('status', 'active')
      .maybeSingle();
      
    if (checkError) {
      console.error('Error checking existing subscription:', checkError);
      return { success: false, message: "Could not check existing subscription status" };
    }
    
    if (existingSubscription) {
      return { success: false, message: "User already has an active subscription" };
    }
    
    // Create the trial subscription
    const { data, error } = await supabase
      .from('subscriptions')
      .insert([{
        user_id: userId,
        payment_id: trialPaymentId,
        status: 'active',
        plan_type: 'trial',
        current_period_start: startDate.toISOString(),
        current_period_end: endDate.toISOString(),
        end_date: endDate.toISOString(),
        amount: 0 // Trials are free
      }])
      .select()
      .single();

    if (error) {
      console.error('Error creating trial subscription:', error);
      return { success: false, message: "Failed to create trial subscription" };
    }
    
    console.log('Trial subscription created:', data);
    return { 
      success: true, 
      message: `${durationDays}-day trial successfully activated`
    };
  } catch (error) {
    console.error('Trial creation error:', error);
    return { success: false, message: "An unexpected error occurred" };
  }
};

/**
 * Checks if a user has had a trial before
 * @param userId The user's ID
 * @returns Whether the user has had a trial before
 */
export const hasUserHadTrialBefore = async (userId: string): Promise<boolean> => {
  if (!userId) return false;
  
  try {
    const { data, error } = await supabase
      .from('subscriptions')
      .select('id')
      .eq('user_id', userId)
      .eq('plan_type', 'trial')
      .limit(1);
      
    if (error) {
      console.error('Error checking trial history:', error);
      return false;
    }
    
    return data && data.length > 0;
  } catch (error) {
    console.error('Trial check error:', error);
    return false;
  }
};
