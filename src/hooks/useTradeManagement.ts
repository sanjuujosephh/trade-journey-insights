
import { useTradeForm } from "./useTradeForm";
import { useTradeOperations } from "./useTradeOperations";
import { useTradeSubmission } from "./useTradeSubmission";
import { Trade } from "@/types/trade";
import { useToast } from "./use-toast";

export function useTradeManagement() {
  const { toast } = useToast();
  
  const {
    formData,
    editingId,
    selectedTrade,
    isDialogOpen,
    setSelectedTrade,
    setIsDialogOpen,
    setFormData,
    setEditingId,
    handleChange,
    handleSelectChange,
    resetForm,
  } = useTradeForm();

  const {
    trades,
    isLoading,
    addTrade,
    updateTrade,
  } = useTradeOperations();

  const { submitTrade, isSubmitting } = useTradeSubmission({
    addTrade,
    updateTrade,
    resetForm
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await submitTrade(formData, editingId);
  };

  const handleEdit = (trade: Trade) => {
    setFormData({
      symbol: trade.symbol || "",
      entry_price: trade.entry_price?.toString() || "",
      exit_price: trade.exit_price?.toString() || "",
      quantity: trade.quantity?.toString() || "",
      trade_type: trade.trade_type || "options",
      stop_loss: trade.stop_loss?.toString() || "",
      strategy: trade.strategy || "",
      outcome: trade.outcome || "profit",
      notes: trade.notes || "",
      entry_date: trade.entry_date || "",
      entry_time: trade.entry_time || "",
      exit_time: trade.exit_time || "",
      chart_link: trade.chart_link || "",
      vix: trade.vix?.toString() || "",
      call_iv: trade.call_iv?.toString() || "",
      put_iv: trade.put_iv?.toString() || "",
      pcr: trade.pcr?.toString() || "",
      vwap_position: (trade.vwap_position || "") as "" | "above" | "below" | "at",
      ema_position: (trade.ema_position || "") as "" | "above" | "below" | "at",
      strike_price: trade.strike_price?.toString() || "",
      option_type: (trade.option_type || "") as "" | "call" | "put",
      market_condition: (trade.market_condition || "") as string,
      timeframe: (trade.timeframe || "") as string,
      trade_direction: (trade.trade_direction || "") as "" | "long" | "short",
      exit_reason: (trade.exit_reason || "") as string,
      confidence_level: trade.confidence_level?.toString() || "",
      entry_emotion: (trade.entry_emotion || "") as string,
      exit_emotion: (trade.exit_emotion || "") as string,
      is_impulsive: trade.is_impulsive || false,
      plan_deviation: trade.plan_deviation || false,
      satisfaction_score: trade.satisfaction_score?.toString() || "",
      stress_level: trade.stress_level?.toString() || "",
      time_pressure: (trade.time_pressure || "") as "" | "high" | "medium" | "low",
    });
    
    setEditingId(trade.id);
    
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
    
    toast({
      title: "Editing Trade",
      description: `Editing ${trade.symbol} trade from ${trade.entry_date}`,
      duration: 3000,
    });
  };

  const handleViewDetails = (trade: Trade) => {
    setSelectedTrade(trade);
    setIsDialogOpen(true);
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
  };

  return {
    formData,
    editingId,
    selectedTrade,
    isDialogOpen,
    isSubmitting,
    trades,
    isLoading,
    setSelectedTrade,
    setIsDialogOpen,
    setFormData,
    setEditingId,
    handleChange,
    handleSelectChange,
    handleSubmit,
    handleEdit,
    handleViewDetails,
    closeDialog,
    resetForm,
  };
}
