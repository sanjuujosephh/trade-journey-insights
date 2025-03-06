
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";

export type UserCredits = {
  id: string;
  user_id: string;
  subscription_credits: number;
  purchased_credits: number;
  total_credits_used: number;
  last_reset_date: string;
  next_reset_date: string | null;
}

export type CreditTransaction = {
  id: string;
  user_id: string;
  amount: number;
  transaction_type: 'deduction' | 'purchase' | 'reset';
  description: string;
  created_at: string;
}

export function useUserCredits() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { 
    data: credits,
    isLoading,
    error
  } = useQuery({
    queryKey: ['user-credits', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      
      const { data, error } = await supabase
        .from('user_credits')
        .select('*')
        .eq('user_id', user.id)
        .single();
      
      if (error) {
        // If no record exists, create one with default values
        if (error.code === 'PGRST116') {
          const { data: newData, error: newError } = await supabase
            .from('user_credits')
            .insert({
              user_id: user.id,
              subscription_credits: 10, // Free users get 10 credits
              purchased_credits: 0
            })
            .select()
            .single();
          
          if (newError) throw newError;
          return newData as UserCredits;
        }
        throw error;
      }
      
      return data as UserCredits;
    },
    enabled: !!user?.id
  });

  const { data: transactions } = useQuery({
    queryKey: ['credit-transactions', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      
      const { data, error } = await supabase
        .from('credit_transactions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(20);
      
      if (error) throw error;
      return data as CreditTransaction[];
    },
    enabled: !!user?.id
  });

  const useCredits = useMutation({
    mutationFn: async ({ amount, description }: { amount: number, description: string }) => {
      if (!user?.id) throw new Error('User not authenticated');
      if (!credits) throw new Error('Credits not loaded');
      
      const totalAvailableCredits = (credits.subscription_credits || 0) + (credits.purchased_credits || 0);
      
      if (totalAvailableCredits < amount) {
        throw new Error('Not enough credits available');
      }
      
      // First, update the credits table
      // We prioritize using subscription credits first, then purchased credits
      let subscriptionCreditsToUse = Math.min(credits.subscription_credits, amount);
      let purchasedCreditsToUse = amount - subscriptionCreditsToUse;
      
      const { error: updateError } = await supabase
        .from('user_credits')
        .update({
          subscription_credits: credits.subscription_credits - subscriptionCreditsToUse,
          purchased_credits: credits.purchased_credits - purchasedCreditsToUse,
          total_credits_used: (credits.total_credits_used || 0) + amount,
          updated_at: new Date().toISOString()
        })
        .eq('id', credits.id);
      
      if (updateError) throw updateError;
      
      // Then, log the transaction
      const { error: txError } = await supabase
        .from('credit_transactions')
        .insert({
          user_id: user.id,
          amount: -amount, // Negative for deductions
          transaction_type: 'deduction',
          description
        });
      
      if (txError) throw txError;
      
      return { success: true, creditsRemaining: totalAvailableCredits - amount };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-credits', user?.id] });
      queryClient.invalidateQueries({ queryKey: ['credit-transactions', user?.id] });
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to use credits');
    }
  });

  const purchaseCredits = useMutation({
    mutationFn: async ({ amount }: { amount: number }) => {
      if (!user?.id) throw new Error('User not authenticated');
      if (!credits) throw new Error('Credits not loaded');
      
      // Update the credits
      const { error: updateError } = await supabase
        .from('user_credits')
        .update({
          purchased_credits: (credits.purchased_credits || 0) + amount,
          updated_at: new Date().toISOString()
        })
        .eq('id', credits.id);
      
      if (updateError) throw updateError;
      
      // Log the transaction
      const { error: txError } = await supabase
        .from('credit_transactions')
        .insert({
          user_id: user.id,
          amount,
          transaction_type: 'purchase',
          description: `Purchased ${amount} credits`
        });
      
      if (txError) throw txError;
      
      return { success: true };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-credits', user?.id] });
      queryClient.invalidateQueries({ queryKey: ['credit-transactions', user?.id] });
      toast.success('Credits purchased successfully!');
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to purchase credits');
    }
  });

  // Calculate totals
  const totalCredits = credits 
    ? (credits.subscription_credits || 0) + (credits.purchased_credits || 0) 
    : 0;

  return {
    credits,
    transactions,
    totalCredits,
    isLoading,
    error,
    useCredits,
    purchaseCredits
  };
}
