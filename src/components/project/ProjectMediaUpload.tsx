import { FileUploader } from "./FileUploader";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/useAuth";

interface ProjectMediaUploadProps {
  data: {
    avatarUrl: string;
    backgroundUrl: string;
  };
  onChange: (data: Partial<{ avatarUrl: string; backgroundUrl: string }>) => void;
}

export const ProjectMediaUpload = ({ data, onChange }: ProjectMediaUploadProps) => {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <div className="space-y-8 max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold mb-2">Imagens do Projeto</h2>
        <p className="text-muted-foreground">
          Adicione um avatar e imagem de fundo para personalizar seu LinksGo
        </p>
      </div>

      <div className="space-y-6">
        <div className="space-y-3">
          <Label>Avatar/Foto de Perfil</Label>
          <p className="text-sm text-muted-foreground">
            Imagem que aparecerá como seu perfil. Recomendado: formato quadrado.
          </p>
          <FileUploader
            currentImage={data.avatarUrl}
            onUploadComplete={(url) => onChange({ avatarUrl: url })}
            bucket="avatars"
            path={user.id}
            accept={{ "image/*": [".png", ".jpg", ".jpeg", ".gif", ".webp"] }}
            maxSize={2 * 1024 * 1024} // 2MB
          />
        </div>

        <div className="border-t pt-6">
          <div className="space-y-3">
            <Label>Imagem de Fundo (opcional)</Label>
            <p className="text-sm text-muted-foreground">
              Imagem que aparecerá atrás do seu perfil. Recomendado: formato landscape (16:9).
            </p>
            <FileUploader
              currentImage={data.backgroundUrl}
              onUploadComplete={(url) => onChange({ backgroundUrl: url })}
              bucket="projects"
              path={user.id}
              accept={{ "image/*": [".png", ".jpg", ".jpeg", ".gif", ".webp"] }}
              maxSize={5 * 1024 * 1024} // 5MB
            />
          </div>
        </div>
      </div>

      <div className="bg-muted/50 p-4 rounded-lg">
        <h4 className="font-medium mb-2">Dicas para melhores resultados:</h4>
        <ul className="text-sm text-muted-foreground space-y-1">
          <li>• Avatar: Use imagens quadradas com boa qualidade (mínimo 200x200px)</li>
          <li>• Fundo: Prefira imagens horizontais com cores que combinem com seu template</li>
          <li>• Formatos aceitos: PNG, JPG, GIF, WebP</li>
          <li>• Tamanho máximo: Avatar 2MB, Fundo 5MB</li>
        </ul>
      </div>
    </div>
  );
};