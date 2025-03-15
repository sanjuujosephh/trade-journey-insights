
import { corsHeaders } from "./cors.ts";
import { calculateTradeStatistics } from "./statistics.ts";
import { createAnalysisPrompt } from "./prompt.ts";
import { getAnalysisFromOpenAI } from "./openai.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.31.0";

// Initialize Supabase client
const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function handleAnalyzeTradesRequest(req) {
  // Set CORS headers for all responses
  const headers = { ...corsHeaders, 'Content-Type': 'application/json' };

  // Validate required environment variables
  const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
  if (!openAIApiKey) {
    console.error('OpenAI API key is not configured');
    return new Response(
      JSON.stringify({ error: 'OpenAI API key is not configured', success: false }),
      { status: 500, headers }
    );
  }

  if (!supabaseServiceKey) {
    console.error('SUPABASE_SERVICE_ROLE_KEY is not configured');
    return new Response(
      JSON.stringify({ error: 'Database authentication key is missing', success: false }),
      { status: 500, headers }
    );
  }

  try {
    // Parse request data
    const { trades, days = 1, customPrompt, userId } = await req.json();
    
    console.log(`Processing analysis request: ${trades?.length || 0} trades over ${days} days for user ${userId}`);
    
    // Validate request data
    if (!userId) {
      console.error('Missing user ID in request');
      return new Response(
        JSON.stringify({ error: "User ID is required", success: false }),
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
    
    console.log(`Credit cost for analysis: ${creditCost}`);
    
    // Get user credit information
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
    
    // Calculate total available credits
    const subscriptionCredits = userData.subscription_credits || 0;
    const purchasedCredits = userData.purchased_credits || 0;
    const totalAvailableCredits = subscriptionCredits + purchasedCredits;
    
    // Check if user has enough credits
    if (totalAvailableCredits < creditCost) {
      console.error(`Insufficient credits. Available: ${totalAvailableCredits}, Required: ${creditCost}`);
      return new Response(
        JSON.stringify({ 
          error: "Insufficient credits", 
          message: `You need ${creditCost} credits for this analysis. You have ${totalAvailableCredits} credits available.`,
          success: false 
        }),
        { status: 403, headers }
      );
    }
    
    // Process deduction logic
    let fromSubscription = 0;
    let fromPurchased = 0;
    
    // Calculate deduction source
    if (subscriptionCredits >= creditCost) {
      fromSubscription = creditCost;
    } else {
      fromSubscription = subscriptionCredits;
      fromPurchased = creditCost - fromSubscription;
    }
    
    // Update user credits
    const { error: updateError } = await supabase
      .from('user_credits')
      .update({
        subscription_credits: subscriptionCredits - fromSubscription,
        purchased_credits: purchasedCredits - fromPurchased,
        total_credits_used: (userData.total_credits_used || 0) + creditCost,
        updated_at: new Date().toISOString()
      })
      .eq('user_id', userId);
    
    if (updateError) {
      console.error('Error updating user credits:', updateError);
      return new Response(
        JSON.stringify({ 
          error: "Failed to update credits", 
          message: updateError.message,
          success: false 
        }),
        { status: 500, headers }
      );
    }
    
    // Record the transaction
    const { error: transactionError } = await supabase
      .from('credit_transactions')
      .insert({
        user_id: userId,
        amount: -creditCost,
        transaction_type: 'deduction',
        description: days === 1 
          ? 'Used for risk profile analysis' 
          : days === 7 
          ? 'Analysis of 7 days of trades' 
          : 'Analysis of 30 days of trades'
      });
    
    if (transactionError) {
      console.error('Error recording transaction:', transactionError);
      // Continue even if transaction logging fails
    }
    
    // Calculate statistics and generate analysis
    const statistics = calculateTradeStatistics(trades);
    const prompt = createAnalysisPrompt(statistics, trades, customPrompt);
    
    console.log('Requesting analysis from OpenAI');
    
    try {
      // Get analysis from OpenAI
      const analysis = await getAnalysisFromOpenAI(prompt);
      
      console.log('Analysis received successfully');
      
      const remainingCredits = totalAvailableCredits - creditCost;
      
      return new Response(
        JSON.stringify({ 
          analysis, 
          success: true,
          creditsUsed: creditCost,
          remainingCredits
        }), 
        { headers }
      );
    } catch (openaiError) {
      console.error('OpenAI API error:', openaiError);
      return new Response(
        JSON.stringify({ 
          error: "OpenAI analysis failed", 
          message: openaiError.message || "Failed to generate analysis",
          success: false 
        }),
        { status: 500, headers }
      );
    }
    
  } catch (error) {
    console.error('Unhandled error in analyze trades function:', error);
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
