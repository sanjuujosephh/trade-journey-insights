
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Trade } from "@/types/trade";

export function useTradeQueries(userId: string | null) {
  const { data: trades = [], isLoading } = useQuery({
    queryKey: ['trades', userId],
    queryFn: async () => {
      if (!userId) return [];
      
      const { data, error } = await supabase
        .from('trades')
        .select('*')
        .order('entry_time', { ascending: false });
      
      if (error) {
        console.error('Error fetching trades:', error);
        throw error;
      }
      
      return data as Trade[];
    },
    enabled: !!userId,
  });

  return { trades, isLoading };
}
