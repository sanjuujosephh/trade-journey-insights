-- Remove the view that's still causing security definer issues
DROP VIEW IF EXISTS public.leaderboard_profiles CASCADE;

-- Create a more secure approach using a dedicated function for leaderboard data
-- This function will safely expose only the needed data for leaderboards
CREATE OR REPLACE FUNCTION public.get_leaderboard_profile_data()
 RETURNS TABLE(id uuid, username text, avatar_url text)
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = public
AS $function$
BEGIN
  RETURN QUERY
  SELECT p.id, p.username, p.avatar_url
  FROM public.profiles p
  WHERE p.username IS NOT NULL;
END;
$function$;

-- Update the get_daily_leaderboard function to use the secure function
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
  -- Return leaderboard data using the secure function
  RETURN QUERY
  WITH profile_data AS (
    SELECT * FROM public.get_leaderboard_profile_data()
  ),
  daily_pnl AS (
    SELECT 
      pd.id as user_id,
      pd.username,
      pd.avatar_url,
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
      profile_data pd ON t.user_id = pd.id
    WHERE 
      -- Filter trades from the last 24 hours
      t.timestamp >= one_day_ago
      AND t.exit_price IS NOT NULL
      AND pd.username IS NOT NULL
    GROUP BY 
      pd.id, pd.username, pd.avatar_url
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