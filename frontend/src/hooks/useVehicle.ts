import { useState, useCallback } from 'react';
import api from '../services/api';

export interface Vehicle {
  id: number;
  plate: string;
  model: string;
  brand: string;
  color: string;
  year: number;
  branch?: number;
  branch_name?: string;
  driver?: number;
  driver_name?: string;
  created_at?: string;
  status?: 'active' | 'maintenance' | 'inactive';
}

export interface VehicleFormData {
  plate: string;
  model: string;
  brand: string;
  color: string;
  year: number;
  branch?: number;
  driver?: number;
  status?: 'active' | 'maintenance' | 'inactive';
}

export const useVehicle = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchVehicles = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get('/company/vehicles/');

      // Verificar se a resposta existe
      if (!response || !response.data) {
        console.warn('Resposta vazia da API de veículos');
        return [];
      }

      // Verificar se a resposta contém results ou é um array direto
      const vehiclesData = response.data.results || response.data;

      // Verificar se vehiclesData existe
      if (!vehiclesData) {
        console.warn('Dados de veículos vazios na resposta da API');
        return [];
      }

      // Garantir que sempre retornamos um array
      return Array.isArray(vehiclesData) ? vehiclesData : [];
    } catch (err: any) {
      console.error('Erro ao carregar veículos:', err);
      // Mensagem de erro mais detalhada baseada na resposta
      if (err.response && err.response.data) {
        if (err.response.data.detail) {
          setError(`Não foi possível carregar a lista de veículos: ${err.response.data.detail}`);
        } else {
          setError(
            'Não foi possível carregar a lista de veículos. Verifique se o servidor está online.'
          );
        }
      } else if (err.message) {
        setError(`Erro ao carregar veículos: ${err.message}`);
      } else {
        setError('Não foi possível carregar a lista de veículos.');
      }
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const createVehicle = useCallback(async (data: VehicleFormData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.post('/company/vehicles/', data);
      return response.data;
    } catch (err: any) {
      console.error('Erro ao criar veículo:', err);
      if (err.response && err.response.data) {
        if (typeof err.response.data === 'object' && Object.keys(err.response.data).length > 0) {
          // Formata erros de validação
          const errorMessages = Object.entries(err.response.data)
            .map(
              ([field, messages]: [string, any]) =>
                `${field}: ${Array.isArray(messages) ? messages.join(', ') : messages}`
            )
            .join('; ');
          setError(`Não foi possível criar o veículo: ${errorMessages}`);
        } else if (err.response.data.detail) {
          setError(`Não foi possível criar o veículo: ${err.response.data.detail}`);
        } else {
          setError('Não foi possível criar o veículo.');
        }
      } else {
        setError('Não foi possível criar o veículo.');
      }
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateVehicle = useCallback(async (id: number, data: VehicleFormData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.put(`/company/vehicles/${id}/`, data);
      return response.data;
    } catch (err: any) {
      console.error('Erro ao atualizar veículo:', err);
      if (err.response && err.response.data) {
        if (typeof err.response.data === 'object' && Object.keys(err.response.data).length > 0) {
          // Formata erros de validação
          const errorMessages = Object.entries(err.response.data)
            .map(
              ([field, messages]: [string, any]) =>
                `${field}: ${Array.isArray(messages) ? messages.join(', ') : messages}`
            )
            .join('; ');
          setError(`Não foi possível atualizar o veículo: ${errorMessages}`);
        } else if (err.response.data.detail) {
          setError(`Não foi possível atualizar o veículo: ${err.response.data.detail}`);
        } else {
          setError('Não foi possível atualizar o veículo.');
        }
      } else {
        setError('Não foi possível atualizar o veículo.');
      }
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteVehicle = useCallback(async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      await api.delete(`/company/vehicles/${id}/`);
      return true;
    } catch (err: any) {
      console.error('Erro ao excluir veículo:', err);
      if (err.response && err.response.data && err.response.data.detail) {
        setError(`Não foi possível excluir o veículo: ${err.response.data.detail}`);
      } else {
        setError('Não foi possível excluir o veículo.');
      }
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    fetchVehicles,
    createVehicle,
    updateVehicle,
    deleteVehicle,
  };
};
