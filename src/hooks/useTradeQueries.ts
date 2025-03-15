
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
      
      try {
        const { data, error } = await supabase
          .from("trades")
          .select("*")
          .eq("user_id", userId)
          .order("entry_date", { ascending: false });

        if (error) {
          console.error("Error fetching trades:", error);
          throw error;
        }
        
        return data as Trade[];
      } catch (queryError) {
        console.error("Error fetching trades:", queryError);
        throw queryError;
      }
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
