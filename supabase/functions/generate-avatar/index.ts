
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { username } = await req.json()
    
    // Generate a deterministic seed based on the username
    const seed = username || Math.random().toString(36).substring(7)
    
    // Use DiceBear to generate an avatar
    const avatarUrl = `https://api.dicebear.com/7.x/avataaars/svg?seed=${seed}`

    // Fetch the SVG content
    const response = await fetch(avatarUrl)
    const svgContent = await response.text()

    return new Response(
      JSON.stringify({ 
        avatarUrl,
        svgContent 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      },
    )
  }
})
