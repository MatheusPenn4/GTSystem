import api from './api';

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

  // Buscar estatísticas gerais
  getEstatisticasGerais: async (): Promise<RelatorioStats[]> => {
    try {
      console.log('Carregando estatísticas gerais do backend...');
      
      const response = await api.get('/reports/estatisticas-gerais', {
        timeout: 8000
      });
      
      console.log('Estatísticas gerais carregadas com sucesso!', response.data.length);
      return response.data;
    } catch (error: any) {
      console.error('Erro ao buscar estatísticas gerais:', error);
      
      if (error.response?.status === 404) {
        console.warn('Endpoint de estatísticas gerais não implementado ainda no backend');
        return [];
      }
      throw error;
    }
  },

  // Buscar relatório de performance
  getRelatorioPerformance: async (dataInicio?: string, dataFim?: string): Promise<any> => {
    try {
      console.log('Carregando relatório de performance do backend...', { dataInicio, dataFim });
      
      const params: any = {};
      if (dataInicio) params.dataInicio = dataInicio;
      if (dataFim) params.dataFim = dataFim;
      
      const response = await api.get('/reports/performance', {
        params,
        timeout: 8000
      });
      
      console.log('Relatório de performance carregado com sucesso!');
      return response.data;
    } catch (error: any) {
      console.error('Erro ao buscar relatório de performance:', error);
      
      if (error.response?.status === 404) {
        console.warn('Endpoint de performance não implementado ainda no backend');
        return {};
      }
      throw error;
    }
  },

  // Buscar dados de ocupação por estacionamento
  getOcupacaoPorEstacionamento: async (): Promise<any[]> => {
    try {
      console.log('Carregando ocupação por estacionamento do backend...');
      
      const response = await api.get('/reports/ocupacao-estacionamentos', {
        timeout: 8000
      });
      
      console.log('Ocupação por estacionamento carregada com sucesso!', response.data.length);
      return response.data;
    } catch (error: any) {
      console.error('Erro ao buscar ocupação por estacionamento:', error);
      
      if (error.response?.status === 404) {
        console.warn('Endpoint de ocupação por estacionamento não implementado ainda no backend');
        return [];
      }
      throw error;
    }
  },

  // Buscar relatório de veículos por empresa
  getVeiculosPorEmpresa: async (): Promise<any[]> => {
    try {
      console.log('Carregando veículos por empresa do backend...');
      
      const response = await api.get('/reports/veiculos-empresa', {
        timeout: 8000
      });
      
      console.log('Veículos por empresa carregados com sucesso!', response.data.length);
      return response.data;
    } catch (error: any) {
      console.error('Erro ao buscar veículos por empresa:', error);
      
      if (error.response?.status === 404) {
        console.warn('Endpoint de veículos por empresa não implementado ainda no backend');
        return [];
      }
      throw error;
    }
  },

  // Buscar estatísticas baseadas no role do usuário
  getEstatisticasPorRole: async (userRole?: string): Promise<RelatorioStats[]> => {
    try {
      console.log('Carregando estatísticas por role do backend...', { userRole });
      
      const params: any = {};
      if (userRole) params.role = userRole;
      
      const response = await api.get('/reports/estatisticas-role', {
        params,
        timeout: 8000
      });
      
      console.log('Estatísticas por role carregadas com sucesso!', response.data.length);
      return response.data;
    } catch (error: any) {
      console.error('Erro ao buscar estatísticas por role:', error);
      
      if (error.response?.status === 404) {
        console.warn('Endpoint de estatísticas por role não implementado ainda no backend');
        return getDefaultStatsForRole(userRole || 'admin');
      }
      throw error;
    }
  }
};

// Função para retornar estatísticas padrão baseadas no role
const getDefaultStatsForRole = (role: string): RelatorioStats[] => {
  const defaultStats = {
    admin: [
      {
        titulo: 'Total de Empresas',
        valor: '15',
        mudanca: '+12%',
        icon: 'Building2',
        cor: 'text-blue-600'
      },
      {
        titulo: 'Veículos Ativos',
        valor: '127',
        mudanca: '+8%',
        icon: 'Truck',
        cor: 'text-green-600'
      },
      {
        titulo: 'Motoristas',
        valor: '89',
        mudanca: '+5%',
        icon: 'User',
        cor: 'text-purple-600'
      },
      {
        titulo: 'Reservas Ativas',
        valor: '342',
        mudanca: '+15%',
        icon: 'Calendar',
        cor: 'text-orange-600'
      }
    ],
    transportadora: [
      {
        titulo: 'Veículos Próprios',
        valor: '12',
        mudanca: '+2',
        icon: 'Truck',
        cor: 'text-blue-600'
      },
      {
        titulo: 'Motoristas',
        valor: '8',
        mudanca: '+1',
        icon: 'User',
        cor: 'text-green-600'
      },
      {
        titulo: 'Reservas Ativas',
        valor: '45',
        mudanca: '+12%',
        icon: 'Calendar',
        cor: 'text-purple-600'
      },
      {
        titulo: 'Faturamento Mensal',
        valor: 'R$ 12.450',
        mudanca: '+8%',
        icon: 'DollarSign',
        cor: 'text-orange-600'
      }
    ],
    estacionamento: [
      {
        titulo: 'Vagas Disponíveis',
        valor: '45',
        mudanca: '-5',
        icon: 'ParkingSquare',
        cor: 'text-blue-600'
      },
      {
        titulo: 'Ocupação Atual',
        valor: '78%',
        mudanca: '+3%',
        icon: 'BarChart3',
        cor: 'text-green-600'
      },
      {
        titulo: 'Reservas Recebidas',
        valor: '156',
        mudanca: '+18%',
        icon: 'Calendar',
        cor: 'text-purple-600'
      },
      {
        titulo: 'Faturamento Mensal',
        valor: 'R$ 8.920',
        mudanca: '+12%',
        icon: 'DollarSign',
        cor: 'text-orange-600'
      }
    ]
  };

  return defaultStats[role as keyof typeof defaultStats] || defaultStats.admin;
};

export default ReportsService; 