import { useState, useCallback } from 'react';
import api from '../services/api';

export interface Branch {
  id: number;
  name: string;
  address: string;
  cnpj?: string;
  phone?: string;
  email?: string;
  created_at: string;
}

export interface BranchFormData {
  name: string;
  address: string;
  cnpj?: string;
  phone?: string;
  email?: string;
}

export const useBranch = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchBranches = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get('/company/branches/');

      // Verificar se a resposta existe
      if (!response || !response.data) {
        console.warn('Resposta vazia da API de filiais');
        return [];
      }

      // Verificar se a resposta contém results ou é um array direto
      const branchesData = response.data.results || response.data;

      // Verificar se branchesData existe
      if (!branchesData) {
        console.warn('Dados de filiais vazios na resposta da API');
        return [];
      }

      // Garantir que sempre retornamos um array
      return Array.isArray(branchesData) ? branchesData : [];
    } catch (err: any) {
      console.error('Erro ao carregar filiais:', err);
      // Mensagem de erro mais detalhada baseada na resposta
      if (err.response && err.response.data) {
        if (err.response.data.detail) {
          setError(`Não foi possível carregar a lista de filiais: ${err.response.data.detail}`);
        } else {
          setError(
            'Não foi possível carregar a lista de filiais. Verifique se o servidor está online.'
          );
        }
      } else if (err.message) {
        setError(`Erro ao carregar filiais: ${err.message}`);
      } else {
        setError('Não foi possível carregar a lista de filiais.');
      }
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const createBranch = useCallback(async (data: BranchFormData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.post('/company/branches/', data);
      return response.data;
    } catch (err: any) {
      console.error('Erro ao criar filial:', err);
      if (err.response && err.response.data) {
        if (typeof err.response.data === 'object' && Object.keys(err.response.data).length > 0) {
          // Formata erros de validação
          const errorMessages = Object.entries(err.response.data)
            .map(
              ([field, messages]: [string, any]) =>
                `${field}: ${Array.isArray(messages) ? messages.join(', ') : messages}`
            )
            .join('; ');
          setError(`Não foi possível criar a filial: ${errorMessages}`);
        } else if (err.response.data.detail) {
          setError(`Não foi possível criar a filial: ${err.response.data.detail}`);
        } else {
          setError('Não foi possível criar a filial.');
        }
      } else {
        setError('Não foi possível criar a filial.');
      }
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateBranch = useCallback(async (id: number, data: BranchFormData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.put(`/company/branches/${id}/`, data);
      return response.data;
    } catch (err: any) {
      console.error('Erro ao atualizar filial:', err);
      if (err.response && err.response.data) {
        if (typeof err.response.data === 'object' && Object.keys(err.response.data).length > 0) {
          // Formata erros de validação
          const errorMessages = Object.entries(err.response.data)
            .map(
              ([field, messages]: [string, any]) =>
                `${field}: ${Array.isArray(messages) ? messages.join(', ') : messages}`
            )
            .join('; ');
          setError(`Não foi possível atualizar a filial: ${errorMessages}`);
        } else if (err.response.data.detail) {
          setError(`Não foi possível atualizar a filial: ${err.response.data.detail}`);
        } else {
          setError('Não foi possível atualizar a filial.');
        }
      } else {
        setError('Não foi possível atualizar a filial.');
      }
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteBranch = useCallback(async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      await api.delete(`/company/branches/${id}/`);
      return true;
    } catch (err: any) {
      console.error('Erro ao excluir filial:', err);
      if (err.response && err.response.data && err.response.data.detail) {
        setError(`Não foi possível excluir a filial: ${err.response.data.detail}`);
      } else {
        setError('Não foi possível excluir a filial.');
      }
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    fetchBranches,
    createBranch,
    updateBranch,
    deleteBranch,
  };
};
