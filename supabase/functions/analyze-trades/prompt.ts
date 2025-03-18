
import { Trade } from "./types.ts";

export function createAnalysisPrompt(statistics: any, trades: Trade[], customPrompt?: string): string {
  // Base prompt template with key variables that will be populated
  const basePrompt = `
Analyze the following trading data and provide detailed insights:

## Trading Statistics
- Total Trades: ${statistics.totalTrades}
- Win Rate: ${statistics.winRate}%
- Total P&L: ${statistics.totalPnL.toFixed(2)}
- Average Trade P&L: ${statistics.avgTradePnL.toFixed(2)}
- Profit Factor: ${statistics.profitFactor}

## Strategy Performance
${formatStrategyPerformance(statistics.strategyPerformance)}

## Market Condition Performance
${formatMarketConditionPerformance(statistics.marketConditionPerformance)}

## Emotional Analysis
${formatEmotionAnalysis(statistics.emotionAnalysis)}

## Time Analysis
${formatTimeAnalysis(statistics.timeAnalysis)}

## Position Sizing
${formatPositionSizing(statistics.positionSizing)}

## Risk Metrics
${formatRiskMetrics(statistics.riskMetrics)}

${customPrompt ? `\n## Custom Analysis Request\n${customPrompt}` : ''}

Please provide a thorough analysis including:
1. Overall performance assessment
2. Strengths and weaknesses identified
3. Patterns in winning vs losing trades
4. Emotional influences on trading decisions
5. Specific recommendations for improvement
6. Optimal trading conditions based on the data

Format your response with clear sections and actionable insights.
`;

  return basePrompt;
}

// Helper functions to format each section
function formatStrategyPerformance(strategyPerformance: Record<string, { wins: number; losses: number; totalPnL: number }>) {
  return Object.entries(strategyPerformance)
    .map(([strategy, stats]) => {
      return `- ${strategy}: ${stats.wins} wins, ${stats.losses} losses, P&L: ${stats.totalPnL.toFixed(2)}`;
    })
    .join('\n');
}

function formatMarketConditionPerformance(marketConditionPerformance: Record<string, { wins: number; losses: number }>) {
  return Object.entries(marketConditionPerformance)
    .map(([condition, stats]) => {
      return `- ${condition}: ${stats.wins} wins, ${stats.losses} losses`;
    })
    .join('\n');
}

function formatEmotionAnalysis(emotionAnalysis: Record<string, { wins: number; losses: number }>) {
  return Object.entries(emotionAnalysis)
    .map(([emotion, stats]) => {
      return `- ${emotion}: ${stats.wins} wins, ${stats.losses} losses`;
    })
    .join('\n');
}

function formatTimeAnalysis(timeAnalysis: Record<string, { wins: number; losses: number; totalPnL: number }>) {
  return Object.entries(timeAnalysis)
    .map(([timeSlot, stats]) => {
      return `- ${timeSlot}: ${stats.wins} wins, ${stats.losses} losses, P&L: ${stats.totalPnL.toFixed(2)}`;
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
