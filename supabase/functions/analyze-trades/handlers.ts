
import { corsHeaders } from "./cors.ts";
import { calculateTradeStatistics } from "./statistics.ts";
import { createAnalysisPrompt } from "./prompt.ts";
import { getAnalysisFromOpenAI } from "./openai.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.31.0";

// Initialize Supabase client
const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY') || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function handleAnalyzeTradesRequest(req) {
  const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

  if (!openAIApiKey) {
    return new Response(
      JSON.stringify({ error: 'OpenAI API key is not configured', success: false }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  try {
    // Extract request data
    const { trades, days = 1, customPrompt, userId } = await req.json();
    
    if (!userId) {
      return new Response(
        JSON.stringify({ error: "User ID is required for credit validation", success: false }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    // Determine credit cost based on days
    const creditCost = days === 1 ? 1 : days === 7 ? 3 : 5;
    
    console.log(`Attempting to deduct ${creditCost} credits for user ${userId} for analysis of ${days} days`);
    
    try {
      // Call the PostgreSQL function to deduct credits
      const { data: deductResult, error: deductError } = await supabase.rpc(
        'deduct_credits',
        { user_id: userId, credits_to_deduct: creditCost }
      );
      
      if (deductError) {
        console.error('Error deducting credits:', deductError);
        return new Response(
          JSON.stringify({ 
            error: "Credit deduction failed", 
            message: deductError.message,
            success: false 
          }),
          { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      console.log(`Successfully deducted ${creditCost} credits. Remaining credits: ${deductResult}`);
      
      // Calculate all trade statistics
      const statistics = calculateTradeStatistics(trades);
      
      // Generate the analysis prompt
      const finalPrompt = createAnalysisPrompt(statistics, trades, customPrompt);

      // Get analysis from OpenAI
      const analysis = await getAnalysisFromOpenAI(finalPrompt);
      
      return new Response(
        JSON.stringify({ 
          analysis, 
          success: true,
          creditsUsed: creditCost,
          remainingCredits: deductResult 
        }), 
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    } catch (error) {
      console.error('Error in credit deduction or analysis:', error);
      return new Response(
        JSON.stringify({ 
          error: "Credit operation or analysis failed", 
          message: error.message,
          success: false 
        }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
  } catch (error) {
    console.error('Error in analyze trades function:', error);
    
    return new Response(
      JSON.stringify({ 
        error: "Analysis failed", 
        message: error.message,
        success: false 
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
}
