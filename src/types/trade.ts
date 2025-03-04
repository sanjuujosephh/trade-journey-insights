
export interface Trade {
  id: string;
  entry_price: number;
  exit_price?: number | null;
  quantity?: number | null;
  outcome: 'profit' | 'loss' | 'breakeven';
  strategy?: string | null;
  trade_type: string;
  entry_date?: string | null;
  exit_date?: string | null;
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
  
  // Option Price Position fields
  vwap_position?: 'above_vwap' | 'below_vwap' | null;
  ema_position?: 'above_20ema' | 'below_20ema' | null;
  
  // Trade Execution Details
  strike_price?: number | null;
  option_type?: 'call' | 'put' | null;
  
  // Trade Context
  market_condition?: 'trending' | 'ranging' | 'news_driven' | 'volatile' | null;
  timeframe?: '1min' | '5min' | '15min' | '1hr' | null;
  trade_direction?: 'long' | 'short' | null;

  // Risk Management & Exit Details
  exit_reason?: 'stop_loss' | 'target' | 'manual' | 'time_based' | null;
  planned_risk_reward?: number | null;
  actual_risk_reward?: number | null;
  planned_target?: number | null;
  slippage?: number | null;
  post_exit_price?: number | null;
  exit_efficiency?: number | null;
  
  // Trade Behavior Tracking
  confidence_level?: number | null;
  confidence_level_score?: number | null;
  entry_emotion?: 'fear' | 'greed' | 'fomo' | 'revenge' | 'neutral' | 'confident' | null;
  exit_emotion?: 'satisfied' | 'regretful' | 'relieved' | 'frustrated' | null;
  emotional_score?: number | null;
  overall_emotional_state?: 'positive' | 'negative' | 'neutral' | null;
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
  entry_date: string;
  exit_date: string;
  entry_time: string;
  exit_time: string;
  chart_link: string;
  
  // Market fields
  vix: string;
  call_iv: string;
  put_iv: string;
  
  // Option Price Position fields
  vwap_position: 'above_vwap' | 'below_vwap' | '';
  ema_position: 'above_20ema' | 'below_20ema' | '';
  
  strike_price: string;
  option_type: 'call' | 'put' | '';
  market_condition: 'trending' | 'ranging' | 'news_driven' | 'volatile' | '';
  timeframe: '1min' | '5min' | '15min' | '1hr' | '';
  trade_direction: 'long' | 'short' | '';
  exit_reason: 'stop_loss' | 'target' | 'manual' | 'time_based' | '';
  confidence_level: string;
  entry_emotion: 'fear' | 'greed' | 'fomo' | 'revenge' | 'neutral' | 'confident' | '';
  exit_emotion: 'satisfied' | 'regretful' | 'relieved' | 'frustrated' | '';
  
  // Risk Management & Performance Metrics
  planned_risk_reward: string;
  actual_risk_reward: string;
  planned_target: string;
  slippage: string;
  post_exit_price: string;
  exit_efficiency: string;
}
