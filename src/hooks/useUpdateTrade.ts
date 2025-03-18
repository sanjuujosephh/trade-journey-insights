
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { Trade, FormData } from "@/types/trade";
import { transformTradeData } from "@/utils/trade-form/transformations";

export function useUpdateTrade(userId: string | null) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...tradeData }: Partial<Trade> & { id: string }) => {
      if (!userId) {
        throw new Error("User not authenticated");
      }

      console.log('Raw update data:', tradeData);
      
      const formDataForTransform: FormData = {
        symbol: tradeData.symbol || '',
        entry_price: tradeData.entry_price?.toString() || '',
        exit_price: tradeData.exit_price?.toString() || '',
        quantity: tradeData.quantity?.toString() || '',
        trade_type: tradeData.trade_type || 'options',
        stop_loss: tradeData.stop_loss?.toString() || '',
        strategy: tradeData.strategy || '',
        outcome: tradeData.outcome || 'profit',
        notes: tradeData.notes || '',
        entry_date: tradeData.entry_date || '',
        entry_time: tradeData.entry_time || '',
        exit_time: tradeData.exit_time || '',
        chart_link: tradeData.chart_link || '',
        vix: tradeData.vix?.toString() || '',
        call_iv: tradeData.call_iv?.toString() || '',
        put_iv: tradeData.put_iv?.toString() || '',
        pcr: tradeData.pcr?.toString() || '',
        vwap_position: (tradeData.vwap_position || '') as "" | "above" | "below" | "at",
        ema_position: (tradeData.ema_position || '') as "" | "above" | "below" | "at",
        strike_price: tradeData.strike_price?.toString() || '',
        option_type: (tradeData.option_type || '') as "" | "call" | "put",
        market_condition: (tradeData.market_condition || '') as string,
        timeframe: (tradeData.timeframe || '') as string,
        trade_direction: (tradeData.trade_direction || '') as "" | "long" | "short",
        exit_reason: (tradeData.exit_reason || '') as string,
        confidence_level: tradeData.confidence_level?.toString() || '',
        entry_emotion: (tradeData.entry_emotion || '') as string,
        exit_emotion: (tradeData.exit_emotion || '') as string,
      };

      const transformedData = transformTradeData(formDataForTransform);

      const updatedTrade = {
        ...transformedData,
        entry_date: tradeData.entry_date,
        entry_time: tradeData.entry_time,
        exit_time: tradeData.exit_time
      };

      console.log('Processed update data:', updatedTrade);

      const { data, error } = await supabase
        .from('trades')
        .update(updatedTrade)
        .eq('id', id)
        .select()
        .single();
      
      if (error) {
        console.error('Error updating trade:', error);
        throw error;
      }
      
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trades', userId] });
      toast({
        title: "Success",
        description: "Trade updated successfully!"
      });
    },
    onError: (error) => {
      console.error('Update trade error:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update trade",
        variant: "destructive"
      });
    }
  });
}
