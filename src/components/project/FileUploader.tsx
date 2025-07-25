import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, Image, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useFileUpload } from "@/hooks/useFileUpload";
import { cn } from "@/lib/utils";

interface FileUploaderProps {
  onUploadComplete: (url: string) => void;
  currentImage?: string;
  bucket: string;
  path: string;
  accept?: { [key: string]: string[] };
  maxSize?: number;
  className?: string;
}

export const FileUploader = ({
  onUploadComplete,
  currentImage,
  bucket,
  path,
  accept = { "image/*": [".png", ".jpg", ".jpeg", ".gif", ".webp"] },
  maxSize = 5 * 1024 * 1024, // 5MB
  className,
}: FileUploaderProps) => {
  const { uploadFile, uploading, progress } = useFileUpload();

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (!file) return;

      try {
        // Create a unique filename to avoid conflicts
        const fileExtension = file.name.split('.').pop();
        const uniqueFileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExtension}`;
        const result = await uploadFile(file, bucket, `${path}/${uniqueFileName}`, { upsert: true });
        onUploadComplete(result.url);
      } catch (error) {
        console.error("Upload error:", error);
      }
    },
    [uploadFile, bucket, path, onUploadComplete]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept,
    maxSize,
    multiple: false,
  });

  const removeImage = () => {
    onUploadComplete("");
  };

  return (
    <div className={cn("space-y-4", className)}>
      {currentImage ? (
        <div className="relative group">
          <img
            src={currentImage}
            alt="Upload preview"
            className="w-full h-48 object-cover rounded-lg"
          />
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
            <Button
              onClick={removeImage}
              variant="destructive"
              size="sm"
              className="absolute top-2 right-2"
            >
              <X className="h-4 w-4" />
            </Button>
            <div {...getRootProps()} className="cursor-pointer">
              <input {...getInputProps()} />
              <Button variant="secondary" size="sm">
                <Upload className="h-4 w-4 mr-2" />
                Substituir
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div
          {...getRootProps()}
          className={cn(
            "border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center cursor-pointer transition-colors hover:border-muted-foreground/50",
            isDragActive && "border-primary bg-primary/5"
          )}
        >
          <input {...getInputProps()} />
          <div className="flex flex-col items-center space-y-4">
            <div className="p-4 bg-muted/50 rounded-full">
              <Image className="h-8 w-8 text-muted-foreground" />
            </div>
            <div>
              <p className="text-lg font-medium">
                {isDragActive ? "Solte o arquivo aqui" : "Clique ou arraste uma imagem"}
              </p>
              <p className="text-sm text-muted-foreground">
                PNG, JPG, GIF até 5MB
              </p>
            </div>
          </div>
        </div>
      )}

      {uploading && (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span>Enviando...</span>
            <span>{progress}%</span>
          </div>
          <Progress value={progress} className="w-full" />
        </div>
      )}
    </div>
  );
};