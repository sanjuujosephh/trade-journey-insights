
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { Trade } from "../../../src/types/trade.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { trades } = await req.json();
    
    // Prepare trades data for analysis
    const tradesSummary = trades.map((trade: Trade) => ({
      outcome: trade.outcome,
      entryPrice: trade.entry_price,
      exitPrice: trade.exit_price,
      symbol: trade.symbol,
      strategy: trade.strategy,
      stopLoss: trade.stop_loss,
      notes: trade.notes,
      entryTime: trade.entry_time,
      exitTime: trade.exit_time,
    }));

    const prompt = `Analyze these trading patterns and provide insights:
    - What patterns do you see in winning vs losing trades?
    - What strategies are performing best?
    - What risk management improvements could be made?
    - Any specific recommendations for improvement?
    
    Here are the trades: ${JSON.stringify(tradesSummary)}`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: 'You are a professional trading analyst. Provide clear, actionable insights.' },
          { role: 'user', content: prompt }
        ],
      }),
    });

    const data = await response.json();
    const analysis = data.choices[0].message.content;

    return new Response(JSON.stringify({ analysis }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in analyze-trades function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
