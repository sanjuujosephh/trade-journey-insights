
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

      // Convert time to 24-hour format for database
      const formatTime = (timeStr: string | null) => {
        if (!timeStr) return null;
        const [time, period] = timeStr.split(' ');
        const [hours, minutes] = time.split(':').map(Number);
        let hour = hours;
        
        if (period === 'PM' && hours !== 12) {
          hour += 12;
        } else if (period === 'AM' && hours === 12) {
          hour = 0;
        }
        
        return `${hour.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
      };
      
      const tradeData = {
        ...newTrade,
        user_id: userId,
        entry_date: newTrade.entry_date || datePart,
        entry_time: formatTime(newTrade.entry_time) || formatTime(timePart),
        exit_time: newTrade.exit_time ? formatTime(newTrade.exit_time) : null,
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
