
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const supabaseUrl = Deno.env.get('SUPABASE_URL')
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabase = createClient(supabaseUrl!, supabaseServiceKey!)
    
    if (req.method === 'POST') {
      const { action, userId, duration, adminKey } = await req.json()
      
      // Simple admin key validation - in production, use a more secure approach
      const expectedAdminKey = Deno.env.get('ADMIN_API_KEY')
      if (!expectedAdminKey || adminKey !== expectedAdminKey) {
        return new Response(
          JSON.stringify({ error: 'Unauthorized' }),
          { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      if (action === 'create-trial') {
        if (!userId || !duration) {
          return new Response(
            JSON.stringify({ error: 'Missing required parameters' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        }
        
        // Verify the user exists
        const { data: user, error: userError } = await supabase
          .from('profiles')
          .select('id')
          .eq('id', userId)
          .single()
        
        if (userError || !user) {
          return new Response(
            JSON.stringify({ error: 'User not found' }),
            { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        }
        
        // Check for existing subscription
        const { data: existingSub, error: subError } = await supabase
          .from('subscriptions')
          .select('id, status')
          .eq('user_id', userId)
          .eq('status', 'active')
          .maybeSingle()
        
        if (subError) {
          return new Response(
            JSON.stringify({ error: 'Error checking subscription status' }),
            { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        }
        
        if (existingSub) {
          return new Response(
            JSON.stringify({ error: 'User already has an active subscription' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        }
        
        // Calculate start and end dates
        const startDate = new Date()
        const endDate = new Date(startDate)
        endDate.setDate(endDate.getDate() + duration)
        
        // Create a mock payment ID for the trial
        const trialPaymentId = `trial_${duration}_days_${Date.now()}`
        
        // Create the trial subscription
        const { data, error } = await supabase
          .from('subscriptions')
          .insert([{
            user_id: userId,
            payment_id: trialPaymentId,
            status: 'active',
            plan_type: 'trial',
            current_period_start: startDate.toISOString(),
            current_period_end: endDate.toISOString(),
            end_date: endDate.toISOString(),
            amount: 0 // Trials are free
          }])
          .select()
        
        if (error) {
          return new Response(
            JSON.stringify({ error: 'Failed to create trial subscription' }),
            { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        }
        
        return new Response(
          JSON.stringify({ 
            success: true, 
            message: `${duration}-day trial successfully activated`,
            subscription: data[0]
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }
      
      if (action === 'check-trial-history') {
        if (!userId) {
          return new Response(
            JSON.stringify({ error: 'Missing user ID' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        }
        
        const { data, error } = await supabase
          .from('subscriptions')
          .select('id, created_at')
          .eq('user_id', userId)
          .eq('plan_type', 'trial')
        
        if (error) {
          return new Response(
            JSON.stringify({ error: 'Error checking trial history' }),
            { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        }
        
        return new Response(
          JSON.stringify({ 
            hasHadTrial: data && data.length > 0,
            trialHistory: data
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }
    }

    return new Response(
      JSON.stringify({ error: 'Invalid request method or action' }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Error in manage-trial function:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
