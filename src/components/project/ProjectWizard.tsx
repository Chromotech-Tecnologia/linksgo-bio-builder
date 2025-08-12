
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { TemplateSelector } from "./TemplateSelector";
import { ProjectBasicInfo } from "./ProjectBasicInfo";
import { ProjectMediaUpload } from "./ProjectMediaUpload";
import { ProjectLinksEditor } from "./ProjectLinksEditor";
import { ProjectPreview } from "./ProjectPreview";
import { ProfessionalCardEditor } from "../templates/ProfessionalCardEditor";
import { useCreateProject } from "@/hooks/useProjects";
import { useCreateProjectLink } from "@/hooks/useProjectLinks";
import { useTemplates } from "@/hooks/useTemplates";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const STEPS = [
  { id: 1, title: "Template", description: "Escolha um design" },
  { id: 2, title: "Informações", description: "Dados básicos" },
  { id: 3, title: "Mídia", description: "Avatar e imagens" },
  { id: 4, title: "Links", description: "Adicione seus links" },
  { id: 5, title: "Personalização", description: "Customize o visual" },
  { id: 6, title: "Finalizar", description: "Revisar e publicar" },
];

export const ProjectWizard = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [projectData, setProjectData] = useState({
    templateId: "",
    title: "",
    slug: "",
    description: "",
    avatarUrl: "",
    backgroundUrl: "",
    links: [] as Array<{ title: string; url: string; iconName?: string }>,
    themeConfig: {} as any,
  });

  const [customColors, setCustomColors] = useState({ primary: "#667eea", secondary: "#764ba2" });
  const [isGradient, setIsGradient] = useState(true);
  const [bgCustomized, setBgCustomized] = useState(false);

  const navigate = useNavigate();
  const createProject = useCreateProject();
  const createProjectLink = useCreateProjectLink();
  const { data: templates } = useTemplates();

  const progress = (currentStep / STEPS.length) * 100;

  const updateProjectData = (data: Partial<typeof projectData>) => {
    setProjectData(prev => ({ ...prev, ...data }));
  };

  const nextStep = () => {
    if (currentStep < STEPS.length) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return !!projectData.templateId;
      case 2:
        return !!(projectData.title && projectData.slug);
      case 3:
      case 4:
        return true;
      case 5:
        return true;
      default:
        return false;
    }
  };

  const handleFinish = async (shouldPublish: boolean = false) => {
    if (isProcessing) return;
    
    setIsProcessing(true);
    
    try {
      // 1. Criar o projeto primeiro
      const project = await createProject.mutateAsync({
        title: projectData.title,
        slug: projectData.slug,
        description: projectData.description,
        template_id: projectData.templateId,
        is_published: shouldPublish,
        avatar_url: projectData.avatarUrl,
        background_url: projectData.backgroundUrl,
        theme_config: {
          ...projectData.themeConfig,
          avatarUrl: projectData.avatarUrl,
          backgroundUrl: projectData.backgroundUrl,
        },
      });

      console.log("Project created:", project);

      // 2. Criar cada link individualmente
      if (projectData.links.length > 0) {
        for (let i = 0; i < projectData.links.length; i++) {
          const link = projectData.links[i];
          await createProjectLink.mutateAsync({
            project_id: project.id,
            title: link.title,
            url: link.url.startsWith('http') ? link.url : `https://${link.url}`,
            icon_name: link.iconName,
            position: i,
          });
        }
        console.log("Links created successfully");
      }

      // 3. Se deve publicar, atualizar o projeto
      if (shouldPublish) {
        // Usar o hook de update para marcar como publicado
        // Por ora, vamos deixar como rascunho e o usuário pode publicar depois
        toast({
          title: "Projeto criado!",
          description: shouldPublish 
            ? "Seu projeto foi criado e está pronto para ser compartilhado!" 
            : "Seu projeto foi salvo como rascunho.",
        });
      }

      // 4. Navegar para a página do projeto
      navigate(`/dashboard/projects/${project.id}`);
    } catch (error) {
      console.error("Error creating project:", error);
      toast({
        title: "Erro ao criar projeto",
        description: "Ocorreu um erro ao criar o projeto. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <TemplateSelector
            selectedTemplateId={projectData.templateId}
            onSelectTemplate={(templateId) => {
              const selectedTemplate = templates?.find(t => t.id === templateId);
              const defaultThemeConfig = (selectedTemplate?.config as any)?.layout === 'professional_card' 
                ? selectedTemplate.config 
                : {};
              
              updateProjectData({ 
                templateId,
                themeConfig: defaultThemeConfig 
              });
            }}
          />
        );
      case 2:
        return (
          <ProjectBasicInfo
            data={projectData}
            onChange={updateProjectData}
          />
        );
      case 3:
        return (
          <ProjectMediaUpload
            data={projectData}
            onChange={updateProjectData}
          />
        );
      case 4:
        return (
          <ProjectLinksEditor
            links={projectData.links}
            onChange={(links) => updateProjectData({ links })}
          />
        );
      case 5:
        const selectedTemplate = templates?.find(t => t.id === projectData.templateId);
        const isProfessionalTemplate = (selectedTemplate?.config as any)?.layout === 'professional_card';
        
        return (
          <Tabs defaultValue="empresarial" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="empresarial">Empresarial</TabsTrigger>
              <TabsTrigger value="smart">Smart</TabsTrigger>
              <TabsTrigger value="personalizado">Personalizado</TabsTrigger>
            </TabsList>

            <TabsContent value="empresarial">
              {isProfessionalTemplate ? (
                <ProfessionalCardEditor
                  projectData={{
                    ...projectData,
                    theme_config: projectData.themeConfig,
                    project_links: projectData.links.map((link, index) => ({
                      id: `temp_${index}`,
                      title: link.title,
                      url: link.url,
                      icon_name: link.iconName,
                      is_active: true,
                      position: index
                    }))
                  }}
                  onUpdate={(data) => updateProjectData({ themeConfig: data.theme_config })}
                />
              ) : (
                <div className="text-center py-12">
                  <h3 className="text-lg font-medium mb-2">Selecione o template Empresarial na etapa 1</h3>
                  <p className="text-muted-foreground">O editor empresarial aparece quando o template empresarial é selecionado.</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="smart">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {templates?.filter(t => t.category === 'Smart').map((template) => {
                  const isSelected = projectData.templateId === template.id;
                  const config = template.config as any;
                  return (
                    <Card key={template.id} className={`cursor-pointer transition-all hover:shadow-lg ${isSelected ? 'ring-2 ring-primary' : ''}`}
                          onClick={() => updateProjectData({ templateId: template.id })}>
                      <CardHeader>
                        <div className="w-full h-32 rounded-md mb-3" style={{ background: config?.colors?.background || 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }} />
                        <CardTitle className="text-lg">{template.name}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <Button className="w-full" variant={isSelected ? 'default' : 'outline'}>
                          {isSelected ? 'Selecionado' : 'Escolher'}
                        </Button>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </TabsContent>

            <TabsContent value="personalizado">
              <Card>
                <CardHeader>
                  <CardTitle>Cor de Fundo</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Switch id="bg-gradient" checked={isGradient} onCheckedChange={setIsGradient} />
                    <Label htmlFor="bg-gradient">{isGradient ? 'Gradiente' : 'Cor Sólida'}</Label>
                  </div>
                  {isGradient ? (
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Cor Inicial</Label>
                        <Input type="color" value={customColors.primary} onChange={(e) => setCustomColors({ ...customColors, primary: e.target.value })} className="w-20 h-10" />
                      </div>
                      <div>
                        <Label>Cor Final</Label>
                        <Input type="color" value={customColors.secondary} onChange={(e) => setCustomColors({ ...customColors, secondary: e.target.value })} className="w-20 h-10" />
                      </div>
                    </div>
                  ) : (
                    <div>
                      <Label>Cor</Label>
                      <Input type="color" value={customColors.primary} onChange={(e) => setCustomColors({ ...customColors, primary: e.target.value })} className="w-20 h-10" />
                    </div>
                  )}
                  <div className="w-full h-20 rounded-md border" style={{ background: isGradient ? `linear-gradient(135deg, ${customColors.primary} 0%, ${customColors.secondary} 100%)` : customColors.primary }} />
                  <Button
                    onClick={() => {
                      setBgCustomized(true);
                      updateProjectData({
                        themeConfig: {
                          ...projectData.themeConfig,
                          background: isGradient ? { gradient: { from: customColors.primary, to: customColors.secondary } } : {},
                          background_color: !isGradient ? customColors.primary : projectData.themeConfig?.background_color,
                        }
                      });
                    }}
                  >
                    Aplicar ao Projeto
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        );
      case 6:
        return (
          <ProjectPreview
            data={projectData}
            onPublish={handleFinish}
            isProcessing={isProcessing}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8">
        <Card className="max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle>Criar Novo LinksGo</CardTitle>
            <div className="space-y-4">
              <Progress value={progress} className="w-full" />
              <div className="flex justify-between text-sm">
                {STEPS.map((step) => (
                  <div
                    key={step.id}
                    className={`text-center cursor-pointer transition-colors ${
                      step.id === currentStep
                        ? "text-primary font-medium"
                        : step.id < currentStep
                        ? "text-muted-foreground hover:text-primary"
                        : "text-muted-foreground/50"
                    }`}
                    onClick={() => {
                      if (step.id < currentStep || step.id === currentStep) {
                        setCurrentStep(step.id);
                      }
                    }}
                  >
                    <div className="font-medium">{step.title}</div>
                    <div className="text-xs">{step.description}</div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Navigation buttons moved here */}
            <div className="flex justify-between pt-4 border-t">
              <div className="space-x-2">
                <Button
                  variant="outline"
                  onClick={() => navigate("/dashboard")}
                  disabled={isProcessing}
                >
                  Cancelar
                </Button>
                {currentStep > 1 && (
                  <Button
                    onClick={prevStep}
                    disabled={isProcessing}
                    variant="outline"
                  >
                    <ChevronLeft className="h-4 w-4 mr-2" />
                    Anterior
                  </Button>
                )}
              </div>

              {currentStep < STEPS.length ? (
                <Button
                  onClick={nextStep}
                  disabled={!canProceed() || isProcessing}
                >
                  Próximo
                  <ChevronRight className="h-4 w-4 ml-2" />
                </Button>
              ) : (
                <div className="space-x-2">
                  <Button
                    onClick={() => handleFinish(false)}
                    variant="outline"
                    disabled={isProcessing}
                  >
                    {isProcessing ? "Salvando..." : "Salvar Rascunho"}
                  </Button>
                  <Button
                    onClick={() => handleFinish(true)}
                    disabled={isProcessing}
                  >
                    {isProcessing ? "Criando..." : "Criar Projeto"}
                  </Button>
                </div>
              )}
            </div>
          </CardHeader>

          <CardContent className="min-h-[500px]">
            {renderStepContent()}
          </CardContent>

        </Card>
      </div>
    </div>
  );
};
