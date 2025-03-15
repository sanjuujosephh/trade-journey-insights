
-- Fixed function to handle ambiguous user_id reference
CREATE OR REPLACE FUNCTION public.deduct_credits(user_id uuid, credits_to_deduct integer)
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  current_subscription_credits INTEGER;
  current_purchased_credits INTEGER;
  total_available_credits INTEGER;
  remaining_to_deduct INTEGER;
  result INTEGER;
BEGIN
  -- Get current credits
  SELECT 
    subscription_credits, 
    purchased_credits
  INTO 
    current_subscription_credits, 
    current_purchased_credits
  FROM public.user_credits
  WHERE user_credits.user_id = $1;
  
  -- Return error if user not found
  IF current_subscription_credits IS NULL THEN
    RAISE EXCEPTION 'User credits not found';
  END IF;
  
  -- Calculate total available credits
  total_available_credits := current_subscription_credits + current_purchased_credits;
  
  -- Check if user has enough credits
  IF total_available_credits < credits_to_deduct THEN
    RAISE EXCEPTION 'Insufficient credits. Required: %, Available: %', credits_to_deduct, total_available_credits;
  END IF;
  
  -- First deduct from subscription credits, then from purchased credits if needed
  IF current_subscription_credits >= credits_to_deduct THEN
    -- Deduct only from subscription credits
    UPDATE public.user_credits
    SET 
      subscription_credits = subscription_credits - credits_to_deduct,
      total_credits_used = total_credits_used + credits_to_deduct,
      updated_at = NOW()
    WHERE user_credits.user_id = $1;
    
    result := total_available_credits - credits_to_deduct;
  ELSE
    -- Deduct all subscription credits and the remaining from purchased credits
    remaining_to_deduct := credits_to_deduct - current_subscription_credits;
    
    UPDATE public.user_credits
    SET 
      subscription_credits = 0,
      purchased_credits = purchased_credits - remaining_to_deduct,
      total_credits_used = total_credits_used + credits_to_deduct,
      updated_at = NOW()
    WHERE user_credits.user_id = $1;
    
    result := total_available_credits - credits_to_deduct;
  END IF;
  
  -- Insert transaction record
  INSERT INTO public.credit_transactions (
    user_id, 
    amount, 
    transaction_type, 
    description
  ) VALUES (
    $1, 
    -credits_to_deduct, 
    'deduction', 
    'AI Analysis credit usage'
  );
  
  -- Return updated credit count
  RETURN result;
END;
$$;
