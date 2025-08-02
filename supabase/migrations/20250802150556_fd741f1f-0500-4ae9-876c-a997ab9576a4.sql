-- Criar template "Professional Card" similar à imagem
INSERT INTO public.templates (
  id,
  name,
  description,
  category,
  template_type,
  color_scheme,
  config,
  is_active
) VALUES (
  gen_random_uuid(),
  'Professional Card',
  'Template profissional com imagem de destaque, botões personalizáveis e área de redes sociais',
  'Business',
  'professional',
  '{"primary": "#1e40af", "secondary": "#3b82f6", "accent": "#60a5fa"}',
  '{
    "layout": "professional_card",
    "hero_image": {
      "enabled": true,
      "height": "200px",
      "border_radius": "0 0 40px 40px"
    },
    "title": {
      "default": "Frase de destaque",
      "color": "#1e40af",
      "font_size": "24px",
      "font_weight": "bold"
    },
    "description": {
      "default": "Aqui você poderá adicionar uma breve descrição para sua frase de destaque",
      "color": "#64748b",
      "font_size": "14px"
    },
    "buttons": {
      "style": "gradient_blue",
      "border_radius": "12px",
      "icon_position": "left",
      "gradient": {
        "from": "#1e40af",
        "to": "#3b82f6"
      },
      "text_color": "#ffffff",
      "icon_color": "#ffffff"
    },
    "social_icons": {
      "enabled": true,
      "style": "rounded_square",
      "size": "48px",
      "background_color": "#3b82f6",
      "icon_color": "#ffffff"
    },
    "footer": {
      "show_logo": true,
      "background_color": "transparent"
    },
    "background": {
      "color": "#ffffff",
      "pattern": "none"
    }
  }',
  true
);