
import { Trade } from "@/types/trade";

export const calculateSharpeRatio = (returns: number[]) => {
  if (returns.length === 0) return 0;
  const avgReturn = returns.reduce((a, b) => a + b, 0) / returns.length;
  const variance = returns.reduce((a, b) => a + Math.pow(b - avgReturn, 2), 0) / returns.length;
  const stdDev = Math.sqrt(variance);
  return stdDev === 0 ? 0 : (avgReturn / stdDev) * Math.sqrt(252); // Annualized
};

export const calculateExpectancy = (trades: Trade[]) => {
  const completedTrades = trades.filter(t => t.exit_price && t.quantity);
  if (completedTrades.length === 0) return 0;

  const winningTrades = completedTrades.filter(t => t.outcome === 'profit');
  const losingTrades = completedTrades.filter(t => t.outcome === 'loss');

  const avgWin = winningTrades.reduce((sum, t) => {
    return sum + ((t.exit_price! - t.entry_price) * t.quantity!);
  }, 0) / (winningTrades.length || 1);

  const avgLoss = losingTrades.reduce((sum, t) => {
    return sum + Math.abs((t.exit_price! - t.entry_price) * t.quantity!);
  }, 0) / (losingTrades.length || 1);

  const winRate = winningTrades.length / completedTrades.length;
  return (winRate * avgWin) - ((1 - winRate) * avgLoss);
};

export const calculateEquityCurve = (trades: Trade[]) => {
  let balance = 0;
  return trades
    .filter(trade => trade.exit_price && trade.quantity)
    .map(trade => {
      const pnl = (trade.exit_price! - trade.entry_price) * trade.quantity!;
      balance += pnl;
      return {
        date: new Date(trade.entry_time || trade.timestamp).toLocaleDateString(),
        balance: parseFloat(balance.toFixed(2))
      };
    });
};

export const calculateDrawdowns = (trades: Trade[]) => {
  let peak = 0;
  let balance = 0;
  return trades
    .filter(trade => trade.exit_price && trade.quantity)
    .map(trade => {
      const pnl = (trade.exit_price! - trade.entry_price) * trade.quantity!;
      balance += pnl;
      
      if (balance > peak) {
        peak = balance;
      }
      
      const drawdown = peak > 0 ? ((peak - balance) / peak) * 100 : 0;
      return {
        date: new Date(trade.entry_time || trade.timestamp).toLocaleDateString(),
        drawdown: parseFloat(drawdown.toFixed(2))
      };
    });
};

export const calculateStreaks = (trades: Trade[]) => {
  let currentStreak = 0;
  let currentType = '';
  const streaks = [];
  
  for (const trade of trades) {
    if (trade.outcome === currentType) {
      currentStreak++;
    } else {
      if (currentStreak > 0) {
        streaks.push({
          type: currentType,
          length: currentStreak
        });
      }
      currentType = trade.outcome;
      currentStreak = 1;
    }
  }
  
  if (currentStreak > 0) {
    streaks.push({
      type: currentType,
      length: currentStreak
    });
  }

  return streaks;
};

export const calculateTradeDurationStats = (trades: Trade[]) => {
  const validTrades = trades.filter(t => t.entry_time && t.exit_time && t.exit_price && t.quantity);
  
  const durationData = validTrades.map(trade => {
    const duration = (new Date(trade.exit_time!).getTime() - new Date(trade.entry_time!).getTime()) / (1000 * 60); // Convert to minutes
    const pnl = (trade.exit_price! - trade.entry_price) * trade.quantity!;
    return { duration, pnl };
  });

  // Group by 30-minute intervals
  const groupedData = durationData.reduce((acc: any[], data) => {
    const durationRange = Math.floor(data.duration / 30) * 30;
    const existing = acc.find(item => item.duration === durationRange);
    
    if (existing) {
      existing.trades++;
      existing.totalPnL += data.pnl;
      existing.avgPnL = existing.totalPnL / existing.trades;
    } else {
      acc.push({
        duration: durationRange,
        trades: 1,
        totalPnL: data.pnl,
        avgPnL: data.pnl
      });
    }
    
    return acc;
  }, []);

  return groupedData.sort((a, b) => a.duration - b.duration);
};

export const calculateStats = (trades: Trade[]) => {
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

  const profitTrades = completedTrades.filter(trade => trade.outcome === "profit");
  const lossTrades = completedTrades.filter(trade => trade.outcome === "loss");

  const winRate = ((profitTrades.length / completedTrades.length) * 100).toFixed(1);

  const avgProfit = profitTrades.length > 0
    ? (profitTrades.reduce((sum, trade) => {
        return sum + ((trade.exit_price! - trade.entry_price) * trade.quantity!);
      }, 0) / profitTrades.length).toFixed(2)
    : "0";

  const avgLoss = lossTrades.length > 0
    ? Math.abs(lossTrades.reduce((sum, trade) => {
        return sum + ((trade.exit_price! - trade.entry_price) * trade.quantity!);
      }, 0) / lossTrades.length).toFixed(2)
    : "0";

  const riskReward = avgLoss !== "0"
    ? (parseFloat(avgProfit) / parseFloat(avgLoss)).toFixed(2)
    : "0";

  const drawdowns = calculateDrawdowns(completedTrades);
  const maxDrawdown = drawdowns.length > 0
    ? Math.max(...drawdowns.map(d => d.drawdown)).toFixed(1)
    : "0";

  const consistencyScore = calculateConsistencyScore(completedTrades);

  return {
    winRate: `${winRate}%`,
    avgProfit: `₹${avgProfit}`,
    avgLoss: `₹${avgLoss}`,
    riskReward,
    maxDrawdown: `${maxDrawdown}%`,
    consistencyScore: `${consistencyScore}%`,
  };
};

export const calculateConsistencyScore = (trades: Trade[]) => {
  if (trades.length === 0) return "0";
  
  let score = 100;
  
  // Penalize for trades without stop loss
  const tradesWithoutStopLoss = trades.filter(t => !t.stop_loss).length;
  score -= (tradesWithoutStopLoss / trades.length) * 30;

  // Penalize for overtrading (more than 3 trades per day)
  const tradeDates = trades.map(t => new Date(t.timestamp).toDateString());
  const uniqueDates = new Set(tradeDates);
  const overtradingDays = Array.from(uniqueDates).filter(date => 
    tradeDates.filter(d => d === date).length > 3
  ).length;
  
  if (uniqueDates.size > 0) {
    score -= (overtradingDays / uniqueDates.size) * 20;
  }

  return Math.max(0, Math.min(100, score)).toFixed(1);
};
