
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

    const { trades } = await req.json();
    
    // Calculate summary statistics
    const totalTrades = trades.length;
    const winningTrades = trades.filter((t: any) => t.outcome === 'profit').length;
    const winRate = ((winningTrades / totalTrades) * 100).toFixed(1);
    
    const strategyPerformance = trades.reduce((acc: any, trade: any) => {
      if (!acc[trade.strategy]) {
        acc[trade.strategy] = { wins: 0, losses: 0 };
      }
      acc[trade.strategy][trade.outcome === 'profit' ? 'wins' : 'losses']++;
      return acc;
    }, {});

    const prompt = `As a trading analyst, analyze these trading patterns:

Trading Summary:
- Total Trades: ${totalTrades}
- Win Rate: ${winRate}%

Strategy Performance:
${Object.entries(strategyPerformance).map(([strategy, stats]: [string, any]) => 
  `${strategy}: ${stats.wins} wins, ${stats.losses} losses`
).join('\n')}

Provide specific insights on:
1. Pattern analysis of winning vs losing trades
2. Strategy effectiveness
3. Risk management suggestions
4. Concrete recommendations for improvement

Trades data: ${JSON.stringify(trades.slice(0, 10))}`;

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
