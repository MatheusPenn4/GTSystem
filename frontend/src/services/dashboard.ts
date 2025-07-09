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
    
    // Usar a rota de teste sem autenticação
    const endpoint = '/dashboard/test';
    console.log(`Endpoint do dashboard: ${endpoint}`);
    
    try {
      const response = await api.get(endpoint, { 
        timeout: 3000
        // Não enviamos o token pois essa rota não requer autenticação
      });
      console.log('Dados brutos da API:', response.data);
      
      // Adaptar a resposta para o formato esperado pelo frontend
      const data = response.data;
      const transformedData = {
        empresasAtivas: data.overview.empresasAtivas,
        veiculosCadastrados: data.overview.veiculosCadastrados,
        motoristasAtivos: data.overview.motoristasAtivos,
        vagasOcupadas: data.overview.vagasOcupadas,
        atividadesRecentes: data.atividadesRecentes
      };
      
      console.log('Dados transformados para o frontend:', transformedData);
      return transformedData;
    } catch (error) {
      console.error('Erro ao buscar dados do dashboard:', error);
      // Lançar o erro para ser tratado pelo componente
      throw error;
    }
  }
};

export default DashboardService; 