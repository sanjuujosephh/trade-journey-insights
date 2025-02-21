
import { FormData, Trade } from "@/types/trade";

export const transformTradeData = (formData: FormData): Omit<Trade, 'id' | 'timestamp'> => {
  return {
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
    strategy: formData.strategy || null,
    notes: formData.notes || null,
    chart_link: formData.chart_link || null,
    symbol: formData.symbol,
    trade_type: formData.trade_type,
    outcome: formData.outcome,
  };
};
