
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { Trade, FormData } from "@/types/trade";
import { transformTradeData } from "@/utils/trade-form/transformations";
import { formatToIST } from "@/utils/datetime";
import { checkTradeLimit } from "@/utils/trade-validation";

export function useTradeMutations(userId: string | null) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const addTrade = useMutation({
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
        exit_date: newTrade.exit_date || null,
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

  const updateTrade = useMutation({
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
        exit_date: tradeData.exit_date || '',
        exit_time: tradeData.exit_time || '',
        chart_link: tradeData.chart_link || '',
        vix: tradeData.vix?.toString() || '',
        call_iv: tradeData.call_iv?.toString() || '',
        put_iv: tradeData.put_iv?.toString() || '',
        vwap_position: (tradeData.vwap_position || '') as "" | "above_vwap" | "below_vwap",
        ema_position: (tradeData.ema_position || '') as "" | "above_20ema" | "below_20ema",
        strike_price: tradeData.strike_price?.toString() || '',
        option_type: (tradeData.option_type || '') as "" | "call" | "put",
        market_condition: (tradeData.market_condition || '') as "" | "trending" | "ranging" | "news_driven" | "volatile",
        timeframe: (tradeData.timeframe || '') as "" | "1min" | "5min" | "15min" | "1hr",
        trade_direction: (tradeData.trade_direction || '') as "" | "long" | "short",
        planned_risk_reward: tradeData.planned_risk_reward?.toString() || '',
        actual_risk_reward: tradeData.actual_risk_reward?.toString() || '',
        planned_target: tradeData.planned_target?.toString() || '',
        exit_reason: (tradeData.exit_reason || '') as "" | "stop_loss" | "target" | "manual" | "time_based",
        slippage: tradeData.slippage?.toString() || '',
        post_exit_price: tradeData.post_exit_price?.toString() || '',
        exit_efficiency: tradeData.exit_efficiency?.toString() || '',
        confidence_level: tradeData.confidence_level?.toString() || '',
        entry_emotion: (tradeData.entry_emotion || '') as "" | "fear" | "greed" | "fomo" | "revenge" | "neutral",
        exit_emotion: (tradeData.exit_emotion || '') as "" | "satisfied" | "regretful" | "relieved" | "frustrated",
      };

      const transformedData = transformTradeData(formDataForTransform);

      const updatedTrade = {
        ...transformedData,
        entry_date: tradeData.entry_date,
        entry_time: tradeData.entry_time,
        exit_date: tradeData.exit_date,
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

  return { addTrade, updateTrade };
}
