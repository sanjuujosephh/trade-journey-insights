
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { UserCredits, CreditTransaction } from './types';

export function useCreditQueries(userId: string | null) {
  // Fetch user credits
  const { 
    data: credits, 
    isLoading, 
    error, 
    refetch 
  } = useQuery({
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

  return {
    credits,
    transactions,
    isLoading,
    error,
    refetch
  };
}
