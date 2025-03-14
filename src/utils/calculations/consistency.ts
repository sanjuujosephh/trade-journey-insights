
import { Trade } from "@/types/trade";

export const calculateConsistencyScore = (trades: Trade[]) => {
  if (trades.length === 0) return "0";
  
  let score = 100;
  
  // Group trades by date
  const tradesByDate = trades.reduce((acc: { [key: string]: Trade[] }, trade) => {
    const date = new Date(trade.entry_time || trade.timestamp).toLocaleDateString();
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(trade);
    return acc;
  }, {});

  // Analyze daily trading patterns
  Object.values(tradesByDate).forEach(dayTrades => {
    // Penalize for overtrading (more than 3 trades per day)
    if (dayTrades.length > 3) {
      score -= 5 * (dayTrades.length - 3);
    }

    // Penalize for trades without stop loss
    const tradesWithoutStopLoss = dayTrades.filter(t => !t.stop_loss).length;
    score -= (tradesWithoutStopLoss / dayTrades.length) * 15;

    // Check for proper trade timing (market hours 9:15 AM to 3:30 PM IST)
    const tradesOutsideHours = dayTrades.filter(trade => {
      const entryTime = new Date(trade.entry_time || trade.timestamp);
      const hours = entryTime.getHours();
      const minutes = entryTime.getMinutes();
      const timeInMinutes = hours * 60 + minutes;
      return timeInMinutes < 555 || timeInMinutes > 930; // 9:15 AM = 555, 3:30 PM = 930
    }).length;
    
    score -= (tradesOutsideHours / dayTrades.length) * 20;
  });
  
  return Math.max(0, Math.min(100, score)).toFixed(1);
};
