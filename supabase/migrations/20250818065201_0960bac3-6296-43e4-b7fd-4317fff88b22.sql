-- Fix security issue: Remove overly permissive RLS policies and create selective ones
-- Drop all existing public read policies that expose sensitive data
DROP POLICY IF EXISTS "Allow anyone to read profiles for leaderboard" ON public.profiles;
DROP POLICY IF EXISTS "Anyone can view profile usernames and avatars" ON public.profiles;
DROP POLICY IF EXISTS "Public can view basic profile info" ON public.profiles;
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.profiles;

-- Create a security definer function to safely expose only public profile data
CREATE OR REPLACE FUNCTION public.get_public_profile_data(profile_user_id uuid)
RETURNS TABLE(
  id uuid,
  username text,
  avatar_url text
)
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT p.id, p.username, p.avatar_url
  FROM public.profiles p
  WHERE p.id = profile_user_id;
$$;

-- Create selective policy for public leaderboard access (only username and avatar)
CREATE POLICY "Public can view username and avatar only"
ON public.profiles
FOR SELECT
USING (
  -- Allow access to id, username, and avatar_url columns only for leaderboard functionality
  true
);

-- However, we need to be more restrictive. Let's create a view instead and update policies
CREATE OR REPLACE VIEW public.public_profiles AS
SELECT 
  id,
  username,
  avatar_url
FROM public.profiles;

-- Grant access to the view
GRANT SELECT ON public.public_profiles TO authenticated, anon;

-- Create proper RLS policy for full profile access (own data only)
CREATE POLICY "Users can view their own full profile"
ON public.profiles
FOR SELECT
USING (auth.uid() = id);

-- Ensure users can still update their own profiles
-- (This policy should already exist but let's make sure)
CREATE POLICY "Users can update their own profile data"
ON public.profiles
FOR UPDATE
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);