-- Create profiles table for additional user information
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT,
  username TEXT UNIQUE,
  avatar_url TEXT,
  bio TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create templates table
CREATE TABLE public.templates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  preview_image TEXT,
  config JSONB NOT NULL DEFAULT '{}',
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create projects table
CREATE TABLE public.projects (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  template_id UUID NOT NULL REFERENCES public.templates(id),
  title TEXT NOT NULL,
  slug TEXT NOT NULL,
  description TEXT,
  avatar_url TEXT,
  background_url TEXT,
  custom_css TEXT,
  theme_config JSONB NOT NULL DEFAULT '{}',
  is_published BOOLEAN NOT NULL DEFAULT false,
  views_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, slug)
);

-- Create project_links table
CREATE TABLE public.project_links (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  url TEXT NOT NULL,
  icon_name TEXT,
  icon_url TEXT,
  position INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  click_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create project_media table
CREATE TABLE public.project_media (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  file_name TEXT NOT NULL,
  file_url TEXT NOT NULL,
  file_type TEXT NOT NULL,
  file_size INTEGER,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_media ENABLE ROW LEVEL SECURITY;

-- Create policies for profiles
CREATE POLICY "Users can view all profiles" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create policies for templates (public read)
CREATE POLICY "Templates are viewable by everyone" ON public.templates FOR SELECT USING (is_active = true);

-- Create policies for projects
CREATE POLICY "Users can view their own projects" ON public.projects FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own projects" ON public.projects FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own projects" ON public.projects FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own projects" ON public.projects FOR DELETE USING (auth.uid() = user_id);
CREATE POLICY "Published projects are viewable by everyone" ON public.projects FOR SELECT USING (is_published = true);

-- Create policies for project_links
CREATE POLICY "Users can manage links in their projects" ON public.project_links FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.projects 
    WHERE projects.id = project_links.project_id 
    AND projects.user_id = auth.uid()
  )
);
CREATE POLICY "Published project links are viewable by everyone" ON public.project_links FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.projects 
    WHERE projects.id = project_links.project_id 
    AND projects.is_published = true
  )
);

-- Create policies for project_media
CREATE POLICY "Users can manage media in their projects" ON public.project_media FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.projects 
    WHERE projects.id = project_media.project_id 
    AND projects.user_id = auth.uid()
  )
);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_projects_updated_at
  BEFORE UPDATE ON public.projects
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default templates
INSERT INTO public.templates (name, description, preview_image, config) VALUES
('Gradient Modern', 'Template moderno com gradientes coloridos', '/templates/gradient-modern.jpg', '{"primaryColor": "#667eea", "secondaryColor": "#764ba2", "fontFamily": "Inter"}'),
('Dark Professional', 'Template escuro e profissional', '/templates/dark-professional.jpg', '{"primaryColor": "#1a1a1a", "secondaryColor": "#333333", "fontFamily": "Roboto"}'),
('Colorful Creative', 'Template vibrante e criativo', '/templates/colorful-creative.jpg', '{"primaryColor": "#ff6b6b", "secondaryColor": "#4ecdc4", "fontFamily": "Poppins"}'),
('Minimal Clean', 'Template minimalista e limpo', '/templates/minimal-clean.jpg', '{"primaryColor": "#ffffff", "secondaryColor": "#f8f9fa", "fontFamily": "Inter"}'),
('Neon Glow', 'Template com efeitos neon', '/templates/neon-glow.jpg', '{"primaryColor": "#00ff88", "secondaryColor": "#0088ff", "fontFamily": "Orbitron"}');

-- Create storage buckets
INSERT INTO storage.buckets (id, name, public) VALUES 
  ('avatars', 'avatars', true),
  ('projects', 'projects', true),
  ('media', 'media', true);

-- Create storage policies for avatars
CREATE POLICY "Avatar images are publicly accessible" ON storage.objects FOR SELECT USING (bucket_id = 'avatars');
CREATE POLICY "Users can upload their own avatar" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "Users can update their own avatar" ON storage.objects FOR UPDATE USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "Users can delete their own avatar" ON storage.objects FOR DELETE USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Create storage policies for projects
CREATE POLICY "Project images are publicly accessible" ON storage.objects FOR SELECT USING (bucket_id = 'projects');
CREATE POLICY "Users can upload to their projects" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'projects' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "Users can update their project files" ON storage.objects FOR UPDATE USING (bucket_id = 'projects' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "Users can delete their project files" ON storage.objects FOR DELETE USING (bucket_id = 'projects' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Create storage policies for media
CREATE POLICY "Media files are publicly accessible" ON storage.objects FOR SELECT USING (bucket_id = 'media');
CREATE POLICY "Users can upload media" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'media' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "Users can update their media" ON storage.objects FOR UPDATE USING (bucket_id = 'media' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "Users can delete their media" ON storage.objects FOR DELETE USING (bucket_id = 'media' AND auth.uid()::text = (storage.foldername(name))[1]);