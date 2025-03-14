
import { Trade, FormData } from "@/types/trade";
import { useCallback } from "react";

interface UseTradeActionsProps {
  setFormData: (data: FormData) => void;
  setEditingId: (id: string | null) => void;
  setSelectedTrade: (trade: Trade | null) => void;
  setIsDialogOpen: (isOpen: boolean) => void;
  resetForm: () => void;
}

export function useTradeActions({
  setFormData,
  setEditingId,
  setSelectedTrade,
  setIsDialogOpen,
  resetForm
}: UseTradeActionsProps) {
  const handleEdit = useCallback((trade: Trade) => {
    console.log('Raw trade data for edit:', trade);
    
    const formDataUpdate: FormData = {
      entry_price: trade.entry_price.toString(),
      exit_price: trade.exit_price?.toString() ?? "",
      quantity: trade.quantity?.toString() ?? "",
      stop_loss: trade.stop_loss?.toString() ?? "",
      strike_price: trade.strike_price?.toString() ?? "",
      vix: trade.vix?.toString() ?? "",
      call_iv: trade.call_iv?.toString() ?? "",
      put_iv: trade.put_iv?.toString() ?? "",
      pcr: trade.pcr?.toString() ?? "", // Added the PCR field here
      planned_risk_reward: trade.planned_risk_reward?.toString() ?? "",
      actual_risk_reward: trade.actual_risk_reward?.toString() ?? "",
      planned_target: trade.planned_target?.toString() ?? "",
      slippage: trade.slippage?.toString() ?? "",
      post_exit_price: trade.post_exit_price?.toString() ?? "",
      exit_efficiency: trade.exit_efficiency?.toString() ?? "",
      confidence_level: trade.confidence_level?.toString() ?? "",
      entry_time: trade.entry_time ?? "",
      exit_time: trade.exit_time ?? "",
      entry_date: trade.entry_date ?? "",
      exit_date: trade.exit_date ?? "",
      strategy: trade.strategy ?? "",
      trade_type: trade.trade_type,
      symbol: trade.symbol,
      outcome: trade.outcome,
      notes: trade.notes ?? "",
      chart_link: trade.chart_link ?? "",
      vwap_position: trade.vwap_position ?? "",
      ema_position: trade.ema_position ?? "",
      market_condition: trade.market_condition ?? "",
      timeframe: trade.timeframe ?? "",
      trade_direction: trade.trade_direction ?? "",
      exit_reason: trade.exit_reason ?? "",
      entry_emotion: trade.entry_emotion ?? "",
      exit_emotion: trade.exit_emotion ?? "",
      option_type: trade.option_type ?? ""
    };
    
    console.log('Setting form data for edit:', formDataUpdate);
    setFormData(formDataUpdate);
    setEditingId(trade.id);
  }, [setFormData, setEditingId]);

  const handleViewDetails = useCallback((trade: Trade) => {
    setSelectedTrade(trade);
    setIsDialogOpen(true);
  }, [setSelectedTrade, setIsDialogOpen]);

  const closeDialog = useCallback(() => {
    setIsDialogOpen(false);
    setSelectedTrade(null);
  }, [setIsDialogOpen, setSelectedTrade]);

  return {
    handleEdit,
    handleViewDetails,
    closeDialog
  };
}
