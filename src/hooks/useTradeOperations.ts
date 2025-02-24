
import { useCallback, useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Trade } from "@/types/trade";
import { transformTradeData } from "@/utils/trade-form/transformations";

const formatToIST = (date: Date, includeSeconds = false) => {
  const options: Intl.DateTimeFormatOptions = {
    timeZone: 'Asia/Kolkata',
    hour12: false,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  };

  if (includeSeconds) {
    options.second = '2-digit';
  }

  const parts = new Intl.DateTimeFormat('en-IN', options).formatToParts(date);
  const values: { [key: string]: string } = {};
  parts.forEach(part => {
    values[part.type] = part.value;
  });

  return `${values.year}-${values.month}-${values.day}T${values.hour}:${values.minute}${includeSeconds ? `:${values.second}` : ''}`;
};

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
      .gte('entry_time', formatToIST(dayStart))
      .lte('entry_time', formatToIST(dayEnd));
    
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
        entry_time: newTrade.entry_time ? newTrade.entry_time : formatToIST(now),
        exit_time: newTrade.exit_time ? newTrade.exit_time : null,
        timestamp: formatToIST(now)
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
        entry_time: trade.entry_time ? trade.entry_time : undefined,
        exit_time: trade.exit_time ? trade.exit_time : null
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
