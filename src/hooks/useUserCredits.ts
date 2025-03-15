
import { useTradeAuth } from './useTradeAuth';
import { useCreditQueries } from './credits/useCreditQueries';
import { useCreditMutations } from './credits/useCreditMutations';
import { useEffect, useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';

// Re-export the types using 'export type' syntax for isolatedModules compatibility
export type { UserCredits, CreditTransaction } from './credits/types';

export function useUserCredits() {
  const { userId } = useTradeAuth();
  const queryClient = useQueryClient();
  
  // Use the query hook with no caching
  const { 
    credits, 
    transactions, 
    isLoading, 
    error, 
    refetch 
  } = useCreditQueries(userId);
  
  // Enhanced refetch function with logging and forced invalidation
  const enhancedRefetch = useCallback(async () => {
    console.log('Explicit credit refetch for user:', userId);
    try {
      // First invalidate the queries
      queryClient.invalidateQueries({ queryKey: ['user-credits', userId] });
      queryClient.invalidateQueries({ queryKey: ['credit-transactions', userId] });
      
      // Then perform the refetch
      const result = await refetch();
      console.log('Credit refetch result:', result);
      return result;
    } catch (error) {
      console.error('Credit refetch error:', error);
      throw error;
    }
  }, [userId, refetch, queryClient]);
  
  // Log user ID and credits for debugging
  useEffect(() => {
    if (userId) {
      console.log('Current user ID in useUserCredits:', userId);
      console.log('Current credits:', credits);
    }
  }, [userId, credits]);
  
  // Force an initial fetch when the hook mounts
  useEffect(() => {
    if (userId) {
      console.log('Initial credit fetch for user:', userId);
      enhancedRefetch().catch(err => 
        console.error('Error during initial fetch:', err)
      );
    }
  }, [userId, enhancedRefetch]);
  
  // Set up interval to refresh credits - shorter interval for more responsiveness
  useEffect(() => {
    if (!userId) return;
    
    const intervalId = setInterval(() => {
      console.log('Refreshing credits on interval');
      enhancedRefetch().catch(err => 
        console.error('Error during interval refresh:', err)
      );
    }, 3000); // Refresh every 3 seconds instead of 5
    
    return () => clearInterval(intervalId);
  }, [userId, enhancedRefetch]);
  
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
