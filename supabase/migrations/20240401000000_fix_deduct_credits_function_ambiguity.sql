
-- This migration updates the deduct_credits function to resolve the column ambiguity
CREATE OR REPLACE FUNCTION deduct_credits(user_id_param UUID, credits_to_deduct INTEGER)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  available_subscription_credits INTEGER;
  available_purchased_credits INTEGER;
  from_subscription INTEGER := 0;
  from_purchased INTEGER := 0;
  remaining_credits INTEGER;
BEGIN
  -- Get current credit amounts
  SELECT subscription_credits, purchased_credits INTO available_subscription_credits, available_purchased_credits
  FROM user_credits
  WHERE user_id = user_id_param;
  
  -- Calculate total available credits
  remaining_credits := COALESCE(available_subscription_credits, 0) + COALESCE(available_purchased_credits, 0);
  
  -- Check if sufficient credits are available
  IF remaining_credits < credits_to_deduct THEN
    RAISE EXCEPTION 'Insufficient credits. Available: %, Required: %', remaining_credits, credits_to_deduct;
  END IF;
  
  -- Determine how many credits to take from each type
  IF available_subscription_credits >= credits_to_deduct THEN
    -- Take all from subscription credits
    from_subscription := credits_to_deduct;
    from_purchased := 0;
  ELSE
    -- Take what's available from subscription, then the rest from purchased
    from_subscription := COALESCE(available_subscription_credits, 0);
    from_purchased := credits_to_deduct - from_subscription;
  END IF;
  
  -- Update user_credits table
  UPDATE user_credits
  SET 
    subscription_credits = COALESCE(subscription_credits, 0) - from_subscription,
    purchased_credits = COALESCE(purchased_credits, 0) - from_purchased,
    total_credits_used = COALESCE(total_credits_used, 0) + credits_to_deduct,
    updated_at = NOW()
  WHERE user_id = user_id_param;
  
  -- Record the transaction
  INSERT INTO credit_transactions (
    user_id,
    amount,
    transaction_type,
    description
  ) VALUES (
    user_id_param,
    -credits_to_deduct,
    'deduction',
    CASE 
      WHEN credits_to_deduct = 1 THEN 'Used for risk profile analysis'
      WHEN credits_to_deduct = 3 THEN 'Analysis of 7 days of trades'
      WHEN credits_to_deduct = 5 THEN 'Analysis of 30 days of trades'
      ELSE 'Analysis of trades'
    END
  );
  
  -- Return remaining credits
  RETURN (COALESCE(available_subscription_credits, 0) - from_subscription) + (COALESCE(available_purchased_credits, 0) - from_purchased);
END;
$$;
