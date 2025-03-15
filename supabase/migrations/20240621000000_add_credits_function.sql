
-- Function to safely add credits to a user's account
CREATE OR REPLACE FUNCTION public.add_credits(user_id UUID, credits_to_add INTEGER)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  current_credits INTEGER;
BEGIN
  -- Get current purchased credits
  SELECT purchased_credits INTO current_credits
  FROM public.user_credits
  WHERE user_id = $1;
  
  -- Return the sum
  RETURN COALESCE(current_credits, 0) + credits_to_add;
END;
$$;
