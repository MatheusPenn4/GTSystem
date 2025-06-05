
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface DateRangeFilterProps {
  startDate: string;
  endDate: string;
  onStartDateChange: (date: string) => void;
  onEndDateChange: (date: string) => void;
  isVisible: boolean;
}

const DateRangeFilter: React.FC<DateRangeFilterProps> = ({
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
  isVisible
}) => {
  if (!isVisible) return null;

  return (
    <Card className="ajh-card">
      <CardHeader>
        <CardTitle className="text-white">Filtros Personalizados</CardTitle>
        <CardDescription className="text-slate-400">
          Selecione o período para os relatórios
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="data-inicio" className="text-slate-300">Data Início</Label>
            <Input
              id="data-inicio"
              type="date"
              value={startDate}
              onChange={(e) => onStartDateChange(e.target.value)}
              className="ajh-input"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="data-fim" className="text-slate-300">Data Fim</Label>
            <Input
              id="data-fim"
              type="date"
              value={endDate}
              onChange={(e) => onEndDateChange(e.target.value)}
              className="ajh-input"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DateRangeFilter;
