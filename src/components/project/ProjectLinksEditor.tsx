import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, ExternalLink, GripVertical, Trash2, Edit } from "lucide-react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

interface Link {
  id?: string;
  title: string;
  url: string;
  iconName?: string;
}

interface ProjectLinksEditorProps {
  links: Link[];
  onChange: (links: Link[]) => void;
}

const POPULAR_ICONS = [
  { name: "Instagram", value: "instagram" },
  { name: "WhatsApp", value: "whatsapp" },
  { name: "YouTube", value: "youtube" },
  { name: "LinkedIn", value: "linkedin" },
  { name: "TikTok", value: "music" },
  { name: "Facebook", value: "facebook" },
  { name: "Twitter/X", value: "twitter" },
  { name: "Email", value: "mail" },
  { name: "Telefone", value: "phone" },
  { name: "Website", value: "globe" },
  { name: "Local", value: "map-pin" },
  { name: "Loja", value: "shopping-bag" },
  { name: "Portfolio", value: "briefcase" },
];

export const ProjectLinksEditor = ({ links, onChange }: ProjectLinksEditorProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    url: "",
    iconName: "",
  });

  const resetForm = () => {
    setFormData({ title: "", url: "", iconName: "" });
    setEditingIndex(null);
  };

  const openAddDialog = () => {
    resetForm();
    setIsDialogOpen(true);
  };

  const openEditDialog = (index: number) => {
    const link = links[index];
    setFormData({
      title: link.title,
      url: link.url,
      iconName: link.iconName || "",
    });
    setEditingIndex(index);
    setIsDialogOpen(true);
  };

  const handleSubmit = () => {
    if (!formData.title || !formData.url) return;

    const newLink = {
      ...formData,
      id: editingIndex !== null ? links[editingIndex].id : crypto.randomUUID(),
    };

    let updatedLinks;
    if (editingIndex !== null) {
      updatedLinks = [...links];
      updatedLinks[editingIndex] = newLink;
    } else {
      updatedLinks = [...links, newLink];
    }

    onChange(updatedLinks);
    setIsDialogOpen(false);
    resetForm();
  };

  const handleDelete = (index: number) => {
    const updatedLinks = links.filter((_, i) => i !== index);
    onChange(updatedLinks);
  };

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;

    const reorderedLinks = Array.from(links);
    const [removed] = reorderedLinks.splice(result.source.index, 1);
    reorderedLinks.splice(result.destination.index, 0, removed);

    onChange(reorderedLinks);
  };

  const formatUrl = (url: string) => {
    if (!url.startsWith("http://") && !url.startsWith("https://")) {
      return `https://${url}`;
    }
    return url;
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold mb-2">Seus Links</h2>
        <p className="text-muted-foreground">
          Adicione os links que você quer compartilhar
        </p>
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium">Links Adicionados</h3>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={openAddDialog}>
                <Plus className="h-4 w-4 mr-2" />
                Adicionar Link
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {editingIndex !== null ? "Editar Link" : "Adicionar Novo Link"}
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Título *</Label>
                  <Input
                    id="title"
                    placeholder="Ex: Meu Instagram"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="url">URL *</Label>
                  <Input
                    id="url"
                    placeholder="https://instagram.com/seuperfil"
                    value={formData.url}
                    onChange={(e) => setFormData(prev => ({ ...prev, url: e.target.value }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="icon">Ícone</Label>
                  <Select
                    value={formData.iconName}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, iconName: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Escolha um ícone" />
                    </SelectTrigger>
                    <SelectContent>
                      {POPULAR_ICONS.map((icon) => (
                        <SelectItem key={icon.value} value={icon.value}>
                          {icon.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Button 
                  onClick={handleSubmit} 
                  className="w-full"
                  disabled={!formData.title || !formData.url}
                >
                  {editingIndex !== null ? "Salvar Alterações" : "Adicionar Link"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {links.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <ExternalLink className="h-12 w-12 text-muted-foreground mb-4" />
              <h4 className="text-lg font-medium mb-2">Nenhum link adicionado</h4>
              <p className="text-muted-foreground text-center mb-4">
                Comece adicionando seus primeiros links
              </p>
              <Button onClick={openAddDialog}>
                <Plus className="h-4 w-4 mr-2" />
                Adicionar Primeiro Link
              </Button>
            </CardContent>
          </Card>
        ) : (
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="links">
              {(provided) => (
                <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-3">
                  {links.map((link, index) => (
                    <Draggable 
                      key={link.id || index} 
                      draggableId={link.id || index.toString()} 
                      index={index}
                    >
                      {(provided) => (
                        <Card
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          className="transition-shadow hover:shadow-md"
                        >
                          <CardContent className="flex items-center gap-4 p-4">
                            <div {...provided.dragHandleProps}>
                              <GripVertical className="h-5 w-5 text-muted-foreground cursor-grab" />
                            </div>
                            
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <h4 className="font-medium truncate flex-1 min-w-0">{link.title}</h4>
                                {link.iconName && (
                                  <Badge variant="secondary" className="text-xs shrink-0">
                                    {POPULAR_ICONS.find(i => i.value === link.iconName)?.name || link.iconName}
                                  </Badge>
                                )}
                              </div>
                              <p className="text-sm text-muted-foreground truncate">
                                {link.url}
                              </p>
                            </div>

                            <div className="flex items-center gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => openEditDialog(index)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDelete(index)}
                                className="text-destructive hover:text-destructive"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        )}
      </div>

      {links.length > 0 && (
        <div className="bg-muted/50 p-4 rounded-lg">
          <h4 className="font-medium mb-2">Dicas:</h4>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• Arraste os links para reordená-los</li>
            <li>• Use títulos descritivos e URLs completas</li>
            <li>• Os ícones ajudam na identificação rápida</li>
          </ul>
        </div>
      )}
    </div>
  );
};