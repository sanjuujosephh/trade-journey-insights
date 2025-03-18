
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
  // New behavioral fields
  is_impulsive: boolean | null;
  plan_deviation: boolean | null;
  satisfaction_score: number | null;
  stress_level: number | null;
  time_pressure: 'high' | 'medium' | 'low' | null;
}

export interface FormData {
  entry_price: string;
  exit_price: string;
  quantity: string;
  stop_loss: string;
  strike_price: string;
  vix: string;
  call_iv: string;
  put_iv: string;
  pcr: string;
  strategy: string;
  outcome: 'profit' | 'loss' | 'breakeven';
  notes: string;
  trade_type: 'options' | 'futures' | 'equity';
  entry_time: string;
  exit_time: string;
  entry_date: string;
  timeframe: string;
  chart_link: string;
  confidence_level: string;
  option_type: 'call' | 'put' | '';
  trade_direction: 'long' | 'short' | '';
  vwap_position: 'above' | 'below' | 'at' | '';
  ema_position: 'above' | 'below' | 'at' | '';
  market_condition: string;
  exit_reason: string;
  entry_emotion: string;
  exit_emotion: string;
  symbol: string;
  // New behavioral fields
  is_impulsive: boolean;
  plan_deviation: boolean;
  satisfaction_score: string;
  stress_level: string;
  time_pressure: 'high' | 'medium' | 'low' | '';
}
