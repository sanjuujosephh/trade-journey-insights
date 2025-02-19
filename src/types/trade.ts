
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
}
