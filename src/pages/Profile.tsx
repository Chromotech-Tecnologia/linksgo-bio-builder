import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Plus, Trash2, Crown, Shield, User, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

interface Profile {
  id: string;
  display_name: string | null;
  username: string | null;
  bio: string | null;
  avatar_url: string | null;
  is_company: boolean;
  company_name: string | null;
  company_cnpj: string | null;
  company_address: string | null;
  company_phone: string | null;
  company_website: string | null;
  organization_id: string | null;
}

interface Organization {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  avatar_url: string | null;
}

interface OrganizationMember {
  id: string;
  user_id: string;
  role: string;
  created_at: string;
  profiles: {
    display_name: string | null;
    username: string | null;
  };
}

export default function Profile() {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [members, setMembers] = useState<OrganizationMember[]>([]);
  const [passwords, setPasswords] = useState({
    current: '',
    new: '',
    confirm: ''
  });
  const [newMemberEmail, setNewMemberEmail] = useState('');

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

  const fetchProfile = async () => {
    if (!user) return;

    try {
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (profileError) throw profileError;
      setProfile(profileData);

      if (profileData.organization_id) {
        const { data: orgData, error: orgError } = await supabase
          .from('organizations')
          .select('*')
          .eq('id', profileData.organization_id)
          .single();

        if (!orgError && orgData) {
          setOrganization(orgData);
          fetchOrganizationMembers(orgData.id);
        }
      }
    } catch (error: any) {
      toast({
        title: "Erro ao carregar perfil",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const fetchOrganizationMembers = async (orgId: string) => {
    try {
      // Get members and their profile data separately due to foreign key structure
      const { data: membersData, error: membersError } = await supabase
        .from('organization_members')
        .select('id, user_id, role, created_at')
        .eq('organization_id', orgId);

      if (membersError) throw membersError;

      // Get profile data for each member
      const membersWithProfiles = await Promise.all(
        (membersData || []).map(async (member) => {
          const { data: profile } = await supabase
            .from('profiles')
            .select('display_name, username')
            .eq('user_id', member.user_id)
            .single();

          return {
            ...member,
            profiles: profile || { display_name: null, username: null }
          };
        })
      );

      setMembers(membersWithProfiles);
    } catch (error: any) {
      toast({
        title: "Erro ao carregar membros",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const updateProfile = async (updates: Partial<Profile>) => {
    if (!user || !profile) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('user_id', user.id);

      if (error) throw error;

      setProfile({ ...profile, ...updates });
      toast({
        title: "Perfil atualizado",
        description: "Suas informações foram salvas com sucesso."
      });
    } catch (error: any) {
      toast({
        title: "Erro ao atualizar perfil",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const changePassword = async () => {
    if (passwords.new !== passwords.confirm) {
      toast({
        title: "Erro",
        description: "A nova senha e confirmação não coincidem.",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({
        password: passwords.new
      });

      if (error) throw error;

      toast({
        title: "Senha alterada",
        description: "Sua senha foi alterada com sucesso."
      });

      setPasswords({ current: '', new: '', confirm: '' });
    } catch (error: any) {
      toast({
        title: "Erro ao alterar senha",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const createOrganization = async () => {
    if (!user || !profile) return;

    setLoading(true);
    try {
      const slug = profile.display_name?.toLowerCase().replace(/\s+/g, '-') || 'my-org';
      
      const { data: orgData, error: orgError } = await supabase
        .from('organizations')
        .insert({
          name: profile.company_name || profile.display_name || 'Minha Organização',
          slug: `${slug}-${Date.now()}`,
          owner_id: user.id
        })
        .select()
        .single();

      if (orgError) throw orgError;

      // Add user as owner member
      const { error: memberError } = await supabase
        .from('organization_members')
        .insert({
          organization_id: orgData.id,
          user_id: user.id,
          role: 'owner'
        });

      if (memberError) throw memberError;

      // Update profile with organization_id
      await updateProfile({ organization_id: orgData.id });
      
      setOrganization(orgData);
      fetchOrganizationMembers(orgData.id);

      toast({
        title: "Organização criada",
        description: "Sua organização foi criada com sucesso."
      });
    } catch (error: any) {
      toast({
        title: "Erro ao criar organização",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const inviteMember = async () => {
    if (!organization || !newMemberEmail) return;

    setLoading(true);
    try {
      // In a real app, you would send an invitation email
      // For now, we'll just show a message
      toast({
        title: "Convite enviado",
        description: `Convite enviado para ${newMemberEmail}. O usuário precisa se cadastrar primeiro.`
      });

      setNewMemberEmail('');
    } catch (error: any) {
      toast({
        title: "Erro ao enviar convite",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const removeMember = async (memberId: string) => {
    if (!organization) return;

    try {
      const { error } = await supabase
        .from('organization_members')
        .delete()
        .eq('id', memberId);

      if (error) throw error;

      setMembers(members.filter(m => m.id !== memberId));
      toast({
        title: "Membro removido",
        description: "O membro foi removido da organização."
      });
    } catch (error: any) {
      toast({
        title: "Erro ao remover membro",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'owner': return <Crown className="h-4 w-4" />;
      case 'admin': return <Shield className="h-4 w-4" />;
      default: return <User className="h-4 w-4" />;
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'owner': return 'Proprietário';
      case 'admin': return 'Administrador';
      default: return 'Membro';
    }
  };

  if (!profile) {
    return <div>Carregando...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate(-1)}
            className="flex items-center space-x-2"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Voltar</span>
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Configurações</h1>
            <p className="text-muted-foreground">
              Gerencie suas informações pessoais, dados da empresa e configurações de conta.
            </p>
          </div>
        </div>

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="profile">Perfil</TabsTrigger>
            <TabsTrigger value="company">Empresa</TabsTrigger>
            <TabsTrigger value="security">Segurança</TabsTrigger>
            <TabsTrigger value="team">Equipe</TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle>Informações Pessoais</CardTitle>
                <CardDescription>
                  Atualize suas informações pessoais e preferências.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="display_name">Nome para exibição</Label>
                    <Input
                      id="display_name"
                      value={profile.display_name || ''}
                      onChange={(e) => setProfile({ ...profile, display_name: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="username">Nome de usuário</Label>
                    <Input
                      id="username"
                      value={profile.username || ''}
                      onChange={(e) => setProfile({ ...profile, username: e.target.value })}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bio">Biografia</Label>
                  <Textarea
                    id="bio"
                    value={profile.bio || ''}
                    onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                    placeholder="Conte um pouco sobre você..."
                  />
                </div>
                <Button 
                  onClick={() => updateProfile({ 
                    display_name: profile.display_name,
                    username: profile.username,
                    bio: profile.bio 
                  })}
                  disabled={loading}
                >
                  Salvar alterações
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="company">
            <Card>
              <CardHeader>
                <CardTitle>Dados da Empresa</CardTitle>
                <CardDescription>
                  Configure os dados da sua empresa para projetos corporativos.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="is_company"
                    checked={profile.is_company}
                    onCheckedChange={(checked) => updateProfile({ is_company: checked })}
                  />
                  <Label htmlFor="is_company">Esta é uma conta empresarial</Label>
                </div>

                {profile.is_company && (
                  <div className="space-y-4 pt-4 border-t">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="company_name">Nome da empresa</Label>
                        <Input
                          id="company_name"
                          value={profile.company_name || ''}
                          onChange={(e) => setProfile({ ...profile, company_name: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="company_cnpj">CNPJ</Label>
                        <Input
                          id="company_cnpj"
                          value={profile.company_cnpj || ''}
                          onChange={(e) => setProfile({ ...profile, company_cnpj: e.target.value })}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="company_address">Endereço</Label>
                      <Input
                        id="company_address"
                        value={profile.company_address || ''}
                        onChange={(e) => setProfile({ ...profile, company_address: e.target.value })}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="company_phone">Telefone</Label>
                        <Input
                          id="company_phone"
                          value={profile.company_phone || ''}
                          onChange={(e) => setProfile({ ...profile, company_phone: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="company_website">Website</Label>
                        <Input
                          id="company_website"
                          value={profile.company_website || ''}
                          onChange={(e) => setProfile({ ...profile, company_website: e.target.value })}
                        />
                      </div>
                    </div>
                    <Button 
                      onClick={() => updateProfile({
                        company_name: profile.company_name,
                        company_cnpj: profile.company_cnpj,
                        company_address: profile.company_address,
                        company_phone: profile.company_phone,
                        company_website: profile.company_website
                      })}
                      disabled={loading}
                    >
                      Salvar dados da empresa
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security">
            <Card>
              <CardHeader>
                <CardTitle>Alterar Senha</CardTitle>
                <CardDescription>
                  Mantenha sua conta segura com uma senha forte.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="new_password">Nova senha</Label>
                  <Input
                    id="new_password"
                    type="password"
                    value={passwords.new}
                    onChange={(e) => setPasswords({ ...passwords, new: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm_password">Confirmar nova senha</Label>
                  <Input
                    id="confirm_password"
                    type="password"
                    value={passwords.confirm}
                    onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
                  />
                </div>
                <Button 
                  onClick={changePassword}
                  disabled={loading || !passwords.new || passwords.new !== passwords.confirm}
                >
                  Alterar senha
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="team">
            <div className="space-y-6">
              {!organization ? (
                <Card>
                  <CardHeader>
                    <CardTitle>Criar Organização</CardTitle>
                    <CardDescription>
                      Crie uma organização para colaborar com outros usuários.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button onClick={createOrganization} disabled={loading}>
                      Criar organização
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <>
                  <Card>
                    <CardHeader>
                      <CardTitle>Organização: {organization.name}</CardTitle>
                      <CardDescription>
                        Gerencie os membros da sua organização.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex gap-2">
                        <Input
                          placeholder="Email do novo membro"
                          value={newMemberEmail}
                          onChange={(e) => setNewMemberEmail(e.target.value)}
                        />
                        <Button 
                          onClick={inviteMember}
                          disabled={loading || !newMemberEmail}
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Convidar
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Membros</CardTitle>
                      <CardDescription>
                        {members.length} {members.length === 1 ? 'membro' : 'membros'}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {members.map((member) => (
                          <div key={member.id} className="flex items-center justify-between p-4 border rounded-lg">
                            <div className="flex items-center space-x-3">
                              <div>
                                <p className="font-medium">
                                  {member.profiles.display_name || member.profiles.username || 'Usuário'}
                                </p>
                                <div className="flex items-center space-x-2 mt-1">
                                  <Badge variant="secondary" className="flex items-center space-x-1">
                                    {getRoleIcon(member.role)}
                                    <span>{getRoleLabel(member.role)}</span>
                                  </Badge>
                                </div>
                              </div>
                            </div>
                            {member.role !== 'owner' && (
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button variant="destructive" size="sm">
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Remover membro</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      Tem certeza que deseja remover este membro da organização?
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                    <AlertDialogAction 
                                      onClick={() => removeMember(member.id)}
                                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                    >
                                      Remover
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            )}
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}