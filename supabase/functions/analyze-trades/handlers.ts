
import { corsHeaders } from "./cors.ts";
import { calculateTradeStatistics } from "./statistics.ts";
import { createAnalysisPrompt } from "./prompt.ts";
import { getAnalysisFromOpenAI } from "./openai.ts";

export async function handleAnalyzeTradesRequest(req) {
  const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

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
}
