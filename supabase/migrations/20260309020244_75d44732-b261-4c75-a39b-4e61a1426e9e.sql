
INSERT INTO templates (name, description, category, is_active, template_type, config) VALUES
(
  'Hamburgueria',
  'Template vibrante para hamburgueria com banners coloridos',
  'Negócios',
  true,
  'banner_card',
  '{
    "layout": "banner_card",
    "background_color": "#fff8f0",
    "primary_color": "#dc2626",
    "secondary_color": "#eab308",
    "accent_color": "#f97316",
    "title_color": "#1f2937",
    "business_type": "hamburgueria",
    "logo_shape": "circle",
    "logo_size": "100px",
    "banner_style": {
      "height": "80px",
      "border_radius": "16px",
      "shadow": true
    },
    "colors": {
      "background": "linear-gradient(180deg, #fff8f0 0%, #fef3c7 100%)"
    }
  }'::jsonb
),
(
  'Pizzaria',
  'Template atrativo para pizzarias com cores quentes',
  'Negócios',
  true,
  'banner_card',
  '{
    "layout": "banner_card",
    "background_color": "#fef2f2",
    "primary_color": "#b91c1c",
    "secondary_color": "#059669",
    "accent_color": "#d97706",
    "title_color": "#1f2937",
    "business_type": "pizzaria",
    "logo_shape": "circle",
    "logo_size": "100px",
    "banner_style": {
      "height": "80px",
      "border_radius": "16px",
      "shadow": true
    },
    "colors": {
      "background": "linear-gradient(180deg, #fef2f2 0%, #fee2e2 100%)"
    }
  }'::jsonb
),
(
  'Restaurante',
  'Template elegante para restaurantes',
  'Negócios',
  true,
  'banner_card',
  '{
    "layout": "banner_card",
    "background_color": "#f8fafc",
    "primary_color": "#1e40af",
    "secondary_color": "#0f766e",
    "accent_color": "#7c3aed",
    "title_color": "#0f172a",
    "business_type": "restaurante",
    "logo_shape": "rounded",
    "logo_size": "100px",
    "banner_style": {
      "height": "80px",
      "border_radius": "12px",
      "shadow": true
    },
    "colors": {
      "background": "linear-gradient(180deg, #f8fafc 0%, #e2e8f0 100%)"
    }
  }'::jsonb
),
(
  'Farmácia',
  'Template profissional para farmácias',
  'Negócios',
  true,
  'banner_card',
  '{
    "layout": "banner_card",
    "background_color": "#f0fdf4",
    "primary_color": "#16a34a",
    "secondary_color": "#2563eb",
    "accent_color": "#0891b2",
    "title_color": "#14532d",
    "business_type": "farmacia",
    "logo_shape": "rounded",
    "logo_size": "100px",
    "banner_style": {
      "height": "80px",
      "border_radius": "12px",
      "shadow": true
    },
    "colors": {
      "background": "linear-gradient(180deg, #f0fdf4 0%, #dcfce7 100%)"
    }
  }'::jsonb
),
(
  'Loja / Comércio',
  'Template versátil para lojas e comércios em geral',
  'Negócios',
  true,
  'banner_card',
  '{
    "layout": "banner_card",
    "background_color": "#faf5ff",
    "primary_color": "#7c3aed",
    "secondary_color": "#db2777",
    "accent_color": "#2563eb",
    "title_color": "#1e1b4b",
    "business_type": "loja",
    "logo_shape": "circle",
    "logo_size": "100px",
    "banner_style": {
      "height": "80px",
      "border_radius": "16px",
      "shadow": true
    },
    "colors": {
      "background": "linear-gradient(180deg, #faf5ff 0%, #ede9fe 100%)"
    }
  }'::jsonb
),
(
  'Salão de Beleza',
  'Template glamouroso para salões e barbearias',
  'Negócios',
  true,
  'banner_card',
  '{
    "layout": "banner_card",
    "background_color": "#fdf2f8",
    "primary_color": "#db2777",
    "secondary_color": "#c026d3",
    "accent_color": "#e11d48",
    "title_color": "#831843",
    "business_type": "salao",
    "logo_shape": "circle",
    "logo_size": "100px",
    "banner_style": {
      "height": "80px",
      "border_radius": "20px",
      "shadow": true
    },
    "colors": {
      "background": "linear-gradient(180deg, #fdf2f8 0%, #fce7f3 100%)"
    }
  }'::jsonb
);
