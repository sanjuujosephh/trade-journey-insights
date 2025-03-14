
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

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
    
    // Calculate summary statistics
    const totalTrades = trades.length;
    const winningTrades = trades.filter((t: any) => t.outcome === 'profit').length;
    const winRate = ((winningTrades / totalTrades) * 100).toFixed(1);
    
    // Advanced statistics
    const totalPnL = trades.reduce((sum: number, trade: any) => {
      const pnl = trade.exit_price && trade.entry_price && trade.quantity
        ? (trade.exit_price - trade.entry_price) * trade.quantity
        : 0;
      return sum + pnl;
    }, 0);

    // New: Calculate average trade PnL
    const avgTradePnL = totalPnL / totalTrades;

    // New: Calculate profit factor (sum of profits / sum of losses)
    let sumProfits = 0;
    let sumLosses = 0;
    trades.forEach((trade: any) => {
      const pnl = trade.exit_price && trade.entry_price && trade.quantity
        ? (trade.exit_price - trade.entry_price) * trade.quantity
        : 0;
      if (pnl > 0) sumProfits += pnl;
      if (pnl < 0) sumLosses += Math.abs(pnl);
    });
    const profitFactor = sumLosses > 0 ? (sumProfits / sumLosses).toFixed(2) : "∞";

    // Analyze strategies
    const strategyPerformance = trades.reduce((acc: any, trade: any) => {
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

    // Analysis by market conditions
    const marketConditionPerformance = trades.reduce((acc: any, trade: any) => {
      if (trade.market_condition) {
        if (!acc[trade.market_condition]) {
          acc[trade.market_condition] = { wins: 0, losses: 0 };
        }
        acc[trade.market_condition][trade.outcome === 'profit' ? 'wins' : 'losses']++;
      }
      return acc;
    }, {});

    // Analyze emotions
    const emotionAnalysis = trades.reduce((acc: any, trade: any) => {
      if (trade.entry_emotion) {
        if (!acc[trade.entry_emotion]) {
          acc[trade.entry_emotion] = { wins: 0, losses: 0 };
        }
        acc[trade.entry_emotion][trade.outcome === 'profit' ? 'wins' : 'losses']++;
      }
      return acc;
    }, {});

    // New: Time analysis - hour of day performance
    const timeAnalysis = trades.reduce((acc: any, trade: any) => {
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

    // New: Position sizing analysis
    const positionSizing = trades.reduce((acc: any, trade: any) => {
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

    // New: Risk management metrics
    const riskMetrics = {
      stopLossUsage: trades.filter((t: any) => t.exit_reason === 'stop_loss').length / totalTrades * 100,
      targetUsage: trades.filter((t: any) => t.exit_reason === 'target').length / totalTrades * 100,
      manualOverrides: trades.filter((t: any) => t.exit_reason === 'manual').length / totalTrades * 100,
    };

    // Create default prompt if no custom prompt is provided
    const defaultPrompt = `As a trading analyst, analyze these trading patterns:

Trading Summary:
- Total Trades: ${totalTrades}
- Win Rate: ${winRate}%
- Total P&L: ${totalPnL.toFixed(2)}
- Average Trade P&L: ${avgTradePnL.toFixed(2)}
- Profit Factor: ${profitFactor}

Strategy Performance:
${Object.entries(strategyPerformance).map(([strategy, stats]: [string, any]) => 
  `${strategy}: ${stats.wins} wins, ${stats.losses} losses, P&L: ${stats.totalPnL.toFixed(2)}`
).join('\n')}

Market Conditions:
${Object.entries(marketConditionPerformance).map(([condition, stats]: [string, any]) => 
  `${condition}: ${stats.wins} wins, ${stats.losses} losses, Win Rate: ${stats.wins + stats.losses > 0 ? ((stats.wins / (stats.wins + stats.losses)) * 100).toFixed(1) : 0}%`
).join('\n')}

Emotional Analysis:
${Object.entries(emotionAnalysis).map(([emotion, stats]: [string, any]) => 
  `${emotion}: ${stats.wins} wins, ${stats.losses} losses, Win Rate: ${stats.wins + stats.losses > 0 ? ((stats.wins / (stats.wins + stats.losses)) * 100).toFixed(1) : 0}%`
).join('\n')}

Time Analysis:
${Object.entries(timeAnalysis).map(([timeSlot, stats]: [string, any]) => 
  `${timeSlot}: ${stats.wins} wins, ${stats.losses} losses, P&L: ${stats.totalPnL.toFixed(2)}`
).join('\n')}

Position Sizing:
${Object.entries(positionSizing).map(([size, stats]: [string, any]) => 
  `${size}: ${stats.count} trades, Win Rate: ${stats.count > 0 ? ((stats.wins / stats.count) * 100).toFixed(1) : 0}%, P&L: ${stats.totalPnL.toFixed(2)}`
).join('\n')}

Risk Management:
Stop loss usage: ${riskMetrics.stopLossUsage.toFixed(1)}%
Take profit usage: ${riskMetrics.targetUsage.toFixed(1)}%
Manual overrides: ${riskMetrics.manualOverrides.toFixed(1)}%

Provide specific insights on:
1. Pattern analysis of winning vs losing trades
2. Strategy effectiveness
3. Risk management suggestions
4. Concrete recommendations for improvement
5. How emotions are affecting trading decisions

Trades data (sample): ${JSON.stringify(trades.slice(0, 5))}`;

    // Use the custom prompt if provided, otherwise use the default
    let finalPrompt = defaultPrompt;
    if (customPrompt) {
      // Replace variables in the custom prompt with actual values
      finalPrompt = customPrompt
        .replace('{{totalTrades}}', totalTrades.toString())
        .replace('{{winRate}}', winRate.toString())
        .replace('{{totalPnL}}', totalPnL.toFixed(2))
        .replace('{{avgTradePnL}}', avgTradePnL.toFixed(2))
        .replace('{{profitFactor}}', profitFactor.toString())
        .replace('{{strategyPerformance}}', 
          Object.entries(strategyPerformance)
            .map(([strategy, stats]: [string, any]) => 
              `${strategy}: ${stats.wins} wins, ${stats.losses} losses, P&L: ${stats.totalPnL.toFixed(2)}`)
            .join('\n')
        )
        .replace('{{marketConditionPerformance}}',
          Object.entries(marketConditionPerformance)
            .map(([condition, stats]: [string, any]) => 
              `${condition}: ${stats.wins} wins, ${stats.losses} losses, Win Rate: ${stats.wins + stats.losses > 0 ? ((stats.wins / (stats.wins + stats.losses)) * 100).toFixed(1) : 0}%`)
            .join('\n')
        )
        .replace('{{emotionAnalysis}}',
          Object.entries(emotionAnalysis)
            .map(([emotion, stats]: [string, any]) => 
              `${emotion}: ${stats.wins} wins, ${stats.losses} losses, Win Rate: ${stats.wins + stats.losses > 0 ? ((stats.wins / (stats.wins + stats.losses)) * 100).toFixed(1) : 0}%`)
            .join('\n')
        )
        .replace('{{timeAnalysis}}',
          Object.entries(timeAnalysis)
            .map(([timeSlot, stats]: [string, any]) => 
              `${timeSlot}: ${stats.wins} wins, ${stats.losses} losses, P&L: ${stats.totalPnL.toFixed(2)}`)
            .join('\n')
        )
        .replace('{{positionSizing}}',
          Object.entries(positionSizing)
            .map(([size, stats]: [string, any]) => 
              `${size}: ${stats.count} trades, Win Rate: ${stats.count > 0 ? ((stats.wins / stats.count) * 100).toFixed(1) : 0}%, P&L: ${stats.totalPnL.toFixed(2)}`)
            .join('\n')
        )
        .replace('{{riskMetrics}}',
          `Stop loss usage: ${riskMetrics.stopLossUsage.toFixed(1)}%\nTake profit usage: ${riskMetrics.targetUsage.toFixed(1)}%\nManual overrides: ${riskMetrics.manualOverrides.toFixed(1)}%`
        )
        .replace('{{tradesData}}', JSON.stringify(trades.slice(0, 5)));
    }

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
            content: finalPrompt 
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

    return new Response(JSON.stringify({ 
      analysis: data.choices[0].message.content 
    }), {
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
