import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DynamicIcon } from "@/components/ui/dynamic-icon";
import { Plus, Trash2, Move, Palette } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface ProfessionalCardEditorProps {
  projectData: any;
  onUpdate: (data: any) => void;
}

const commonIcons = [
  'smartphone', 'mail', 'globe', 'phone', 'map-pin', 'calendar',
  'facebook', 'instagram', 'twitter', 'linkedin', 'youtube', 'whatsapp',
  'download', 'shopping-cart', 'heart', 'star', 'camera', 'music',
  'video', 'file-text', 'book', 'briefcase', 'users', 'coffee'
];

const socialPlatforms = [
  { name: 'Facebook', icon: 'facebook' },
  { name: 'Instagram', icon: 'instagram' },
  { name: 'Twitter', icon: 'twitter' },
  { name: 'LinkedIn', icon: 'linkedin' },
  { name: 'YouTube', icon: 'youtube' },
  { name: 'WhatsApp', icon: 'whatsapp' },
  { name: 'TikTok', icon: 'music' },
  { name: 'Website', icon: 'globe' },
  { name: 'Email', icon: 'mail' },
  { name: 'Phone', icon: 'phone' }
];

export const ProfessionalCardEditor = ({ projectData, onUpdate }: ProfessionalCardEditorProps) => {
  const [activeTab, setActiveTab] = useState("general");
  
  const themeConfig = projectData.theme_config || {};
  const socialLinks = projectData.social_links || [];

  const updateThemeConfig = (path: string, value: any) => {
    const keys = path.split('.');
    const newThemeConfig = { ...themeConfig };
    
    let current = newThemeConfig;
    for (let i = 0; i < keys.length - 1; i++) {
      if (!current[keys[i]]) current[keys[i]] = {};
      current = current[keys[i]];
    }
    current[keys[keys.length - 1]] = value;
    
    onUpdate({
      ...projectData,
      theme_config: newThemeConfig
    });
  };

  const updateLink = (linkId: string, updates: any) => {
    const updatedLinks = projectData.project_links.map((link: any) =>
      link.id === linkId ? { ...link, ...updates } : link
    );
    
    onUpdate({
      ...projectData,
      project_links: updatedLinks
    });
  };

  const addSocialLink = () => {
    const newSocialLink = {
      id: `social_${Date.now()}`,
      platform: 'Facebook',
      url: '',
      icon_name: 'facebook',
      icon_color: '#ffffff',
      background_color: '#3b82f6'
    };
    
    onUpdate({
      ...projectData,
      social_links: [...socialLinks, newSocialLink]
    });
  };

  const updateSocialLink = (linkId: string, updates: any) => {
    const updatedSocialLinks = socialLinks.map((link: any) =>
      link.id === linkId ? { ...link, ...updates } : link
    );
    
    onUpdate({
      ...projectData,
      social_links: updatedSocialLinks
    });
  };

  const removeSocialLink = (linkId: string) => {
    const updatedSocialLinks = socialLinks.filter((link: any) => link.id !== linkId);
    onUpdate({
      ...projectData,
      social_links: updatedSocialLinks
    });
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">Editor de Template Empresarial</h2>
        <p className="text-muted-foreground">Personalize todos os aspectos do seu template</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="general">Geral</TabsTrigger>
          <TabsTrigger value="hero">Imagem Hero</TabsTrigger>
          <TabsTrigger value="buttons">Botões</TabsTrigger>
          <TabsTrigger value="social">Redes Sociais</TabsTrigger>
          <TabsTrigger value="style">Estilo</TabsTrigger>
        </TabsList>

        {/* Aba Geral */}
        <TabsContent value="general" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Configurações Gerais</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={!!themeConfig.background?.gradient}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        updateThemeConfig('background.gradient.from', themeConfig.background?.gradient?.from || themeConfig.background_color || '#667eea');
                        updateThemeConfig('background.gradient.to', themeConfig.background?.gradient?.to || '#764ba2');
                      } else {
                        updateThemeConfig('background', {});
                      }
                    }}
                  />
                  <Label>Usar gradiente de fundo</Label>
                </div>

                {themeConfig.background?.gradient ? (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Gradiente - Cor Inicial</Label>
                      <Input
                        type="color"
                        value={themeConfig.background?.gradient?.from || '#667eea'}
                        onChange={(e) => updateThemeConfig('background.gradient.from', e.target.value)}
                        className="w-20 h-10"
                      />
                    </div>
                    <div>
                      <Label>Gradiente - Cor Final</Label>
                      <Input
                        type="color"
                        value={themeConfig.background?.gradient?.to || '#764ba2'}
                        onChange={(e) => updateThemeConfig('background.gradient.to', e.target.value)}
                        className="w-20 h-10"
                      />
                    </div>
                  </div>
                ) : (
                  <div>
                    <Label htmlFor="bg-color">Cor de Fundo</Label>
                    <Input
                      id="bg-color"
                      type="color"
                      value={themeConfig.background_color || '#ffffff'}
                      onChange={(e) => updateThemeConfig('background_color', e.target.value)}
                      className="w-20 h-10"
                    />
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="title-color">Cor do Título</Label>
                    <Input
                      id="title-color"
                      type="color"
                      value={themeConfig.title_color || '#1e40af'}
                      onChange={(e) => updateThemeConfig('title_color', e.target.value)}
                      className="w-20 h-10"
                    />
                  </div>
                  <div>
                    <Label htmlFor="desc-color">Cor da Descrição</Label>
                    <Input
                      id="desc-color"
                      type="color"
                      value={themeConfig.description_color || '#64748b'}
                      onChange={(e) => updateThemeConfig('description_color', e.target.value)}
                      className="w-20 h-10"
                    />
                  </div>
                </div>

                <div
                  className="w-full h-20 rounded-md border"
                  style={{
                    background: themeConfig.background?.gradient
                      ? `linear-gradient(135deg, ${themeConfig.background.gradient.from} 0%, ${themeConfig.background.gradient.to} 100%)`
                      : themeConfig.background_color || '#ffffff'
                  }}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Aba Imagem Hero */}
        <TabsContent value="hero" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Configurações da Imagem Hero</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Switch
                  checked={themeConfig.hero_image?.enabled !== false}
                  onCheckedChange={(checked) => updateThemeConfig('hero_image.enabled', checked)}
                />
                <Label>Mostrar Imagem Hero</Label>
              </div>
              
              <div>
                <Label htmlFor="hero-height">Altura da Seção Hero</Label>
                <Select
                  value={themeConfig.hero_image?.height || '200px'}
                  onValueChange={(value) => updateThemeConfig('hero_image.height', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="150px">Pequena (150px)</SelectItem>
                    <SelectItem value="200px">Média (200px)</SelectItem>
                    <SelectItem value="250px">Grande (250px)</SelectItem>
                    <SelectItem value="300px">Extra Grande (300px)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="hero-size">Tamanho da Imagem (px)</Label>
                <Input
                  id="hero-size"
                  type="number"
                  min={40}
                  max={512}
                  step={1}
                  value={parseInt((themeConfig.hero_image?.size || '120px').replace('px',''))}
                  onChange={(e) => {
                    const val = Math.max(40, Math.min(512, Number(e.target.value) || 0));
                    updateThemeConfig('hero_image.size', `${val}px`);
                  }}
                  className="w-32"
                />
              </div>
              
              <div>
                <Label htmlFor="hero-shape">Formato da Imagem</Label>
                <Select
                  value={themeConfig.hero_image?.shape || 'round'}
                  onValueChange={(value) => updateThemeConfig('hero_image.shape', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="round">Redondo</SelectItem>
                    <SelectItem value="square">Quadrado</SelectItem>
                    <SelectItem value="real">Tamanho real</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="hero-img-radius">Bordas da Imagem (px)</Label>
                <Input
                  id="hero-img-radius"
                  type="number"
                  min={0}
                  max={64}
                  step={1}
                  value={parseInt((themeConfig.hero_image?.image_border_radius || '12px').replace('px',''))}
                  onChange={(e) => {
                    const val = Math.max(0, Math.min(64, Number(e.target.value) || 0));
                    updateThemeConfig('hero_image.image_border_radius', `${val}px`);
                  }}
                  className="w-32"
                />
              </div>
              
              <div>
                <Label htmlFor="hero-radius">Bordas da Seção</Label>
                <Select
                  value={themeConfig.hero_image?.border_radius || '0 0 24px 24px'}
                  onValueChange={(value) => updateThemeConfig('hero_image.border_radius', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">Sem bordas</SelectItem>
                    <SelectItem value="0 0 12px 12px">Bordas pequenas</SelectItem>
                    <SelectItem value="0 0 24px 24px">Bordas médias</SelectItem>
                    <SelectItem value="0 0 40px 40px">Bordas grandes</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Aba Botões */}
        <TabsContent value="buttons" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Estilo dos Botões</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Cor Inicial do Gradiente</Label>
                  <Input
                    type="color"
                    value={themeConfig.buttons?.gradient?.from || '#1e40af'}
                    onChange={(e) => updateThemeConfig('buttons.gradient.from', e.target.value)}
                    className="w-20 h-10"
                  />
                </div>
                <div>
                  <Label>Cor Final do Gradiente</Label>
                  <Input
                    type="color"
                    value={themeConfig.buttons?.gradient?.to || '#3b82f6'}
                    onChange={(e) => updateThemeConfig('buttons.gradient.to', e.target.value)}
                    className="w-20 h-10"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Cor do Texto</Label>
                  <Input
                    type="color"
                    value={themeConfig.buttons?.text_color || '#ffffff'}
                    onChange={(e) => updateThemeConfig('buttons.text_color', e.target.value)}
                    className="w-20 h-10"
                  />
                </div>
                <div>
                  <Label>Cor do Ícone</Label>
                  <Input
                    type="color"
                    value={themeConfig.buttons?.icon_color || '#ffffff'}
                    onChange={(e) => updateThemeConfig('buttons.icon_color', e.target.value)}
                    className="w-20 h-10"
                  />
                </div>
              </div>

              <div>
                <Label>Bordas Arredondadas dos Botões</Label>
                <Select
                  value={themeConfig.buttons?.border_radius || '12px'}
                  onValueChange={(value) => updateThemeConfig('buttons.border_radius', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="4px">Pequenas</SelectItem>
                    <SelectItem value="8px">Médias</SelectItem>
                    <SelectItem value="12px">Grandes</SelectItem>
                    <SelectItem value="20px">Extra Grandes</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Edição individual dos botões */}
          <Card>
            <CardHeader>
              <CardTitle>Personalizar Botões Individuais</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {projectData.project_links?.map((link: any) => (
                <div key={link.id} className="p-4 border rounded-lg space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">{link.title}</h4>
                    <div className="flex items-center space-x-2">
                      <DynamicIcon name={link.icon_name || 'circle'} className="w-4 h-4" />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label>Ícone</Label>
                      <Select
                        value={link.icon_name || ''}
                        onValueChange={(value) => updateLink(link.id, { icon_name: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Escolher ícone" />
                        </SelectTrigger>
                        <SelectContent>
                          {commonIcons.map(icon => (
                            <SelectItem key={icon} value={icon}>
                              <div className="flex items-center space-x-2">
                                <DynamicIcon name={icon} className="w-4 h-4" />
                                <span>{icon}</span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label>Cor do Ícone</Label>
                      <Input
                        type="color"
                        value={link.icon_color || themeConfig.buttons?.icon_color || '#ffffff'}
                        onChange={(e) => updateLink(link.id, { icon_color: e.target.value })}
                        className="w-20 h-8"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Aba Redes Sociais */}
        <TabsContent value="social" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Ícones de Redes Sociais
                <Button onClick={addSocialLink} size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Adicionar
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <Label>Cor de Fundo dos Ícones</Label>
                  <Input
                    type="color"
                    value={themeConfig.social_icons?.background_color || '#3b82f6'}
                    onChange={(e) => updateThemeConfig('social_icons.background_color', e.target.value)}
                    className="w-20 h-10"
                  />
                </div>
                <div>
                  <Label>Cor dos Ícones</Label>
                  <Input
                    type="color"
                    value={themeConfig.social_icons?.icon_color || '#ffffff'}
                    onChange={(e) => updateThemeConfig('social_icons.icon_color', e.target.value)}
                    className="w-20 h-10"
                  />
                </div>
              </div>

              <Separator />

              {socialLinks.map((social: any) => (
                <div key={social.id} className="p-4 border rounded-lg space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">{social.platform}</h4>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => removeSocialLink(social.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                  
                  <div className="grid grid-cols-1 gap-3">
                    <div>
                      <Label>Plataforma</Label>
                      <Select
                        value={social.platform}
                        onValueChange={(value) => {
                          const platform = socialPlatforms.find(p => p.name === value);
                          updateSocialLink(social.id, { 
                            platform: value,
                            icon_name: platform?.icon || 'globe'
                          });
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {socialPlatforms.map(platform => (
                            <SelectItem key={platform.name} value={platform.name}>
                              <div className="flex items-center space-x-2">
                                <DynamicIcon name={platform.icon} className="w-4 h-4" />
                                <span>{platform.name}</span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label>URL</Label>
                      <Input
                        type="url"
                        value={social.url}
                        onChange={(e) => updateSocialLink(social.id, { url: e.target.value })}
                        placeholder="https://..."
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label>Cor de Fundo</Label>
                        <Input
                          type="color"
                          value={social.background_color || themeConfig.social_icons?.background_color || '#3b82f6'}
                          onChange={(e) => updateSocialLink(social.id, { background_color: e.target.value })}
                          className="w-20 h-8"
                        />
                      </div>
                      <div>
                        <Label>Cor do Ícone</Label>
                        <Input
                          type="color"
                          value={social.icon_color || themeConfig.social_icons?.icon_color || '#ffffff'}
                          onChange={(e) => updateSocialLink(social.id, { icon_color: e.target.value })}
                          className="w-20 h-8"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              
              {socialLinks.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <p>Nenhum ícone de rede social adicionado</p>
                  <p className="text-sm">Clique em "Adicionar" para começar</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Aba Estilo */}
        <TabsContent value="style" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Configurações de Estilo Avançadas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Tamanho dos Ícones Sociais</Label>
                <Select
                  value={themeConfig.social_icons?.size || '48px'}
                  onValueChange={(value) => updateThemeConfig('social_icons.size', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="32px">Pequeno (32px)</SelectItem>
                    <SelectItem value="40px">Médio (40px)</SelectItem>
                    <SelectItem value="48px">Grande (48px)</SelectItem>
                    <SelectItem value="56px">Extra Grande (56px)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="p-4 bg-muted rounded-lg">
                <h4 className="font-medium mb-2 flex items-center">
                  <Palette className="w-4 h-4 mr-2" />
                  Dicas de Personalização
                </h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Use cores contrastantes para melhor legibilidade</li>
                  <li>• Mantenha consistência nos gradientes dos botões</li>
                  <li>• Teste em diferentes dispositivos</li>
                  <li>• Evite usar muitas cores diferentes</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};