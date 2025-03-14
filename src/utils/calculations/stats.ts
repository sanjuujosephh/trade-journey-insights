
import { Trade } from "@/types/trade";
import { calculateDrawdowns } from "./drawdowns";
import { calculateConsistencyScore } from "./consistency";

export const calculateStats = (trades: Trade[]) => {
  // Group trades by date
  const tradesByDate = trades.reduce((acc: { [key: string]: Trade[] }, trade) => {
    const date = new Date(trade.entry_time || trade.timestamp).toLocaleDateString();
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(trade);
    return acc;
  }, {});

  const completedTrades = trades.filter(trade => trade.exit_price !== null && trade.quantity !== null);
  
  if (completedTrades.length === 0) {
    return {
      winRate: "0%",
      avgProfit: "₹0",
      avgLoss: "₹0",
      riskReward: "0",
      maxDrawdown: "0%",
      consistencyScore: "0%",
    };
  }

  // Calculate daily stats
  const dailyStats = Object.entries(tradesByDate).map(([date, dayTrades]) => {
    const profitTrades = dayTrades.filter(t => t.outcome === "profit");
    const lossTrades = dayTrades.filter(t => t.outcome === "loss");
    const dailyPnL = dayTrades
      .filter(t => t.exit_price && t.quantity)
      .reduce((sum, t) => sum + ((t.exit_price! - t.entry_price) * t.quantity!), 0);
    
    return {
      date,
      winRate: profitTrades.length / dayTrades.length,
      pnl: dailyPnL,
      trades: dayTrades.length
    };
  });

  const avgDailyWinRate = dailyStats.reduce((sum, day) => sum + day.winRate, 0) / dailyStats.length;
  const profitDays = dailyStats.filter(day => day.pnl > 0);
  const lossDays = dailyStats.filter(day => day.pnl < 0);

  const avgProfitDay = profitDays.length > 0
    ? profitDays.reduce((sum, day) => sum + day.pnl, 0) / profitDays.length
    : 0;

  const avgLossDay = lossDays.length > 0
    ? Math.abs(lossDays.reduce((sum, day) => sum + day.pnl, 0) / lossDays.length)
    : 0;

  return {
    winRate: `${(avgDailyWinRate * 100).toFixed(1)}%`,
    avgProfit: `₹${avgProfitDay.toFixed(2)}`,
    avgLoss: `₹${avgLossDay.toFixed(2)}`,
    riskReward: avgLossDay !== 0 ? (avgProfitDay / avgLossDay).toFixed(2) : "0",
    maxDrawdown: `${Math.max(...calculateDrawdowns(trades).map(d => d.drawdown)).toFixed(1)}%`,
    consistencyScore: `${calculateConsistencyScore(trades)}%`,
  };
};
