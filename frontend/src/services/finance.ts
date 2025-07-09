import api from '@/lib/api';

export interface FaturamentoEstacionamento {
  id: string;
  nome: string;
  vagas: number;
  ocupacaoMedia: number;
  diariasVendidas: number;
  faturamento: number;
  comissao: number;
}

export interface EvolucaoMensal {
  mes: string;
  faturamento: number;
  comissao: number;
}

export interface FinancialSummary {
  totalFaturamento: number;
  totalComissao: number;
  totalDiarias: number;
  mediaOcupacao: number;
}

const FinanceService = {
  // Buscar faturamento de estacionamentos
  getFaturamentoEstacionamentos: async (periodo: string): Promise<FaturamentoEstacionamento[]> => {
    try {
      console.log('Carregando faturamento de estacionamentos do backend...', { periodo });
      
      const response = await api.get('/financial/parking-lots', {
        params: { periodo },
        timeout: 8000
      });
      
      // O backend retorna { status: 'success', data: [...], summary: {...} }
      const data = response.data?.data || [];
      console.log('Faturamento de estacionamentos carregado com sucesso!', data.length, 'registros');
      return data;
    } catch (error: any) {
      console.error('Erro ao buscar faturamento de estacionamentos:', error);
      
      // Se o endpoint não existir ainda, retornar array vazio
      if (error.response?.status === 404) {
        console.warn('Endpoint de faturamento não implementado ainda no backend');
        return [];
      }
      throw error;
    }
  },

  // Buscar evolução mensal
  getEvolucaoMensal: async (periodo: string): Promise<EvolucaoMensal[]> => {
    try {
      console.log('Carregando evolução mensal do backend...', { periodo });
      
      const response = await api.get('/financial/monthly-evolution', {
        params: { periodo },
        timeout: 8000
      });
      
      // O backend retorna { status: 'success', data: [...], summary: {...} }
      const data = response.data?.data || [];
      console.log('Evolução mensal carregada com sucesso!', data.length, 'registros');
      return data;
    } catch (error: any) {
      console.error('Erro ao buscar evolução mensal:', error);
      
      // Se o endpoint não existir ainda, retornar array vazio
      if (error.response?.status === 404) {
        console.warn('Endpoint de evolução mensal não implementado ainda no backend');
        return [];
      }
      throw error;
    }
  },

  // Buscar resumo financeiro
  getFinancialSummary: async (periodo: string): Promise<FinancialSummary> => {
    try {
      console.log('Carregando resumo financeiro do backend...', { periodo });
      
      const response = await api.get('/financial/summary', {
        params: { periodo },
        timeout: 8000
      });
      
      console.log('Resumo financeiro carregado com sucesso!');
      return response.data;
    } catch (error: any) {
      console.error('Erro ao buscar resumo financeiro:', error);
      
      // Se o endpoint não existir ainda, retornar dados zerados
      if (error.response?.status === 404) {
        console.warn('Endpoint de resumo financeiro não implementado ainda no backend');
        return {
          totalFaturamento: 0,
          totalComissao: 0,
          totalDiarias: 0,
          mediaOcupacao: 0
        };
      }
      throw error;
    }
  },

  // Gerar relatório financeiro
  generateReport: async (periodo: string, formato: 'pdf' | 'excel'): Promise<Blob> => {
    try {
      console.log('Gerando relatório financeiro...', { periodo, formato });
      
      const response = await api.get('/financial/report', {
        params: { periodo, formato },
        responseType: 'blob',
        timeout: 30000 // Relatórios podem demorar mais
      });
      
      console.log('Relatório financeiro gerado com sucesso!');
      return response.data;
    } catch (error: any) {
      console.error('Erro ao gerar relatório financeiro:', error);
      
      if (error.response?.status === 404) {
        throw new Error('Funcionalidade de relatórios ainda não implementada no backend');
      }
      throw error;
    }
  }
};

export default FinanceService; 