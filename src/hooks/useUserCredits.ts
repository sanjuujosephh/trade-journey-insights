
import { useTradeAuth } from './useTradeAuth';
import { useCreditQueries } from './credits/useCreditQueries';
import { useCreditMutations } from './credits/useCreditMutations';
import { useEffect, useState } from 'react';

// Re-export the types using 'export type' syntax for isolatedModules compatibility
export type { UserCredits, CreditTransaction } from './credits/types';

export function useUserCredits() {
  const { userId } = useTradeAuth();
  const [lastUserId, setLastUserId] = useState<string | null>(null);
  
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
      
      // Store the last user ID to detect changes
      if (userId !== lastUserId) {
        setLastUserId(userId);
        console.log('User ID changed, refetching credits');
        refetch();
      }
    }
  }, [userId, credits, lastUserId, refetch]);
  
  // Force an initial fetch when the hook mounts
  useEffect(() => {
    if (userId) {
      console.log('Initial credit fetch for user:', userId);
      refetch();
    }
  }, [userId, refetch]);
  
  // Setup a periodic refetch
  useEffect(() => {
    if (!userId) return;
    
    const interval = setInterval(() => {
      console.log('Periodic credit refetch');
      refetch();
    }, 10000); // Refresh every 10 seconds
    
    return () => clearInterval(interval);
  }, [userId, refetch]);
  
  // Use the mutations hook
  const { 
    useCredits, 
    purchaseCredits,
    isUsingCredits,
    isPurchasingCredits
  } = useCreditMutations(userId, credits, refetch);
  
  // Calculate available credits
  const availableCredits = credits ? 
    (credits.subscription_credits || 0) + (credits.purchased_credits || 0) : 0;
  
  return {
    credits,
    transactions,
    isLoading,
    error,
    useCredits,
    purchaseCredits,
    refetch,
    isUsingCredits,
    isPurchasingCredits,
    availableCredits
  };
}
