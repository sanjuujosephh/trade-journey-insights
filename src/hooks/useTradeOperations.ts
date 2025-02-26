
import { useTradeAuth } from "./useTradeAuth";
import { useTradeQueries } from "./useTradeQueries";
import { useTradeMutations } from "./useTradeMutations";

export function useTradeOperations() {
  const { userId } = useTradeAuth();
  const { trades, isLoading } = useTradeQueries(userId, {
    staleTime: 5 * 60 * 1000, // Data stays fresh for 5 minutes
    cacheTime: 30 * 60 * 1000, // Cache persists for 30 minutes
    refetchOnWindowFocus: false, // Prevent unnecessary refetches
    refetchOnMount: false
  });
  const { addTrade, updateTrade } = useTradeMutations(userId);

  return {
    trades,
    isLoading,
    addTrade,
    updateTrade,
    userId,
  };
}
