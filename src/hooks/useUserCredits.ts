
import { useTradeAuth } from './useTradeAuth';
import { useCreditQueries } from './credits/useCreditQueries';
import { useCreditMutations } from './credits/useCreditMutations';
import { useEffect } from 'react';

// Re-export the types using 'export type' syntax for isolatedModules compatibility
export type { UserCredits, CreditTransaction } from './credits/types';

export function useUserCredits() {
  const { userId } = useTradeAuth();
  
  // Use the query hook
  const { 
    credits, 
    transactions, 
    isLoading, 
    error, 
    refetch 
  } = useCreditQueries(userId);
  
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
      refetch();
    }
  }, [userId, refetch]);
  
  // Use the mutations hook
  const { 
    useCredits, 
    purchaseCredits 
  } = useCreditMutations(userId, credits, refetch);
  
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
