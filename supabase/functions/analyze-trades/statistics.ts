
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
  
  // Analyze exit reasons
  const exitReasonAnalysis = analyzeExitReasons(trades);
  
  // Analyze trade emotions
  const tradeEmotionImpact = analyzeTradeEmotionImpact(trades);
  
  // Analyze behavioral consistency
  const behavioralConsistency = analyzeBehavioralConsistency(trades);

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
    riskMetrics,
    exitReasonAnalysis,
    tradeEmotionImpact,
    behavioralConsistency
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
  const targetCount = trades.filter(t => t.exit_reason === 'target_reached').length;
  const manualCount = trades.filter(t => t.exit_reason === 'manual').length;
  
  return {
    stopLossUsage: totalTrades > 0 ? (stopLossCount / totalTrades) * 100 : 0,
    targetUsage: totalTrades > 0 ? (targetCount / totalTrades) * 100 : 0,
    manualOverrides: totalTrades > 0 ? (manualCount / totalTrades) * 100 : 0
  };
}

// New function to analyze exit reasons
function analyzeExitReasons(trades: Trade[]) {
  const result: Record<string, { count: number; avgPnL: number; successRate: number }> = {};
  
  // Group by exit reason
  trades.forEach((trade) => {
    const exitReason = trade.exit_reason || 'unknown';
    
    if (!result[exitReason]) {
      result[exitReason] = { 
        count: 0, 
        avgPnL: 0,
        successRate: 0
      };
    }
    
    result[exitReason].count++;
    result[exitReason].avgPnL += calculateTradePnL(trade);
  });
  
  // Calculate averages and success rates
  Object.keys(result).forEach((exitReason) => {
    const data = result[exitReason];
    
    // Calculate average PnL
    data.avgPnL = data.count > 0 ? data.avgPnL / data.count : 0;
    
    // Calculate success rate (trades that made money)
    const successfulTrades = trades
      .filter(t => (t.exit_reason || 'unknown') === exitReason)
      .filter(t => calculateTradePnL(t) > 0)
      .length;
      
    data.successRate = data.count > 0 ? (successfulTrades / data.count) * 100 : 0;
  });
  
  return result;
}

// New function to analyze emotional impact on trades
function analyzeTradeEmotionImpact(trades: Trade[]) {
  // Entry emotion -> Exit emotion combinations
  const emotionPairs: Record<string, { count: number; avgPnL: number; successRate: number }> = {};
  
  trades.forEach((trade) => {
    if (!trade.entry_emotion || !trade.exit_emotion) return;
    
    const emotionPair = `${trade.entry_emotion}->${trade.exit_emotion}`;
    
    if (!emotionPairs[emotionPair]) {
      emotionPairs[emotionPair] = {
        count: 0,
        avgPnL: 0,
        successRate: 0
      };
    }
    
    emotionPairs[emotionPair].count++;
    emotionPairs[emotionPair].avgPnL += calculateTradePnL(trade);
  });
  
  // Calculate averages and success rates
  Object.keys(emotionPairs).forEach((pair) => {
    const data = emotionPairs[pair];
    
    // Calculate average PnL
    data.avgPnL = data.count > 0 ? data.avgPnL / data.count : 0;
    
    // Calculate success rate
    const [entryEmotion, exitEmotion] = pair.split('->');
    const successfulTrades = trades
      .filter(t => t.entry_emotion === entryEmotion && t.exit_emotion === exitEmotion)
      .filter(t => calculateTradePnL(t) > 0)
      .length;
      
    data.successRate = data.count > 0 ? (successfulTrades / data.count) * 100 : 0;
  });
  
  return emotionPairs;
}

// New function to analyze behavioral consistency
function analyzeBehavioralConsistency(trades: Trade[]) {
  // Sorted trades by date
  const sortedTrades = [...trades].sort((a, b) => {
    if (!a.entry_date || !b.entry_date) return 0;
    // Convert DD-MM-YYYY to sortable date format
    const aDateParts = a.entry_date.split('-').map(Number);
    const bDateParts = b.entry_date.split('-').map(Number);
    
    // Create date objects (year, month-1, day)
    const aDate = new Date(aDateParts[2], aDateParts[1]-1, aDateParts[0]);
    const bDate = new Date(bDateParts[2], bDateParts[1]-1, bDateParts[0]);
    
    return aDate.getTime() - bDate.getTime();
  });
  
  // Strategy consistency
  const strategyChanges = countStrategyChanges(sortedTrades);
  
  // Overtrading detection
  const dailyTradeCounts = getDailyTradeCounts(sortedTrades);
  const overtradingDays = Object.values(dailyTradeCounts).filter(count => count > 3).length;
  
  // Plan adherence (target/stop loss hits vs. manual exits)
  const planAdherence = calculatePlanAdherence(trades);
  
  return {
    strategyChanges,
    overtradingDays,
    planAdherence
  };
}

// Helper for counting strategy changes
function countStrategyChanges(sortedTrades: Trade[]) {
  let changes = 0;
  let lastStrategy = '';
  
  sortedTrades.forEach((trade) => {
    const currentStrategy = trade.strategy || 'unknown';
    if (lastStrategy && currentStrategy !== lastStrategy) {
      changes++;
    }
    lastStrategy = currentStrategy;
  });
  
  return changes;
}

// Helper for counting daily trades
function getDailyTradeCounts(sortedTrades: Trade[]) {
  const dailyCounts: Record<string, number> = {};
  
  sortedTrades.forEach((trade) => {
    if (!trade.entry_date) return;
    
    if (!dailyCounts[trade.entry_date]) {
      dailyCounts[trade.entry_date] = 0;
    }
    
    dailyCounts[trade.entry_date]++;
  });
  
  return dailyCounts;
}

// Helper for calculating plan adherence
function calculatePlanAdherence(trades: Trade[]) {
  const totalTrades = trades.length;
  if (totalTrades === 0) return 0;
  
  // Count trades that followed a plan (using targets or stops)
  const plannedExits = trades.filter(t => 
    t.exit_reason === 'target_reached' || t.exit_reason === 'stop_loss'
  ).length;
  
  return (plannedExits / totalTrades) * 100;
}
