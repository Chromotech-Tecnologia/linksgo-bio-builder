import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { AlertCircle, Check } from "lucide-react";

interface ProjectBasicInfoProps {
  data: {
    title: string;
    slug: string;
    description: string;
  };
  onChange: (data: Partial<{ title: string; slug: string; description: string }>) => void;
  currentProjectId?: string;
}

export const ProjectBasicInfo = ({ data, onChange, currentProjectId }: ProjectBasicInfoProps) => {
  const [slugStatus, setSlugStatus] = useState<"checking" | "available" | "taken" | "invalid" | null>(null);
  const { user } = useAuth();

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9\s-]/g, "")
      .trim()
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");
  };

  const validateSlug = (slug: string) => {
    const slugRegex = /^[a-z0-9]([a-z0-9-]*[a-z0-9])?$/;
    return slugRegex.test(slug) && slug.length >= 3 && slug.length <= 50;
  };

  const checkSlugAvailability = async (slug: string, currentProjectId?: string) => {
    if (!user || !slug || !validateSlug(slug)) {
      setSlugStatus("invalid");
      return;
    }

    setSlugStatus("checking");

    try {
      let query = supabase
        .from("projects")
        .select("id")
        .eq("slug", slug)
        .eq("user_id", user.id);

      // If we're editing a project, exclude the current project from the check
      if (currentProjectId) {
        query = query.neq("id", currentProjectId);
      }

      const { data: existingProject } = await query.maybeSingle();

      setSlugStatus(existingProject ? "taken" : "available");
    } catch (error) {
      setSlugStatus("available");
    }
  };

  useEffect(() => {
    if (data.slug) {
      const timeoutId = setTimeout(() => {
        checkSlugAvailability(data.slug, currentProjectId);
      }, 500);

      return () => clearTimeout(timeoutId);
    }
  }, [data.slug, user, currentProjectId]);

  const handleTitleChange = (title: string) => {
    onChange({ title });
    
    // Auto-generate slug if it's empty or matches the previous generated slug
    if (!data.slug || data.slug === generateSlug(data.title)) {
      const newSlug = generateSlug(title);
      onChange({ slug: newSlug });
    }
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold mb-2">Informações Básicas</h2>
        <p className="text-muted-foreground">
          Configure o nome e a URL do seu LinksGo
        </p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="title">Nome do Projeto *</Label>
          <Input
            id="title"
            placeholder="Ex: João Silva, Minha Empresa, etc."
            value={data.title}
            onChange={(e) => handleTitleChange(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="slug">URL Personalizada *</Label>
          <div className="flex items-center">
            <span className="bg-muted px-3 py-2 rounded-l-md border border-r-0 text-sm text-muted-foreground">
              linksgo.lovable.app/
            </span>
            <Input
              id="slug"
              placeholder="meu-link"
              value={data.slug}
              onChange={(e) => onChange({ slug: e.target.value.toLowerCase() })}
              className="rounded-l-none"
            />
          </div>
          
          {slugStatus && (
            <Alert className={slugStatus === "available" ? "border-green-200" : "border-red-200"}>
              <div className="flex items-center gap-2">
                {slugStatus === "checking" && <div className="animate-spin h-4 w-4 border-2 border-primary border-t-transparent rounded-full" />}
                {slugStatus === "available" && <Check className="h-4 w-4 text-green-600" />}
                {(slugStatus === "taken" || slugStatus === "invalid") && <AlertCircle className="h-4 w-4 text-red-600" />}
                <AlertDescription>
                  {slugStatus === "checking" && "Verificando disponibilidade..."}
                  {slugStatus === "available" && "URL disponível!"}
                  {slugStatus === "taken" && "Esta URL já está em uso. Tente outra."}
                  {slugStatus === "invalid" && "URL inválida. Use apenas letras, números e hífen."}
                </AlertDescription>
              </div>
            </Alert>
          )}
          
          <p className="text-xs text-muted-foreground">
            Mínimo 3 caracteres. Apenas letras, números e hífen.
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Descrição (opcional)</Label>
          <Textarea
            id="description"
            placeholder="Conte um pouco sobre você ou sua empresa..."
            value={data.description}
            onChange={(e) => onChange({ description: e.target.value })}
            rows={3}
          />
        </div>
      </div>

      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Você poderá alterar essas informações depois na área de edição do projeto.
        </AlertDescription>
      </Alert>
    </div>
  );
};