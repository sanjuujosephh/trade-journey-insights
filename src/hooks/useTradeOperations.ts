
import { useTradeAuth } from "./useTradeAuth";
import { useTradeQueries } from "./useTradeQueries";
import { useTradeMutations } from "./useTradeMutations";

export function useTradeOperations() {
  const { userId } = useTradeAuth();
  const { trades, isLoading } = useTradeQueries(userId);
  const { addTrade, updateTrade } = useTradeMutations(userId);

  return {
    trades,
    isLoading,
    addTrade,
    updateTrade,
    userId,
  };
}
