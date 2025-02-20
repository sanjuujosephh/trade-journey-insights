
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
  
  // AI Analysis Fields
  ai_feedback?: string | null;
  what_if_analysis?: Record<string, any> | null;
}
