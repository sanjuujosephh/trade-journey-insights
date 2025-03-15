
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useTradeAuth } from './useTradeAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface UserCredits {
  id: string;
  user_id: string;
  subscription_credits: number;
  purchased_credits: number;
  total_credits_used: number;
  last_reset_date: string | null;
  next_reset_date: string | null;
  created_at: string | null;
  updated_at: string | null;
}

export interface CreditTransaction {
  id: string;
  user_id: string;
  amount: number;
  description: string | null;
  transaction_type: 'purchase' | 'deduction' | 'reset' | 'refund';
  created_at: string | null;
}

export function useUserCredits() {
  const { userId } = useTradeAuth();
  const queryClient = useQueryClient();
  
  // Fetch user credits
  const { data: credits, isLoading, error, refetch } = useQuery({
    queryKey: ['user-credits', userId],
    queryFn: async () => {
      if (!userId) return null;
      
      const { data, error } = await supabase
        .from('user_credits')
        .select('*')
        .eq('user_id', userId)
        .single();
        
      if (error) {
        console.error('Error fetching user credits:', error);
        return null;
      }
      
      return data as UserCredits;
    },
    enabled: !!userId
  });
  
  // Fetch credit transactions
  const { data: transactions } = useQuery({
    queryKey: ['credit-transactions', userId],
    queryFn: async () => {
      if (!userId) return [];
      
      const { data, error } = await supabase
        .from('credit_transactions')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
        
      if (error) {
        console.error('Error fetching credit transactions:', error);
        return [];
      }
      
      return data as CreditTransaction[];
    },
    enabled: !!userId
  });
  
  // Use credits mutation
  const useCredits = useMutation({
    mutationFn: async (params: {
      amount: number;
      description: string;
      transaction_type?: 'purchase' | 'deduction' | 'reset' | 'refund';
    }) => {
      if (!userId) {
        return { success: false, message: 'User not authenticated' };
      }
      
      const { amount, description, transaction_type = amount < 0 ? 'deduction' : 'purchase' } = params;
      
      // Ensure we have the latest credits data
      await refetch();
      
      if (!credits) {
        return { success: false, message: 'No credits information available' };
      }
      
      // Calculate the new credit values
      const absAmount = Math.abs(amount);
      let newSubscriptionCredits = credits.subscription_credits;
      let newPurchasedCredits = credits.purchased_credits;
      let newTotalCreditsUsed = credits.total_credits_used;
      
      // If it's a deduction (negative amount), deduct from subscription credits first
      if (amount < 0) {
        if (newSubscriptionCredits >= absAmount) {
          newSubscriptionCredits -= absAmount;
        } else {
          // If subscription credits are not enough, use purchased credits for the rest
          const remainingAmount = absAmount - newSubscriptionCredits;
          newSubscriptionCredits = 0;
          newPurchasedCredits -= remainingAmount;
        }
        
        // Increase total used credits
        newTotalCreditsUsed += absAmount;
      } else {
        // For additions (purchase, refund, reset), add to purchased credits
        newPurchasedCredits += amount;
      }
      
      // Insert transaction
      const { error: transactionError } = await supabase
        .from('credit_transactions')
        .insert({
          user_id: userId,
          amount: amount,
          description: description,
          transaction_type: transaction_type
        });
        
      if (transactionError) {
        console.error('Error inserting credit transaction:', transactionError);
        return { success: false, message: 'Failed to record transaction' };
      }
      
      // Update user credits
      const { error: updateError } = await supabase
        .from('user_credits')
        .update({
          subscription_credits: newSubscriptionCredits,
          purchased_credits: newPurchasedCredits,
          total_credits_used: newTotalCreditsUsed,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', userId);
        
      if (updateError) {
        console.error('Error updating user credits:', updateError);
        return { success: false, message: 'Failed to update credits' };
      }
      
      // Invalidate queries to refresh the data
      queryClient.invalidateQueries({ queryKey: ['user-credits'] });
      queryClient.invalidateQueries({ queryKey: ['credit-transactions'] });
      
      return { success: true, message: 'Credits updated successfully' };
    }
  });
  
  // Purchase credits mutation
  const purchaseCredits = useMutation({
    mutationFn: async (params: { amount: number }) => {
      if (!userId) {
        return { success: false, message: 'User not authenticated' };
      }
      
      const { amount } = params;
      
      // Check if the user has a credits record
      const { data: existingCredits, error: checkError } = await supabase
        .from('user_credits')
        .select('id')
        .eq('user_id', userId)
        .maybeSingle();
        
      if (checkError) {
        console.error('Error checking existing credits:', checkError);
        return { success: false, message: 'Failed to check existing credits' };
      }
      
      if (!existingCredits) {
        // Create a new user_credits record if it doesn't exist
        const { error: insertError } = await supabase
          .from('user_credits')
          .insert({
            user_id: userId,
            subscription_credits: 0,
            purchased_credits: amount,
            total_credits_used: 0
          });
          
        if (insertError) {
          console.error('Error creating user credits:', insertError);
          return { success: false, message: 'Failed to create credits record' };
        }
      } else {
        // Update existing credits - FIX: Don't use RPC directly here
        // Just update with addition operation
        const { error: updateError } = await supabase
          .from('user_credits')
          .update({
            purchased_credits: (credits?.purchased_credits || 0) + amount,
            updated_at: new Date().toISOString()
          })
          .eq('user_id', userId);
          
        if (updateError) {
          console.error('Error updating purchased credits:', updateError);
          return { success: false, message: 'Failed to update purchased credits' };
        }
      }
      
      // Insert transaction record
      const { error: transactionError } = await supabase
        .from('credit_transactions')
        .insert({
          user_id: userId,
          amount: amount,
          description: `Purchased ${amount} credits`,
          transaction_type: 'purchase'
        });
        
      if (transactionError) {
        console.error('Error inserting purchase transaction:', transactionError);
        return { success: false, message: 'Failed to record purchase transaction' };
      }
      
      // Invalidate queries to refresh the data
      queryClient.invalidateQueries({ queryKey: ['user-credits'] });
      queryClient.invalidateQueries({ queryKey: ['credit-transactions'] });
      
      toast.success(`Successfully purchased ${amount} credits!`);
      
      return { success: true, message: 'Credits purchased successfully' };
    }
  });
  
  return {
    credits,
    transactions,
    isLoading,
    error,
    useCredits,
    purchaseCredits,
    refetch
  };
}
