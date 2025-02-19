
-- Drop the existing function and trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- Create the updated function
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  avatar_url TEXT;
BEGIN
  -- Generate avatar URL using DiceBear
  avatar_url := 'https://api.dicebear.com/7.x/avataaars/svg?seed=' || 
                COALESCE(new.raw_user_meta_data->>'username', 
                substr(encode(gen_random_bytes(6), 'hex'), 1, 8));

  -- Insert the new profile with the avatar URL
  INSERT INTO public.profiles (id, username, avatar_url)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'username', 'User_' || substr(new.id::text, 1, 8)),
    avatar_url
  );
  
  RETURN new;
END;
$$;

-- Recreate the trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
