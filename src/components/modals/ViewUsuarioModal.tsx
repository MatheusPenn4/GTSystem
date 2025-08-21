import React from 'react';
import { X, User as UserIcon, Mail, Building2, Calendar, Shield, CheckCircle, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { User } from '@/services/users';

interface ViewUsuarioModalProps {
  isOpen: boolean;
  onClose: () => void;
  usuario: User;
}

const ViewUsuarioModal: React.FC<ViewUsuarioModalProps> = ({
  isOpen,
  onClose,
  usuario
}) => {
  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'admin':
        return <Badge variant="destructive">Administrador</Badge>;
      case 'transportadora':
        return <Badge variant="default">Transportadora</Badge>;
      case 'estacionamento':
        return <Badge variant="secondary">Estacionamento</Badge>;
      default:
        return <Badge variant="outline">Desconhecido</Badge>;
    }
  };

  const getStatusBadge = (isActive: boolean, emailVerified?: boolean) => {
    if (!isActive) {
      return <Badge variant="destructive">Inativo</Badge>;
    }
    if (emailVerified !== true) {
      return <Badge variant="outline">Email não verificado</Badge>;
    }
    return <Badge variant="default" className="bg-green-600">Ativo</Badge>;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="ajh-modal max-w-md">
        <DialogHeader>
          <DialogTitle className="text-white flex items-center gap-2">
            <UserIcon className="w-5 h-5" />
            Detalhes do Usuário
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Informações Básicas */}
          <div className="space-y-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <UserIcon className="w-4 h-4 text-slate-400" />
                <span className="text-slate-400 text-sm">Nome</span>
              </div>
              <p className="text-white font-medium">{usuario.name}</p>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-2">
                <Mail className="w-4 h-4 text-slate-400" />
                <span className="text-slate-400 text-sm">E-mail</span>
              </div>
              <p className="text-white">{usuario.email}</p>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-2">
                <Shield className="w-4 h-4 text-slate-400" />
                <span className="text-slate-400 text-sm">Tipo de usuário</span>
              </div>
              {getRoleBadge(usuario.role)}
            </div>

            {usuario.companyName && (
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Building2 className="w-4 h-4 text-slate-400" />
                  <span className="text-slate-400 text-sm">Empresa</span>
                </div>
                <p className="text-white">{usuario.companyName}</p>
              </div>
            )}
          </div>

          {/* Status */}
          <div className="border-t border-slate-700 pt-4">
            <h4 className="text-white font-medium mb-3">Status</h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-slate-400 text-sm">Status da conta</span>
                {getStatusBadge(usuario.isActive, usuario.emailVerified)}
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-400 text-sm">E-mail verificado</span>
                {usuario.emailVerified === true ? (
                  <div className="flex items-center gap-1 text-green-400">
                    <CheckCircle className="w-4 h-4" />
                    <span className="text-sm">Verificado</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1 text-red-400">
                    <XCircle className="w-4 h-4" />
                    <span className="text-sm">Não verificado</span>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-400 text-sm">Conta ativa</span>
                {usuario.isActive ? (
                  <div className="flex items-center gap-1 text-green-400">
                    <CheckCircle className="w-4 h-4" />
                    <span className="text-sm">Ativa</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1 text-red-400">
                    <XCircle className="w-4 h-4" />
                    <span className="text-sm">Inativa</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Datas */}
          <div className="border-t border-slate-700 pt-4">
            <h4 className="text-white font-medium mb-3">Informações Temporais</h4>
            <div className="space-y-3">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Calendar className="w-4 h-4 text-slate-400" />
                  <span className="text-slate-400 text-sm">Cadastrado em</span>
                </div>
                <p className="text-white text-sm">{formatDate(usuario.createdAt)}</p>
              </div>

              {usuario.lastLogin && (
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Calendar className="w-4 h-4 text-slate-400" />
                    <span className="text-slate-400 text-sm">Último login</span>
                  </div>
                  <p className="text-white text-sm">{formatDate(usuario.lastLogin)}</p>
                </div>
              )}
            </div>
          </div>

          {/* ID do Usuário */}
          <div className="border-t border-slate-700 pt-4">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-slate-400 text-sm">ID do usuário</span>
            </div>
            <p className="text-slate-500 text-xs font-mono">{usuario.id}</p>
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <Button
            onClick={onClose}
            className="ajh-btn-secondary"
          >
            Fechar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ViewUsuarioModal; 