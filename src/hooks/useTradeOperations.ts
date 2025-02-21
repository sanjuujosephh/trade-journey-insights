
import { useCallback, useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Trade } from "@/types/trade";
import { transformTradeData } from "@/utils/trade-form/transformations";

export function useTradeOperations() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserId(user.id);
      }
    };
    getUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUserId(session?.user.id ?? null);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const { data: trades = [], isLoading } = useQuery({
    queryKey: ['trades', userId],
    queryFn: async () => {
      if (!userId) return [];
      
      const { data, error } = await supabase
        .from('trades')
        .select('*')
        .eq('user_id', userId)
        .order('timestamp', { ascending: false });
      
      if (error) {
        console.error('Error fetching trades:', error);
        throw error;
      }
      
      return data;
    },
    enabled: !!userId,
  });

  const checkTradeLimit = useCallback(async (date: string) => {
    if (!userId) {
      console.error('No user ID available');
      return false;
    }
    
    const dayStart = new Date(date);
    dayStart.setHours(0, 0, 0, 0);
    
    const dayEnd = new Date(date);
    dayEnd.setHours(23, 59, 59, 999);
    
    const { data: existingTrades, error } = await supabase
      .from('trades')
      .select('id')
      .gte('entry_time', dayStart.toISOString())
      .lte('entry_time', dayEnd.toISOString())
      .eq('user_id', userId);
    
    if (error) {
      console.error('Error checking trade limit:', error);
      return false;
    }
    
    return (existingTrades?.length || 0) < 1;
  }, [userId]);

  const addTrade = useMutation({
    mutationFn: async (newTrade: Omit<Trade, 'id' | 'timestamp'>) => {
      if (!userId) {
        throw new Error("User not authenticated");
      }

      // Ensure valid timestamps
      const now = new Date().toISOString();
      const tradeData = {
        ...newTrade,
        user_id: userId,
        entry_time: newTrade.entry_time ? new Date(newTrade.entry_time).toISOString() : now,
        exit_time: newTrade.exit_time ? new Date(newTrade.exit_time).toISOString() : null,
        timestamp: now
      };

      // Calculate P/L and set outcome
      if (tradeData.exit_price && tradeData.entry_price && tradeData.quantity) {
        const pnl = (tradeData.exit_price - tradeData.entry_price) * tradeData.quantity;
        tradeData.outcome = pnl > 0 ? 'profit' : pnl < 0 ? 'loss' : 'breakeven';
      }

      const canAddTrade = await checkTradeLimit(tradeData.entry_time);
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
    mutationFn: async ({ id, ...trade }: Partial<Trade> & { id: string }) => {
      if (!userId) {
        throw new Error("User not authenticated");
      }

      // Calculate P/L and set outcome
      if (trade.exit_price && trade.entry_price && trade.quantity) {
        const pnl = (trade.exit_price - trade.entry_price) * trade.quantity;
        trade.outcome = pnl > 0 ? 'profit' : pnl < 0 ? 'loss' : 'breakeven';
      }

      const updates = {
        ...trade,
        entry_time: trade.entry_time ? new Date(trade.entry_time).toISOString() : undefined,
        exit_time: trade.exit_time ? new Date(trade.exit_time).toISOString() : null
      };

      const { data, error } = await supabase
        .from('trades')
        .update(updates)
        .eq('id', id)
        .eq('user_id', userId)
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

  return {
    trades,
    isLoading,
    addTrade,
    updateTrade,
    userId,
  };
}
