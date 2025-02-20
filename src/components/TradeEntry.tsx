import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { TradeDetailsDialog } from "./TradeDetailsDialog";
import { Trade } from "@/types/trade";
import { BasicTradeInfo } from "./trade-form/BasicTradeInfo";
import { MarketContext } from "./trade-form/MarketContext";
import { BehavioralAnalysis } from "./trade-form/BehavioralAnalysis";
import { TradeHistory } from "./trade-form/TradeHistory";
import { LoadingSpinner } from "./LoadingSpinner";
import { ErrorBoundary } from "./ErrorBoundary";
import { ImportTrades } from "./trade-form/ImportTrades";

export const AVAILABLE_SYMBOLS = ["NIFTY", "BANKNIFTY"] as const;
export const AVAILABLE_STRATEGIES = [
  "Trendline Breakout",
  "Trendline Breakdown",
  "Trendline Support",
  "Trendline Resistance",
  "Volume Area",
  "Fibonacci Retracement",
  "Channel Trading",
  "Support and Resistance Zones",
  "VWAP Reversion",
  "Breakout and Retest",
  "Volume Profile Analysis",
  "Price Action Trading",
  "Trend Following Strategy",
  "Liquidity Grab Strategy",
  "Fair Value Gap Strategy",
  "Breakout Fakeout Strategy"
] as const;

interface FormData {
  symbol: string;
  entry_price: string;
  exit_price: string;
  quantity: string;
  trade_type: string;
  stop_loss: string;
  strategy: string;
  outcome: 'profit' | 'loss' | 'breakeven';
  notes: string;
  entry_time: string;
  exit_time: string;
  chart_link: string;
  vix: string;
  call_iv: string;
  put_iv: string;
  strike_price: string;
  option_type: 'call' | 'put' | '';
  market_condition: 'trending' | 'ranging' | 'news_driven' | 'volatile' | '';
  timeframe: '1min' | '5min' | '15min' | '1hr' | '';
  trade_direction: 'long' | 'short' | '';
  planned_risk_reward: string;
  actual_risk_reward: string;
  planned_target: string;
  exit_reason: 'stop_loss' | 'target' | 'manual' | 'time_based' | '';
  slippage: string;
  post_exit_price: string;
  exit_efficiency: string;
  confidence_level: string;
  entry_emotion: 'fear' | 'greed' | 'fomo' | 'revenge' | 'neutral' | '';
  exit_emotion: 'fear' | 'greed' | 'fomo' | 'revenge' | 'neutral' | '';
  followed_plan: boolean;
  plan_deviation_reason: string;
  is_fomo_trade: boolean;
  is_impulsive_exit: boolean;
}

const emptyFormData: FormData = {
  symbol: AVAILABLE_SYMBOLS[0],
  entry_price: "",
  exit_price: "",
  quantity: "",
  trade_type: "options",
  stop_loss: "",
  strategy: "",
  outcome: "profit",
  notes: "",
  entry_time: "",
  exit_time: "",
  chart_link: "",
  vix: "",
  call_iv: "",
  put_iv: "",
  strike_price: "",
  option_type: "",
  market_condition: "",
  timeframe: "",
  trade_direction: "",
  planned_risk_reward: "",
  actual_risk_reward: "",
  planned_target: "",
  exit_reason: "",
  slippage: "",
  post_exit_price: "",
  exit_efficiency: "",
  confidence_level: "",
  entry_emotion: "",
  exit_emotion: "",
  followed_plan: true,
  plan_deviation_reason: "",
  is_fomo_trade: false,
  is_impulsive_exit: false,
};

export default function TradeEntry() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState<FormData>(emptyFormData);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [selectedTrade, setSelectedTrade] = useState<Trade | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserId(user.id);
      }
    };
    getUser();
  }, []);

  const { data: trades = [], isLoading } = useQuery({
    queryKey: ['trades'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('trades')
        .select('*')
        .order('timestamp', { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });

  const checkTradeLimit = async (date: string) => {
    if (editingId) return true;
    
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
    
    return (existingTrades?.length || 0) < 2;
  };

  const addTrade = useMutation({
    mutationFn: async (newTrade: Omit<Trade, 'id' | 'timestamp'>) => {
      const canAddTrade = await checkTradeLimit(newTrade.entry_time || new Date().toISOString());
      if (!canAddTrade) {
        throw new Error("Daily trade limit reached (2 trades per day)");
      }

      const { data, error } = await supabase
        .from('trades')
        .insert([{ ...newTrade, user_id: userId }])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trades'] });
      toast({
        title: "Success",
        description: "Trade logged successfully!"
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to log trade. Please try again.",
        variant: "destructive"
      });
    }
  });

  const updateTrade = useMutation({
    mutationFn: async ({ id, ...trade }: Partial<Trade> & { id: string }) => {
      const { data, error } = await supabase
        .from('trades')
        .update({ ...trade, user_id: userId })
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trades'] });
      toast({
        title: "Success",
        description: "Trade updated successfully!"
      });
    },
    onError: (error) => {
      console.error('Update error:', error);
      toast({
        title: "Error",
        description: "Failed to update trade. Please try again.",
        variant: "destructive"
      });
    }
  });

  const deleteTrade = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('trades')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trades'] });
      toast({
        title: "Success",
        description: "Trade deleted successfully!"
      });
    },
    onError: (error) => {
      console.error('Delete error:', error);
      toast({
        title: "Error",
        description: "Failed to delete trade. Please try again.",
        variant: "destructive"
      });
    }
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!userId) {
      toast({
        title: "Error",
        description: "You must be logged in to log trades.",
        variant: "destructive"
      });
      return;
    }
    
    const tradeData = {
      ...formData,
      entry_price: parseFloat(formData.entry_price),
      exit_price: formData.exit_price ? parseFloat(formData.exit_price) : null,
      quantity: formData.quantity ? parseFloat(formData.quantity) : null,
      stop_loss: formData.stop_loss ? parseFloat(formData.stop_loss) : null,
      strike_price: formData.strike_price ? parseFloat(formData.strike_price) : null,
      planned_risk_reward: formData.planned_risk_reward ? parseFloat(formData.planned_risk_reward) : null,
      actual_risk_reward: formData.actual_risk_reward ? parseFloat(formData.actual_risk_reward) : null,
      planned_target: formData.planned_target ? parseFloat(formData.planned_target) : null,
      slippage: formData.slippage ? parseFloat(formData.slippage) : null,
      post_exit_price: formData.post_exit_price ? parseFloat(formData.post_exit_price) : null,
      exit_efficiency: formData.exit_efficiency ? parseFloat(formData.exit_efficiency) : null,
      confidence_level: formData.confidence_level ? parseInt(formData.confidence_level) : null,
      entry_time: formData.entry_time || null,
      exit_time: formData.exit_time || null,
      option_type: formData.option_type || null,
      market_condition: formData.market_condition || null,
      timeframe: formData.timeframe || null,
      trade_direction: formData.trade_direction || null,
      exit_reason: formData.exit_reason || null,
      slippage: formData.slippage || null,
      post_exit_price: formData.post_exit_price || null,
      exit_efficiency: formData.exit_efficiency || null,
      confidence_level: formData.confidence_level || null,
      entry_emotion: formData.entry_emotion || null,
      exit_emotion: formData.exit_emotion || null,
      followed_plan: formData.followed_plan,
      is_fomo_trade: formData.is_fomo_trade,
      is_impulsive_exit: formData.is_impulsive_exit,
    } as Omit<Trade, 'id' | 'timestamp'>;
    
    try {
      if (editingId) {
        await updateTrade.mutateAsync({ id: editingId, ...tradeData });
        setEditingId(null);
      } else {
        await addTrade.mutateAsync(tradeData);
      }
      
      setFormData(emptyFormData);
    } catch (error) {
      console.error('Form submission error:', error);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectChange = (name: string, value: string | boolean) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleEdit = (trade: Trade) => {
    setFormData({
      symbol: trade.symbol,
      entry_price: trade.entry_price.toString(),
      exit_price: trade.exit_price?.toString() ?? "",
      quantity: trade.quantity?.toString() ?? "",
      trade_type: trade.trade_type,
      stop_loss: trade.stop_loss?.toString() ?? "",
      strategy: trade.strategy ?? "",
      outcome: trade.outcome,
      notes: trade.notes ?? "",
      entry_time: trade.entry_time ? formatToLocalDateTime(trade.entry_time) : "",
      exit_time: trade.exit_time ? formatToLocalDateTime(trade.exit_time) : "",
      chart_link: trade.chart_link ?? "",
      vix: trade.vix ?? "",
      call_iv: trade.call_iv ?? "",
      put_iv: trade.put_iv ?? "",
      strike_price: trade.strike_price?.toString() ?? "",
      option_type: trade.option_type ?? "",
      market_condition: trade.market_condition ?? "",
      timeframe: trade.timeframe ?? "",
      trade_direction: trade.trade_direction ?? "",
      planned_risk_reward: trade.planned_risk_reward?.toString() ?? "",
      actual_risk_reward: trade.actual_risk_reward?.toString() ?? "",
      planned_target: trade.planned_target?.toString() ?? "",
      exit_reason: trade.exit_reason ?? "",
      slippage: trade.slippage?.toString() ?? "",
      post_exit_price: trade.post_exit_price?.toString() ?? "",
      exit_efficiency: trade.exit_efficiency?.toString() ?? "",
      confidence_level: trade.confidence_level?.toString() ?? "",
      entry_emotion: trade.entry_emotion ?? "",
      exit_emotion: trade.exit_emotion ?? "",
      followed_plan: trade.followed_plan ?? true,
      plan_deviation_reason: trade.plan_deviation_reason ?? "",
      is_fomo_trade: trade.is_fomo_trade ?? false,
      is_impulsive_exit: trade.is_impulsive_exit ?? false,
    });
    setEditingId(trade.id);
  };

  const handleDelete = async (id: string) => {
    await deleteTrade.mutateAsync(id);
  };

  const formatToLocalDateTime = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const offset = date.getTimezoneOffset();
    const localDate = new Date(date.getTime() - (offset * 60 * 1000));
    return localDate.toISOString().slice(0, 16);
  };

  const formatDisplayTime = (dateString: string) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  if (isLoading) return <LoadingSpinner />;

  return (
    <ErrorBoundary>
      <div className="space-y-6 animate-fade-in h-full overflow-y-auto scrollbar-none pb-6">
        <ImportTrades />
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <BasicTradeInfo
              formData={formData}
              handleChange={handleChange}
              handleSelectChange={handleSelectChange}
            />
            <MarketContext
              formData={formData}
              handleChange={handleChange}
              handleSelectChange={handleSelectChange}
            />
          </div>

          <BehavioralAnalysis
            formData={formData}
            handleChange={handleChange}
            handleSelectChange={handleSelectChange}
          />

          <div className="flex justify-end">
            <Button type="submit" className="w-full sm:w-auto">
              {editingId ? "Update Trade" : "Log Trade"}
            </Button>
          </div>
        </form>

        {trades.length > 0 && (
          <TradeHistory
            trades={trades}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onViewDetails={(trade) => {
              setSelectedTrade(trade);
              setIsDialogOpen(true);
            }}
          />
        )}

        <TradeDetailsDialog
          trade={selectedTrade}
          open={isDialogOpen}
          onOpenChange={setIsDialogOpen}
        />
      </div>
    </ErrorBoundary>
  );
}
