import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTemplates } from "@/hooks/useTemplates";
import { Skeleton } from "@/components/ui/skeleton";
import { Check, Palette } from "lucide-react";
import { useState } from "react";
import { Switch } from "@/components/ui/switch";

interface TemplateSelectorProps {
  selectedTemplateId?: string;
  onSelectTemplate: (templateId: string) => void;
}

export const TemplateSelector = ({ selectedTemplateId, onSelectTemplate }: TemplateSelectorProps) => {
  const { data: templates, isLoading } = useTemplates();
  const [customColors, setCustomColors] = useState({ primary: "#667eea", secondary: "#764ba2" });
  const [isGradient, setIsGradient] = useState(true);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-80 w-full" />
        ))}
      </div>
    );
  }

  // Group templates by category
  const groupedTemplates = templates?.reduce((acc, template) => {
    const category = template.category || 'Smart';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(template);
    return acc;
  }, {} as Record<string, any[]>) || {};

  // Order categories: Empresarial, Personalizado, Smart
  const categoryOrder = ['Empresarial', 'Personalizado', 'Smart'];
  const categories = categoryOrder.filter(cat => 
    cat === 'Personalizado' || groupedTemplates[cat]?.length > 0
  );

  const createCustomTemplate = () => {
    const customTemplate = {
      id: 'custom-' + Date.now(),
      name: 'Personalizado',
      description: 'Template personalizado com suas cores',
      category: 'Smart',
      config: {
        effects: ['personalizado', 'gradiente'],
        colors: {
          background: `linear-gradient(135deg, ${customColors.primary} 0%, ${customColors.secondary} 100%)`
        }
      }
    };
    onSelectTemplate(customTemplate.id);
  };

  const getTemplateTitle = (template: any) => {
    if (template.category === 'Smart') {
      const colorScheme = template.color_scheme as any;
      if (colorScheme?.primary && colorScheme?.secondary) {
        return `${colorScheme.primary} / ${colorScheme.secondary}`;
      }
    }
    return template.name;
  };

  const renderTemplateCard = (template: any) => {
    const config = template.config as any;
    const isSelected = selectedTemplateId === template.id;

    return (
      <Card 
        key={template.id} 
        className={`cursor-pointer transition-all hover:shadow-lg ${
          isSelected ? "ring-2 ring-primary" : ""
        }`}
        onClick={() => onSelectTemplate(template.id)}
      >
        <CardHeader className="relative">
          {isSelected && (
            <div className="absolute -top-2 -right-2 bg-primary text-primary-foreground rounded-full p-1">
              <Check className="h-4 w-4" />
            </div>
          )}
          <div 
            className="w-full h-32 rounded-md mb-3"
            style={{ 
              background: config?.colors?.background || 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
            }}
          />
          <CardTitle className="text-lg">{getTemplateTitle(template)}</CardTitle>
          <CardDescription>{template.description}</CardDescription>
        </CardHeader>
        
        <CardContent>
          <div className="flex flex-wrap gap-2 mb-4">
            {config?.effects?.map((effect: string) => (
              <Badge key={effect} variant="secondary" className="text-xs">
                {effect}
              </Badge>
            ))}
          </div>
          
          <Button 
            className="w-full" 
            variant={isSelected ? "default" : "outline"}
          >
            {isSelected ? "Selecionado" : "Escolher Template"}
          </Button>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Escolha um Template</h2>
        <p className="text-muted-foreground">
          Selecione um design para começar seu LinksGo
        </p>
      </div>

      <Tabs defaultValue={categories[0]} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          {categories.map((category) => (
            <TabsTrigger key={category} value={category}>
              {category}
            </TabsTrigger>
          ))}
        </TabsList>

        {categories.map((category) => (
          <TabsContent key={category} value={category} className="space-y-6">
            {category === 'Personalizado' && (
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Palette className="h-5 w-5" />
                    Criar Template Personalizado
                  </CardTitle>
                  <CardDescription>
                    Escolha suas próprias cores para criar um template único
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-2 mb-4">
                    <Switch
                      id="gradient-mode"
                      checked={isGradient}
                      onCheckedChange={setIsGradient}
                    />
                    <label htmlFor="gradient-mode" className="text-sm font-medium">
                      {isGradient ? "Cor Gradiente" : "Cor Sólida"}
                    </label>
                  </div>
                  
                  {isGradient ? (
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium">Cor Principal</label>
                        <input
                          type="color"
                          value={customColors.primary}
                          onChange={(e) => setCustomColors({ ...customColors, primary: e.target.value })}
                          className="w-full h-10 rounded border"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium">Cor Secundária</label>
                        <input
                          type="color"
                          value={customColors.secondary}
                          onChange={(e) => setCustomColors({ ...customColors, secondary: e.target.value })}
                          className="w-full h-10 rounded border"
                        />
                      </div>
                    </div>
                  ) : (
                    <div>
                      <label className="text-sm font-medium">Cor Principal</label>
                      <input
                        type="color"
                        value={customColors.primary}
                        onChange={(e) => setCustomColors({ ...customColors, primary: e.target.value })}
                        className="w-full h-10 rounded border"
                      />
                    </div>
                  )}
                  
                  <div 
                    className="w-full h-24 rounded-md"
                    style={{ 
                      background: isGradient 
                        ? `linear-gradient(135deg, ${customColors.primary} 0%, ${customColors.secondary} 100%)`
                        : customColors.primary
                    }}
                  />
                  <Button onClick={createCustomTemplate} className="w-full">
                    Usar Cores Personalizadas
                  </Button>
                </CardContent>
              </Card>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {groupedTemplates[category]?.map(renderTemplateCard)}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};