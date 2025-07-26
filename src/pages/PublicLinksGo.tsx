import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ExternalLink, Heart } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { DynamicIcon } from "@/components/ui/dynamic-icon";

const PublicLinksGo = () => {
  const { slug } = useParams<{ slug: string }>();

  const { data: project, isLoading, error } = useQuery({
    queryKey: ["public-project", slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("projects")
        .select(`
          *,
          project_links(*)
        `)
        .eq("slug", slug)
        .eq("is_published", true)
        .single();

      if (error) throw error;

      // Increment view count
      await supabase
        .from("projects")
        .update({ views_count: data.views_count + 1 })
        .eq("id", data.id);

      return data;
    },
    enabled: !!slug,
  });

  const handleLinkClick = async (linkId: string, url: string) => {
    // Increment click count
    await supabase
      .from("project_links")
      .update({ click_count: project?.project_links?.find(l => l.id === linkId)?.click_count + 1 || 1 })
      .eq("id", linkId);

    // Open link
    window.open(url.startsWith('http') ? url : `https://${url}`, '_blank');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-500 via-blue-500 to-purple-600 flex items-center justify-center">
        <div className="w-full max-w-md mx-auto p-6">
          <div className="text-center space-y-6">
            <Skeleton className="w-24 h-24 rounded-full mx-auto" />
            <div className="space-y-2">
              <Skeleton className="h-6 w-32 mx-auto" />
              <Skeleton className="h-4 w-48 mx-auto" />
            </div>
            <div className="space-y-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-500 to-gray-700 flex items-center justify-center text-white">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold">404</h1>
          <h2 className="text-xl">LinksGo não encontrado</h2>
          <p className="text-white/80">
            Esta página não existe ou foi removida.
          </p>
          <Button 
            className="mt-4" 
            onClick={() => window.location.href = '/'}
          >
            Criar meu LinksGo
          </Button>
        </div>
      </div>
    );
  }

  const config = project.theme_config as any;
  const backgroundStyle = project.background_url?.startsWith('linear-gradient') 
    ? project.background_url 
    : config?.colors?.background 
    || 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';

  return (
    <div 
      className="min-h-screen flex items-center justify-center text-white relative overflow-hidden"
      style={{ background: backgroundStyle }}
    >
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

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/20" />

      {/* Content */}
      <div className="relative z-10 w-full max-w-md mx-auto p-6">
        <div className="text-center space-y-8">
          {/* Avatar */}
          <Avatar className="w-32 h-32 mx-auto border-4 border-white/30 shadow-xl">
            <AvatarImage src={project.avatar_url} />
            <AvatarFallback className="text-3xl font-bold bg-white/20 text-white">
              {project.title.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>

          {/* Info */}
          <div className="space-y-3">
            <h1 className="text-3xl font-bold drop-shadow-lg">
              {project.title}
            </h1>
            {project.description && (
              <p className="text-white/90 text-lg leading-relaxed">
                {project.description}
              </p>
            )}
          </div>

          {/* Links */}
          <div className="space-y-4">
            {project.project_links
              ?.filter((link: any) => link.is_active)
              ?.sort((a: any, b: any) => a.position - b.position)
              ?.map((link: any) => (
                <Button
                  key={link.id}
                  onClick={() => handleLinkClick(link.id, link.url)}
                  className="w-full h-14 bg-white/15 hover:bg-white/25 backdrop-blur-sm border border-white/20 text-white font-medium text-lg transition-all duration-300 hover:scale-105 hover:shadow-lg group"
                  variant="ghost"
                >
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center gap-3">
                      {link.icon_name && (
                        <DynamicIcon 
                          name={link.icon_name} 
                          className="h-5 w-5 opacity-80" 
                          fallback={ExternalLink}
                        />
                      )}
                      <span>{link.title}</span>
                    </div>
                    <ExternalLink className="h-4 w-4 opacity-70 group-hover:opacity-100 transition-opacity" />
                  </div>
                </Button>
              ))}
          </div>

          {/* Footer */}
          <div className="pt-8 space-y-4">
            <div className="flex items-center justify-center gap-2 text-white/60 text-sm">
              <span>Feito com</span>
              <Heart className="h-4 w-4 fill-current" />
              <span>no LinksGo</span>
            </div>
            
            <Button
              onClick={() => window.open('https://app.linksgo.com.br', '_blank')}
              variant="ghost"
              className="text-white/80 hover:text-white hover:bg-white/10 text-sm"
            >
              Criar meu LinksGo grátis
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PublicLinksGo;