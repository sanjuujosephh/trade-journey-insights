
import { useTradeAuth } from "./useTradeAuth";
import { useTradeQueries } from "./useTradeQueries";
import { useTradeMutations } from "./useTradeMutations";

export function useTradeOperations() {
  const { userId } = useTradeAuth();
  const { trades, isLoading } = useTradeQueries(userId, {
    staleTime: 5 * 60 * 1000,
    cacheTime: 30 * 60 * 1000,
    refetchOnWindowFocus: false,
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
