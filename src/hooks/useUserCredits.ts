
import { useTradeAuth } from './useTradeAuth';
import { useCreditQueries } from './credits/useCreditQueries';
import { useCreditMutations } from './credits/useCreditMutations';

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
