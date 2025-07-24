import React, { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useProject, useUpdateProject } from "@/hooks/useProjects";
import { useProjectLinks } from "@/hooks/useProjectLinks";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { ProjectBasicInfo } from "@/components/project/ProjectBasicInfo";
import { ProjectMediaUpload } from "@/components/project/ProjectMediaUpload";
import { ProjectLinksEditor } from "@/components/project/ProjectLinksEditor";
import { TemplateEditor } from "@/components/project/TemplateEditor";
import { ArrowLeft, Save, Eye, Palette } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

const ProjectEdit = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: project, isLoading } = useProject(id!);
  const { data: links } = useProjectLinks(id!);
  const updateProject = useUpdateProject();

  const [projectData, setProjectData] = useState({
    title: "",
    slug: "",
    description: "",
    avatarUrl: "",
    backgroundUrl: "",
    templateId: "",
    isPublished: false,
  });

  const [linksData, setLinksData] = useState<any[]>([]);

  // Update local state when project data loads
  useEffect(() => {
    if (project) {
      setProjectData({
        title: project.title,
        slug: project.slug,
        description: project.description || "",
        avatarUrl: project.avatar_url || "",
        backgroundUrl: project.background_url || "",
        templateId: project.template_id || "",
        isPublished: project.is_published || false,
      });
    }
  }, [project]);

  useEffect(() => {
    if (links) {
      setLinksData(links.map(link => ({
        id: link.id,
        title: link.title,
        url: link.url,
        iconName: link.icon_name,
      })));
    }
  }, [links]);

  const handleSave = async () => {
    if (!id) return;

    try {
      // Update project basic info
      await updateProject.mutateAsync({
        id,
        title: projectData.title,
        slug: projectData.slug,
        description: projectData.description,
        avatar_url: projectData.avatarUrl,
        background_url: projectData.backgroundUrl,
        template_id: projectData.templateId,
        is_published: projectData.isPublished,
        theme_config: Object.assign(
          project?.theme_config || {},
          {
            avatarUrl: projectData.avatarUrl,
            backgroundUrl: projectData.backgroundUrl,
          }
        ),
      });

      // Update project links
      if (linksData.length > 0) {
        // Delete existing links
        await supabase
          .from('project_links')
          .delete()
          .eq('project_id', id);

        // Insert updated links
        const linksToInsert = linksData.map((link, index) => ({
          project_id: id,
          title: link.title,
          url: link.url,
          icon_name: link.iconName,
          position: index,
        }));

        await supabase
          .from('project_links')
          .insert(linksToInsert);
      }
    } catch (error) {
      console.error("Error updating project:", error);
    }
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

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8">
        <Card className="max-w-4xl mx-auto">
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
                  <CardTitle>Editar Projeto</CardTitle>
                  <p className="text-muted-foreground">{project.title}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="published"
                    checked={projectData.isPublished}
                    onCheckedChange={(checked) => 
                      setProjectData(prev => ({ ...prev, isPublished: checked }))
                    }
                  />
                  <Label htmlFor="published">
                    {projectData.isPublished ? "Publicado" : "Rascunho"}
                  </Label>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    onClick={() => navigate(`/dashboard/projects/${id}`)}
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    Preview
                  </Button>
                  <Button onClick={handleSave} disabled={updateProject.isPending}>
                    <Save className="h-4 w-4 mr-2" />
                    {updateProject.isPending ? "Salvando..." : "Salvar"}
                  </Button>
                </div>
              </div>
            </div>
          </CardHeader>

          <CardContent>
            <Tabs defaultValue="basic" className="space-y-6">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="basic">Informações</TabsTrigger>
                <TabsTrigger value="template">Template</TabsTrigger>
                <TabsTrigger value="media">Mídia</TabsTrigger>
                <TabsTrigger value="links">Links</TabsTrigger>
              </TabsList>

              <TabsContent value="basic">
                <ProjectBasicInfo
                  data={projectData}
                  onChange={(data) => setProjectData(prev => ({ ...prev, ...data }))}
                />
              </TabsContent>

              <TabsContent value="template">
                <TemplateEditor
                  selectedTemplateId={projectData.templateId}
                  currentColors={{
                    primary: (project?.theme_config as any)?.colors?.primary || "#667eea",
                    secondary: (project?.theme_config as any)?.colors?.secondary || "#764ba2"
                  }}
                  onSelectTemplate={(templateId) => 
                    setProjectData(prev => ({ ...prev, templateId }))
                  }
                  onUpdateColors={(colors) => {
                    const currentConfig = project?.theme_config || {};
                    setProjectData(prev => ({ 
                      ...prev,
                      backgroundUrl: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 100%)`
                    }));
                  }}
                />
              </TabsContent>

              <TabsContent value="media">
                <ProjectMediaUpload
                  data={projectData}
                  onChange={(data) => setProjectData(prev => ({ ...prev, ...data }))}
                />
              </TabsContent>

              <TabsContent value="links">
                <ProjectLinksEditor
                  links={linksData}
                  onChange={setLinksData}
                />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProjectEdit;