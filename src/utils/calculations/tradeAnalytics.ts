
import { Trade } from "@/types/trade";
import { calculateExpectancy } from "./expectancy";
import { calculateSharpeRatio } from "./sharpe";
import { calculateDrawdowns } from "./drawdowns";
import { calculateStreaks } from "./streaks";
import { calculateTradeDurationStats } from "./duration";
import { calculateConsistencyScore } from "./consistency";

export interface TradeStatistics {
  totalTrades: number;
  winRate: number;
  profitFactor: number;
  averageProfit: number;
  averageLoss: number;
  largestWin: number;
  largestLoss: number;
  expectancy: number;
  sharpeRatio: number;
  maxDrawdown: number;
  longestWinStreak: number;
  longestLossStreak: number;
  consistencyScore: number;
  averageDuration: number;
  totalPnL: number;
  avgTradePnL: number;
  strategyPerformance: Record<string, { wins: number; losses: number; totalPnL: number }>;
  marketConditionPerformance: Record<string, { wins: number; losses: number }>;
  riskMetrics: {
    stopLossUsage: number;
    targetUsage: number;
    manualOverrides: number;
  };
}

export function calculateTradeStatistics(trades: Trade[]): TradeStatistics {
  if (!trades || trades.length === 0) {
    return {
      totalTrades: 0,
      winRate: 0,
      profitFactor: 0,
      averageProfit: 0,
      averageLoss: 0,
      largestWin: 0,
      largestLoss: 0,
      expectancy: 0,
      sharpeRatio: 0,
      maxDrawdown: 0,
      longestWinStreak: 0,
      longestLossStreak: 0,
      consistencyScore: 0,
      averageDuration: 0,
      totalPnL: 0,
      avgTradePnL: 0,
      strategyPerformance: {},
      marketConditionPerformance: {},
      riskMetrics: {
        stopLossUsage: 0,
        targetUsage: 0,
        manualOverrides: 0
      }
    };
  }

  // Calculate basic statistics
  const winningTrades = trades.filter(trade => trade.outcome === 'profit');
  const losingTrades = trades.filter(trade => trade.outcome === 'loss');
  
  const winRate = winningTrades.length / trades.length;
  
  // Calculate profits and losses
  const totalProfit = winningTrades.reduce((sum, trade) => {
    const profit = ((Number(trade.exit_price) - Number(trade.entry_price)) * Number(trade.quantity)) || 0;
    return sum + profit;
  }, 0);
  
  const totalLoss = Math.abs(losingTrades.reduce((sum, trade) => {
    const loss = ((Number(trade.exit_price) - Number(trade.entry_price)) * Number(trade.quantity)) || 0;
    return sum + loss;
  }, 0));
  
  const profitFactor = totalLoss > 0 ? totalProfit / totalLoss : totalProfit > 0 ? Infinity : 0;
  
  // Calculate average profit and loss
  const averageProfit = winningTrades.length > 0 ? totalProfit / winningTrades.length : 0;
  const averageLoss = losingTrades.length > 0 ? totalLoss / losingTrades.length : 0;
  
  // Find largest win and loss
  const profits = winningTrades.map(trade => 
    ((Number(trade.exit_price) - Number(trade.entry_price)) * Number(trade.quantity)) || 0
  );
  const losses = losingTrades.map(trade => 
    Math.abs(((Number(trade.exit_price) - Number(trade.entry_price)) * Number(trade.quantity)) || 0)
  );
  
  const largestWin = profits.length > 0 ? Math.max(...profits) : 0;
  const largestLoss = losses.length > 0 ? Math.max(...losses) : 0;
  
  // Calculate expectancy and sharpe ratio
  const expectancy = calculateExpectancy(trades);
  
  // Fix: Extract trade returns as numbers for sharpeRatio calculation
  const tradeReturns = trades.map(trade => {
    if (trade.exit_price && trade.quantity) {
      return ((Number(trade.exit_price) - Number(trade.entry_price)) * Number(trade.quantity));
    }
    return 0;
  });
  const sharpeRatio = calculateSharpeRatio(tradeReturns);
  
  // Calculate drawdowns
  const drawdowns = calculateDrawdowns(trades);
  const maxDrawdown = drawdowns.length > 0 
    ? Math.max(...drawdowns.map(d => d.drawdown))
    : 0;
  
  // Calculate streaks
  const streaks = calculateStreaks(trades);
  const winStreaks = streaks.filter(s => s.type === 'profit').map(s => s.length);
  const lossStreaks = streaks.filter(s => s.type === 'loss').map(s => s.length);
  const longestWinStreak = winStreaks.length > 0 ? Math.max(...winStreaks) : 0;
  const longestLossStreak = lossStreaks.length > 0 ? Math.max(...lossStreaks) : 0;
  
  // Calculate duration stats
  const durationStats = calculateTradeDurationStats(trades);
  const averageDuration = durationStats.length > 0 
    ? durationStats.reduce((sum, stat) => sum + stat.duration, 0) / durationStats.length
    : 0;
  
  // Calculate consistency score - Fix: Convert string to number
  const consistencyScore = Number(calculateConsistencyScore(trades));
  
  // Calculate total PnL and average trade PnL
  const totalPnL = totalProfit - totalLoss;
  const avgTradePnL = trades.length > 0 ? totalPnL / trades.length : 0;
  
  // Analyze strategies
  const strategyPerformance = analyzeStrategies(trades);
  
  // Analyze market conditions
  const marketConditionPerformance = analyzeMarketConditions(trades);
  
  // Calculate risk metrics
  const riskMetrics = calculateRiskMetrics(trades);
  
  return {
    totalTrades: trades.length,
    winRate,
    profitFactor,
    averageProfit,
    averageLoss,
    largestWin,
    largestLoss,
    expectancy,
    sharpeRatio,
    maxDrawdown,
    longestWinStreak,
    longestLossStreak,
    consistencyScore,
    averageDuration,
    totalPnL,
    avgTradePnL,
    strategyPerformance,
    marketConditionPerformance,
    riskMetrics
  };
}

// Analyze strategies
function analyzeStrategies(trades: Trade[]) {
  const result: Record<string, { wins: number; losses: number; totalPnL: number }> = {};
  
  trades.forEach((trade) => {
    const strategy = trade.strategy || "unknown";
    
    if (!result[strategy]) {
      result[strategy] = { wins: 0, losses: 0, totalPnL: 0 };
    }
    
    // Increment wins or losses
    if (trade.outcome === 'profit') {
      result[strategy].wins++;
    } else {
      result[strategy].losses++;
    }
    
    // Add P&L
    const pnl = ((Number(trade.exit_price) - Number(trade.entry_price)) * Number(trade.quantity)) || 0;
    result[strategy].totalPnL += pnl;
  });
  
  return result;
}

// Analyze market conditions
function analyzeMarketConditions(trades: Trade[]) {
  const result: Record<string, { wins: number; losses: number }> = {};
  
  trades.forEach((trade) => {
    const marketCondition = trade.market_condition || "unknown";
    
    if (!result[marketCondition]) {
      result[marketCondition] = { wins: 0, losses: 0 };
    }
    
    // Increment wins or losses
    if (trade.outcome === 'profit') {
      result[marketCondition].wins++;
    } else {
      result[marketCondition].losses++;
    }
  });
  
  return result;
}

// Calculate risk metrics
function calculateRiskMetrics(trades: Trade[]) {
  const totalTrades = trades.length;
  
  // Count trades by exit reason
  const stopLossCount = trades.filter(t => t.exit_reason === 'stop_loss').length;
  const targetCount = trades.filter(t => t.exit_reason === 'target_reached').length;
  const manualCount = trades.filter(t => t.exit_reason === 'manual').length;
  
  return {
    stopLossUsage: totalTrades > 0 ? (stopLossCount / totalTrades) * 100 : 0,
    targetUsage: totalTrades > 0 ? (targetCount / totalTrades) * 100 : 0,
    manualOverrides: totalTrades > 0 ? (manualCount / totalTrades) * 100 : 0
  };
}
