
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
  const sharpeRatio = calculateSharpeRatio(trades);
  
  // Calculate drawdowns and streaks
  const { maxDrawdown } = calculateDrawdowns(trades);
  const { longestWinStreak, longestLossStreak } = calculateStreaks(trades);
  
  // Calculate other advanced metrics
  const { averageDuration } = calculateTradeDurationStats(trades);
  const consistencyScore = calculateConsistencyScore(trades);
  
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
  };
}
