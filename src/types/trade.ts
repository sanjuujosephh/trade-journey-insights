
export interface Trade {
  id: string;
  entry_price: number;
  exit_price?: number | null;
  quantity?: number | null;
  outcome: 'profit' | 'loss' | 'breakeven';
  strategy?: string | null;
  trade_type: string;
  entry_time?: string | null;
  exit_time?: string | null;
  timestamp: string;
  stop_loss?: number | null;
  symbol: string;
  notes?: string | null;
  chart_link?: string | null;
  
  // VIX and IV fields
  vix?: number | null;
  call_iv?: number | null;
  put_iv?: number | null;
  
  // New Option Price Position fields
  vwap_position?: 'above_vwap' | 'below_vwap' | null;
  ema_position?: 'above_20ema' | 'below_20ema' | null;
  
  // Trade Execution Details
  strike_price?: number | null;
  option_type?: 'call' | 'put' | null;
  
  // Trade Context
  market_condition?: 'trending' | 'ranging' | 'news_driven' | 'volatile' | null;
  timeframe?: '1min' | '5min' | '15min' | '1hr' | null;
  trade_direction?: 'long' | 'short' | null;
  planned_risk_reward?: number | null;
  actual_risk_reward?: number | null;
  
  // Risk Management & Exit Details
  planned_target?: number | null;
  exit_reason?: 'stop_loss' | 'target' | 'manual' | 'time_based' | null;
  
  // Trade Behavior Tracking
  slippage?: number | null;
  post_exit_price?: number | null;
  exit_efficiency?: number | null;
  
  // Psychological & Behavioral Data
  confidence_level?: number | null;
  entry_emotion?: 'fear' | 'greed' | 'fomo' | 'revenge' | 'neutral' | null;
  exit_emotion?: 'fear' | 'greed' | 'fomo' | 'revenge' | 'neutral' | null;
  followed_plan?: boolean;
  plan_deviation_reason?: string | null;
  is_fomo_trade?: boolean;
  is_impulsive_exit?: boolean;
  user_id?: string;
  
  // AI Analysis Fields
  ai_feedback?: string | null;
  what_if_analysis?: Record<string, any> | null;
}

export interface FormData {
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
  
  // New Option Price Position fields
  vwap_position: 'above_vwap' | 'below_vwap' | '';
  ema_position: 'above_20ema' | 'below_20ema' | '';
  
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
