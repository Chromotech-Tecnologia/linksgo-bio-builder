import { useParams, useNavigate } from "react-router-dom";
import { useProject } from "@/hooks/useProjects";
import { useProjectLinks } from "@/hooks/useProjectLinks";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ArrowLeft, Edit, Share2, Eye, ExternalLink } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/hooks/use-toast";

const ProjectView = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: project, isLoading } = useProject(id!);
  const { data: links } = useProjectLinks(id!);

  const handleShare = () => {
    const url = `https://linksgo.app/${project?.slug}`;
    navigator.clipboard.writeText(url);
    toast({
      title: "Link copiado!",
      description: "O link do seu LinksGo foi copiado para a área de transferência.",
    });
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-8">
        <Card className="max-w-4xl mx-auto">
          <CardHeader>
            <Skeleton className="h-8 w-64" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-32 w-full" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="container mx-auto py-8">
        <Card className="max-w-4xl mx-auto">
          <CardContent className="text-center py-12">
            <h2 className="text-xl font-semibold mb-2">Projeto não encontrado</h2>
            <p className="text-muted-foreground mb-4">
              O projeto que você está procurando não existe ou foi removido.
            </p>
            <Button onClick={() => navigate("/dashboard")}>
              Voltar ao Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const publicUrl = `https://linksgo.app/${project.slug}`;

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Header */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => navigate("/dashboard")}
                  >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Voltar
                  </Button>
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      {project.title}
                      <Badge variant={project.is_published ? "default" : "secondary"}>
                        {project.is_published ? "Publicado" : "Rascunho"}
                      </Badge>
                    </CardTitle>
                    <p className="text-muted-foreground">{publicUrl}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" onClick={handleShare}>
                    <Share2 className="h-4 w-4 mr-2" />
                    Compartilhar
                  </Button>
                  <Button onClick={() => navigate(`/dashboard/projects/${id}/edit`)}>
                    <Edit className="h-4 w-4 mr-2" />
                    Editar
                  </Button>
                </div>
              </div>
            </CardHeader>
          </Card>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Preview */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="h-5 w-5" />
                  Preview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div 
                  className="text-white rounded-lg overflow-hidden relative"
                  style={{
                    background: project.background_url?.startsWith('linear-gradient') 
                      ? project.background_url 
                      : (project.theme_config as any)?.colors?.background 
                      || 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    minHeight: '400px'
                  }}
                >
                  <div className="p-6 relative z-10">
                    {/* Background Image */}
                    {project.background_url && !project.background_url.startsWith('linear-gradient') && (
                      <div className="absolute inset-0 opacity-20">
                        <img 
                          src={project.background_url} 
                          alt="Background" 
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    
                    <div className="relative z-20 text-center space-y-6">
                      {/* Avatar */}
                      <Avatar className="w-20 h-20 mx-auto border-4 border-white/20">
                        <AvatarImage src={project.avatar_url} />
                        <AvatarFallback className="text-xl font-bold bg-white/20">
                          {project.title.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>

                      {/* Info */}
                      <div>
                        <h2 className="text-xl font-bold mb-1">{project.title}</h2>
                        {project.description && (
                          <p className="text-white/80 text-sm">{project.description}</p>
                        )}
                      </div>

                      {/* Links */}
                      <div className="space-y-2">
                        {links?.slice(0, 3).map((link) => (
                          <div 
                            key={link.id}
                            className="bg-white/10 backdrop-blur-sm rounded-lg p-3 hover:bg-white/20 transition-colors cursor-pointer"
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-medium text-sm">{link.title}</span>
                              <ExternalLink className="h-3 w-3 text-white/60" />
                            </div>
                          </div>
                        ))}
                        {(links?.length || 0) > 3 && (
                          <div className="text-center text-white/60 text-xs">
                            +{(links?.length || 0) - 3} mais links
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Stats and Info */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Estatísticas</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold">{project.views_count}</div>
                      <div className="text-sm text-muted-foreground">Visualizações</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold">{links?.length || 0}</div>
                      <div className="text-sm text-muted-foreground">Links</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Links ({links?.length || 0})</CardTitle>
                </CardHeader>
                <CardContent>
                  {links && links.length > 0 ? (
                    <div className="space-y-3">
                      {links.map((link) => (
                        <div key={link.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                          <div>
                            <div className="font-medium">{link.title}</div>
                            <div className="text-sm text-muted-foreground truncate max-w-48">
                              {link.url}
                            </div>
                          </div>
                          <div className="text-right text-sm text-muted-foreground">
                            {link.click_count} cliques
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground text-center py-8">
                      Nenhum link adicionado ainda
                    </p>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Ações</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button 
                    variant="outline" 
                    className="w-full" 
                    onClick={() => window.open(publicUrl, '_blank')}
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Ver Página Pública
                  </Button>
                  <Button variant="outline" className="w-full" onClick={handleShare}>
                    <Share2 className="h-4 w-4 mr-2" />
                    Copiar Link
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectView;