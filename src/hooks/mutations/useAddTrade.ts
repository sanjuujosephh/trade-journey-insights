
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { Trade } from "@/types/trade";
import { formatToIST } from "@/utils/datetime";
import { checkTradeLimit } from "@/utils/trade-validation";

export function useAddTrade(userId: string | null) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newTrade: Omit<Trade, 'id' | 'timestamp'>) => {
      if (!userId) {
        throw new Error("User not authenticated");
      }

      const now = new Date();
      const { datePart, timePart } = formatToIST(now);
      
      const tradeData = {
        ...newTrade,
        user_id: userId,
        entry_date: newTrade.entry_date || datePart,
        entry_time: newTrade.entry_time || timePart,
        exit_time: newTrade.exit_time || null,
        timestamp: now
      };

      console.log('Adding trade with data:', tradeData);

      const canAddTrade = await checkTradeLimit(userId, tradeData.entry_date, tradeData.entry_time);
      if (!canAddTrade) {
        throw new Error("Daily trade limit reached (1 trade per day)");
      }

      const { data, error } = await supabase
        .from('trades')
        .insert([tradeData])
        .select()
        .single();
      
      if (error) {
        console.error('Error adding trade:', error);
        throw error;
      }
      
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trades', userId] });
      toast({
        title: "Success",
        description: "Trade logged successfully!"
      });
    },
    onError: (error) => {
      console.error('Add trade error:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to log trade",
        variant: "destructive"
      });
    }
  });
}
