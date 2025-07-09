
import React from 'react';
import { X, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface DeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description: string;
  onConfirm: () => void;
}

const DeleteModal: React.FC<DeleteModalProps> = ({ 
  isOpen, 
  onClose, 
  title, 
  description, 
  onConfirm 
}) => {
  const { toast } = useToast();

  if (!isOpen) return null;

  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-ajh-dark border border-slate-700 rounded-lg w-full max-w-md">
        <div className="p-6 border-b border-slate-700">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-white">{title}</h3>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-4">
          <div className="flex items-center justify-center w-12 h-12 bg-red-500/10 rounded-lg mx-auto">
            <Trash2 className="w-6 h-6 text-red-400" />
          </div>
          <p className="text-slate-300 text-center">{description}</p>
          <p className="text-sm text-slate-400 text-center">
            Esta ação não pode ser desfeita.
          </p>
        </div>

        <div className="p-6 border-t border-slate-700 flex gap-3">
          <Button
            type="button"
            onClick={onClose}
            className="flex-1 ajh-button-secondary"
          >
            Cancelar
          </Button>
          <Button
            onClick={handleConfirm}
            className="flex-1 bg-red-600 hover:bg-red-700 text-white"
          >
            Confirmar Exclusão
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DeleteModal;
