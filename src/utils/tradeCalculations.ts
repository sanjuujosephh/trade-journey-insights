
import { Trade } from "@/types/trade";

export const calculateSharpeRatio = (returns: number[]) => {
  if (returns.length === 0) return 0;
  const avgReturn = returns.reduce((a, b) => a + b, 0) / returns.length;
  const variance = returns.reduce((a, b) => a + Math.pow(b - avgReturn, 2), 0) / returns.length;
  const stdDev = Math.sqrt(variance);
  // Using daily Sharpe ratio for intraday trading
  return stdDev === 0 ? 0 : (avgReturn / stdDev) * Math.sqrt(252);
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
  // Group trades by date
  const tradesByDate = trades.reduce((acc: { [key: string]: Trade[] }, trade) => {
    const date = new Date(trade.entry_time || trade.timestamp).toLocaleDateString();
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(trade);
    return acc;
  }, {});

  // Calculate daily P&L
  let balance = 0;
  return Object.entries(tradesByDate).map(([date, dayTrades]) => {
    const dailyPnL = dayTrades
      .filter(trade => trade.exit_price && trade.quantity)
      .reduce((sum, trade) => {
        return sum + ((trade.exit_price! - trade.entry_price) * trade.quantity!);
      }, 0);
    
    balance += dailyPnL;
    return {
      date,
      balance: parseFloat(balance.toFixed(2)),
      dailyPnL: parseFloat(dailyPnL.toFixed(2))
    };
  });
};

export const calculateDrawdowns = (trades: Trade[]) => {
  // Group trades by date
  const tradesByDate = trades.reduce((acc: { [key: string]: Trade[] }, trade) => {
    const date = new Date(trade.entry_time || trade.timestamp).toLocaleDateString();
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(trade);
    return acc;
  }, {});

  let peak = 0;
  let balance = 0;
  
  return Object.entries(tradesByDate).map(([date, dayTrades]) => {
    const dailyPnL = dayTrades
      .filter(trade => trade.exit_price && trade.quantity)
      .reduce((sum, trade) => {
        return sum + ((trade.exit_price! - trade.entry_price) * trade.quantity!);
      }, 0);
    
    balance += dailyPnL;
    
    if (balance > peak) {
      peak = balance;
    }
    
    const drawdown = peak > 0 ? ((peak - balance) / peak) * 100 : 0;
    return {
      date,
      drawdown: parseFloat(drawdown.toFixed(2)),
      dailyPnL: parseFloat(dailyPnL.toFixed(2))
    };
  });
};

export const calculateStreaks = (trades: Trade[]) => {
  // Group trades by date
  const tradesByDate = trades.reduce((acc: { [key: string]: Trade[] }, trade) => {
    const date = new Date(trade.entry_time || trade.timestamp).toLocaleDateString();
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(trade);
    return acc;
  }, {});

  const dailyResults = Object.entries(tradesByDate).map(([date, dayTrades]) => {
    const dailyPnL = dayTrades
      .filter(trade => trade.exit_price && trade.quantity)
      .reduce((sum, trade) => {
        return sum + ((trade.exit_price! - trade.entry_price) * trade.quantity!);
      }, 0);
    return { date, type: dailyPnL >= 0 ? 'profit' : 'loss' };
  });

  let currentStreak = 0;
  let currentType = '';
  const streaks = [];
  
  for (const result of dailyResults) {
    if (result.type === currentType) {
      currentStreak++;
    } else {
      if (currentStreak > 0) {
        streaks.push({
          type: currentType,
          length: currentStreak
        });
      }
      currentType = result.type;
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
