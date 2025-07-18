import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export const useFileUpload = () => {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const uploadFile = async (
    file: File,
    bucket: string,
    path: string,
    options?: { upsert?: boolean }
  ) => {
    try {
      setUploading(true);
      setProgress(0);

      // Simulate progress for better UX
      const progressInterval = setInterval(() => {
        setProgress(prev => Math.min(prev + 10, 90));
      }, 100);

      const { data, error } = await supabase.storage
        .from(bucket)
        .upload(path, file, {
          cacheControl: "3600",
          upsert: options?.upsert || false,
        });

      clearInterval(progressInterval);
      setProgress(100);

      if (error) throw error;

      // Get public URL
      const { data: urlData } = supabase.storage
        .from(bucket)
        .getPublicUrl(data.path);

      // Store file metadata in database
      const { data: mediaData, error: mediaError } = await supabase
        .from("project_media")
        .insert({
          project_id: path.split("/")[0], // Assuming path format: projectId/filename
          file_name: file.name,
          file_url: urlData.publicUrl,
          file_type: file.type,
          file_size: file.size,
        })
        .select()
        .single();

      if (mediaError) throw mediaError;

      toast({
        title: "Upload concluído!",
        description: "Arquivo enviado com sucesso.",
      });

      return {
        url: urlData.publicUrl,
        metadata: mediaData,
      };
    } catch (error) {
      toast({
        title: "Erro no upload",
        description: error instanceof Error ? error.message : "Erro desconhecido",
        variant: "destructive",
      });
      throw error;
    } finally {
      setUploading(false);
      setProgress(0);
    }
  };

  const deleteFile = async (bucket: string, path: string) => {
    try {
      const { error } = await supabase.storage
        .from(bucket)
        .remove([path]);

      if (error) throw error;

      toast({
        title: "Arquivo removido!",
        description: "O arquivo foi excluído com sucesso.",
      });
    } catch (error) {
      toast({
        title: "Erro ao remover arquivo",
        description: error instanceof Error ? error.message : "Erro desconhecido",
        variant: "destructive",
      });
      throw error;
    }
  };

  return {
    uploadFile,
    deleteFile,
    uploading,
    progress,
  };
};