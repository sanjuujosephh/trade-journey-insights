
import { Trade } from "@/types/trade";

export const calculateTradeDurationStats = (trades: Trade[]) => {
  const validTrades = trades.filter(t => t.entry_time && t.exit_time && t.exit_price && t.quantity);
  
  // Group trades by date
  const tradesByDate = validTrades.reduce((acc: { [key: string]: any[] }, trade) => {
    const date = new Date(trade.entry_time!).toLocaleDateString();
    if (!acc[date]) {
      acc[date] = [];
    }
    
    const duration = (new Date(trade.exit_time!).getTime() - new Date(trade.entry_time!).getTime()) / (1000 * 60); // Convert to minutes
    const pnl = (trade.exit_price! - trade.entry_price) * trade.quantity!;
    
    acc[date].push({ duration, pnl });
    return acc;
  }, {});

  // Calculate average duration and PnL for each day
  return Object.entries(tradesByDate).map(([date, trades]) => {
    const avgDuration = trades.reduce((sum, t) => sum + t.duration, 0) / trades.length;
    const totalPnL = trades.reduce((sum, t) => sum + t.pnl, 0);
    return {
      date,
      duration: Math.round(avgDuration),
      avgPnL: parseFloat(totalPnL.toFixed(2)),
      trades: trades.length
    };
  }).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
};
