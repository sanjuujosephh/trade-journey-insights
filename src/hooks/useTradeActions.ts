
import { useNavigate } from "react-router-dom";
import { Trade } from "@/types/trade";

export function useTradeActions() {
  const navigate = useNavigate();

  const handleEdit = (trade: Trade) => {
    const formDataUpdate = {
      entry_price: trade.entry_price.toString(),
      exit_price: trade.exit_price?.toString() || "",
      quantity: trade.quantity?.toString() || "",
      stop_loss: trade.stop_loss?.toString() || "",
      strike_price: trade.strike_price?.toString() || "",
      vix: trade.vix?.toString() || "",
      call_iv: trade.call_iv?.toString() || "",
      put_iv: trade.put_iv?.toString() || "",
      pcr: trade.pcr?.toString() || "", // Added PCR field
      planned_risk_reward: "",
      actual_risk_reward: "",
      strategy: trade.strategy || "",
      outcome: trade.outcome,
      notes: trade.notes || "",
      trade_type: trade.trade_type,
      entry_time: trade.entry_time || "",
      exit_time: trade.exit_time || "",
      entry_date: trade.entry_date || "",
      exit_date: "",
      timeframe: trade.timeframe || "",
      chart_link: trade.chart_link || "",
      confidence_level: trade.confidence_level?.toString() || "",
      option_type: trade.option_type || "",
      trade_direction: trade.trade_direction || "",
      vwap_position: trade.vwap_position || "",
      ema_position: trade.ema_position || "",
      market_condition: trade.market_condition || "",
      exit_reason: trade.exit_reason || "",
      entry_emotion: trade.entry_emotion || "",
      exit_emotion: trade.exit_emotion || "",
      symbol: trade.symbol,
    };

    navigate('/trades/edit/' + trade.id, {
      state: {
        initialFormData: formDataUpdate,
        tradeId: trade.id
      }
    });
  };

  const handleView = (tradeId: string) => {
    navigate(`/trades/${tradeId}`);
  };

  return { handleEdit, handleView };
}
