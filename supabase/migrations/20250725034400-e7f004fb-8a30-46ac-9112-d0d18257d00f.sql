-- Update all templates to have different colors and better color schemes
UPDATE templates SET 
  config = jsonb_set(
    config,
    '{colors,background}',
    '"linear-gradient(135deg, #667eea 0%, #764ba2 100%)"'
  )
WHERE name = 'Gradient Modern';

UPDATE templates SET 
  config = jsonb_set(
    config,
    '{colors,background}',
    '"linear-gradient(135deg, #f093fb 0%, #f5576c 100%)"'
  )
WHERE name = 'Dark Professional';

UPDATE templates SET 
  config = jsonb_set(
    config,
    '{colors,background}',
    '"linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)"'
  )
WHERE name = 'Colorful Creative';

UPDATE templates SET 
  config = jsonb_set(
    config,
    '{colors,background}',
    '"linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)"'
  )
WHERE name = 'Minimal Clean';

UPDATE templates SET 
  config = jsonb_set(
    config,
    '{colors,background}',
    '"linear-gradient(135deg, #fa709a 0%, #fee140 100%)"'
  )
WHERE name = 'Neon Glow';

UPDATE templates SET 
  config = jsonb_set(
    config,
    '{colors,background}',
    '"linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)"'
  )
WHERE name = 'Ocean Breeze';

UPDATE templates SET 
  config = jsonb_set(
    config,
    '{colors,background}',
    '"linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)"'
  )
WHERE name = 'Sunset Vibes';

UPDATE templates SET 
  config = jsonb_set(
    config,
    '{colors,background}',
    '"linear-gradient(135deg, #96fbc4 0%, #f9f586 100%)"'
  )
WHERE name = 'Forest Green';

UPDATE templates SET 
  config = jsonb_set(
    config,
    '{colors,background}',
    '"linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)"'
  )
WHERE name = 'Warm Autumn';

UPDATE templates SET 
  config = jsonb_set(
    config,
    '{colors,background}',
    '"linear-gradient(135deg, #89f7fe 0%, #66a6ff 100%)"'
  )
WHERE name = 'Sky Blue';

UPDATE templates SET 
  config = jsonb_set(
    config,
    '{colors,background}',
    '"linear-gradient(135deg, #fdbb2d 0%, #22c1c3 100%)"'
  )
WHERE name = 'Golden Hour';

UPDATE templates SET 
  config = jsonb_set(
    config,
    '{colors,background}',
    '"linear-gradient(135deg, #e0c3fc 0%, #9bb5ff 100%)"'
  )
WHERE name = 'Purple Dream';

-- Business templates
UPDATE templates SET 
  config = jsonb_set(
    config,
    '{colors,background}',
    '"linear-gradient(135deg, #2c3e50 0%, #3498db 100%)"'
  )
WHERE name = 'Corporate Blue';

UPDATE templates SET 
  config = jsonb_set(
    config,
    '{colors,background}',
    '"linear-gradient(135deg, #232526 0%, #414345 100%)"'
  )
WHERE name = 'Executive Dark';

UPDATE templates SET 
  config = jsonb_set(
    config,
    '{colors,background}',
    '"linear-gradient(135deg, #56ab2f 0%, #a8e6cf 100%)"'
  )
WHERE name = 'Professional Green';

UPDATE templates SET 
  config = jsonb_set(
    config,
    '{colors,background}',
    '"linear-gradient(135deg, #8e2de2 0%, #4a00e0 100%)"'
  )
WHERE name = 'Tech Purple';

UPDATE templates SET 
  config = jsonb_set(
    config,
    '{colors,background}',
    '"linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)"'
  )
WHERE name = 'Bold Red';

UPDATE templates SET 
  config = jsonb_set(
    config,
    '{colors,background}',
    '"linear-gradient(135deg, #ffeaa7 0%, #fab1a0 100%)"'
  )
WHERE name = 'Warm Professional';

-- Services templates
UPDATE templates SET 
  config = jsonb_set(
    config,
    '{colors,background}',
    '"linear-gradient(135deg, #74b9ff 0%, #0984e3 100%)"'
  )
WHERE name = 'Healthcare Blue';

UPDATE templates SET 
  config = jsonb_set(
    config,
    '{colors,background}',
    '"linear-gradient(135deg, #fd79a8 0%, #fdcb6e 100%)"'
  )
WHERE name = 'Beauty Pink';

UPDATE templates SET 
  config = jsonb_set(
    config,
    '{colors,background}',
    '"linear-gradient(135deg, #00b894 0%, #00cec9 100%)"'
  )
WHERE name = 'Fitness Green';

UPDATE templates SET 
  config = jsonb_set(
    config,
    '{colors,background}',
    '"linear-gradient(135deg, #6c5ce7 0%, #a29bfe 100%)"'
  )
WHERE name = 'Creative Purple';

UPDATE templates SET 
  config = jsonb_set(
    config,
    '{colors,background}',
    '"linear-gradient(135deg, #ff7675 0%, #fd79a8 100%)"'
  )
WHERE name = 'Salon Coral';

UPDATE templates SET 
  config = jsonb_set(
    config,
    '{colors,background}',
    '"linear-gradient(135deg, #fdcb6e 0%, #e17055 100%)"'
  )
WHERE name = 'Consultant Orange';

-- Business specific templates
UPDATE templates SET 
  config = jsonb_set(
    config,
    '{colors,background}',
    '"linear-gradient(135deg, #55a3ff 0%, #003d82 100%)"'
  )
WHERE name = 'Restaurant Blue';

UPDATE templates SET 
  config = jsonb_set(
    config,
    '{colors,background}',
    '"linear-gradient(135deg, #ff9ff3 0%, #f368e0 100%)"'
  )
WHERE name = 'Pet Care Pink';

UPDATE templates SET 
  config = jsonb_set(
    config,
    '{colors,background}',
    '"linear-gradient(135deg, #ff9a56 0%, #ffad56 100%)"'
  )
WHERE name = 'Pizzaria Orange';

UPDATE templates SET 
  config = jsonb_set(
    config,
    '{colors,background}',
    '"linear-gradient(135deg, #667eea 0%, #764ba2 100%)"'
  )
WHERE name = 'Modern Business';