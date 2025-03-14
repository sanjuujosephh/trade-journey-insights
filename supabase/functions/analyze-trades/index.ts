
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { handleAnalyzeTradesRequest } from "./handlers.ts";
import { corsHeaders } from "./cors.ts";

// Main serve function
serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    return await handleAnalyzeTradesRequest(req);
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
