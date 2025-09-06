-- Update Empresarial templates to include professional_card layout
UPDATE templates 
SET config = jsonb_set(
  config::jsonb, 
  '{layout}', 
  '"professional_card"'
)
WHERE category = 'Empresarial' AND is_active = true;