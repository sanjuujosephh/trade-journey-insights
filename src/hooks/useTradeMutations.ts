
import { useAddTrade } from "./mutations/useAddTrade";
import { useUpdateTrade } from "./mutations/useUpdateTrade";

export function useTradeMutations(userId: string | null) {
  const addTrade = useAddTrade(userId);
  const updateTrade = useUpdateTrade(userId);

  return { addTrade, updateTrade };
}
