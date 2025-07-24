import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTemplates } from "@/hooks/useTemplates";
import { Skeleton } from "@/components/ui/skeleton";
import { Check, Palette } from "lucide-react";
import { useState } from "react";

interface TemplateEditorProps {
  selectedTemplateId?: string;
  currentColors?: { primary: string; secondary: string };
  onSelectTemplate: (templateId: string) => void;
  onUpdateColors: (colors: { primary: string; secondary: string }) => void;
}

export const TemplateEditor = ({ 
  selectedTemplateId, 
  currentColors = { primary: "#667eea", secondary: "#764ba2" },
  onSelectTemplate,
  onUpdateColors 
}: TemplateEditorProps) => {
  const { data: templates, isLoading } = useTemplates();
  const [customColors, setCustomColors] = useState(currentColors);

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

  const categories = Object.keys(groupedTemplates);

  const applyCustomColors = () => {
    onUpdateColors(customColors);
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
          <CardTitle className="text-lg">{template.name}</CardTitle>
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
            {isSelected ? "Selecionado" : "Escolher"}
          </Button>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-xl font-bold mb-2">Editar Template e Cores</h2>
        <p className="text-muted-foreground">
          Altere o template ou personalize as cores
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="h-5 w-5" />
            Cores Personalizadas
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
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
          <div 
            className="w-full h-24 rounded-md"
            style={{ 
              background: `linear-gradient(135deg, ${customColors.primary} 0%, ${customColors.secondary} 100%)`
            }}
          />
          <Button onClick={applyCustomColors} className="w-full">
            Aplicar Cores Personalizadas
          </Button>
        </CardContent>
      </Card>

      <Tabs defaultValue={categories[0]} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          {categories.map((category) => (
            <TabsTrigger key={category} value={category}>
              {category}
            </TabsTrigger>
          ))}
        </TabsList>

        {categories.map((category) => (
          <TabsContent key={category} value={category} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {groupedTemplates[category]?.map(renderTemplateCard)}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};