
import { useMutation } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { UseCreditsParams, PurchaseCreditsParams, CreditOperationResult } from './types';
import { toast } from '@/hooks/use-toast';

export function useCreditMutations(
  userId: string | null, 
  credits: any | null, 
  refetchCredits: () => void
) {

  // Mutation to use credits
  const useCreditsOperation = useMutation({
    mutationFn: async ({ amount, description, transaction_type = 'deduction' }: UseCreditsParams) => {
      if (!userId) {
        throw new Error('User ID is required');
      }

      console.log(`Using ${amount} credits for ${description}`);
      
      if (!credits) {
        throw new Error('Credits information not available');
      }
      
      const total_available = (credits.subscription_credits || 0) + (credits.purchased_credits || 0);
      
      if (total_available < amount) {
        throw new Error('Insufficient credits');
      }
      
      // Deduct from credits
      let subscription_credits = credits.subscription_credits || 0;
      let purchased_credits = credits.purchased_credits || 0;
      
      // First use subscription credits
      if (subscription_credits >= amount) {
        subscription_credits -= amount;
      } else {
        // If subscription credits are not enough, use purchased credits too
        const remaining = amount - subscription_credits;
        subscription_credits = 0;
        purchased_credits -= remaining;
      }
      
      // Update user_credits table
      const { error: updateError } = await supabase
        .from('user_credits')
        .update({
          subscription_credits,
          purchased_credits,
          total_credits_used: (credits.total_credits_used || 0) + amount,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', userId);
        
      if (updateError) {
        console.error('Error updating credits:', updateError);
        throw updateError;
      }
      
      // Log transaction
      const { error: transactionError } = await supabase
        .from('credit_transactions')
        .insert({
          user_id: userId,
          amount: -amount, // Negative for deduction
          description,
          transaction_type
        });
        
      if (transactionError) {
        console.error('Error logging transaction:', transactionError);
        throw transactionError;
      }
      
      // Force refetch to update UI
      refetchCredits();
      
      return { success: true, message: 'Credits used successfully' } as CreditOperationResult;
    },
    onSuccess: () => {
      console.log('Successfully used credits');
      refetchCredits();
    },
    onError: (error) => {
      console.error('Error using credits:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to use credits",
        variant: "destructive"
      });
    }
  });
  
  // Mutation to purchase credits
  const purchaseCreditsOperation = useMutation({
    mutationFn: async ({ amount }: PurchaseCreditsParams) => {
      if (!userId) {
        throw new Error('User ID is required');
      }
      
      // Get current credits
      const { data: currentCredits, error: fetchError } = await supabase
        .from('user_credits')
        .select('*')
        .eq('user_id', userId)
        .single();
        
      if (fetchError) {
        console.error('Error fetching credits:', fetchError);
        throw fetchError;
      }
      
      // Update credits
      const { error: updateError } = await supabase
        .from('user_credits')
        .update({
          purchased_credits: (currentCredits?.purchased_credits || 0) + amount,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', userId);
        
      if (updateError) {
        console.error('Error updating credits:', updateError);
        throw updateError;
      }
      
      // Log transaction
      const { error: transactionError } = await supabase
        .from('credit_transactions')
        .insert({
          user_id: userId,
          amount,
          description: `Purchased ${amount} credits`,
          transaction_type: 'purchase'
        });
        
      if (transactionError) {
        console.error('Error logging transaction:', transactionError);
        throw transactionError;
      }
      
      // Force refetch
      refetchCredits();
      
      return { success: true, message: 'Credits purchased successfully' } as CreditOperationResult;
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Credits purchased successfully",
      });
      refetchCredits();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to purchase credits",
        variant: "destructive"
      });
    }
  });
  
  // Simplified interface for component use
  const useCredits = (amount: number, description: string, transaction_type?: 'deduction' | 'reset' | 'refund') => {
    return useCreditsOperation.mutateAsync({ amount, description, transaction_type });
  };
  
  const purchaseCredits = (amount: number) => {
    return purchaseCreditsOperation.mutateAsync({ amount });
  };
  
  return {
    useCredits,
    purchaseCredits,
    isUsingCredits: useCreditsOperation.isPending,
    isPurchasingCredits: purchaseCreditsOperation.isPending
  };
}
