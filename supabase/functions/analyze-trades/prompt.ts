
import { Trade } from "./types.ts";

export function createAnalysisPrompt(statistics: any, trades: Trade[], customPrompt?: string): string {
  // Base prompt template with key variables that will be populated
  const basePrompt = `
Analyze the following trading data and provide detailed insights:

## Trading Statistics
- Total Trades: ${statistics.totalTrades}
- Win Rate: ${statistics.winRate.toFixed(2)}%
- Total P&L: ${statistics.totalPnL.toFixed(2)}
- Average Trade P&L: ${statistics.avgTradePnL.toFixed(2)}
- Profit Factor: ${statistics.profitFactor.toFixed(2)}

## Strategy Performance
${formatStrategyPerformance(statistics.strategyPerformance)}

## Market Condition Performance
${formatMarketConditionPerformance(statistics.marketConditionPerformance)}

## Emotional Analysis
${formatEmotionAnalysis(statistics.emotionAnalysis)}

## Behavioral Patterns
${formatBehavioralPatterns(trades)}

## Time Analysis
${formatTimeAnalysis(statistics.timeAnalysis)}

## Position Sizing
${formatPositionSizing(statistics.positionSizing)}

## Risk Metrics
${formatRiskMetrics(statistics.riskMetrics)}

## Technical Indicator Impact
${formatTechnicalIndicatorImpact(trades)}

## Volatility Impact
${formatVolatilityImpact(trades)}

${customPrompt ? `\n## Custom Analysis Request\n${customPrompt}` : ''}

Please provide a thorough analysis including:
1. Overall performance assessment
2. Strengths and weaknesses identified
3. Patterns in winning vs losing trades
4. Emotional influences on trading decisions
5. Specific recommendations for improvement
6. Optimal trading conditions based on the data
7. Behavioral adjustments that could improve performance
8. Risk management suggestions

Format your response with clear sections and actionable insights. Be specific and practical with your recommendations.
`;

  return basePrompt;
}

// Helper functions to format each section
function formatStrategyPerformance(strategyPerformance: Record<string, { wins: number; losses: number; totalPnL: number }>) {
  return Object.entries(strategyPerformance)
    .map(([strategy, stats]) => {
      const winRate = stats.wins + stats.losses > 0 
        ? ((stats.wins / (stats.wins + stats.losses)) * 100).toFixed(1) 
        : '0.0';
      return `- ${strategy}: ${stats.wins} wins, ${stats.losses} losses, Win Rate: ${winRate}%, P&L: ${stats.totalPnL.toFixed(2)}`;
    })
    .join('\n');
}

function formatMarketConditionPerformance(marketConditionPerformance: Record<string, { wins: number; losses: number }>) {
  return Object.entries(marketConditionPerformance)
    .map(([condition, stats]) => {
      const winRate = stats.wins + stats.losses > 0 
        ? ((stats.wins / (stats.wins + stats.losses)) * 100).toFixed(1) 
        : '0.0';
      return `- ${condition}: ${stats.wins} wins, ${stats.losses} losses, Win Rate: ${winRate}%`;
    })
    .join('\n');
}

function formatEmotionAnalysis(emotionAnalysis: Record<string, { wins: number; losses: number }>) {
  return Object.entries(emotionAnalysis)
    .map(([emotion, stats]) => {
      const winRate = stats.wins + stats.losses > 0 
        ? ((stats.wins / (stats.wins + stats.losses)) * 100).toFixed(1) 
        : '0.0';
      return `- ${emotion}: ${stats.wins} wins, ${stats.losses} losses, Win Rate: ${winRate}%`;
    })
    .join('\n');
}

function formatBehavioralPatterns(trades: Trade[]) {
  // Analyze impulsive vs. planned trades
  const impulsiveTrades = trades.filter(t => t.is_impulsive === true);
  const plannedTrades = trades.filter(t => t.is_impulsive === false);
  
  const impulsiveWins = impulsiveTrades.filter(t => t.outcome === 'profit').length;
  const plannedWins = plannedTrades.filter(t => t.outcome === 'profit').length;
  
  const impulsiveWinRate = impulsiveTrades.length > 0 
    ? ((impulsiveWins / impulsiveTrades.length) * 100).toFixed(1) 
    : '0.0';
  const plannedWinRate = plannedTrades.length > 0 
    ? ((plannedWins / plannedTrades.length) * 100).toFixed(1) 
    : '0.0';
  
  // Analyze plan deviation impacts
  const deviatedTrades = trades.filter(t => t.plan_deviation === true);
  const followedPlanTrades = trades.filter(t => t.plan_deviation === false);
  
  const deviatedWins = deviatedTrades.filter(t => t.outcome === 'profit').length;
  const followedPlanWins = followedPlanTrades.filter(t => t.outcome === 'profit').length;
  
  const deviatedWinRate = deviatedTrades.length > 0 
    ? ((deviatedWins / deviatedTrades.length) * 100).toFixed(1) 
    : '0.0';
  const followedPlanWinRate = followedPlanTrades.length > 0 
    ? ((followedPlanWins / followedPlanTrades.length) * 100).toFixed(1) 
    : '0.0';
  
  // Analyze stress level impact
  const highStressTrades = trades.filter(t => t.stress_level !== null && t.stress_level > 7);
  const lowStressTrades = trades.filter(t => t.stress_level !== null && t.stress_level <= 3);
  
  const highStressWins = highStressTrades.filter(t => t.outcome === 'profit').length;
  const lowStressWins = lowStressTrades.filter(t => t.outcome === 'profit').length;
  
  const highStressWinRate = highStressTrades.length > 0 
    ? ((highStressWins / highStressTrades.length) * 100).toFixed(1) 
    : '0.0';
  const lowStressWinRate = lowStressTrades.length > 0 
    ? ((lowStressWins / lowStressTrades.length) * 100).toFixed(1) 
    : '0.0';
  
  // Analyze time pressure impact
  const highPressureTrades = trades.filter(t => t.time_pressure === 'high');
  const lowPressureTrades = trades.filter(t => t.time_pressure === 'low');
  
  const highPressureWins = highPressureTrades.filter(t => t.outcome === 'profit').length;
  const lowPressureWins = lowPressureTrades.filter(t => t.outcome === 'profit').length;
  
  const highPressureWinRate = highPressureTrades.length > 0 
    ? ((highPressureWins / highPressureTrades.length) * 100).toFixed(1) 
    : '0.0';
  const lowPressureWinRate = lowPressureTrades.length > 0 
    ? ((lowPressureWins / lowPressureTrades.length) * 100).toFixed(1) 
    : '0.0';
  
  return `
- Impulsive Trades: ${impulsiveTrades.length} trades, Win Rate: ${impulsiveWinRate}%
- Planned Trades: ${plannedTrades.length} trades, Win Rate: ${plannedWinRate}%
- Trades With Plan Deviation: ${deviatedTrades.length} trades, Win Rate: ${deviatedWinRate}%
- Trades Following Plan: ${followedPlanTrades.length} trades, Win Rate: ${followedPlanWinRate}%
- High Stress Trades: ${highStressTrades.length} trades, Win Rate: ${highStressWinRate}%
- Low Stress Trades: ${lowStressTrades.length} trades, Win Rate: ${lowStressWinRate}%
- High Time Pressure Trades: ${highPressureTrades.length} trades, Win Rate: ${highPressureWinRate}%
- Low Time Pressure Trades: ${lowPressureTrades.length} trades, Win Rate: ${lowPressureWinRate}%
`;
}

function formatTimeAnalysis(timeAnalysis: Record<string, { wins: number; losses: number; totalPnL: number }>) {
  return Object.entries(timeAnalysis)
    .map(([timeSlot, stats]) => {
      const winRate = stats.wins + stats.losses > 0 
        ? ((stats.wins / (stats.wins + stats.losses)) * 100).toFixed(1) 
        : '0.0';
      return `- ${timeSlot}: ${stats.wins} wins, ${stats.losses} losses, Win Rate: ${winRate}%, P&L: ${stats.totalPnL.toFixed(2)}`;
    })
    .join('\n');
}

function formatPositionSizing(positionSizing: Record<string, { count: number; wins: number; losses: number; totalPnL: number }>) {
  return Object.entries(positionSizing)
    .map(([size, stats]) => {
      const winRate = stats.count > 0 ? (stats.wins / stats.count * 100).toFixed(1) : '0.0';
      return `- ${size}: ${stats.count} trades, Win Rate: ${winRate}%, P&L: ${stats.totalPnL.toFixed(2)}`;
    })
    .join('\n');
}

function formatRiskMetrics(riskMetrics: { stopLossUsage: number; targetUsage: number; manualOverrides: number }) {
  return `
- Stop loss usage: ${riskMetrics.stopLossUsage.toFixed(1)}%
- Take profit usage: ${riskMetrics.targetUsage.toFixed(1)}%
- Manual overrides: ${riskMetrics.manualOverrides.toFixed(1)}%
`;
}

function formatTechnicalIndicatorImpact(trades: Trade[]) {
  // VWAP position analysis
  const aboveVwapTrades = trades.filter(t => t.vwap_position === 'above');
  const belowVwapTrades = trades.filter(t => t.vwap_position === 'below');
  const atVwapTrades = trades.filter(t => t.vwap_position === 'at');
  
  const aboveVwapWins = aboveVwapTrades.filter(t => t.outcome === 'profit').length;
  const belowVwapWins = belowVwapTrades.filter(t => t.outcome === 'profit').length;
  const atVwapWins = atVwapTrades.filter(t => t.outcome === 'profit').length;
  
  const aboveVwapWinRate = aboveVwapTrades.length > 0 
    ? ((aboveVwapWins / aboveVwapTrades.length) * 100).toFixed(1) 
    : '0.0';
  const belowVwapWinRate = belowVwapTrades.length > 0 
    ? ((belowVwapWins / belowVwapTrades.length) * 100).toFixed(1) 
    : '0.0';
  const atVwapWinRate = atVwapTrades.length > 0 
    ? ((atVwapWins / atVwapTrades.length) * 100).toFixed(1) 
    : '0.0';
  
  // EMA position analysis
  const aboveEmaTrades = trades.filter(t => t.ema_position === 'above');
  const belowEmaTrades = trades.filter(t => t.ema_position === 'below');
  const atEmaTrades = trades.filter(t => t.ema_position === 'at');
  
  const aboveEmaWins = aboveEmaTrades.filter(t => t.outcome === 'profit').length;
  const belowEmaWins = belowEmaTrades.filter(t => t.outcome === 'profit').length;
  const atEmaWins = atEmaTrades.filter(t => t.outcome === 'profit').length;
  
  const aboveEmaWinRate = aboveEmaTrades.length > 0 
    ? ((aboveEmaWins / aboveEmaTrades.length) * 100).toFixed(1) 
    : '0.0';
  const belowEmaWinRate = belowEmaTrades.length > 0 
    ? ((belowEmaWins / belowEmaTrades.length) * 100).toFixed(1) 
    : '0.0';
  const atEmaWinRate = atEmaTrades.length > 0 
    ? ((atEmaWins / atEmaTrades.length) * 100).toFixed(1) 
    : '0.0';
  
  return `
VWAP Position:
- Above VWAP: ${aboveVwapTrades.length} trades, Win Rate: ${aboveVwapWinRate}%
- Below VWAP: ${belowVwapTrades.length} trades, Win Rate: ${belowVwapWinRate}%
- At VWAP: ${atVwapTrades.length} trades, Win Rate: ${atVwapWinRate}%

EMA Position:
- Above EMA: ${aboveEmaTrades.length} trades, Win Rate: ${aboveEmaWinRate}%
- Below EMA: ${belowEmaTrades.length} trades, Win Rate: ${belowEmaWinRate}%
- At EMA: ${atEmaTrades.length} trades, Win Rate: ${atEmaWinRate}%
`;
}

function formatVolatilityImpact(trades: Trade[]) {
  // Calculate average VIX for winning vs losing trades
  const winningTrades = trades.filter(t => t.outcome === 'profit');
  const losingTrades = trades.filter(t => t.outcome === 'loss');
  
  const winningWithVix = winningTrades.filter(t => t.vix !== null && t.vix !== undefined);
  const losingWithVix = losingTrades.filter(t => t.vix !== null && t.vix !== undefined);
  
  const avgWinningVix = winningWithVix.length > 0 
    ? winningWithVix.reduce((sum, t) => sum + (t.vix || 0), 0) / winningWithVix.length 
    : 0;
  const avgLosingVix = losingWithVix.length > 0 
    ? losingWithVix.reduce((sum, t) => sum + (t.vix || 0), 0) / losingWithVix.length 
    : 0;
  
  // Calculate average IV for winning vs losing trades
  const winningWithCallIv = winningTrades.filter(t => t.call_iv !== null && t.call_iv !== undefined);
  const losingWithCallIv = losingTrades.filter(t => t.call_iv !== null && t.call_iv !== undefined);
  
  const avgWinningCallIv = winningWithCallIv.length > 0 
    ? winningWithCallIv.reduce((sum, t) => sum + (t.call_iv || 0), 0) / winningWithCallIv.length 
    : 0;
  const avgLosingCallIv = losingWithCallIv.length > 0 
    ? losingWithCallIv.reduce((sum, t) => sum + (t.call_iv || 0), 0) / losingWithCallIv.length 
    : 0;
  
  // Calculate average PCR for winning vs losing trades
  const winningWithPcr = winningTrades.filter(t => t.pcr !== null && t.pcr !== undefined);
  const losingWithPcr = losingTrades.filter(t => t.pcr !== null && t.pcr !== undefined);
  
  const avgWinningPcr = winningWithPcr.length > 0 
    ? winningWithPcr.reduce((sum, t) => sum + (t.pcr || 0), 0) / winningWithPcr.length 
    : 0;
  const avgLosingPcr = losingWithPcr.length > 0 
    ? losingWithPcr.reduce((sum, t) => sum + (t.pcr || 0), 0) / losingWithPcr.length 
    : 0;
  
  return `
- Average VIX for winning trades: ${avgWinningVix.toFixed(2)}
- Average VIX for losing trades: ${avgLosingVix.toFixed(2)}
- Average Call IV for winning trades: ${avgWinningCallIv.toFixed(2)}
- Average Call IV for losing trades: ${avgLosingCallIv.toFixed(2)}
- Average PCR for winning trades: ${avgWinningPcr.toFixed(2)}
- Average PCR for losing trades: ${avgLosingPcr.toFixed(2)}
`;
}
