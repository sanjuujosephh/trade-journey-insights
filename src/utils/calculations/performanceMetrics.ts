
import { Trade } from "@/types/trade";

export const calculateTradeDurationStats = (trades: Trade[]) => {
  const validTrades = trades.filter(t => t.entry_time && t.exit_time && t.exit_price && t.quantity);
  
  const tradesByDate = validTrades.reduce((acc: { [key: string]: any[] }, trade) => {
    const date = new Date(trade.entry_time!).toLocaleDateString();
    if (!acc[date]) {
      acc[date] = [];
    }
    
    const duration = (new Date(trade.exit_time!).getTime() - new Date(trade.entry_time!).getTime()) / (1000 * 60);
    const pnl = (trade.exit_price! - trade.entry_price) * trade.quantity!;
    
    acc[date].push({ duration, pnl });
    return acc;
  }, {});

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

export const calculateConsistencyScore = (trades: Trade[]) => {
  if (trades.length === 0) return "0";
  
  let score = 100;
  
  const tradesByDate = trades.reduce((acc: { [key: string]: Trade[] }, trade) => {
    const date = new Date(trade.entry_time || trade.timestamp).toLocaleDateString();
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(trade);
    return acc;
  }, {});

  Object.values(tradesByDate).forEach(dayTrades => {
    if (dayTrades.length > 3) {
      score -= 5 * (dayTrades.length - 3);
    }

    const tradesWithoutStopLoss = dayTrades.filter(t => !t.stop_loss).length;
    score -= (tradesWithoutStopLoss / dayTrades.length) * 15;

    const tradesOutsideHours = dayTrades.filter(trade => {
      const entryTime = new Date(trade.entry_time || trade.timestamp);
      const hours = entryTime.getHours();
      const minutes = entryTime.getMinutes();
      const timeInMinutes = hours * 60 + minutes;
      return timeInMinutes < 555 || timeInMinutes > 930;
    }).length;
    
    score -= (tradesOutsideHours / dayTrades.length) * 20;
  });
  
  return Math.max(0, Math.min(100, score)).toFixed(1);
};
