
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import "https://deno.land/x/xhr@0.1.0/mod.ts"

const openAIApiKey = Deno.env.get('OPENAI_API_KEY')

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { trades } = await req.json()

    // Process each trade with AI
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
            content: `You are a trade analysis assistant. Convert CSV trade data into structured trade entries.
            Analyze the patterns and extract relevant information like:
            - Entry and exit prices
            - Trade direction (long/short)
            - Market conditions
            - Strategy used
            - Risk/reward ratios
            - Emotional state during trade
            Return the data in a format matching the trades table schema.`
          },
          {
            role: 'user',
            content: `Process these trades and return a JSON array of trade objects: ${JSON.stringify(trades)}`
          }
        ],
      }),
    })

    const aiResponse = await response.json()
    const processedTrades = JSON.parse(aiResponse.choices[0].message.content)

    // Add timestamps and ensure required fields
    const finalTrades = processedTrades.map((trade: any) => ({
      ...trade,
      timestamp: new Date().toISOString(),
      entry_time: trade.entry_time || new Date().toISOString(),
    }))

    return new Response(
      JSON.stringify({ trades: finalTrades }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error processing trades:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})
