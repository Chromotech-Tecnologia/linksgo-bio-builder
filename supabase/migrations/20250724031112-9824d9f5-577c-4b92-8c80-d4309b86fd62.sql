-- Criar sistema de templates com categorias
ALTER TABLE templates ADD COLUMN category text DEFAULT 'Smart';
ALTER TABLE templates ADD COLUMN color_scheme jsonb DEFAULT '{"primary": "#667eea", "secondary": "#764ba2"}'::jsonb;
ALTER TABLE templates ADD COLUMN template_type text DEFAULT 'gradient'; -- 'gradient', 'image', 'custom'

-- Inserir templates Smart com diferentes cores
INSERT INTO templates (name, description, category, template_type, color_scheme, config) VALUES
('Smart Roxo', 'Template moderno com gradiente roxo', 'Smart', 'gradient', '{"primary": "#667eea", "secondary": "#764ba2"}', '{"effects": ["gradiente", "moderno"], "colors": {"background": "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"}}'),
('Smart Azul', 'Template moderno com gradiente azul', 'Smart', 'gradient', '{"primary": "#4facfe", "secondary": "#00f2fe"}', '{"effects": ["gradiente", "moderno"], "colors": {"background": "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)"}}'),
('Smart Verde', 'Template moderno com gradiente verde', 'Smart', 'gradient', '{"primary": "#43e97b", "secondary": "#38f9d7"}', '{"effects": ["gradiente", "moderno"], "colors": {"background": "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)"}}'),
('Smart Rosa', 'Template moderno com gradiente rosa', 'Smart', 'gradient', '{"primary": "#fa709a", "secondary": "#fee140"}', '{"effects": ["gradiente", "moderno"], "colors": {"background": "linear-gradient(135deg, #fa709a 0%, #fee140 100%)"}}'),
('Smart Laranja', 'Template moderno com gradiente laranja', 'Smart', 'gradient', '{"primary": "#ff9a9e", "secondary": "#fecfef"}', '{"effects": ["gradiente", "moderno"], "colors": {"background": "linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)"}}'),
('Smart Dourado', 'Template moderno com gradiente dourado', 'Smart', 'gradient', '{"primary": "#ffecd2", "secondary": "#fcb69f"}', '{"effects": ["gradiente", "moderno"], "colors": {"background": "linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)"}}'),
('Smart Vermelho', 'Template moderno com gradiente vermelho', 'Smart', 'gradient', '{"primary": "#ff6b6b", "secondary": "#ffa8a8"}', '{"effects": ["gradiente", "moderno"], "colors": {"background": "linear-gradient(135deg, #ff6b6b 0%, #ffa8a8 100%)"}}'),
('Smart Turquesa', 'Template moderno com gradiente turquesa', 'Smart', 'gradient', '{"primary": "#40e0d0", "secondary": "#48cae4"}', '{"effects": ["gradiente", "moderno"], "colors": {"background": "linear-gradient(135deg, #40e0d0 0%, #48cae4 100%)"}}'),
('Smart Violeta', 'Template moderno com gradiente violeta', 'Smart', 'gradient', '{"primary": "#8b5cf6", "secondary": "#a78bfa"}', '{"effects": ["gradiente", "moderno"], "colors": {"background": "linear-gradient(135deg, #8b5cf6 0%, #a78bfa 100%)"}}'),
('Smart Ciano', 'Template moderno com gradiente ciano', 'Smart', 'gradient', '{"primary": "#06b6d4", "secondary": "#67e8f9"}', '{"effects": ["gradiente", "moderno"], "colors": {"background": "linear-gradient(135deg, #06b6d4 0%, #67e8f9 100%)"}}'),
('Smart Esmeralda', 'Template moderno com gradiente esmeralda', 'Smart', 'gradient', '{"primary": "#059669", "secondary": "#34d399"}', '{"effects": ["gradiente", "moderno"], "colors": {"background": "linear-gradient(135deg, #059669 0%, #34d399 100%)"}}'),
('Smart Âmbar', 'Template moderno com gradiente âmbar', 'Smart', 'gradient', '{"primary": "#f59e0b", "secondary": "#fbbf24"}', '{"effects": ["gradiente", "moderno"], "colors": {"background": "linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%)"}}');

-- Templates Empresariais
INSERT INTO templates (name, description, category, template_type, color_scheme, config) VALUES
('Empresarial Azul', 'Template profissional para empresas', 'Empresarial', 'gradient', '{"primary": "#1e3a8a", "secondary": "#3b82f6"}', '{"effects": ["profissional", "empresarial"], "colors": {"background": "linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)"}}'),
('Empresarial Cinza', 'Template corporativo elegante', 'Empresarial', 'gradient', '{"primary": "#374151", "secondary": "#6b7280"}', '{"effects": ["profissional", "elegante"], "colors": {"background": "linear-gradient(135deg, #374151 0%, #6b7280 100%)"}}'),
('Empresarial Verde', 'Template empresarial sustentável', 'Empresarial', 'gradient', '{"primary": "#065f46", "secondary": "#059669"}', '{"effects": ["sustentável", "moderno"], "colors": {"background": "linear-gradient(135deg, #065f46 0%, #059669 100%)"}}'),
('Empresarial Dourado', 'Template premium para empresas', 'Empresarial', 'gradient', '{"primary": "#92400e", "secondary": "#d97706"}', '{"effects": ["premium", "elegante"], "colors": {"background": "linear-gradient(135deg, #92400e 0%, #d97706 100%)"}}');

-- Templates Serviços
INSERT INTO templates (name, description, category, template_type, color_scheme, config) VALUES
('Serviços Médicos', 'Template para profissionais da saúde', 'Serviços', 'gradient', '{"primary": "#0369a1", "secondary": "#0ea5e9"}', '{"effects": ["saúde", "confiança"], "colors": {"background": "linear-gradient(135deg, #0369a1 0%, #0ea5e9 100%)"}}'),
('Serviços Jurídicos', 'Template para advogados e escritórios', 'Serviços', 'gradient', '{"primary": "#1f2937", "secondary": "#4b5563"}', '{"effects": ["jurídico", "profissional"], "colors": {"background": "linear-gradient(135deg, #1f2937 0%, #4b5563 100%)"}}'),
('Serviços Educação', 'Template para educadores e cursos', 'Serviços', 'gradient', '{"primary": "#7c3aed", "secondary": "#a855f7"}', '{"effects": ["educação", "criativo"], "colors": {"background": "linear-gradient(135deg, #7c3aed 0%, #a855f7 100%)"}}'),
('Serviços Consultoria', 'Template para consultores', 'Serviços', 'gradient', '{"primary": "#dc2626", "secondary": "#ef4444"}', '{"effects": ["consultoria", "expertise"], "colors": {"background": "linear-gradient(135deg, #dc2626 0%, #ef4444 100%)"}}');

-- Templates Negócios
INSERT INTO templates (name, description, category, template_type, color_scheme, config) VALUES
('Restaurante', 'Template para restaurantes e food service', 'Negócios', 'gradient', '{"primary": "#dc2626", "secondary": "#fbbf24"}', '{"effects": ["gastronomia", "acolhedor"], "colors": {"background": "linear-gradient(135deg, #dc2626 0%, #fbbf24 100%)"}}'),
('Pet Shop', 'Template para pet shops e veterinárias', 'Negócios', 'gradient', '{"primary": "#059669", "secondary": "#10b981"}', '{"effects": ["pets", "cuidado"], "colors": {"background": "linear-gradient(135deg, #059669 0%, #10b981 100%)"}}'),
('Estética', 'Template para salões e clínicas de estética', 'Negócios', 'gradient', '{"primary": "#ec4899", "secondary": "#f472b6"}', '{"effects": ["beleza", "elegante"], "colors": {"background": "linear-gradient(135deg, #ec4899 0%, #f472b6 100%)"}}'),
('Pizzaria', 'Template para pizzarias e delivery', 'Negócios', 'gradient', '{"primary": "#ea580c", "secondary": "#fb923c"}', '{"effects": ["pizza", "delivery"], "colors": {"background": "linear-gradient(135deg, #ea580c 0%, #fb923c 100%)"}}'),
('Academia', 'Template para academias e personal trainers', 'Negócios', 'gradient', '{"primary": "#1f2937", "secondary": "#ef4444"}', '{"effects": ["fitness", "energia"], "colors": {"background": "linear-gradient(135deg, #1f2937 0%, #ef4444 100%)"}}'),
('Imobiliária', 'Template para corretores e imobiliárias', 'Negócios', 'gradient', '{"primary": "#1e40af", "secondary": "#3b82f6"}', '{"effects": ["imóveis", "confiança"], "colors": {"background": "linear-gradient(135deg, #1e40af 0%, #3b82f6 100%)"}}'),
('Tecnologia', 'Template para empresas de tech', 'Negócios', 'gradient', '{"primary": "#6366f1", "secondary": "#8b5cf6"}', '{"effects": ["tecnologia", "inovação"], "colors": {"background": "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)"}}'),
('Moda', 'Template para lojas de roupas e fashion', 'Negócios', 'gradient', '{"primary": "#be185d", "secondary": "#ec4899"}', '{"effects": ["moda", "estilo"], "colors": {"background": "linear-gradient(135deg, #be185d 0%, #ec4899 100%)"}}');