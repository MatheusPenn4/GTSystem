import api from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';

export interface DashboardData {
  // Dados gerais
  empresasAtivas: number;
  veiculosCadastrados: number;
  motoristasAtivos: number;
  vagasOcupadas: { total: number; capacidade: number; percentual: number };
  
  // Atividades recentes
  atividadesRecentes: Array<{
    id: string;
    tipo: 'veiculo' | 'motorista' | 'empresa' | 'alerta';
    descricao: string;
    data: string;
    icone?: string;
  }>;
}

const DashboardService = {
  // Buscar dados do dashboard baseado no tipo de usuário
  getDashboardData: async (): Promise<DashboardData> => {
    console.log('Tentando buscar dados reais do dashboard...');
    // Obter o tipo de usuário do localStorage
    const userRole = localStorage.getItem('ajh_user_type');
    const userToken = localStorage.getItem('ajh_token');
    
    console.log(`Usuário: tipo=${userRole}, token=${userToken ? 'presente' : 'ausente'}`);
    
    // Definir endpoint correto por role
    let endpoint = '/dashboard/test';
    if (userRole === 'estacionamento') endpoint = '/dashboard/estacionamento';
    else if (userRole === 'transportadora') endpoint = '/dashboard/transportadora';
    else if (userRole === 'admin') endpoint = '/dashboard/admin';
    
    console.log(`Endpoint do dashboard: ${endpoint}`);
    
    try {
      const response = await api.get(endpoint + '?groupBy=month&startDate=&endDate=', { 
        timeout: 3000
      });
      console.log('Dados brutos da API:', response.data);
      const data = response.data;
      // Adaptar a resposta para o formato esperado pelo frontend
      let transformedData: DashboardData;
      if (endpoint === '/dashboard/estacionamento') {
        // Montar dados específicos para estacionamento a partir de data.overview
        transformedData = {
          empresasAtivas: 1, // Não faz sentido para estacionamento
          veiculosCadastrados: 0,
          motoristasAtivos: 0,
          vagasOcupadas: {
            total: data.overview?.activeReservations || 0,
            capacidade: data.overview?.totalSpaces || 0,
            percentual: data.overview?.occupancyRate || 0
          },
          atividadesRecentes: []
        };
      } else {
        // Padrão para outros roles
        transformedData = {
          empresasAtivas: data.overview?.empresasAtivas || 0,
          veiculosCadastrados: data.overview?.veiculosCadastrados || 0,
          motoristasAtivos: data.overview?.motoristasAtivos || 0,
          vagasOcupadas: data.overview?.vagasOcupadas || { total: 0, capacidade: 0, percentual: 0 },
          atividadesRecentes: data.atividadesRecentes || []
        };
      }
      console.log('Dados transformados para o frontend:', transformedData);
      return transformedData;
    } catch (error) {
      console.error('Erro ao buscar dados do dashboard:', error);
      throw error;
    }
  }
};

export default DashboardService; 