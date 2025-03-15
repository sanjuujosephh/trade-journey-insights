
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { UserCredits, CreditTransaction } from './types';

export function useCreditQueries(userId: string | null) {
  // Fetch user credits with no caching to ensure fresh data
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
        throw error;
      }
      
      console.log('User credits data:', data);
      return data as UserCredits;
    },
    enabled: !!userId,
    refetchOnWindowFocus: true,
    staleTime: 0, // Consider data always stale to force refetch
    cacheTime: 1000 // Only cache for 1 second
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
        throw error;
      }
      
      return data as CreditTransaction[];
    },
    enabled: !!userId,
    staleTime: 0, // Always consider stale to force refetch
    cacheTime: 1000 // Short cache time
  });

  return {
    credits,
    transactions,
    isLoading,
    error,
    refetch
  };
}
