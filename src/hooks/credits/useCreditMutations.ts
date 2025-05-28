
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { UserCredits, UseCreditsParams, PurchaseCreditsParams, CreditOperationResult } from './types';

export function useCreditMutations(userId: string | null, credits: UserCredits | null, refetch: () => Promise<any>) {
  const queryClient = useQueryClient();
  
  // Use credits mutation - simplified for free platform
  const useCredits = useMutation({
    mutationFn: async (params: UseCreditsParams): Promise<CreditOperationResult> => {
      if (!userId) {
        return { success: false, message: 'User not authenticated' };
      }
      
      const { amount, description, transaction_type = amount < 0 ? 'deduction' : 'purchase' } = params;
      
      // Since platform is free, just log the transaction for tracking
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
      
      // Update total credits used if it's a deduction
      if (amount < 0) {
        const { error: updateError } = await supabase
          .from('user_credits')
          .update({
            total_credits_used: (credits?.total_credits_used || 0) + Math.abs(amount),
            updated_at: new Date().toISOString()
          })
          .eq('user_id', userId);
          
        if (updateError) {
          console.error('Error updating user credits:', updateError);
        }
      }
      
      // Invalidate queries
      queryClient.invalidateQueries({ queryKey: ['user-credits'] });
      queryClient.invalidateQueries({ queryKey: ['credit-transactions'] });
      
      // Manual refetch
      setTimeout(() => refetch(), 300);
      
      return { success: true, message: 'Credits updated successfully' };
    }
  });
  
  // Purchase credits mutation - no longer needed but kept for compatibility
  const purchaseCredits = useMutation({
    mutationFn: async (params: PurchaseCreditsParams): Promise<CreditOperationResult> => {
      toast.success('Platform is now completely free! No need to purchase credits.');
      return { success: true, message: 'Platform is free!' };
    }
  });

  return {
    useCredits,
    purchaseCredits
  };
}
