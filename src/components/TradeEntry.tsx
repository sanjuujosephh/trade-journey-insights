import { useState, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { TradeDetailsDialog } from "./TradeDetailsDialog";
import { Trade, FormData } from "@/types/trade";
import { BasicTradeInfo } from "./trade-form/BasicTradeInfo";
import { MarketContext } from "./trade-form/MarketContext";
import { BehavioralAnalysis } from "./trade-form/BehavioralAnalysis";
import { TradeHistory } from "./trade-form/TradeHistory";
import { LoadingSpinner } from "./LoadingSpinner";
import { ErrorBoundary } from "./ErrorBoundary";
import { ImportTrades } from "./trade-form/ImportTrades";
import { validateTradeForm } from "./trade-form/TradeFormValidation";
import { AVAILABLE_SYMBOLS, AVAILABLE_STRATEGIES } from "@/constants/tradeConstants";

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
  vwap_position: "",
  ema_position: "",
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

  const checkTradeLimit = useCallback(async (date: string) => {
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
  }, [editingId, userId]);

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserId(user.id);
      }
    };
    getUser();
  }, []);

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
      setFormData(emptyFormData);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to log trade",
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
      setEditingId(null);
      setFormData(emptyFormData);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update trade",
        variant: "destructive"
      });
    }
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const errors = validateTradeForm(formData);
    if (errors.length > 0) {
      toast({
        title: "Validation Error",
        description: errors.join(", "),
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
      vix: formData.vix ? parseFloat(formData.vix) : null,
      call_iv: formData.call_iv ? parseFloat(formData.call_iv) : null,
      put_iv: formData.put_iv ? parseFloat(formData.put_iv) : null,
      vwap_position: formData.vwap_position || null,
      ema_position: formData.ema_position || null,
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
      entry_emotion: formData.entry_emotion || null,
      exit_emotion: formData.exit_emotion || null,
      followed_plan: formData.followed_plan,
      is_fomo_trade: formData.is_fomo_trade,
      is_impulsive_exit: formData.is_impulsive_exit,
      strategy: formData.strategy || null,
      notes: formData.notes || null,
      chart_link: formData.chart_link || null
    } as Omit<Trade, 'id' | 'timestamp'>;
    
    try {
      if (editingId) {
        await updateTrade.mutateAsync({ id: editingId, ...tradeData });
      } else {
        await addTrade.mutateAsync(tradeData);
      }
    } catch (error) {
      console.error('Form submission error:', error);
    }
  };

  const handleChange = useCallback((
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  }, []);

  const handleSelectChange = useCallback((name: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  }, []);

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
            onEdit={(trade) => {
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
                vix: trade.vix?.toString() ?? "",
                call_iv: trade.call_iv?.toString() ?? "",
                put_iv: trade.put_iv?.toString() ?? "",
                strike_price: trade.strike_price?.toString() ?? "",
                option_type: trade.option_type ?? "",
                vwap_position: trade.vwap_position ?? "",
                ema_position: trade.ema_position ?? "",
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
            }}
            onDelete={async (id) => {
              const { error } = await supabase
                .from('trades')
                .delete()
                .eq('id', id);
              
              if (error) {
                toast({
                  title: "Error",
                  description: "Failed to delete trade",
                  variant: "destructive"
                });
                return;
              }
              
              queryClient.invalidateQueries({ queryKey: ['trades'] });
              toast({
                title: "Success",
                description: "Trade deleted successfully!"
              });
            }}
            onViewDetails={setSelectedTrade}
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
