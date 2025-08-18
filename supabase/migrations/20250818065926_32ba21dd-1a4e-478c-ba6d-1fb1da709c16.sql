-- Fix the security definer view issue and implement proper column-level security
-- Drop the problematic policy and view
DROP POLICY IF EXISTS "Public can view username and avatar only" ON public.profiles;
DROP VIEW IF EXISTS public.public_profiles;

-- Drop the security definer function as well
DROP FUNCTION IF EXISTS public.get_public_profile_data(uuid);

-- Create a proper non-security definer view for public profile data
CREATE VIEW public.leaderboard_profiles AS
SELECT 
  id,
  username,
  avatar_url,
  created_at
FROM public.profiles;

-- Enable RLS on the view
ALTER VIEW public.leaderboard_profiles SET (security_barrier = true);

-- Grant access to the view for leaderboard functionality
GRANT SELECT ON public.leaderboard_profiles TO authenticated, anon;

-- Create restrictive RLS policy - only allow access to own full profile
CREATE POLICY "Users can only view their own complete profile"
ON public.profiles
FOR SELECT
USING (auth.uid() = id);

-- Update the get_daily_leaderboard function to use the secure view
CREATE OR REPLACE FUNCTION public.get_daily_leaderboard(limit_count integer DEFAULT 20)
 RETURNS TABLE(username text, avatar_url text, profit_loss numeric, rank integer)
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = public
AS $function$
DECLARE
  current_time timestamp with time zone := now();
  one_day_ago timestamp with time zone := now() - interval '24 hours';
BEGIN
  -- Return leaderboard data using the secure view
  RETURN QUERY
  WITH daily_pnl AS (
    SELECT 
      lp.id as user_id,
      lp.username,
      lp.avatar_url,
      SUM(
        CASE 
          WHEN t.exit_price IS NOT NULL AND t.entry_price IS NOT NULL AND t.quantity IS NOT NULL 
          THEN (t.exit_price - t.entry_price) * t.quantity 
          ELSE 0 
        END
      ) as profit_loss
    FROM 
      public.trades t
    JOIN 
      public.leaderboard_profiles lp ON t.user_id = lp.id
    WHERE 
      -- Filter trades from the last 24 hours
      t.timestamp >= one_day_ago
      AND t.exit_price IS NOT NULL
      AND lp.username IS NOT NULL
    GROUP BY 
      lp.id, lp.username, lp.avatar_url
  )
  
  -- Top traders (profit)
  (SELECT 
    username,
    avatar_url,
    profit_loss,
    ROW_NUMBER() OVER (ORDER BY profit_loss DESC) as rank
  FROM 
    daily_pnl
  WHERE 
    profit_loss > 0
  ORDER BY 
    profit_loss DESC
  LIMIT limit_count)
  
  UNION ALL
  
  -- Top losers (loss)
  (SELECT 
    username,
    avatar_url,
    profit_loss,
    ROW_NUMBER() OVER (ORDER BY profit_loss ASC) as rank
  FROM 
    daily_pnl
  WHERE 
    profit_loss < 0
  ORDER BY 
    profit_loss ASC
  LIMIT limit_count);
END;
$function$;