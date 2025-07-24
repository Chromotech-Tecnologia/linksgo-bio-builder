
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { TemplateSelector } from "./TemplateSelector";
import { ProjectBasicInfo } from "./ProjectBasicInfo";
import { ProjectMediaUpload } from "./ProjectMediaUpload";
import { ProjectLinksEditor } from "./ProjectLinksEditor";
import { ProjectPreview } from "./ProjectPreview";
import { useCreateProject } from "@/hooks/useProjects";
import { useCreateProjectLink } from "@/hooks/useProjectLinks";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const STEPS = [
  { id: 1, title: "Template", description: "Escolha um design" },
  { id: 2, title: "Informações", description: "Dados básicos" },
  { id: 3, title: "Mídia", description: "Avatar e imagens" },
  { id: 4, title: "Links", description: "Adicione seus links" },
  { id: 5, title: "Finalizar", description: "Revisar e publicar" },
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
  });

  const navigate = useNavigate();
  const createProject = useCreateProject();
  const createProjectLink = useCreateProjectLink();

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
            onSelectTemplate={(templateId) => updateProjectData({ templateId })}
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
                    className={`text-center ${
                      step.id === currentStep
                        ? "text-primary font-medium"
                        : step.id < currentStep
                        ? "text-muted-foreground"
                        : "text-muted-foreground/50"
                    }`}
                  >
                    <div className="font-medium">{step.title}</div>
                    <div className="text-xs">{step.description}</div>
                  </div>
                ))}
              </div>
            </div>
          </CardHeader>

          <CardContent className="min-h-[500px]">
            {renderStepContent()}
          </CardContent>

          <div className="flex justify-between p-6 border-t">
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
        </Card>
      </div>
    </div>
  );
};
