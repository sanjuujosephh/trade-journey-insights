
export function createAnalysisPrompt(statistics: any, trades: any[], customPrompt?: string): string {
  // Base prompt template with key variables that will be populated
  const basePrompt = `
Analyze the following trading data and provide detailed insights:

## Trading Statistics
- Total Trades: {{totalTrades}}
- Win Rate: {{winRate}}%
- Total P&L: {{totalPnL}}
- Average Trade P&L: {{avgTradePnL}}
- Profit Factor: {{profitFactor}}

## Strategy Performance
{{strategyPerformance}}

## Market Condition Performance
{{marketConditionPerformance}}

## Emotional Analysis
{{emotionAnalysis}}

## Time Analysis
{{timeAnalysis}}

## Position Sizing
{{positionSizing}}

## Risk Metrics
{{riskMetrics}}

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

  // Replace placeholders with actual values from the statistics
  let finalPrompt = basePrompt
    .replace('{{totalTrades}}', statistics.totalTrades)
    .replace('{{winRate}}', statistics.winRate)
    .replace('{{totalPnL}}', statistics.totalPnL.toFixed(2))
    .replace('{{avgTradePnL}}', statistics.avgTradePnL.toFixed(2))
    .replace('{{profitFactor}}', statistics.profitFactor);

  // Format strategy performance section
  const strategyPerformance = Object.entries(statistics.strategyPerformance)
    .map(([strategy, stats]) => {
      const typedStats = stats as { wins: number; losses: number; totalPnL: number };
      return `- ${strategy}: ${typedStats.wins} wins, ${typedStats.losses} losses, P&L: ${typedStats.totalPnL.toFixed(2)}`;
    })
    .join('\n');
  finalPrompt = finalPrompt.replace('{{strategyPerformance}}', strategyPerformance);

  // Format market condition performance section
  const marketConditionPerformance = Object.entries(statistics.marketConditionPerformance)
    .map(([condition, stats]) => {
      const typedStats = stats as { wins: number; losses: number };
      return `- ${condition}: ${typedStats.wins} wins, ${typedStats.losses} losses`;
    })
    .join('\n');
  finalPrompt = finalPrompt.replace('{{marketConditionPerformance}}', marketConditionPerformance);

  // Format emotion analysis section
  const emotionAnalysis = Object.entries(statistics.emotionAnalysis)
    .map(([emotion, stats]) => {
      const typedStats = stats as { wins: number; losses: number };
      return `- ${emotion}: ${typedStats.wins} wins, ${typedStats.losses} losses`;
    })
    .join('\n');
  finalPrompt = finalPrompt.replace('{{emotionAnalysis}}', emotionAnalysis);

  // Format time analysis section
  const timeAnalysis = Object.entries(statistics.timeAnalysis)
    .map(([timeSlot, stats]) => {
      const typedStats = stats as { wins: number; losses: number; totalPnL: number };
      return `- ${timeSlot}: ${typedStats.wins} wins, ${typedStats.losses} losses, P&L: ${typedStats.totalPnL.toFixed(2)}`;
    })
    .join('\n');
  finalPrompt = finalPrompt.replace('{{timeAnalysis}}', timeAnalysis);

  // Format position sizing section
  const positionSizing = Object.entries(statistics.positionSizing)
    .map(([size, stats]) => {
      const typedStats = stats as { count: number; wins: number; losses: number; totalPnL: number };
      const winRate = typedStats.count > 0 ? (typedStats.wins / typedStats.count * 100).toFixed(1) : '0.0';
      return `- ${size}: ${typedStats.count} trades, Win Rate: ${winRate}%, P&L: ${typedStats.totalPnL.toFixed(2)}`;
    })
    .join('\n');
  finalPrompt = finalPrompt.replace('{{positionSizing}}', positionSizing);

  // Format risk metrics section
  const riskMetrics = `
- Stop loss usage: ${statistics.riskMetrics.stopLossUsage.toFixed(1)}%
- Take profit usage: ${statistics.riskMetrics.targetUsage.toFixed(1)}%
- Manual overrides: ${statistics.riskMetrics.manualOverrides.toFixed(1)}%
`;
  finalPrompt = finalPrompt.replace('{{riskMetrics}}', riskMetrics);

  return finalPrompt;
}
