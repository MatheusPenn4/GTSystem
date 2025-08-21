import api from './api';

export interface Transacao {
  id: string;
  tipo: 'entrada' | 'saida';
  valor: number;
  descricao: string;
  data: string;
  categoria: string;
  status: 'pendente' | 'confirmado' | 'cancelado';
}

export interface ResumoFinanceiro {
  receitaTotal: number;
  despesaTotal: number;
  saldo: number;
  receitaMensal: number;
  despesaMensal: number;
}

const FinanceService = {
  // Buscar transações
  getTransacoes: async (dataInicio?: string, dataFim?: string): Promise<Transacao[]> => {
    try {
      console.log('Tentando buscar transações...', { dataInicio, dataFim });
      
      const params: any = {};
      if (dataInicio) params.dataInicio = dataInicio;
      if (dataFim) params.dataFim = dataFim;
      
      const response = await api.get('/finance/transacoes', { params, timeout: 8000 });
      console.log('Transações obtidas com sucesso!', response.data.length);
      
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar transações:', error);
      throw error;
    }
  },

  // Buscar resumo financeiro
  getResumoFinanceiro: async (): Promise<ResumoFinanceiro> => {
    try {
      console.log('Tentando buscar resumo financeiro...');
      
      const response = await api.get('/finance/resumo', { timeout: 8000 });
      console.log('Resumo financeiro obtido com sucesso!');
      
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar resumo financeiro:', error);
      throw error;
    }
  },

  // Criar nova transação
  createTransacao: async (transacao: Omit<Transacao, 'id' | 'data'>): Promise<Transacao> => {
    try {
      console.log('Tentando criar transação...', transacao);
      
      const response = await api.post('/finance/transacoes', transacao, { timeout: 8000 });
      console.log('Transação criada com sucesso!');
      
      return response.data;
    } catch (error) {
      console.error('Erro ao criar transação:', error);
      throw error;
    }
  },

  // Atualizar transação
  updateTransacao: async (id: string, transacao: Partial<Transacao>): Promise<Transacao> => {
    try {
      console.log(`Tentando atualizar transação ${id}...`, transacao);
      
      const response = await api.put(`/finance/transacoes/${id}`, transacao, { timeout: 8000 });
      console.log('Transação atualizada com sucesso!');
      
      return response.data;
    } catch (error) {
      console.error('Erro ao atualizar transação:', error);
      throw error;
    }
  },

  // Deletar transação
  deleteTransacao: async (id: string): Promise<void> => {
    try {
      console.log(`Tentando deletar transação ${id}...`);
      
      await api.delete(`/finance/transacoes/${id}`, { timeout: 8000 });
      console.log('Transação deletada com sucesso!');
    } catch (error) {
      console.error('Erro ao deletar transação:', error);
      throw error;
    }
  },

  // Buscar relatório financeiro
  getRelatorioFinanceiro: async (dataInicio: string, dataFim: string): Promise<any> => {
    try {
      console.log('Tentando buscar relatório financeiro...', { dataInicio, dataFim });
      
      const response = await api.get('/finance/relatorio', {
        params: { dataInicio, dataFim },
        timeout: 8000
      });
      console.log('Relatório financeiro obtido com sucesso!');
      
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar relatório financeiro:', error);
      throw error;
    }
  }
};

export default FinanceService; 