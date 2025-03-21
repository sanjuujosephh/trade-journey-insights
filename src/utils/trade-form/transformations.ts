
import type { FormData, Trade } from "@/types/trade";

const sanitizeNumber = (value: string): number | null => {
  if (!value) return null;
  const num = parseFloat(value);
  return isNaN(num) ? null : num;
};

export const transformTradeData = (formData: FormData): Omit<Trade, 'id' | 'timestamp'> => {
  // Validate exit_reason to ensure it's one of the allowed values
  let exitReason = formData.exit_reason || null;
  if (exitReason && !['stop_loss', 'target_reached', 'manual', 'time_based'].includes(exitReason)) {
    exitReason = null;
  }

  return {
    entry_price: parseFloat(formData.entry_price),
    exit_price: sanitizeNumber(formData.exit_price),
    quantity: sanitizeNumber(formData.quantity),
    trade_type: formData.trade_type,
    stop_loss: sanitizeNumber(formData.stop_loss),
    strategy: formData.strategy || null,
    outcome: formData.outcome,
    notes: formData.notes || null,
    entry_time: formData.entry_time || null,
    exit_time: formData.exit_time || null,
    chart_link: formData.chart_link || null,
    vix: sanitizeNumber(formData.vix),
    call_iv: sanitizeNumber(formData.call_iv),
    put_iv: sanitizeNumber(formData.put_iv),
    pcr: sanitizeNumber(formData.pcr),
    strike_price: sanitizeNumber(formData.strike_price),
    option_type: formData.option_type || null,
    vwap_position: formData.vwap_position || null,
    ema_position: formData.ema_position || null,
    market_condition: (formData.market_condition || null) as 'trending' | 'ranging' | 'volatile' | 'news_driven' | null,
    timeframe: formData.timeframe || null,
    trade_direction: formData.trade_direction || null,
    exit_reason: exitReason as 'stop_loss' | 'target_reached' | 'manual' | 'time_based' | null,
    confidence_level: sanitizeNumber(formData.confidence_level),
    entry_emotion: formData.entry_emotion || null,
    exit_emotion: formData.exit_emotion || null,
    symbol: formData.symbol,
    entry_date: formData.entry_date || null,
    ai_feedback: null,
    is_impulsive: formData.is_impulsive || null,
    plan_deviation: formData.plan_deviation || null,
    satisfaction_score: sanitizeNumber(formData.satisfaction_score),
    stress_level: sanitizeNumber(formData.stress_level),
    time_pressure: formData.time_pressure || null,
    user_id: ""  // This will be properly set in the mutation
  };
};
