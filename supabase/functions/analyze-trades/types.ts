
export interface Trade {
  id?: string;
  user_id?: string;
  symbol?: string;
  entry_date?: string;
  entry_time?: string;
  exit_date?: string;
  exit_time?: string;
  entry_price?: number;
  exit_price?: number;
  quantity?: number;
  direction?: string;
  trade_type?: string;
  trade_direction?: string;
  timeframe?: string;
  strategy?: string;
  market_condition?: string;
  entry_reason?: string;
  exit_reason?: string;
  entry_emotion?: string;
  exit_emotion?: string;
  outcome?: string;
  notes?: string;
  emotional_score?: number;
  overall_emotional_state?: string;
  confidence_level_score?: number;
  timestamp?: string;
  created_at?: string;
  updated_at?: string;
}
