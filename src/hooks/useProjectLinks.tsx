import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export const useProjectLinks = (projectId: string) => {
  return useQuery({
    queryKey: ["project-links", projectId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("project_links")
        .select("*")
        .eq("project_id", projectId)
        .order("position", { ascending: true });

      if (error) throw error;
      return data;
    },
    enabled: !!projectId,
  });
};

export const useCreateProjectLink = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (link: {
      project_id: string;
      title: string;
      url: string;
      icon_name?: string;
      icon_url?: string;
      position: number;
    }) => {
      const { data, error } = await supabase
        .from("project_links")
        .insert(link)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["project-links", data.project_id] });
      toast({
        title: "Link adicionado!",
        description: "O link foi criado com sucesso.",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro ao criar link",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};

export const useUpdateProjectLink = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...updates }: { id: string; [key: string]: any }) => {
      const { data, error } = await supabase
        .from("project_links")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["project-links", data.project_id] });
      toast({
        title: "Link atualizado!",
        description: "As alterações foram salvas.",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro ao atualizar link",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};

export const useDeleteProjectLink = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("project_links")
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["project-links"] });
      toast({
        title: "Link removido!",
        description: "O link foi excluído com sucesso.",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro ao excluir link",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};

export const useReorderProjectLinks = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ projectId, linkIds }: { projectId: string; linkIds: string[] }) => {
      const updates = linkIds.map((id, index) => 
        supabase
          .from("project_links")
          .update({ position: index })
          .eq("id", id)
      );

      await Promise.all(updates);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["project-links", variables.projectId] });
    },
    onError: (error) => {
      toast({
        title: "Erro ao reordenar links",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};