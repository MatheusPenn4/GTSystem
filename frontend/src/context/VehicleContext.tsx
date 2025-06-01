import React, { createContext, useContext, useCallback } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '../services/api';

interface Vehicle {
  id: number;
  plate: string;
  model: string;
  brand: string;
  year: number;
  color: string;
  status: 'active' | 'maintenance' | 'inactive';
  branch?: number;
  branch_name?: string; // Adicionar campo para nome da filial
  driver?: number;
  driver_name?: string; // Adicionar campo para nome do motorista
}

interface VehicleFormData {
  plate: string;
  model: string;
  brand: string;
  year: number;
  color: string;
  status: 'active' | 'maintenance' | 'inactive';
  branch?: number;
  driver?: number;
}

interface VehicleContextData {
  vehicles: Vehicle[];
  loading: boolean;
  error: string | null;
  fetchVehicles: () => Promise<void>;
  createVehicle: (data: VehicleFormData) => Promise<void>;
  updateVehicle: (id: number, data: VehicleFormData) => Promise<void>;
  deleteVehicle: (id: number) => Promise<void>;
}

const VehicleContext = createContext<VehicleContextData>({} as VehicleContextData);

export const VehicleProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const queryClient = useQueryClient();

  // Query para buscar veículos
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['vehicles'],
    queryFn: async () => {
      const response = await api.get('/company/vehicles/');
      return response.data;
    },
    select: (data) => data.results || data,
  });

  // Mutação para criar veículo
  const createMutation = useMutation({
    mutationFn: async (vehicleData: VehicleFormData) => {
      const response = await api.post('/company/vehicles/', vehicleData);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vehicles'] });
    },
  });

  // Mutação para atualizar veículo
  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: VehicleFormData }) => {
      const response = await api.put(`/company/vehicles/${id}/`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vehicles'] });
    },
  });

  // Mutação para deletar veículo
  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`/company/vehicles/${id}/`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vehicles'] });
    },
  });

  const fetchVehicles = useCallback(async () => {
    await refetch();
  }, [refetch]);

  const createVehicle = useCallback(
    async (data: VehicleFormData) => {
      await createMutation.mutateAsync(data);
    },
    [createMutation]
  );

  const updateVehicle = useCallback(
    async (id: number, data: VehicleFormData) => {
      await updateMutation.mutateAsync({ id, data });
    },
    [updateMutation]
  );

  const deleteVehicle = useCallback(
    async (id: number) => {
      await deleteMutation.mutateAsync(id);
    },
    [deleteMutation]
  );

  return (
    <VehicleContext.Provider
      value={{
        vehicles: data || [],
        loading: isLoading,
        error: error?.message || null,
        fetchVehicles,
        createVehicle,
        updateVehicle,
        deleteVehicle,
      }}
    >
      {children}
    </VehicleContext.Provider>
  );
};

export const useVehicleContext = () => {
  const context = useContext(VehicleContext);
  if (!context) {
    throw new Error('useVehicleContext must be used within a VehicleProvider');
  }
  return context;
};
