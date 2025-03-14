
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Main serve function
serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (!openAIApiKey) {
      throw new Error('OpenAI API key is not configured');
    }

    const { trades, days = 1, customPrompt } = await req.json();
    
    // Calculate all trade statistics
    const statistics = calculateTradeStatistics(trades);
    
    // Generate the analysis prompt
    const finalPrompt = createAnalysisPrompt(statistics, trades, customPrompt);

    // Get analysis from OpenAI
    const analysis = await getAnalysisFromOpenAI(finalPrompt);
    
    return new Response(JSON.stringify({ analysis }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in analyze-trades function:', error);
    return new Response(JSON.stringify({ 
      error: error.message || 'Failed to analyze trades' 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

// Calculate all statistics from trades
function calculateTradeStatistics(trades) {
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

// Create the default prompt or customize an existing one
function createAnalysisPrompt(stats, trades, customPrompt) {
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

// Call OpenAI API to get the analysis
async function getAnalysisFromOpenAI(prompt) {
  console.log('Sending request to OpenAI...');
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${openAIApiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [
        { 
          role: 'system', 
          content: 'You are a professional trading analyst. Provide clear, actionable insights in a concise format.'
        },
        { 
          role: 'user', 
          content: prompt 
        }
      ],
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    console.error('OpenAI API error:', error);
    throw new Error('Failed to get analysis from OpenAI');
  }

  const data = await response.json();
  console.log('Received response from OpenAI');
  
  if (!data.choices?.[0]?.message?.content) {
    throw new Error('Invalid response from OpenAI');
  }

  return data.choices[0].message.content;
}
