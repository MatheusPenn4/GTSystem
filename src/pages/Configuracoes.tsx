
import React, { useState } from 'react';
import { Save, User, Bell, Shield, Database, Globe } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';

const Configuracoes: React.FC = () => {
  const { user, updateUser } = useAuth();
  const [activeTab, setActiveTab] = useState('perfil');
  const [formData, setFormData] = useState({
    nome: user?.name || '',
    email: user?.email || '',
    telefone: '',
    senhaAtual: '',
    novaSenha: '',
    confirmarSenha: ''
  });

  const tabs = [
    { id: 'perfil', label: 'Perfil', icon: User },
    { id: 'notificacoes', label: 'Notificações', icon: Bell },
    { id: 'seguranca', label: 'Segurança', icon: Shield },
    { id: 'sistema', label: 'Sistema', icon: Database },
    { id: 'integracao', label: 'Integração', icon: Globe }
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSavePerfil = () => {
    updateUser({
      name: formData.nome,
      email: formData.email
    });
    
    toast({
      title: "Perfil atualizado",
      description: "Suas informações foram salvas com sucesso.",
    });
  };

  const handleSaveSenha = () => {
    if (formData.novaSenha !== formData.confirmarSenha) {
      toast({
        title: "Erro",
        description: "A confirmação de senha não confere.",
        variant: "destructive"
      });
      return;
    }

    // Simular atualização de senha
    toast({
      title: "Senha atualizada",
      description: "Sua senha foi alterada com sucesso.",
    });

    setFormData(prev => ({
      ...prev,
      senhaAtual: '',
      novaSenha: '',
      confirmarSenha: ''
    }));
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Configurações</h1>
        <p className="text-slate-400">Gerencie suas preferências e configurações do sistema</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar de Navegação */}
        <Card className="ajh-card lg:col-span-1">
          <CardContent className="p-0">
            <nav className="space-y-1">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`
                      w-full flex items-center space-x-3 px-4 py-3 text-left transition-colors
                      ${activeTab === tab.id 
                        ? 'bg-ajh-primary/10 text-ajh-primary border-r-2 border-ajh-primary' 
                        : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
                      }
                    `}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </CardContent>
        </Card>

        {/* Conteúdo Principal */}
        <div className="lg:col-span-3 space-y-6">
          {/* Perfil */}
          {activeTab === 'perfil' && (
            <Card className="ajh-card">
              <CardHeader>
                <CardTitle className="text-white">Informações do Perfil</CardTitle>
                <CardDescription className="text-slate-400">
                  Atualize suas informações pessoais
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center space-x-6">
                  <div className="w-20 h-20 bg-ajh-primary rounded-full flex items-center justify-center">
                    <span className="text-white text-2xl font-bold">
                      {user?.name?.split(' ').map(n => n[0]).join('') || 'U'}
                    </span>
                  </div>
                  <div>
                    <Button className="ajh-button-secondary">
                      Alterar Foto
                    </Button>
                    <p className="text-slate-400 text-sm mt-2">
                      JPG, PNG ou GIF (máx. 5MB)
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="nome" className="text-white">Nome Completo</Label>
                    <Input
                      id="nome"
                      value={formData.nome}
                      onChange={(e) => handleInputChange('nome', e.target.value)}
                      className="ajh-input"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-white">E-mail</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className="ajh-input"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="telefone" className="text-white">Telefone</Label>
                    <Input
                      id="telefone"
                      value={formData.telefone}
                      onChange={(e) => handleInputChange('telefone', e.target.value)}
                      className="ajh-input"
                      placeholder="(11) 99999-9999"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cargo" className="text-white">Cargo</Label>
                    <Input
                      id="cargo"
                      value={user?.role || ''}
                      className="ajh-input"
                      disabled
                    />
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button onClick={handleSavePerfil} className="ajh-button-primary">
                    <Save className="w-4 h-4 mr-2" />
                    Salvar Alterações
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Segurança */}
          {activeTab === 'seguranca' && (
            <Card className="ajh-card">
              <CardHeader>
                <CardTitle className="text-white">Segurança</CardTitle>
                <CardDescription className="text-slate-400">
                  Gerencie sua senha e configurações de segurança
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="senhaAtual" className="text-white">Senha Atual</Label>
                    <Input
                      id="senhaAtual"
                      type="password"
                      value={formData.senhaAtual}
                      onChange={(e) => handleInputChange('senhaAtual', e.target.value)}
                      className="ajh-input"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="novaSenha" className="text-white">Nova Senha</Label>
                    <Input
                      id="novaSenha"
                      type="password"
                      value={formData.novaSenha}
                      onChange={(e) => handleInputChange('novaSenha', e.target.value)}
                      className="ajh-input"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmarSenha" className="text-white">Confirmar Nova Senha</Label>
                    <Input
                      id="confirmarSenha"
                      type="password"
                      value={formData.confirmarSenha}
                      onChange={(e) => handleInputChange('confirmarSenha', e.target.value)}
                      className="ajh-input"
                    />
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button onClick={handleSaveSenha} className="ajh-button-primary">
                    <Save className="w-4 h-4 mr-2" />
                    Alterar Senha
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Notificações */}
          {activeTab === 'notificacoes' && (
            <Card className="ajh-card">
              <CardHeader>
                <CardTitle className="text-white">Notificações</CardTitle>
                <CardDescription className="text-slate-400">
                  Configure como deseja receber notificações
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { id: 'email', label: 'Notificações por E-mail', desc: 'Receber atualizações importantes por e-mail' },
                    { id: 'push', label: 'Notificações Push', desc: 'Notificações em tempo real no navegador' },
                    { id: 'cnh', label: 'Alerta CNH Vencendo', desc: 'Avisar quando CNH de motoristas estiver próxima do vencimento' },
                    { id: 'ocupacao', label: 'Relatório de Ocupação', desc: 'Relatório diário de ocupação do estacionamento' },
                    { id: 'manutencao', label: 'Alertas de Manutenção', desc: 'Notificar sobre veículos em manutenção' }
                  ].map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-4 bg-slate-800/30 rounded-lg">
                      <div>
                        <h4 className="text-white font-medium">{item.label}</h4>
                        <p className="text-slate-400 text-sm">{item.desc}</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked />
                        <div className="w-11 h-6 bg-slate-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-ajh-primary"></div>
                      </label>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Sistema */}
          {activeTab === 'sistema' && (
            <Card className="ajh-card">
              <CardHeader>
                <CardTitle className="text-white">Configurações do Sistema</CardTitle>
                <CardDescription className="text-slate-400">
                  Configurações gerais e backup do sistema
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="p-4 bg-slate-800/30 rounded-lg">
                    <h4 className="text-white font-medium mb-2">Backup Automático</h4>
                    <p className="text-slate-400 text-sm mb-4">Última execução: Hoje às 03:00</p>
                    <Button className="ajh-button-secondary">
                      Executar Backup Manual
                    </Button>
                  </div>

                  <div className="p-4 bg-slate-800/30 rounded-lg">
                    <h4 className="text-white font-medium mb-2">Manutenção do Sistema</h4>
                    <p className="text-slate-400 text-sm mb-4">Limpeza de logs e otimização do banco de dados</p>
                    <Button className="ajh-button-secondary">
                      Executar Manutenção
                    </Button>
                  </div>

                  <div className="p-4 bg-slate-800/30 rounded-lg">
                    <h4 className="text-white font-medium mb-2">Exportar Dados</h4>
                    <p className="text-slate-400 text-sm mb-4">Baixar todos os dados do sistema</p>
                    <Button className="ajh-button-secondary">
                      Gerar Exportação
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Integração */}
          {activeTab === 'integracao' && (
            <Card className="ajh-card">
              <CardHeader>
                <CardTitle className="text-white">Integrações</CardTitle>
                <CardDescription className="text-slate-400">
                  Configure integrações com sistemas externos
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { nome: 'API Externa', status: 'Conectado', desc: 'Integração com sistema de gestão' },
                    { nome: 'Webhook Notificações', status: 'Desconectado', desc: 'Envio automático de notificações' },
                    { nome: 'Sincronização ERP', status: 'Conectado', desc: 'Sincronização com sistema ERP' },
                    { nome: 'Backup Cloud', status: 'Conectado', desc: 'Backup automático na nuvem' }
                  ].map((integracao, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-slate-800/30 rounded-lg">
                      <div>
                        <h4 className="text-white font-medium">{integracao.nome}</h4>
                        <p className="text-slate-400 text-sm">{integracao.desc}</p>
                      </div>
                      <div className="flex items-center space-x-3">
                        <span className={`text-sm ${
                          integracao.status === 'Conectado' ? 'text-green-400' : 'text-red-400'
                        }`}>
                          {integracao.status}
                        </span>
                        <Button size="sm" className="ajh-button-secondary">
                          Configurar
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default Configuracoes;
