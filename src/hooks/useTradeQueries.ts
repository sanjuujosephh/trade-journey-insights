
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import type { Trade } from "@/types/trade";

export function useTradeQueries(userId: string | null, options = {}) {
  const {
    data: trades = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["trades", userId],
    queryFn: async () => {
      if (!userId) return [];
      const { data, error } = await supabase
        .from("trades")
        .select("*")
        .eq("user_id", userId)
        .order("entry_date", { ascending: false });

      if (error) throw error;
      return data as Trade[];
    },
    enabled: !!userId,
    ...options,
  });

  return {
    trades,
    isLoading,
    error,
  };
}
