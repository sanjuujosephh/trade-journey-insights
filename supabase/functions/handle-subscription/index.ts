
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1"
import Razorpay from "npm:razorpay";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const razorpayKeyId = Deno.env.get('RAZORPAY_KEY_ID')
const razorpayKeySecret = Deno.env.get('RAZORPAY_KEY_SECRET')
const supabaseUrl = Deno.env.get('SUPABASE_URL')
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')

const razorpay = new Razorpay({
  key_id: razorpayKeyId,
  key_secret: razorpayKeySecret,
})

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabase = createClient(supabaseUrl!, supabaseServiceKey!)
    
    if (req.method === 'POST') {
      const { action, userId, plan } = await req.json()

      if (action === 'create') {
        // Create a Razorpay customer
        const customer = await razorpay.customers.create({
          email: 'user@example.com', // You'll need to pass the user's email
          notes: {
            supabase_id: userId,
          },
        })

        // Create a subscription
        const subscription = await razorpay.subscriptions.create({
          plan_id: plan,
          customer_id: customer.id,
          total_count: 12, // Number of billing cycles
        })

        // Store subscription details in Supabase
        const { data, error } = await supabase
          .from('subscriptions')
          .insert({
            user_id: userId,
            razorpay_subscription_id: subscription.id,
            razorpay_customer_id: customer.id,
            current_period_start: new Date(subscription.current_start),
            current_period_end: new Date(subscription.current_end),
          })
          .single()

        if (error) throw error

        return new Response(
          JSON.stringify({ 
            subscription_id: subscription.id,
            short_url: subscription.short_url 
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      if (action === 'cancel') {
        // Get subscription ID from Supabase
        const { data: subData, error: subError } = await supabase
          .from('subscriptions')
          .select('razorpay_subscription_id')
          .eq('user_id', userId)
          .single()

        if (subError) throw subError

        // Cancel subscription in Razorpay
        await razorpay.subscriptions.cancel(subData.razorpay_subscription_id)

        // Update status in Supabase
        const { error: updateError } = await supabase
          .from('subscriptions')
          .update({ status: 'cancelled' })
          .eq('user_id', userId)

        if (updateError) throw updateError

        return new Response(
          JSON.stringify({ message: 'Subscription cancelled successfully' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }
    }

    return new Response(JSON.stringify({ error: 'Invalid request' }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    })

  } catch (error) {
    console.error('Error:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    })
  }
})
