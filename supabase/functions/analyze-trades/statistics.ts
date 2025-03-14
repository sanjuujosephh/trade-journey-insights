
// Calculate all statistics from trades
export function calculateTradeStatistics(trades) {
  // Basic statistics
  const totalTrades = trades.length;
  const winningTrades = trades.filter((t) => t.outcome === 'profit').length;
  const winRate = ((winningTrades / totalTrades) * 100).toFixed(1);
  
  // Calculate total P&L
  const totalPnL = calculateTotalPnL(trades);

  // Calculate average trade P&L
  const avgTradePnL = totalPnL / totalTrades;

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
function calculateTotalPnL(trades) {
  return trades.reduce((sum, trade) => {
    const pnl = trade.exit_price && trade.entry_price && trade.quantity
      ? (trade.exit_price - trade.entry_price) * trade.quantity
      : 0;
    return sum + pnl;
  }, 0);
}

// Calculate profits and losses for profit factor
function calculateProfitsAndLosses(trades) {
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
function analyzeStrategies(trades) {
  return trades.reduce((acc, trade) => {
    if (!acc[trade.strategy]) {
      acc[trade.strategy] = { wins: 0, losses: 0, totalPnL: 0 };
    }
    acc[trade.strategy][trade.outcome === 'profit' ? 'wins' : 'losses']++;
    
    // Calculate PnL for strategy if possible
    if (trade.exit_price && trade.entry_price && trade.quantity) {
      const pnl = (trade.exit_price - trade.entry_price) * trade.quantity;
      acc[trade.strategy].totalPnL += pnl;
    }
    
    return acc;
  }, {});
}

// Analyze market conditions
function analyzeMarketConditions(trades) {
  return trades.reduce((acc, trade) => {
    if (trade.market_condition) {
      if (!acc[trade.market_condition]) {
        acc[trade.market_condition] = { wins: 0, losses: 0 };
      }
      acc[trade.market_condition][trade.outcome === 'profit' ? 'wins' : 'losses']++;
    }
    return acc;
  }, {});
}

// Analyze emotions
function analyzeEmotions(trades) {
  return trades.reduce((acc, trade) => {
    if (trade.entry_emotion) {
      if (!acc[trade.entry_emotion]) {
        acc[trade.entry_emotion] = { wins: 0, losses: 0 };
      }
      acc[trade.entry_emotion][trade.outcome === 'profit' ? 'wins' : 'losses']++;
    }
    return acc;
  }, {});
}

// Analyze time performance
function analyzeTimePerformance(trades) {
  return trades.reduce((acc, trade) => {
    if (trade.entry_time) {
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
    }
    return acc;
  }, {});
}

// Analyze position sizing
function analyzePositionSizing(trades) {
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
  }, {});
}

// Calculate risk metrics
function calculateRiskMetrics(trades, totalTrades) {
  return {
    stopLossUsage: trades.filter((t) => t.exit_reason === 'stop_loss').length / totalTrades * 100,
    targetUsage: trades.filter((t) => t.exit_reason === 'target').length / totalTrades * 100,
    manualOverrides: trades.filter((t) => t.exit_reason === 'manual').length / totalTrades * 100,
  };
}
