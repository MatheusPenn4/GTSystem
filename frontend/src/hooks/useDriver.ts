import { useState, useCallback } from 'react';
import api from '../services/api';

export interface Driver {
  id: number;
  name: string;
  license_number: string;
  cnh_category: string;
  cnh_expiration: string;
  phone: string;
  email: string;
  branch?: number;
  branch_name?: string;
  vehicle?: number;
  vehicle_plate?: string;
  vehicle_model?: string;
  created_at?: string;
}

export interface DriverFormData {
  name: string;
  license_number: string;
  cnh_category: string;
  cnh_expiration: string;
  phone: string;
  email: string;
  branch?: number;
  vehicle?: number;
}

export const useDriver = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchDrivers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get('/company/drivers/');

      // Verificar se a resposta existe
      if (!response || !response.data) {
        console.warn('Resposta vazia da API de motoristas');
        return [];
      }

      // Verificar se a resposta contém results ou é um array direto
      const driversData = response.data.results || response.data;

      // Verificar se driversData existe
      if (!driversData) {
        console.warn('Dados de motoristas vazios na resposta da API');
        return [];
      }

      // Garantir que sempre retornamos um array
      return Array.isArray(driversData) ? driversData : [];
    } catch (err: any) {
      console.error('Erro ao carregar motoristas:', err);
      // Mensagem de erro mais detalhada baseada na resposta
      if (err.response && err.response.data) {
        if (err.response.data.detail) {
          setError(`Não foi possível carregar a lista de motoristas: ${err.response.data.detail}`);
        } else {
          setError(
            'Não foi possível carregar a lista de motoristas. Verifique se o servidor está online.'
          );
        }
      } else if (err.message) {
        setError(`Erro ao carregar motoristas: ${err.message}`);
      } else {
        setError('Não foi possível carregar a lista de motoristas.');
      }
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const createDriver = useCallback(async (data: DriverFormData) => {
    setLoading(true);
    setError(null);
    try {
      console.log('Dados recebidos para criação de motorista:', data);

      // Verificar se branch está definido
      if (!data.branch) {
        setError('É necessário selecionar uma filial para o motorista.');
        throw new Error('Branch is required');
      }

      // Mapear os campos do frontend para o formato esperado pelo backend
      const backendData = {
        name: data.name,
        license_number: data.license_number,
        cnh_category: data.cnh_category,
        cnh_expiration: data.cnh_expiration,
        phone: data.phone,
        email: data.email,
        branch: Number(data.branch),
        vehicle: data.vehicle ? Number(data.vehicle) : null,
      };

      console.log('Dados enviados para o backend:', backendData);

      const response = await api.post('/company/drivers/', backendData);
      console.log('Resposta do backend:', response.data);
      return response.data;
    } catch (err: any) {
      console.error('Erro ao criar motorista:', err);

      // Log detalhado do erro
      if (err.response) {
        console.error('Resposta de erro:', {
          status: err.response.status,
          data: err.response.data,
          headers: err.response.headers,
        });
      }

      if (err.response && err.response.data) {
        if (typeof err.response.data === 'object' && Object.keys(err.response.data).length > 0) {
          // Formata erros de validação
          const errorMessages = Object.entries(err.response.data)
            .map(
              ([field, messages]: [string, any]) =>
                `${field}: ${Array.isArray(messages) ? messages.join(', ') : messages}`
            )
            .join('; ');
          setError(`Não foi possível criar o motorista: ${errorMessages}`);
        } else if (err.response.data.detail) {
          setError(`Não foi possível criar o motorista: ${err.response.data.detail}`);
        } else {
          setError('Não foi possível criar o motorista.');
        }
      } else if (err.message === 'Branch is required') {
        // Mensagem já definida acima
      } else {
        setError('Não foi possível criar o motorista.');
      }
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateDriver = useCallback(async (id: number, data: DriverFormData) => {
    setLoading(true);
    setError(null);
    try {
      // Verificar se branch está definido
      if (!data.branch) {
        setError('É necessário selecionar uma filial para o motorista.');
        throw new Error('Branch is required');
      }

      // Mapear os campos do frontend para o formato esperado pelo backend
      const backendData = {
        name: data.name,
        license_number: data.license_number,
        cnh_category: data.cnh_category,
        cnh_expiration: data.cnh_expiration,
        phone: data.phone,
        email: data.email,
        branch: Number(data.branch),
        vehicle: data.vehicle ? Number(data.vehicle) : null,
      };

      console.log('Dados enviados para o backend (atualização):', backendData);

      const response = await api.put(`/company/drivers/${id}/`, backendData);
      return response.data;
    } catch (err: any) {
      console.error('Erro ao atualizar motorista:', err);
      if (err.response && err.response.data) {
        if (typeof err.response.data === 'object' && Object.keys(err.response.data).length > 0) {
          // Formata erros de validação
          const errorMessages = Object.entries(err.response.data)
            .map(
              ([field, messages]: [string, any]) =>
                `${field}: ${Array.isArray(messages) ? messages.join(', ') : messages}`
            )
            .join('; ');
          setError(`Não foi possível atualizar o motorista: ${errorMessages}`);
        } else if (err.response.data.detail) {
          setError(`Não foi possível atualizar o motorista: ${err.response.data.detail}`);
        } else {
          setError('Não foi possível atualizar o motorista.');
        }
      } else if (err.message === 'Branch is required') {
        // Mensagem já definida acima
      } else {
        setError('Não foi possível atualizar o motorista.');
      }
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteDriver = useCallback(async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      await api.delete(`/company/drivers/${id}/`);
      return true;
    } catch (err: any) {
      console.error('Erro ao excluir motorista:', err);
      if (err.response && err.response.data && err.response.data.detail) {
        setError(`Não foi possível excluir o motorista: ${err.response.data.detail}`);
      } else {
        setError('Não foi possível excluir o motorista.');
      }
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    fetchDrivers,
    createDriver,
    updateDriver,
    deleteDriver,
  };
};
