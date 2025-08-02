-- Remove all duplicate profiles, keeping only the oldest one for each user_id
DELETE FROM public.profiles 
WHERE id NOT IN (
    SELECT DISTINCT ON (user_id) id 
    FROM public.profiles 
    ORDER BY user_id, created_at ASC
);

-- Drop the existing username constraint
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_username_key;

-- Add a unique constraint on user_id to prevent duplicate profiles
ALTER TABLE public.profiles ADD CONSTRAINT profiles_user_id_unique UNIQUE (user_id);

-- Create a partial unique index for usernames (allowing multiple NULL values)
CREATE UNIQUE INDEX profiles_username_unique_idx ON public.profiles (username) 
WHERE username IS NOT NULL;

-- Drop the existing trigger and function if they exist
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- Create an improved function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Only create profile if one doesn't already exist for this user
  INSERT INTO public.profiles (user_id, display_name, created_at, updated_at)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'display_name', NEW.email),
    NOW(),
    NOW()
  )
  ON CONFLICT (user_id) DO NOTHING;  -- Ignore if profile already exists
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user registration
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();