import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useTemplates } from "@/hooks/useTemplates";
import { Skeleton } from "@/components/ui/skeleton";
import { Check } from "lucide-react";

interface TemplateSelectorProps {
  selectedTemplateId?: string;
  onSelectTemplate: (templateId: string) => void;
}

export const TemplateSelector = ({ selectedTemplateId, onSelectTemplate }: TemplateSelectorProps) => {
  const { data: templates, isLoading } = useTemplates();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-80 w-full" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Escolha um Template</h2>
        <p className="text-muted-foreground">
          Selecione um design para começar seu LinksGo
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {templates?.map((template) => {
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
        })}
      </div>
    </div>
  );
};