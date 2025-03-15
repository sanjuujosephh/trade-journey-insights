
import { Trade } from "./types.ts";

// Calculate all statistics from trades
export function calculateTradeStatistics(trades: Trade[]) {
  // Basic statistics
  const totalTrades = trades.length;
  const winningTrades = trades.filter((t) => t.outcome === 'profit').length;
  const winRate = totalTrades > 0 ? ((winningTrades / totalTrades) * 100).toFixed(1) : '0.0';
  
  // Calculate total P&L
  const totalPnL = calculateTotalPnL(trades);

  // Calculate average trade P&L
  const avgTradePnL = totalTrades > 0 ? totalPnL / totalTrades : 0;

  // Calculate profit factor
  const { sumProfits, sumLosses } = calculateProfitsAndLosses(trades);
  const profitFactor = sumLosses > 0 ? (sumProfits / sumLosses).toFixed(2) : "∞";

  // Analyze strategies
  const strategyPerformance = analyzeStrategies(trades);

  // Analysis by market conditions
  const marketConditionPerformance = analyzeMarketConditions(trades);

  // Analyze emotions
  const emotionAnalysis = analyzeEmotions(trades);

  // Time analysis - hour of day performance
  const timeAnalysis = analyzeTimePerformance(trades);

  // Position sizing analysis
  const positionSizing = analyzePositionSizing(trades);

  // Risk management metrics
  const riskMetrics = calculateRiskMetrics(trades, totalTrades);

  return {
    totalTrades,
    winRate,
    totalPnL,
    avgTradePnL,
    profitFactor,
    strategyPerformance,
    marketConditionPerformance,
    emotionAnalysis,
    timeAnalysis,
    positionSizing,
    riskMetrics
  };
}

// Calculate total P&L from trades
function calculateTotalPnL(trades: Trade[]) {
  return trades.reduce((sum, trade) => {
    const pnl = trade.exit_price && trade.entry_price && trade.quantity
      ? (trade.exit_price - trade.entry_price) * trade.quantity
      : 0;
    return sum + pnl;
  }, 0);
}

// Calculate profits and losses for profit factor
function calculateProfitsAndLosses(trades: Trade[]) {
  let sumProfits = 0;
  let sumLosses = 0;
  
  trades.forEach((trade) => {
    const pnl = trade.exit_price && trade.entry_price && trade.quantity
      ? (trade.exit_price - trade.entry_price) * trade.quantity
      : 0;
    if (pnl > 0) sumProfits += pnl;
    if (pnl < 0) sumLosses += Math.abs(pnl);
  });
  
  return { sumProfits, sumLosses };
}

// Analyze strategies
function analyzeStrategies(trades: Trade[]) {
  return trades.reduce((acc, trade) => {
    const strategy = trade.strategy || "unknown";
    if (!acc[strategy]) {
      acc[strategy] = { wins: 0, losses: 0, totalPnL: 0 };
    }
    acc[strategy][trade.outcome === 'profit' ? 'wins' : 'losses']++;
    
    // Calculate PnL for strategy if possible
    if (trade.exit_price && trade.entry_price && trade.quantity) {
      const pnl = (trade.exit_price - trade.entry_price) * trade.quantity;
      acc[strategy].totalPnL += pnl;
    }
    
    return acc;
  }, {} as Record<string, { wins: number; losses: number; totalPnL: number }>);
}

// Analyze market conditions
function analyzeMarketConditions(trades: Trade[]) {
  return trades.reduce((acc, trade) => {
    const marketCondition = trade.market_condition || "unknown";
    if (!acc[marketCondition]) {
      acc[marketCondition] = { wins: 0, losses: 0 };
    }
    acc[marketCondition][trade.outcome === 'profit' ? 'wins' : 'losses']++;
    return acc;
  }, {} as Record<string, { wins: number; losses: number }>);
}

// Analyze emotions
function analyzeEmotions(trades: Trade[]) {
  return trades.reduce((acc, trade) => {
    const emotion = trade.entry_emotion || "unknown";
    if (!acc[emotion]) {
      acc[emotion] = { wins: 0, losses: 0 };
    }
    acc[emotion][trade.outcome === 'profit' ? 'wins' : 'losses']++;
    return acc;
  }, {} as Record<string, { wins: number; losses: number }>);
}

// Analyze time performance
function analyzeTimePerformance(trades: Trade[]) {
  return trades.reduce((acc, trade) => {
    if (trade.entry_time) {
      try {
        const hour = new Date(trade.entry_time).getHours();
        const timeSlot = `${hour}:00-${hour+1}:00`;
        
        if (!acc[timeSlot]) {
          acc[timeSlot] = { wins: 0, losses: 0, totalPnL: 0 };
        }
        
        acc[timeSlot][trade.outcome === 'profit' ? 'wins' : 'losses']++;
        
        if (trade.exit_price && trade.entry_price && trade.quantity) {
          const pnl = (trade.exit_price - trade.entry_price) * trade.quantity;
          acc[timeSlot].totalPnL += pnl;
        }
      } catch (e) {
        // If there's an error parsing the time, skip this trade
        console.error(`Error parsing entry_time: ${trade.entry_time}`, e);
      }
    }
    return acc;
  }, {} as Record<string, { wins: number; losses: number; totalPnL: number }>);
}

// Analyze position sizing
function analyzePositionSizing(trades: Trade[]) {
  return trades.reduce((acc, trade) => {
    if (trade.quantity) {
      const size = trade.quantity;
      const sizeCategory = size <= 10 ? 'small' : size <= 50 ? 'medium' : 'large';
      
      if (!acc[sizeCategory]) {
        acc[sizeCategory] = { count: 0, wins: 0, losses: 0, totalPnL: 0 };
      }
      
      acc[sizeCategory].count++;
      acc[sizeCategory][trade.outcome === 'profit' ? 'wins' : 'losses']++;
      
      if (trade.exit_price && trade.entry_price) {
        const pnl = (trade.exit_price - trade.entry_price) * size;
        acc[sizeCategory].totalPnL += pnl;
      }
    }
    return acc;
  }, {} as Record<string, { count: number; wins: number; losses: number; totalPnL: number }>);
}

// Calculate risk metrics
function calculateRiskMetrics(trades: Trade[], totalTrades: number) {
  return {
    stopLossUsage: totalTrades > 0 ? trades.filter((t) => t.exit_reason === 'stop_loss').length / totalTrades * 100 : 0,
    targetUsage: totalTrades > 0 ? trades.filter((t) => t.exit_reason === 'target').length / totalTrades * 100 : 0,
    manualOverrides: totalTrades > 0 ? trades.filter((t) => t.exit_reason === 'manual').length / totalTrades * 100 : 0,
  };
}
