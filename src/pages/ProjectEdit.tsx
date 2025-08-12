import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useProject, useUpdateProject } from "@/hooks/useProjects";
import { useTemplates } from "@/hooks/useTemplates";
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
import { ProfessionalCardEditor } from "@/components/templates/ProfessionalCardEditor";
import { ArrowLeft, Save, Eye, Palette } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

const ProjectEdit = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: project, isLoading } = useProject(id!);
  const { data: links } = useProjectLinks(id!);
  const { data: templates } = useTemplates();
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
        theme_config: {
          ...(project?.theme_config as any || {}),
          avatarUrl: projectData.avatarUrl,
          backgroundUrl: projectData.backgroundUrl,
          colors: {
            ...(project?.theme_config as any)?.colors || {}
          }
        },
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
                <TabsTrigger value="media">Mídia</TabsTrigger>
                <TabsTrigger value="links">Links</TabsTrigger>
                <TabsTrigger value="customization">Personalização</TabsTrigger>
              </TabsList>

              <TabsContent value="basic">
                <ProjectBasicInfo
                  data={projectData}
                  onChange={(data) => setProjectData(prev => ({ ...prev, ...data }))}
                  currentProjectId={id}
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


              <TabsContent value="customization">
                {(() => {
                  const selectedTemplate = templates?.find(t => t.id === projectData.templateId);
                  const isProfessionalTemplate = selectedTemplate?.name === 'Professional Card' || 
                                               selectedTemplate?.category === 'Empresarial' ||
                                               projectData.templateId?.includes('professional') ||
                                               projectData.templateId?.includes('empresarial');
                  
                  if (isProfessionalTemplate && project) {
                    return (
                      <div className="space-y-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="text-lg font-bold">Editor de Template Empresarial</h3>
                            <p className="text-muted-foreground">Personalize todos os aspectos do template empresarial</p>
                          </div>
                        </div>
                        
                        <div className="space-y-4">
                          <ProfessionalCardEditor
                            projectData={{
                              ...project,
                              project_links: links?.map((link, index) => ({
                                id: link.id,
                                title: link.title,
                                url: link.url,
                                icon_name: link.icon_name,
                                is_active: true,
                                position: index
                              })) || [],
                              social_links: (project as any).theme_config?.social_links || []
                            }}
                            onUpdate={async (data) => {
                              if (id) {
                                await updateProject.mutateAsync({
                                  id,
                                  theme_config: {
                                    ...(project?.theme_config as any || {}),
                                    ...data.theme_config,
                                    social_links: data.social_links ?? (project?.theme_config as any)?.social_links ?? []
                                  }
                                });
                              }
                            }}
                          />
                        </div>
                      </div>
                    );
                  } else {
                    return (
                      <div className="text-center py-12">
                        <h3 className="text-lg font-medium mb-2">Personalização Avançada</h3>
                        <p className="text-muted-foreground">
                          Este template não oferece opções de personalização avançada.
                        </p>
                      </div>
                    );
                  }
                })()}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProjectEdit;