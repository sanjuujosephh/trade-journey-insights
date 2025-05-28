
import { useAddTrade } from "./mutations/useAddTrade";

export function useTradeMutations(userId: string | null) {
  const addTrade = useAddTrade(userId);

  return { addTrade };
}
