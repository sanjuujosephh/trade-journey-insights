
export interface Trade {
  id: string;
  user_id: string;
  timestamp: string;
  entry_price: number;
  exit_price: number | null;
  quantity: number | null;
  trade_type: 'options' | 'futures' | 'equity';
  stop_loss: number | null;
  strategy: string | null;
  outcome: 'profit' | 'loss' | 'breakeven';
  notes: string | null;
  entry_time: string | null;
  exit_time: string | null;
  chart_link: string | null;
  vix: number | null;
  call_iv: number | null;
  put_iv: number | null;
  pcr: number | null;
  strike_price: number | null;
  option_type: 'call' | 'put' | null;
  vwap_position: 'above' | 'below' | 'at' | null;
  ema_position: 'above' | 'below' | 'at' | null;
  market_condition: 'trending' | 'ranging' | 'volatile' | 'news_driven' | null;
  timeframe: string | null;
  trade_direction: 'long' | 'short' | null;
  exit_reason: 'stop_loss' | 'target_reached' | 'manual' | 'time_based' | null;
  confidence_level: number | null;
  entry_emotion: string | null;
  exit_emotion: string | null;
  symbol: string;
  entry_date: string | null;
  ai_feedback: string | null;
  is_impulsive: boolean | null;
  plan_deviation: boolean | null;
  satisfaction_score: number | null;
  stress_level: number | null;
  time_pressure: 'high' | 'medium' | 'low' | null;
}
