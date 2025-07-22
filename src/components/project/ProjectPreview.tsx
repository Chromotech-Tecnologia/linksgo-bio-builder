
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Eye, Edit, Rocket, Loader2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface ProjectPreviewProps {
  data: {
    title: string;
    slug: string;
    description: string;
    avatarUrl: string;
    backgroundUrl: string;
    links: Array<{ title: string; url: string; iconName?: string }>;
  };
  onPublish: (shouldPublish: boolean) => void;
  isProcessing?: boolean;
}

export const ProjectPreview = ({ data, onPublish, isProcessing = false }: ProjectPreviewProps) => {
  const previewUrl = `${window.location.origin}/${data.slug}`;

  return (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold mb-2">Revisar e Finalizar</h2>
        <p className="text-muted-foreground">
          Confira como seu LinksGo ficará antes de criar
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Preview */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium flex items-center gap-2">
            <Eye className="h-5 w-5" />
            Preview do LinksGo
          </h3>
          
          <Card className="bg-gradient-to-br from-purple-500 via-blue-500 to-purple-600 text-white overflow-hidden">
            <CardContent className="p-6">
              {/* Background Image */}
              {data.backgroundUrl && (
                <div className="absolute inset-0 opacity-20">
                  <img 
                    src={data.backgroundUrl} 
                    alt="Background" 
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              
              <div className="relative z-10 text-center space-y-6">
                {/* Avatar */}
                <Avatar className="w-24 h-24 mx-auto border-4 border-white/20">
                  <AvatarImage src={data.avatarUrl} />
                  <AvatarFallback className="text-2xl font-bold bg-white/20">
                    {data.title.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>

                {/* Info */}
                <div>
                  <h2 className="text-2xl font-bold mb-2">{data.title}</h2>
                  {data.description && (
                    <p className="text-white/80 text-sm">{data.description}</p>
                  )}
                </div>

                {/* Links */}
                <div className="space-y-3">
                  {data.links.length > 0 ? (
                    data.links.slice(0, 3).map((link, index) => (
                      <div 
                        key={index}
                        className="bg-white/10 backdrop-blur-sm rounded-lg p-4 hover:bg-white/20 transition-colors cursor-pointer"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-medium">{link.title}</span>
                          <span className="text-xs bg-white/20 px-2 py-1 rounded">
                            {link.iconName || "link"}
                          </span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="bg-white/5 backdrop-blur-sm rounded-lg p-4 border-2 border-dashed border-white/20">
                      <p className="text-white/60 text-sm">Nenhum link adicionado ainda</p>
                    </div>
                  )}
                  {data.links.length > 3 && (
                    <div className="text-center text-white/60 text-sm">
                      +{data.links.length - 3} mais links
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="text-center">
            <Badge variant="secondary" className="text-xs">
              Preview Mobile
            </Badge>
          </div>
        </div>

        {/* Details */}
        <div className="space-y-6">
          <h3 className="text-lg font-medium">Detalhes do Projeto</h3>
          
          <div className="space-y-4">
            <div className="bg-muted/50 p-4 rounded-lg">
              <h4 className="font-medium mb-2">Informações Básicas</h4>
              <div className="space-y-2 text-sm">
                <div><strong>Título:</strong> {data.title}</div>
                <div><strong>URL:</strong> {previewUrl}</div>
                {data.description && (
                  <div><strong>Descrição:</strong> {data.description}</div>
                )}
              </div>
            </div>

            <div className="bg-muted/50 p-4 rounded-lg">
              <h4 className="font-medium mb-2">Mídia</h4>
              <div className="space-y-2 text-sm">
                <div><strong>Avatar:</strong> {data.avatarUrl ? "✅ Configurado" : "❌ Não definido"}</div>
                <div><strong>Fundo:</strong> {data.backgroundUrl ? "✅ Configurado" : "❌ Não definido"}</div>
              </div>
            </div>

            <div className="bg-muted/50 p-4 rounded-lg">
              <h4 className="font-medium mb-2">Links ({data.links.length})</h4>
              {data.links.length > 0 ? (
                <div className="space-y-1 text-sm max-h-32 overflow-y-auto">
                  {data.links.map((link, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <span className="truncate">{link.title}</span>
                      <span className="text-muted-foreground ml-2">
                        {link.iconName || "link"}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">Nenhum link adicionado</p>
              )}
            </div>
          </div>

          <div className="space-y-3 pt-4 border-t">
            <h4 className="font-medium">Finalizar Criação</h4>
            <div className="space-y-2">
              <Button 
                onClick={() => onPublish(false)} 
                variant="outline" 
                className="w-full"
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Salvando...
                  </>
                ) : (
                  <>
                    <Edit className="h-4 w-4 mr-2" />
                    Salvar como Rascunho
                  </>
                )}
              </Button>
              <Button 
                onClick={() => onPublish(true)} 
                className="w-full"
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Criando...
                  </>
                ) : (
                  <>
                    <Rocket className="h-4 w-4 mr-2" />
                    Criar LinksGo
                  </>
                )}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground text-center">
              Após criar, você poderá editar e publicar quando quiser
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
