
import React from 'react';
import { Eye, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface TableActionsProps {
  onView: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

const TableActions: React.FC<TableActionsProps> = ({ onView, onEdit, onDelete }) => {
  return (
    <div className="flex items-center gap-2">
      <Button
        size="sm"
        variant="outline"
        className="h-8 w-8 p-0 border-slate-600 hover:bg-slate-700"
        onClick={onView}
      >
        <Eye className="w-4 h-4 text-slate-300" />
      </Button>
      <Button
        size="sm"
        variant="outline"
        className="h-8 w-8 p-0 border-slate-600 hover:bg-slate-700"
        onClick={onEdit}
      >
        <Edit className="w-4 h-4 text-slate-300" />
      </Button>
      <Button
        size="sm"
        variant="outline"
        className="h-8 w-8 p-0 border-slate-600 hover:bg-slate-700"
        onClick={onDelete}
      >
        <Trash2 className="w-4 h-4 text-red-400" />
      </Button>
    </div>
  );
};

export default TableActions;
