
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
  return trades.reduce((acc: { date: string; balance: number }[], trade) => {
    const lastBalance = acc.length > 0 ? acc[acc.length - 1].balance : 0;
    if (trade.exit_price && trade.quantity) {
      const pnl = (trade.exit_price - trade.entry_price) * trade.quantity;
      acc.push({
        date: new Date(trade.entry_time || trade.timestamp).toLocaleDateString(),
        balance: lastBalance + pnl
      });
    }
    return acc;
  }, []);
};

export const calculateDrawdowns = (trades: Trade[]) => {
  let peak = 0;
  let drawdowns = [];
  let balance = 0;

  for (const trade of trades) {
    if (!trade.exit_price || !trade.quantity) continue;
    const pnl = (trade.exit_price - trade.entry_price) * trade.quantity;
    balance += pnl;
    
    if (balance > peak) {
      peak = balance;
    }
    
    const drawdown = ((peak - balance) / peak) * 100;
    drawdowns.push({
      date: new Date(trade.entry_time || trade.timestamp).toLocaleDateString(),
      drawdown: drawdown
    });
  }
  return drawdowns;
};

export const calculateStreaks = (trades: Trade[]) => {
  let currentStreak = 0;
  const streaks = [];
  
  for (let i = 0; i < trades.length; i++) {
    if (trades[i].outcome === trades[i-1]?.outcome) {
      currentStreak++;
    } else {
      if (currentStreak > 0) {
        streaks.push({
          type: trades[i-1].outcome,
          length: currentStreak
        });
      }
      currentStreak = 1;
    }
  }
  
  if (currentStreak > 0) {
    streaks.push({
      type: trades[trades.length - 1].outcome,
      length: currentStreak
    });
  }

  return streaks;
};

export const calculateTradeDurationStats = (trades: Trade[]) => {
  const durationData = trades
    .filter(t => t.entry_time && t.exit_time)
    .map(trade => {
      const duration = new Date(trade.exit_time!).getTime() - new Date(trade.entry_time!).getTime();
      return {
        duration: duration / (1000 * 60), // Convert to minutes
        pnl: trade.exit_price && trade.quantity ? 
          (trade.exit_price - trade.entry_price) * trade.quantity : 0
      };
    });

  return durationData.reduce((acc: any[], data) => {
    const durationRange = Math.floor(data.duration / 30) * 30; // Group by 30-minute intervals
    const existing = acc.find(item => item.duration === durationRange);
    
    if (existing) {
      existing.trades++;
      existing.avgPnL = (existing.avgPnL * (existing.trades - 1) + data.pnl) / existing.trades;
    } else {
      acc.push({
        duration: durationRange,
        trades: 1,
        avgPnL: data.pnl
      });
    }
    
    return acc;
  }, []).sort((a: any, b: any) => a.duration - b.duration);
};

export const calculateStats = (trades: Trade[]) => {
  const completedTrades = trades.filter(trade => trade.exit_price !== null && trade.quantity !== null);
  const totalTrades = completedTrades.length;
  
  if (totalTrades === 0) {
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

  const winRate = ((profitTrades.length / totalTrades) * 100).toFixed(1);

  const avgProfit = profitTrades.length > 0
    ? (profitTrades.reduce((sum, trade) => {
        if (!trade.exit_price || !trade.quantity) return sum;
        const pnl = (trade.exit_price - trade.entry_price) * trade.quantity;
        return sum + pnl;
      }, 0) / profitTrades.length).toFixed(2)
    : "0";

  const avgLoss = lossTrades.length > 0
    ? (lossTrades.reduce((sum, trade) => {
        if (!trade.exit_price || !trade.quantity) return sum;
        const pnl = Math.abs((trade.exit_price - trade.entry_price) * trade.quantity);
        return sum + pnl;
      }, 0) / lossTrades.length).toFixed(2)
    : "0";

  const riskReward = avgLoss !== "0"
    ? (parseFloat(avgProfit) / parseFloat(avgLoss)).toFixed(2)
    : "0";

  const maxDrawdown = calculateDrawdowns(completedTrades);
  const maxDrawdownValue = maxDrawdown.length > 0 ? 
    Math.max(...maxDrawdown.map(d => d.drawdown)).toFixed(1) : "0";

  const consistencyScore = calculateConsistencyScore(completedTrades);

  return {
    winRate: `${winRate}%`,
    avgProfit: `₹${avgProfit}`,
    avgLoss: `₹${avgLoss}`,
    riskReward,
    maxDrawdown: `${maxDrawdownValue}%`,
    consistencyScore: `${consistencyScore}%`,
  };
};

export const calculateConsistencyScore = (trades: Trade[]) => {
  let score = 100;
  
  const tradesWithoutStopLoss = trades.filter(t => !t.stop_loss).length;
  score -= (tradesWithoutStopLoss / trades.length) * 30;

  const overtradingDays = new Set(
    trades.filter(t => {
      const dayTrades = trades.filter(trade => 
        new Date(trade.timestamp).toDateString() === new Date(t.timestamp).toDateString()
      );
      return dayTrades.length > 2;
    }).map(t => new Date(t.timestamp).toDateString())
  ).size;
  score -= (overtradingDays / Math.ceil(trades.length / 2)) * 20;

  return Math.max(0, Math.min(100, score)).toFixed(1);
};
