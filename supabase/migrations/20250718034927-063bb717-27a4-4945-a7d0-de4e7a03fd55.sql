-- Insert default templates
INSERT INTO public.templates (name, description, preview_image, config) VALUES
(
  'Gradient Modern',
  'Design moderno com gradientes coloridos e efeitos visuais',
  'https://images.unsplash.com/photo-1557683316-973673baf926?w=400&h=300&fit=crop',
  '{
    "colors": {
      "primary": "239 68 68",
      "secondary": "59 130 246", 
      "background": "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
    },
    "layout": "modern",
    "effects": ["blur", "shadow"]
  }'
),
(
  'Dark Professional', 
  'Tema escuro profissional e elegante',
  'https://images.unsplash.com/photo-1518737451751-5d86cbf7c582?w=400&h=300&fit=crop',
  '{
    "colors": {
      "primary": "255 255 255",
      "secondary": "156 163 175",
      "background": "linear-gradient(135deg, #1f2937 0%, #111827 100%)"
    },
    "layout": "professional",
    "effects": ["glow"]
  }'
),
(
  'Colorful Creative',
  'Design vibrante e criativo para artistas',
  'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop',
  '{
    "colors": {
      "primary": "236 72 153",
      "secondary": "168 85 247",
      "background": "linear-gradient(135deg, #fbbf24 0%, #f59e0b 50%, #ef4444 100%)"
    },
    "layout": "creative",
    "effects": ["animation", "hover"]
  }'
),
(
  'Minimal Clean',
  'Design minimalista e limpo',
  'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=300&fit=crop',
  '{
    "colors": {
      "primary": "17 24 39",
      "secondary": "107 114 128", 
      "background": "linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%)"
    },
    "layout": "minimal",
    "effects": ["clean"]
  }'
),
(
  'Neon Glow',
  'Efeitos neon e brilho futurista',
  'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=300&fit=crop',
  '{
    "colors": {
      "primary": "34 197 94",
      "secondary": "14 165 233",
      "background": "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)"
    },
    "layout": "futuristic",
    "effects": ["neon", "glow", "animation"]
  }'
);