
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
    const requestData = await req.json();
    const { trades, days = 1, customPrompt, userId } = requestData;
    
    console.log(`Received request to analyze ${trades?.length || 0} trades over ${days} days for user ${userId || 'unknown'}`);
    
    if (!userId) {
      return new Response(
        JSON.stringify({ error: "User ID is required for credit validation", success: false }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    if (!trades || !Array.isArray(trades) || trades.length === 0) {
      return new Response(
        JSON.stringify({ error: "No trades provided for analysis", success: false }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    // Determine credit cost based on days
    const creditCost = days === 1 ? 1 : days === 7 ? 3 : 5;
    
    console.log(`Attempting to deduct ${creditCost} credits for user ${userId} for analysis of ${days} days`);
    
    // Deduct credits
    let deductResult;
    try {
      // Call the PostgreSQL function to deduct credits
      const { data, error } = await supabase.rpc(
        'deduct_credits',
        { user_id: userId, credits_to_deduct: creditCost }
      );
      
      if (error) {
        console.error('Error deducting credits:', error);
        return new Response(
          JSON.stringify({ 
            error: "Credit deduction failed", 
            message: error.message,
            success: false 
          }),
          { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      deductResult = data;
      console.log(`Successfully deducted ${creditCost} credits. Remaining credits: ${deductResult}`);
      
    } catch (creditError) {
      console.error('Error in credit deduction:', creditError);
      return new Response(
        JSON.stringify({ 
          error: "Credit operation failed", 
          message: creditError.message || "Unknown error during credit operation",
          success: false 
        }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    // Process trades and generate analysis
    try {
      // Calculate all trade statistics
      const statistics = calculateTradeStatistics(trades);
      
      // Generate the analysis prompt
      const finalPrompt = createAnalysisPrompt(statistics, trades, customPrompt);
      
      console.log('Prompt created, requesting analysis from OpenAI...');

      try {
        // Get analysis from OpenAI
        const analysis = await getAnalysisFromOpenAI(finalPrompt);
        
        console.log('Analysis received successfully from OpenAI');
        
        return new Response(
          JSON.stringify({ 
            analysis, 
            success: true,
            creditsUsed: creditCost,
            remainingCredits: deductResult 
          }), 
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      } catch (openaiError) {
        console.error('OpenAI API error:', openaiError);
        
        // Return error response with CORS headers
        return new Response(
          JSON.stringify({ 
            error: "OpenAI analysis failed", 
            message: openaiError.message || "Failed to generate analysis",
            success: false 
          }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    } catch (processingError) {
      console.error('Error processing trades or creating prompt:', processingError);
      return new Response(
        JSON.stringify({ 
          error: "Failed to process trades", 
          message: processingError.message || "Error processing trade data",
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
        message: error.message || "Unknown error occurred",
        success: false 
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
}
