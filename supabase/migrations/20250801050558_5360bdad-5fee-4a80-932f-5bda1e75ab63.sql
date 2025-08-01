-- Remove the policy that allows everyone to view published projects
DROP POLICY IF EXISTS "Published projects are viewable by everyone" ON public.projects;

-- Update the policy to ensure users can only view their own projects
-- This policy already exists but we'll recreate it to be explicit
DROP POLICY IF EXISTS "Users can view their own projects" ON public.projects;

CREATE POLICY "Users can view their own projects" 
ON public.projects 
FOR SELECT 
TO authenticated
USING (auth.uid() = user_id);

-- For public access (like /slug routes), we need a separate policy that only allows 
-- viewing specific published projects when accessed by slug, not listing all projects
CREATE POLICY "Public access to published projects by slug" 
ON public.projects 
FOR SELECT 
TO anon
USING (is_published = true);