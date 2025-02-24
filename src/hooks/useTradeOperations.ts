
import { useCallback, useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Trade } from "@/types/trade";
import { transformTradeData } from "@/utils/trade-form/transformations";
import { dateToISTString, parseISTString } from "@/utils/datetime";

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
        .order('entry_time', { ascending: false });
      
      if (error) {
        console.error('Error fetching trades:', error);
        throw error;
      }
      
      return data;
    },
    enabled: !!userId,
  });

  const checkTradeLimit = useCallback(async (entryTime: string) => {
    if (!userId) return false;
    
    const date = parseISTString(entryTime);
    const dayStart = new Date(date);
    dayStart.setHours(9, 0, 0, 0);
    
    const dayEnd = new Date(date);
    dayEnd.setHours(15, 59, 59, 999);
    
    const { data: existingTrades, error } = await supabase
      .from('trades')
      .select('id')
      .gte('entry_time', dateToISTString(dayStart))
      .lte('entry_time', dateToISTString(dayEnd))
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

      const now = new Date();
      const tradeData = {
        ...newTrade,
        user_id: userId,
        entry_time: newTrade.entry_time || dateToISTString(now),
        exit_time: newTrade.exit_time || null,
        timestamp: dateToISTString(now)
      };

      console.log('Adding trade with data:', tradeData);

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

      const updates = {
        ...trade,
        entry_time: trade.entry_time ? dateToISTString(parseISTString(trade.entry_time)) : undefined,
        exit_time: trade.exit_time ? dateToISTString(parseISTString(trade.exit_time)) : null
      };

      console.log('Updating trade with data:', updates);

      const { data, error } = await supabase
        .from('trades')
        .update(updates)
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

  return {
    trades,
    isLoading,
    addTrade,
    updateTrade,
    userId,
  };
}
