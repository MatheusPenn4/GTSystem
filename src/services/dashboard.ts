import api from './api';

export interface DashboardData {
  totalEstacionamentos: number;
  totalVeiculos: number;
  totalMotoristas: number;
  totalReservas: number;
  receitaMensal: number;
  ocupacaoMedia: number;
  reservasAtivas: number;
  vagasDisponiveis: number;
}

const DashboardService = {
  // Buscar dados do dashboard
  getDashboardData: async (): Promise<DashboardData> => {
    try {
      console.log('Tentando buscar dados do dashboard...');
      
      const response = await api.get('/dashboard', { timeout: 8000 });
      console.log('Dados do dashboard obtidos com sucesso!');
      
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar dados do dashboard:', error);
      throw error;
    }
  },

  // Buscar estatísticas por período
  getStatsByPeriod: async (periodo: string): Promise<any> => {
    try {
      console.log(`Tentando buscar estatísticas do período: ${periodo}`);
      
      const response = await api.get(`/dashboard/stats/${periodo}`, { timeout: 8000 });
      console.log('Estatísticas obtidas com sucesso!');
      
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar estatísticas:', error);
      throw error;
    }
  },

  // Buscar dados de ocupação em tempo real
  getOcupacaoTempoReal: async (): Promise<any> => {
    try {
      console.log('Tentando buscar dados de ocupação em tempo real...');
      
      const response = await api.get('/dashboard/ocupacao-tempo-real', { timeout: 8000 });
      console.log('Dados de ocupação obtidos com sucesso!');
      
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar dados de ocupação:', error);
      throw error;
    }
  }
};

export default DashboardService; 