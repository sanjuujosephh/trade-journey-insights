
import { useTradeAuth } from './useTradeAuth';
import { useCreditQueries } from './credits/useCreditQueries';
import { useCreditMutations } from './credits/useCreditMutations';
import { useEffect, useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';

// Re-export the types
export type { UserCredits, CreditTransaction } from './credits/types';

export function useUserCredits() {
  const { userId } = useTradeAuth();
  const queryClient = useQueryClient();
  
  // Use the query hook
  const { 
    credits, 
    transactions, 
    isLoading, 
    error, 
    refetch 
  } = useCreditQueries(userId);
  
  // Enhanced refetch function with logging
  const enhancedRefetch = useCallback(async () => {
    console.log('Explicit credit refetch for user:', userId);
    try {
      const result = await refetch();
      console.log('Credit refetch result:', result);
      return result;
    } catch (error) {
      console.error('Credit refetch error:', error);
      throw error;
    }
  }, [userId, refetch]);
  
  // Force an initial fetch when the hook mounts
  useEffect(() => {
    if (userId) {
      console.log('Initial credit fetch for user:', userId);
      enhancedRefetch().catch(err => 
        console.error('Error during initial fetch:', err)
      );
    }
  }, [userId, enhancedRefetch]);
  
  // Set up interval to refresh credits
  useEffect(() => {
    if (!userId) return;
    
    const intervalId = setInterval(() => {
      console.log('Refreshing credits on interval');
      queryClient.invalidateQueries({ queryKey: ['user-credits', userId] });
      queryClient.invalidateQueries({ queryKey: ['credit-transactions', userId] });
    }, 5000); // Refresh every 5 seconds
    
    return () => clearInterval(intervalId);
  }, [userId, queryClient]);
  
  // Use the mutations hook
  const { 
    useCredits, 
    purchaseCredits 
  } = useCreditMutations(userId, credits, enhancedRefetch);
  
  return {
    credits,
    transactions,
    isLoading,
    error,
    useCredits,
    purchaseCredits,
    refetch: enhancedRefetch
  };
}
