
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
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
      
      console.log('Fetching credits for user:', userId);
      const { data, error } = await supabase
        .from('user_credits')
        .select('*')
        .eq('user_id', userId)
        .single();
        
      if (error) {
        console.error('Error fetching user credits:', error);
        return null;
      }
      
      console.log('User credits data:', data);
      return data as UserCredits;
    },
    enabled: !!userId,
    refetchOnWindowFocus: true,
    staleTime: 0, // Always consider the data stale to force refresh
    refetchInterval: 5000, // Poll every 5 seconds
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
    enabled: !!userId,
    staleTime: 0, // Always treat as stale
    refetchInterval: 5000 // Poll every 5 seconds
  });

  return {
    credits,
    transactions,
    isLoading,
    error,
    refetch
  };
}
