
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

## Time Performance Analysis
${formatTimeAnalysis(statistics.timeAnalysis)}

## Strategy Performance
${formatStrategyPerformance(statistics.strategyPerformance)}

## Market Condition Performance
${formatMarketConditionPerformance(statistics.marketConditionPerformance)}

## Emotional Analysis
${formatEmotionAnalysis(statistics.emotionAnalysis)}

## Position Sizing
${formatPositionSizing(statistics.positionSizing)}

## Risk Metrics
${formatRiskMetrics(statistics.riskMetrics)}

## VIX, IV, PCR Analysis
${formatVolatilityMetrics(trades)}

## Price Position vs. Technical Indicators
${formatPricePositionAnalysis(trades)}

${customPrompt ? `\n## Custom Analysis Request\n${customPrompt}` : ''}

Please provide a thorough analysis including:

1. PERFORMANCE INSIGHTS:
   - Best performing timeframes (morning vs afternoon sessions)
   - Most profitable strategies with highest win rates and risk-reward ratios
   - Correlation between market conditions and profitability
   - Optimal volatility conditions based on VIX, IV, and PCR values
   - Effect of option price position relative to VWAP and EMA

2. BEHAVIORAL INSIGHTS:
   - Correlation between emotional states and trade outcomes
   - Impact of exit emotions on decision quality
   - Analysis of exit reasons and their effect on profitability
   - Assessment of trading consistency and discipline
   - Identification of potential overtrading patterns

3. RECOMMENDATIONS:
   - Specific timeframes and market conditions to focus on
   - Strategies that align best with your trading style
   - Emotional patterns to be aware of and how to address them
   - Specific improvements for exit decisions
   - Concrete steps to improve overall consistency

Format your response with clear sections for each analysis area and provide actionable insights that can be implemented immediately.
`;

  return basePrompt;
}

// Helper functions to format each section
function formatStrategyPerformance(strategyPerformance: Record<string, { wins: number; losses: number; totalPnL: number }>) {
  if (!strategyPerformance || Object.keys(strategyPerformance).length === 0) {
    return "No strategy data available";
  }
  
  return Object.entries(strategyPerformance)
    .map(([strategy, stats]) => {
      const total = stats.wins + stats.losses;
      const winRate = total > 0 ? (stats.wins / total * 100).toFixed(1) : '0.0';
      return `- ${strategy}: ${stats.wins} wins, ${stats.losses} losses (${winRate}% win rate), P&L: ${stats.totalPnL.toFixed(2)}`;
    })
    .join('\n');
}

function formatMarketConditionPerformance(marketConditionPerformance: Record<string, { wins: number; losses: number }>) {
  if (!marketConditionPerformance || Object.keys(marketConditionPerformance).length === 0) {
    return "No market condition data available";
  }
  
  return Object.entries(marketConditionPerformance)
    .map(([condition, stats]) => {
      const total = stats.wins + stats.losses;
      const winRate = total > 0 ? (stats.wins / total * 100).toFixed(1) : '0.0';
      return `- ${condition}: ${stats.wins} wins, ${stats.losses} losses (${winRate}% win rate)`;
    })
    .join('\n');
}

function formatEmotionAnalysis(emotionAnalysis: Record<string, { wins: number; losses: number }>) {
  if (!emotionAnalysis || Object.keys(emotionAnalysis).length === 0) {
    return "No emotion data available";
  }
  
  return Object.entries(emotionAnalysis)
    .map(([emotion, stats]) => {
      const total = stats.wins + stats.losses;
      const winRate = total > 0 ? (stats.wins / total * 100).toFixed(1) : '0.0';
      return `- ${emotion}: ${stats.wins} wins, ${stats.losses} losses (${winRate}% win rate)`;
    })
    .join('\n');
}

function formatTimeAnalysis(timeAnalysis: Record<string, { wins: number; losses: number; totalPnL: number }>) {
  if (!timeAnalysis || Object.keys(timeAnalysis).length === 0) {
    return "No time analysis data available";
  }
  
  return Object.entries(timeAnalysis)
    .map(([timeSlot, stats]) => {
      const total = stats.wins + stats.losses;
      const winRate = total > 0 ? (stats.wins / total * 100).toFixed(1) : '0.0';
      return `- ${timeSlot}: ${stats.wins} wins, ${stats.losses} losses (${winRate}% win rate), P&L: ${stats.totalPnL.toFixed(2)}`;
    })
    .join('\n');
}

function formatPositionSizing(positionSizing: Record<string, { count: number; wins: number; losses: number; totalPnL: number }>) {
  if (!positionSizing || Object.keys(positionSizing).length === 0) {
    return "No position sizing data available";
  }
  
  return Object.entries(positionSizing)
    .map(([size, stats]) => {
      const winRate = stats.count > 0 ? (stats.wins / stats.count * 100).toFixed(1) : '0.0';
      return `- ${size}: ${stats.count} trades, Win Rate: ${winRate}%, P&L: ${stats.totalPnL.toFixed(2)}`;
    })
    .join('\n');
}

function formatRiskMetrics(riskMetrics: { stopLossUsage: number; targetUsage: number; manualOverrides: number }) {
  if (!riskMetrics) {
    return "No risk metrics available";
  }
  
  return `
- Stop loss usage: ${riskMetrics.stopLossUsage.toFixed(1)}%
- Take profit usage: ${riskMetrics.targetUsage.toFixed(1)}%
- Manual overrides: ${riskMetrics.manualOverrides.toFixed(1)}%
`;
}

function formatVolatilityMetrics(trades: Trade[]) {
  if (!trades || trades.length === 0) {
    return "No volatility data available";
  }
  
  // Calculate winning and losing trades
  const winningTrades = trades.filter(t => t.outcome === 'profit');
  const losingTrades = trades.filter(t => t.outcome === 'loss');
  
  // Calculate average VIX, IV, PCR for winning and losing trades
  const avgWinVix = calculateAverage(winningTrades.map(t => t.vix ?? 0).filter(Boolean));
  const avgLossVix = calculateAverage(losingTrades.map(t => t.vix ?? 0).filter(Boolean));
  
  const avgWinCallIv = calculateAverage(winningTrades.map(t => t.call_iv ?? 0).filter(Boolean));
  const avgLossCallIv = calculateAverage(losingTrades.map(t => t.call_iv ?? 0).filter(Boolean));
  
  const avgWinPutIv = calculateAverage(winningTrades.map(t => t.put_iv ?? 0).filter(Boolean));
  const avgLossPutIv = calculateAverage(losingTrades.map(t => t.put_iv ?? 0).filter(Boolean));
  
  const avgWinPcr = calculateAverage(winningTrades.map(t => t.pcr ?? 0).filter(Boolean));
  const avgLossPcr = calculateAverage(losingTrades.map(t => t.pcr ?? 0).filter(Boolean));
  
  return `
- Average VIX in winning trades: ${avgWinVix.toFixed(2)} vs. ${avgLossVix.toFixed(2)} in losing trades
- Average Call IV in winning trades: ${avgWinCallIv.toFixed(2)} vs. ${avgLossCallIv.toFixed(2)} in losing trades
- Average Put IV in winning trades: ${avgWinPutIv.toFixed(2)} vs. ${avgLossPutIv.toFixed(2)} in losing trades
- Average PCR in winning trades: ${avgWinPcr.toFixed(2)} vs. ${avgLossPcr.toFixed(2)} in losing trades
`;
}

function formatPricePositionAnalysis(trades: Trade[]) {
  if (!trades || trades.length === 0) {
    return "No price position data available";
  }
  
  // Analyze VWAP position effect
  const vwapAbove = trades.filter(t => t.vwap_position === 'above');
  const vwapBelow = trades.filter(t => t.vwap_position === 'below');
  const vwapAt = trades.filter(t => t.vwap_position === 'at');
  
  const vwapAboveWins = vwapAbove.filter(t => t.outcome === 'profit').length;
  const vwapBelowWins = vwapBelow.filter(t => t.outcome === 'profit').length;
  const vwapAtWins = vwapAt.filter(t => t.outcome === 'profit').length;
  
  const vwapAboveWinRate = vwapAbove.length > 0 ? (vwapAboveWins / vwapAbove.length * 100).toFixed(1) : '0.0';
  const vwapBelowWinRate = vwapBelow.length > 0 ? (vwapBelowWins / vwapBelow.length * 100).toFixed(1) : '0.0';
  const vwapAtWinRate = vwapAt.length > 0 ? (vwapAtWins / vwapAt.length * 100).toFixed(1) : '0.0';
  
  // Analyze EMA position effect
  const emaAbove = trades.filter(t => t.ema_position === 'above');
  const emaBelow = trades.filter(t => t.ema_position === 'below');
  const emaAt = trades.filter(t => t.ema_position === 'at');
  
  const emaAboveWins = emaAbove.filter(t => t.outcome === 'profit').length;
  const emaBelowWins = emaBelow.filter(t => t.outcome === 'profit').length;
  const emaAtWins = emaAt.filter(t => t.outcome === 'profit').length;
  
  const emaAboveWinRate = emaAbove.length > 0 ? (emaAboveWins / emaAbove.length * 100).toFixed(1) : '0.0';
  const emaBelowWinRate = emaBelow.length > 0 ? (emaBelowWins / emaBelow.length * 100).toFixed(1) : '0.0';
  const emaAtWinRate = emaAt.length > 0 ? (emaAtWins / emaAt.length * 100).toFixed(1) : '0.0';
  
  return `
VWAP Position Effect:
- Entry above VWAP: ${vwapAbove.length} trades, ${vwapAboveWinRate}% win rate
- Entry below VWAP: ${vwapBelow.length} trades, ${vwapBelowWinRate}% win rate
- Entry at VWAP: ${vwapAt.length} trades, ${vwapAtWinRate}% win rate

EMA Position Effect:
- Entry above EMA: ${emaAbove.length} trades, ${emaAboveWinRate}% win rate
- Entry below EMA: ${emaBelow.length} trades, ${emaBelowWinRate}% win rate
- Entry at EMA: ${emaAt.length} trades, ${emaAtWinRate}% win rate
`;
}

function calculateAverage(numbers: number[]): number {
  if (numbers.length === 0) return 0;
  return numbers.reduce((sum, num) => sum + num, 0) / numbers.length;
}
