import api from '@/lib/api';

export interface FaturamentoMensal {
  mes: string;
  valor: number;
}

export interface OcupacaoDados {
  dia: string;
  ocupacao: number;
}

export interface DistribuicaoVeiculos {
  tipo: string;
  valor: number;
  cor: string;
}

export interface RelatorioStats {
  titulo: string;
  valor: string;
  mudanca: string;
  icon: string;
  cor: string;
}

const ReportsService = {
  // Buscar faturamento mensal
  getFaturamentoMensal: async (dataInicio?: string, dataFim?: string): Promise<FaturamentoMensal[]> => {
    try {
      console.log('Carregando faturamento mensal do backend...', { dataInicio, dataFim });
      
      const params: any = {};
      if (dataInicio) params.dataInicio = dataInicio;
      if (dataFim) params.dataFim = dataFim;
      
      const response = await api.get('/reports/faturamento-mensal', {
        params,
        timeout: 8000
      });
      
      console.log('Faturamento mensal carregado com sucesso!', response.data.length);
      return response.data;
    } catch (error: any) {
      console.error('Erro ao buscar faturamento mensal:', error);
      
      if (error.response?.status === 404) {
        console.warn('Endpoint de faturamento mensal não implementado ainda no backend');
        return [];
      }
      throw error;
    }
  },

  // Buscar dados de ocupação semanal
  getOcupacaoSemanal: async (): Promise<OcupacaoDados[]> => {
    try {
      console.log('Carregando dados de ocupação semanal do backend...');
      
      const response = await api.get('/reports/ocupacao-semanal', {
        timeout: 8000
      });
      
      console.log('Dados de ocupação semanal carregados com sucesso!', response.data.length);
      return response.data;
    } catch (error: any) {
      console.error('Erro ao buscar ocupação semanal:', error);
      
      if (error.response?.status === 404) {
        console.warn('Endpoint de ocupação semanal não implementado ainda no backend');
        return [];
      }
      throw error;
    }
  },

  // Buscar distribuição de veículos
  getDistribuicaoVeiculos: async (): Promise<DistribuicaoVeiculos[]> => {
    try {
      console.log('Carregando distribuição de veículos do backend...');
      
      const response = await api.get('/reports/distribuicao-veiculos', {
        timeout: 8000
      });
      
      console.log('Distribuição de veículos carregada com sucesso!', response.data.length);
      
      // Adicionar cores padrão se não vieram do backend
      const cores = ['#8B5CF6', '#06B6D4', '#10B981', '#F59E0B'];
      return response.data.map((item: any, index: number) => ({
        ...item,
        cor: item.cor || cores[index % cores.length]
      }));
    } catch (error: any) {
      console.error('Erro ao buscar distribuição de veículos:', error);
      
      if (error.response?.status === 404) {
        console.warn('Endpoint de distribuição de veículos não implementado ainda no backend');
        return [];
      }
      throw error;
    }
  },

  // Buscar estatísticas por role do usuário
  getStatsForRole: async (role: string): Promise<RelatorioStats[]> => {
    try {
      console.log('Carregando estatísticas por role do backend...', { role });
      
      const response = await api.get('/reports/stats-by-role', {
        params: { role },
        timeout: 8000
      });
      
      console.log('Estatísticas por role carregadas com sucesso!', response.data.length);
      return response.data;
    } catch (error: any) {
      console.error('Erro ao buscar estatísticas por role:', error);
      
      if (error.response?.status === 404) {
        console.warn('Endpoint de estatísticas por role não implementado ainda no backend');
        
        // Retornar dados padrão baseados no role
        return getDefaultStatsForRole(role);
      }
      throw error;
    }
  },

  // Exportar relatório
  exportRelatorio: async (formato: 'pdf' | 'excel', tipo: string, dataInicio?: string, dataFim?: string): Promise<Blob> => {
    try {
      console.log('Exportando relatório...', { formato, tipo, dataInicio, dataFim });
      
      const params: any = { formato, tipo };
      if (dataInicio) params.dataInicio = dataInicio;
      if (dataFim) params.dataFim = dataFim;
      
      const response = await api.get('/reports/export', {
        params,
        responseType: 'blob',
        timeout: 30000 // Relatórios podem demorar mais
      });
      
      console.log('Relatório exportado com sucesso!');
      return response.data;
    } catch (error: any) {
      console.error('Erro ao exportar relatório:', error);
      
      if (error.response?.status === 404) {
        throw new Error('Funcionalidade de exportação ainda não implementada no backend');
      }
      throw error;
    }
  }
};

// Função para retornar estatísticas padrão por role quando o endpoint não estiver implementado
const getDefaultStatsForRole = (role: string): RelatorioStats[] => {
  if (role === 'transportadora') {
    return [
      { titulo: 'Veículos Ativos', valor: '0', mudanca: '+0%', icon: 'Truck', cor: 'text-blue-400' },
      { titulo: 'Gasto Mensal', valor: 'R$ 0', mudanca: '+0%', icon: 'BarChart3', cor: 'text-green-400' },
      { titulo: 'Reservas Ativas', valor: '0', mudanca: '+0', icon: 'Calendar', cor: 'text-purple-400' },
      { titulo: 'Economia', valor: 'R$ 0', mudanca: '+0%', icon: 'TrendingUp', cor: 'text-yellow-400' }
    ];
  }
  
  if (role === 'estacionamento') {
    return [
      { titulo: 'Receita Mensal', valor: 'R$ 0', mudanca: '+0%', icon: 'BarChart3', cor: 'text-green-400' },
      { titulo: 'Taxa Ocupação', valor: '0%', mudanca: '+0%', icon: 'Building2', cor: 'text-blue-400' },
      { titulo: 'Reservas Hoje', valor: '0', mudanca: '+0', icon: 'Calendar', cor: 'text-purple-400' },
      { titulo: 'Vagas Disponíveis', valor: '0', mudanca: '+0', icon: 'Truck', cor: 'text-yellow-400' }
    ];
  }

  return [
    { titulo: 'Receita Total', valor: 'R$ 0', mudanca: '+0%', icon: 'BarChart3', cor: 'text-green-400' },
    { titulo: 'Empresas Ativas', valor: '0', mudanca: '+0', icon: 'Building2', cor: 'text-blue-400' },
    { titulo: 'Veículos Total', valor: '0', mudanca: '+0', icon: 'Truck', cor: 'text-purple-400' },
    { titulo: 'Motoristas', valor: '0', mudanca: '+0', icon: 'Users', cor: 'text-yellow-400' }
  ];
};

export default ReportsService; 