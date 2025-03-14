
// Create the default prompt or customize an existing one
export function createAnalysisPrompt(stats, trades, customPrompt) {
  // Create default prompt
  const defaultPrompt = createDefaultPrompt(stats, trades);
  
  // Use the custom prompt if provided, otherwise use the default
  if (!customPrompt) {
    return defaultPrompt;
  }
  
  // Replace variables in the custom prompt with actual values
  return customizePrompt(customPrompt, stats, trades);
}

// Create the default analysis prompt
function createDefaultPrompt(stats, trades) {
  return `As a trading analyst, analyze these trading patterns:

Trading Summary:
- Total Trades: ${stats.totalTrades}
- Win Rate: ${stats.winRate}%
- Total P&L: ${stats.totalPnL.toFixed(2)}
- Average Trade P&L: ${stats.avgTradePnL.toFixed(2)}
- Profit Factor: ${stats.profitFactor}

Strategy Performance:
${Object.entries(stats.strategyPerformance).map(([strategy, stats]) => 
  `${strategy}: ${stats.wins} wins, ${stats.losses} losses, P&L: ${stats.totalPnL.toFixed(2)}`
).join('\n')}

Market Conditions:
${Object.entries(stats.marketConditionPerformance).map(([condition, stats]) => 
  `${condition}: ${stats.wins} wins, ${stats.losses} losses, Win Rate: ${stats.wins + stats.losses > 0 ? ((stats.wins / (stats.wins + stats.losses)) * 100).toFixed(1) : 0}%`
).join('\n')}

Emotional Analysis:
${Object.entries(stats.emotionAnalysis).map(([emotion, stats]) => 
  `${emotion}: ${stats.wins} wins, ${stats.losses} losses, Win Rate: ${stats.wins + stats.losses > 0 ? ((stats.wins / (stats.wins + stats.losses)) * 100).toFixed(1) : 0}%`
).join('\n')}

Time Analysis:
${Object.entries(stats.timeAnalysis).map(([timeSlot, stats]) => 
  `${timeSlot}: ${stats.wins} wins, ${stats.losses} losses, P&L: ${stats.totalPnL.toFixed(2)}`
).join('\n')}

Position Sizing:
${Object.entries(stats.positionSizing).map(([size, stats]) => 
  `${size}: ${stats.count} trades, Win Rate: ${stats.count > 0 ? ((stats.wins / stats.count) * 100).toFixed(1) : 0}%, P&L: ${stats.totalPnL.toFixed(2)}`
).join('\n')}

Risk Management:
Stop loss usage: ${stats.riskMetrics.stopLossUsage.toFixed(1)}%
Take profit usage: ${stats.riskMetrics.targetUsage.toFixed(1)}%
Manual overrides: ${stats.riskMetrics.manualOverrides.toFixed(1)}%

Provide specific insights on:
1. Pattern analysis of winning vs losing trades
2. Strategy effectiveness
3. Risk management suggestions
4. Concrete recommendations for improvement
5. How emotions are affecting trading decisions

Trades data (sample): ${JSON.stringify(trades.slice(0, 5))}`;
}

// Customize a prompt by replacing variables with actual values
function customizePrompt(customPrompt, stats, trades) {
  return customPrompt
    .replace('{{totalTrades}}', stats.totalTrades.toString())
    .replace('{{winRate}}', stats.winRate.toString())
    .replace('{{totalPnL}}', stats.totalPnL.toFixed(2))
    .replace('{{avgTradePnL}}', stats.avgTradePnL.toFixed(2))
    .replace('{{profitFactor}}', stats.profitFactor.toString())
    .replace('{{strategyPerformance}}', 
      Object.entries(stats.strategyPerformance)
        .map(([strategy, stats]) => 
          `${strategy}: ${stats.wins} wins, ${stats.losses} losses, P&L: ${stats.totalPnL.toFixed(2)}`)
        .join('\n')
    )
    .replace('{{marketConditionPerformance}}',
      Object.entries(stats.marketConditionPerformance)
        .map(([condition, stats]) => 
          `${condition}: ${stats.wins} wins, ${stats.losses} losses, Win Rate: ${stats.wins + stats.losses > 0 ? ((stats.wins / (stats.wins + stats.losses)) * 100).toFixed(1) : 0}%`)
        .join('\n')
    )
    .replace('{{emotionAnalysis}}',
      Object.entries(stats.emotionAnalysis)
        .map(([emotion, stats]) => 
          `${emotion}: ${stats.wins} wins, ${stats.losses} losses, Win Rate: ${stats.wins + stats.losses > 0 ? ((stats.wins / (stats.wins + stats.losses)) * 100).toFixed(1) : 0}%`)
        .join('\n')
    )
    .replace('{{timeAnalysis}}',
      Object.entries(stats.timeAnalysis)
        .map(([timeSlot, stats]) => 
          `${timeSlot}: ${stats.wins} wins, ${stats.losses} losses, P&L: ${stats.totalPnL.toFixed(2)}`)
        .join('\n')
    )
    .replace('{{positionSizing}}',
      Object.entries(stats.positionSizing)
        .map(([size, stats]) => 
          `${size}: ${stats.count} trades, Win Rate: ${stats.count > 0 ? ((stats.wins / stats.count) * 100).toFixed(1) : 0}%, P&L: ${stats.totalPnL.toFixed(2)}`)
        .join('\n')
    )
    .replace('{{riskMetrics}}',
      `Stop loss usage: ${stats.riskMetrics.stopLossUsage.toFixed(1)}%\nTake profit usage: ${stats.riskMetrics.targetUsage.toFixed(1)}%\nManual overrides: ${stats.riskMetrics.manualOverrides.toFixed(1)}%`
    )
    .replace('{{tradesData}}', JSON.stringify(trades.slice(0, 5)));
}
