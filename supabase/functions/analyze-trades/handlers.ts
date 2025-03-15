
import { corsHeaders } from "./cors.ts";
import { calculateTradeStatistics } from "./statistics.ts";
import { createAnalysisPrompt } from "./prompt.ts";
import { getAnalysisFromOpenAI } from "./openai.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.31.0";

// Initialize Supabase client with SERVICE_ROLE key for admin privileges
const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function handleAnalyzeTradesRequest(req) {
  // Ensure CORS headers are added to all responses
  const headers = { ...corsHeaders, 'Content-Type': 'application/json' };

  // Check for required env variables
  const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
  if (!openAIApiKey) {
    console.error('OpenAI API key is not configured');
    return new Response(
      JSON.stringify({ error: 'OpenAI API key is not configured', success: false }),
      { status: 500, headers }
    );
  }

  // Check if service role key is set
  if (!supabaseServiceKey) {
    console.error('SUPABASE_SERVICE_ROLE_KEY is not configured');
    return new Response(
      JSON.stringify({ error: 'Database authentication key is missing', success: false }),
      { status: 500, headers }
    );
  }

  try {
    // Extract request data
    const requestData = await req.json();
    const { trades, days = 1, customPrompt, userId } = requestData;
    
    console.log(`Received request to analyze ${trades?.length || 0} trades over ${days} days for user ${userId || 'unknown'}`);
    
    if (!userId) {
      console.error('Missing user ID in request');
      return new Response(
        JSON.stringify({ error: "User ID is required for credit validation", success: false }),
        { status: 400, headers }
      );
    }
    
    if (!trades || !Array.isArray(trades) || trades.length === 0) {
      console.error('No trades provided for analysis');
      return new Response(
        JSON.stringify({ error: "No trades provided for analysis", success: false }),
        { status: 400, headers }
      );
    }
    
    // Determine credit cost based on days
    const creditCost = days === 1 ? 1 : days === 7 ? 3 : 5;
    
    console.log(`Attempting to deduct ${creditCost} credits for user ${userId} for analysis of ${days} days`);
    
    // Deduct credits using service role for full permissions
    let deductResult;
    try {
      // Verify user exists and has sufficient credits before attempting deduction
      const { data: userData, error: userError } = await supabase
        .from('user_credits')
        .select('subscription_credits, purchased_credits')
        .eq('user_id', userId)
        .single();
      
      if (userError) {
        console.error('Error fetching user credits:', userError);
        return new Response(
          JSON.stringify({ 
            error: "Failed to verify user credits", 
            message: userError.message,
            success: false 
          }),
          { status: 403, headers }
        );
      }
      
      const totalAvailableCredits = (userData.subscription_credits || 0) + (userData.purchased_credits || 0);
      
      if (totalAvailableCredits < creditCost) {
        console.error(`Insufficient credits. Required: ${creditCost}, Available: ${totalAvailableCredits}`);
        return new Response(
          JSON.stringify({ 
            error: "Insufficient credits", 
            message: `You need ${creditCost} credits for this analysis. You have ${totalAvailableCredits} credits available.`,
            success: false 
          }),
          { status: 403, headers }
        );
      }
      
      // Call the PostgreSQL function to deduct credits - fixing the ambiguous column issue
      const { data, error } = await supabase.rpc(
        'deduct_credits',
        { 
          user_id_param: userId, // Use a different parameter name to avoid ambiguity
          credits_to_deduct: creditCost 
        }
      );
      
      if (error) {
        console.error('Error deducting credits:', error);
        return new Response(
          JSON.stringify({ 
            error: "Credit deduction failed", 
            message: error.message,
            success: false 
          }),
          { status: 403, headers }
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
        { status: 500, headers }
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
          { headers }
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
          { status: 500, headers }
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
        { status: 500, headers }
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
      { status: 500, headers }
    );
  }
}
