import { useState, useCallback } from 'react';
import api from '../services/api';

export interface Company {
  id: number;
  name: string;
  cnpj: string;
  address: string;
}

export interface CompanyFormData {
  name: string;
  cnpj: string;
  address: string;
}

export const useCompany = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCompanies = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get('/company/companies/');
      const companiesData = response.data.results || response.data;
      return Array.isArray(companiesData) ? companiesData : [];
    } catch (err) {
      setError('Não foi possível carregar a lista de empresas.');
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const createCompany = useCallback(async (data: CompanyFormData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.post('/company/companies/', data);
      return response.data;
    } catch (err) {
      setError('Não foi possível criar a empresa.');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateCompany = useCallback(async (id: number, data: CompanyFormData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.put(`/company/companies/${id}/`, data);
      return response.data;
    } catch (err) {
      setError('Não foi possível atualizar a empresa.');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteCompany = useCallback(async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      await api.delete(`/company/companies/${id}/`);
      return true;
    } catch (err) {
      setError('Não foi possível excluir a empresa.');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    fetchCompanies,
    createCompany,
    updateCompany,
    deleteCompany,
  };
};
