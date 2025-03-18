
import { Trade } from "./types.ts";

// Calculate all statistics from trades
export function calculateTradeStatistics(trades: Trade[]) {
  // Basic statistics
  const totalTrades = trades.length;
  const winningTrades = trades.filter((t) => t.outcome === 'profit').length;
  const winRate = totalTrades > 0 ? (winningTrades / totalTrades) * 100 : 0;
  
  // Calculate total P&L
  const totalPnL = calculateTotalPnL(trades);

  // Calculate average trade P&L
  const avgTradePnL = totalTrades > 0 ? totalPnL / totalTrades : 0;

  // Calculate profit factor
  const { sumProfits, sumLosses } = calculateProfitsAndLosses(trades);
  const profitFactor = sumLosses > 0 ? sumProfits / sumLosses : sumProfits > 0 ? Infinity : 0;

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
  const riskMetrics = calculateRiskMetrics(trades);

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
    const pnl = calculateTradePnL(trade);
    return sum + pnl;
  }, 0);
}

// Calculate P&L for a single trade
function calculateTradePnL(trade: Trade) {
  if (!trade.exit_price || !trade.entry_price || !trade.quantity) {
    return 0;
  }
  
  const directionMultiplier = trade.trade_direction === 'short' ? -1 : 1;
  return directionMultiplier * (trade.exit_price - trade.entry_price) * trade.quantity;
}

// Calculate profits and losses for profit factor
function calculateProfitsAndLosses(trades: Trade[]) {
  let sumProfits = 0;
  let sumLosses = 0;
  
  trades.forEach((trade) => {
    const pnl = calculateTradePnL(trade);
    if (pnl > 0) sumProfits += pnl;
    if (pnl < 0) sumLosses += Math.abs(pnl);
  });
  
  return { sumProfits, sumLosses };
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
    result[strategy].totalPnL += calculateTradePnL(trade);
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

// Analyze emotions
function analyzeEmotions(trades: Trade[]) {
  const result: Record<string, { wins: number; losses: number }> = {};
  
  trades.forEach((trade) => {
    const emotion = trade.entry_emotion || "unknown";
    
    if (!result[emotion]) {
      result[emotion] = { wins: 0, losses: 0 };
    }
    
    // Increment wins or losses
    if (trade.outcome === 'profit') {
      result[emotion].wins++;
    } else {
      result[emotion].losses++;
    }
  });
  
  return result;
}

// Analyze time performance
function analyzeTimePerformance(trades: Trade[]) {
  const result: Record<string, { wins: number; losses: number; totalPnL: number }> = {};
  
  trades.forEach((trade) => {
    // Skip trades without entry time
    if (!trade.entry_time) return;
    
    // Parse time and create a time slot (hour format)
    let timeSlot = "unknown";
    
    try {
      // Try to extract hour from time string (assuming format like "14:30")
      const hour = parseInt(trade.entry_time.split(':')[0], 10);
      if (!isNaN(hour)) {
        timeSlot = `${hour}:00-${(hour+1) % 24}:00`;
      }
    } catch (e) {
      console.error(`Error parsing entry_time: ${trade.entry_time}`, e);
    }
    
    if (!result[timeSlot]) {
      result[timeSlot] = { wins: 0, losses: 0, totalPnL: 0 };
    }
    
    // Increment wins or losses
    if (trade.outcome === 'profit') {
      result[timeSlot].wins++;
    } else {
      result[timeSlot].losses++;
    }
    
    // Add P&L
    result[timeSlot].totalPnL += calculateTradePnL(trade);
  });
  
  return result;
}

// Analyze position sizing
function analyzePositionSizing(trades: Trade[]) {
  const result: Record<string, { count: number; wins: number; losses: number; totalPnL: number }> = {};
  
  trades.forEach((trade) => {
    if (!trade.quantity) return;
    
    // Categorize position size
    const quantity = trade.quantity;
    const sizeCategory = quantity <= 10 ? 'small' : quantity <= 50 ? 'medium' : 'large';
    
    if (!result[sizeCategory]) {
      result[sizeCategory] = { count: 0, wins: 0, losses: 0, totalPnL: 0 };
    }
    
    // Increment count and wins/losses
    result[sizeCategory].count++;
    
    if (trade.outcome === 'profit') {
      result[sizeCategory].wins++;
    } else {
      result[sizeCategory].losses++;
    }
    
    // Add P&L
    result[sizeCategory].totalPnL += calculateTradePnL(trade);
  });
  
  return result;
}

// Calculate risk metrics
function calculateRiskMetrics(trades: Trade[]) {
  const totalTrades = trades.length;
  
  // Count trades by exit reason
  const stopLossCount = trades.filter(t => t.exit_reason === 'stop_loss').length;
  const targetCount = trades.filter(t => t.exit_reason === 'target').length;
  const manualCount = trades.filter(t => t.exit_reason === 'manual').length;
  
  return {
    stopLossUsage: totalTrades > 0 ? (stopLossCount / totalTrades) * 100 : 0,
    targetUsage: totalTrades > 0 ? (targetCount / totalTrades) * 100 : 0,
    manualOverrides: totalTrades > 0 ? (manualCount / totalTrades) * 100 : 0
  };
}
