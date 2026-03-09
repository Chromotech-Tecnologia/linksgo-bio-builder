-- Add visibility columns to project_links
ALTER TABLE public.project_links 
ADD COLUMN IF NOT EXISTS hide_title boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS hide_icon boolean DEFAULT false;