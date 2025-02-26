
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

      // Combine date and time into ISO string
      const combineDateAndTime = (dateStr: string, timeStr: string | null) => {
        if (!dateStr || !timeStr) return null;
        
        // Parse date components
        const [day, month, year] = dateStr.split('-').map(Number);
        
        // Parse time components and convert to 24-hour format
        const [timeBase, period] = timeStr.split(' ');
        const [hours, minutes] = timeBase.split(':').map(Number);
        let hour = hours;
        
        if (period === 'PM' && hours !== 12) {
          hour += 12;
        } else if (period === 'AM' && hours === 12) {
          hour = 0;
        }

        // Create ISO string in user's timezone
        const dateObj = new Date(year, month - 1, day, hour, minutes);
        return dateObj.toISOString();
      };

      const tradeData = {
        ...newTrade,
        user_id: userId,
        entry_date: newTrade.entry_date || datePart,
        entry_time: combineDateAndTime(
          newTrade.entry_date || datePart,
          newTrade.entry_time || timePart
        ),
        exit_time: newTrade.exit_time 
          ? combineDateAndTime(newTrade.entry_date || datePart, newTrade.exit_time)
          : null,
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
