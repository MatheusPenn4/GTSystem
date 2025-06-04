
import React from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  data: Record<string, any>;
}

const ViewModal: React.FC<ViewModalProps> = ({ isOpen, onClose, title, data }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-ajh-dark border border-slate-700 rounded-lg w-full max-w-2xl max-h-[80vh] overflow-y-auto">
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
          {Object.entries(data).map(([key, value]) => (
            <div key={key} className="flex flex-col sm:flex-row sm:items-center gap-2">
              <span className="text-slate-400 font-medium capitalize min-w-32">
                {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}:
              </span>
              <span className="text-white">{value || 'N/A'}</span>
            </div>
          ))}
        </div>

        <div className="p-6 border-t border-slate-700">
          <Button onClick={onClose} className="ajh-button-secondary w-full">
            Fechar
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ViewModal;
