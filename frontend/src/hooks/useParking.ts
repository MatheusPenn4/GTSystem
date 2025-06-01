import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import {
  parkingLotAdapter,
  parkingSpotAdapter,
  parkingRecordAdapter,
} from '../adapters/parkingAdapters';
import api, { endpoints } from '../services/api';
import { ApiResponse, ApiError } from '../types/api';
import { ParkingLot, ParkingSpot, ParkingRecord } from '../types/parking';

interface ParkingQueryParams {
  search?: string;
  page?: number;
  pageSize?: number;
  ordering?: string;
}

interface VehicleEntry {
  parkingLotId: number;
  parkingSpotId: number;
  vehicleId: number;
  companyId: number;
  driverId?: number;
}

interface VehicleExit {
  vehicleId: number;
}

export function useParking() {
  const queryClient = useQueryClient();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const clearMessages = () => {
    setError(null);
    setSuccess(null);
  };

  const handleApiError = (err: AxiosError<ApiError>) => {
    const message = err.response?.data?.message || err.message;
    setError(message);
    return message;
  };

  // Função para buscar todos os estacionamentos
  const fetchParkingLots = async (params: ParkingQueryParams = {}) => {
    try {
      const queryParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value) queryParams.append(key.toLowerCase(), String(value));
      });

      const url = `${endpoints.parking.lots}${queryParams.toString() ? `?${queryParams}` : ''}`;
      const response = await api.get<ApiResponse<Record<string, unknown>>>(url);
      return response.data;
    } catch (err) {
      handleApiError(err as AxiosError<ApiError>);
      throw err;
    }
  };

  // Função para buscar vagas
  const fetchParkingSpots = async (parkingLotId: number) => {
    try {
      const url = `${endpoints.parking.spots}?lot_id=${parkingLotId}`;
      const response = await api.get<ApiResponse<Record<string, unknown>>>(url);
      return response.data;
    } catch (err) {
      handleApiError(err as AxiosError<ApiError>);
      throw err;
    }
  };

  const fetchParkingRecords = async (params: Record<string, unknown> = {}) => {
    try {
      const queryParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value != null) queryParams.append(key, String(value));
      });

      const url = `${endpoints.parking.records}${queryParams.toString() ? `?${queryParams}` : ''}`;
      const response = await api.get<ApiResponse<Record<string, unknown>>>(url);
      return response.data;
    } catch (err) {
      handleApiError(err as AxiosError<ApiError>);
      throw err;
    }
  };

  // Mutações
  const vehicleEntryMutation = useMutation({
    mutationFn: async (entryData: VehicleEntry) => {
      try {
        const response = await api.post(endpoints.parking.vehicleEntry, entryData);
        return response.data;
      } catch (err) {
        handleApiError(err as AxiosError<ApiError>);
        throw err;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['parking-spots'] });
      queryClient.invalidateQueries({ queryKey: ['available-spots'] });
      queryClient.invalidateQueries({ queryKey: ['parking-records'] });
      setSuccess('Entrada de veículo registrada com sucesso!');
      setTimeout(clearMessages, 3000); // Limpa mensagens após 3 segundos
    },
  });

  const vehicleExitMutation = useMutation({
    mutationFn: async (exitData: VehicleExit) => {
      try {
        const response = await api.post(endpoints.parking.vehicleExit, exitData);
        return response.data;
      } catch (err) {
        handleApiError(err as AxiosError<ApiError>);
        throw err;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['parking-spots'] });
      queryClient.invalidateQueries({ queryKey: ['available-spots'] });
      queryClient.invalidateQueries({ queryKey: ['parking-records'] });
      setSuccess('Saída de veículo registrada com sucesso!');
      setTimeout(clearMessages, 3000); // Limpa mensagens após 3 segundos
    },
  });

  // Adicionar mutações para CRUD operations
  const createParkingMutation = useMutation({
    mutationFn: async (parkingData: Partial<ParkingLot>) => {
      try {
        const response = await api.post(endpoints.parking.lots, parkingData);
        return response.data;
      } catch (err) {
        handleApiError(err as AxiosError<ApiError>);
        throw err;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['parking-lots'] });
      setSuccess('Estacionamento criado com sucesso!');
      setTimeout(clearMessages, 3000);
    },
  });

  const updateParkingMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<ParkingLot> }) => {
      try {
        const response = await api.put(`${endpoints.parking.lots}/${id}/`, data);
        return response.data;
      } catch (err) {
        handleApiError(err as AxiosError<ApiError>);
        throw err;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['parking-lots'] });
      setSuccess('Estacionamento atualizado com sucesso!');
      setTimeout(clearMessages, 3000);
    },
  });

  const deleteParkingMutation = useMutation({
    mutationFn: async (id: number) => {
      try {
        const response = await api.delete(`${endpoints.parking.lots}/${id}/`);
        return response.data;
      } catch (err) {
        handleApiError(err as AxiosError<ApiError>);
        throw err;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['parking-lots'] });
      setSuccess('Estacionamento excluído com sucesso!');
      setTimeout(clearMessages, 3000);
    },
  });

  return {
    // Funções para usar queries - devem ser chamadas em componentes
    fetchParkingLots,
    fetchParkingSpots,
    fetchParkingRecords,
    // Mutações
    vehicleEntryMutation,
    vehicleExitMutation,
    // Novas mutações CRUD
    createParkingMutation,
    updateParkingMutation,
    deleteParkingMutation,
    // Estados
    error,
    success,
    clearMessages,
    // Utilitários
    queryClient,
    handleApiError,
  };
}

// Hook específico para parking lots
export function useParkingLots(params: ParkingQueryParams = {}) {
  const [error, setError] = useState<string | null>(null);

  const handleApiError = (err: AxiosError<ApiError>) => {
    const message = err.response?.data?.message || err.message;
    setError(message);
    return message;
  };

  const fetchParkingLots = async (params: ParkingQueryParams = {}) => {
    try {
      const queryParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value) queryParams.append(key.toLowerCase(), String(value));
      });

      const url = `${endpoints.parking.lots}${queryParams.toString() ? `?${queryParams}` : ''}`;
      const response = await api.get<ApiResponse<Record<string, unknown>>>(url);
      return response.data;
    } catch (err) {
      handleApiError(err as AxiosError<ApiError>);
      throw err;
    }
  };

  const query = useQuery<
    ApiResponse<Record<string, unknown>>,
    Error,
    {
      results: ParkingLot[];
      count: number;
      next: string | null;
      previous: string | null;
    }
  >({
    queryKey: ['parking-lots', params],
    queryFn: () => fetchParkingLots(params),
    select: (data) => ({
      results: ((data.results as Record<string, unknown>[]) || []).map(parkingLotAdapter),
      count: data.count,
      next: data.next ?? null,
      previous: data.previous ?? null,
    }),
  });

  return {
    ...query,
    error: error || query.error?.message,
  };
}

// Hook específico para parking spots
export function useParkingSpots(parkingLotId: number) {
  const [error, setError] = useState<string | null>(null);

  const handleApiError = (err: AxiosError<ApiError>) => {
    const message = err.response?.data?.message || err.message;
    setError(message);
    return message;
  };

  const fetchParkingSpots = async (parkingLotId: number) => {
    try {
      const url = `${endpoints.parking.spots}?lot_id=${parkingLotId}`;
      const response = await api.get<ApiResponse<Record<string, unknown>>>(url);
      return response.data;
    } catch (err) {
      handleApiError(err as AxiosError<ApiError>);
      throw err;
    }
  };

  const query = useQuery<
    ApiResponse<Record<string, unknown>>,
    Error,
    {
      results: ParkingSpot[];
      count: number;
    }
  >({
    queryKey: ['parking-spots', parkingLotId],
    queryFn: () => fetchParkingSpots(parkingLotId),
    enabled: Boolean(parkingLotId),
    select: (data) => ({
      results: ((data.results as Record<string, unknown>[]) || []).map(parkingSpotAdapter),
      count: data.count,
    }),
    staleTime: 15000,
  });

  return {
    ...query,
    error: error || query.error?.message,
  };
}

// Hook específico para parking records
export function useParkingRecords(params: Record<string, unknown> = {}) {
  const [error, setError] = useState<string | null>(null);

  const handleApiError = (err: AxiosError<ApiError>) => {
    const message = err.response?.data?.message || err.message;
    setError(message);
    return message;
  };

  const fetchParkingRecords = async (params: Record<string, unknown> = {}) => {
    try {
      const queryParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value != null) queryParams.append(key, String(value));
      });

      const url = `${endpoints.parking.records}${queryParams.toString() ? `?${queryParams}` : ''}`;
      const response = await api.get<ApiResponse<Record<string, unknown>>>(url);
      return response.data;
    } catch (err) {
      handleApiError(err as AxiosError<ApiError>);
      throw err;
    }
  };

  const query = useQuery<
    ApiResponse<Record<string, unknown>>,
    Error,
    {
      results: ParkingRecord[];
      count: number;
    }
  >({
    queryKey: ['parking-records', params],
    queryFn: () => fetchParkingRecords(params),
    select: (data) => ({
      results: ((data.results as Record<string, unknown>[]) || []).map(parkingRecordAdapter),
      count: data.count,
    }),
    staleTime: 15000,
    refetchInterval: 30000,
  });

  return {
    ...query,
    error: error || query.error?.message,
  };
}

// Hook combinado para facilitar o uso - mantém compatibilidade com código existente
export function useParkingData() {
  const {
    vehicleEntryMutation,
    vehicleExitMutation,
    createParkingMutation,
    updateParkingMutation,
    deleteParkingMutation,
    error: mainError,
    success,
    clearMessages,
  } = useParking();

  return {
    vehicleEntryMutation,
    vehicleExitMutation,
    createParkingMutation,
    updateParkingMutation,
    deleteParkingMutation,
    error: mainError,
    success,
    clearMessages,
    useParkingLots,
    useParkingSpots,
    useParkingRecords,
  };
}
