import React, { createContext, useContext, useCallback } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '../services/api';

interface Driver {
  id: number;
  name: string;
  license_number: string;
  cnh_category: string;
  cnh_expiration: string;
  phone: string;
  email: string;
  branch?: number;
  branch_name?: string; // Adicionar campo para nome da filial
  vehicle?: number;
}

interface DriverFormData {
  name: string;
  license_number: string;
  cnh_category: string;
  cnh_expiration: string;
  phone: string;
  email: string;
  branch?: number;
  vehicle?: number;
}

interface DriverContextData {
  drivers: Driver[];
  loading: boolean;
  error: string | null;
  fetchDrivers: () => Promise<void>;
  createDriver: (data: DriverFormData) => Promise<void>;
  updateDriver: (id: number, data: DriverFormData) => Promise<void>;
  deleteDriver: (id: number) => Promise<void>;
}

const DriverContext = createContext<DriverContextData>({} as DriverContextData);

export const DriverProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const queryClient = useQueryClient();

  // Query para buscar motoristas
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['drivers'],
    queryFn: async () => {
      const response = await api.get('/company/drivers/');
      return response.data;
    },
    select: (data) => data.results || data,
  });

  // Mutação para criar motorista
  const createMutation = useMutation({
    mutationFn: async (driverData: DriverFormData) => {
      const response = await api.post('/company/drivers/', driverData);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['drivers'] });
    },
  });

  // Mutação para atualizar motorista
  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: DriverFormData }) => {
      const response = await api.put(`/company/drivers/${id}/`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['drivers'] });
    },
  });

  // Mutação para deletar motorista
  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`/company/drivers/${id}/`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['drivers'] });
    },
  });

  const fetchDrivers = useCallback(async () => {
    await refetch();
  }, [refetch]);

  const createDriver = useCallback(
    async (data: DriverFormData) => {
      await createMutation.mutateAsync(data);
    },
    [createMutation]
  );

  const updateDriver = useCallback(
    async (id: number, data: DriverFormData) => {
      await updateMutation.mutateAsync({ id, data });
    },
    [updateMutation]
  );

  const deleteDriver = useCallback(
    async (id: number) => {
      await deleteMutation.mutateAsync(id);
    },
    [deleteMutation]
  );

  return (
    <DriverContext.Provider
      value={{
        drivers: data || [],
        loading: isLoading,
        error: error?.message || null,
        fetchDrivers,
        createDriver,
        updateDriver,
        deleteDriver,
      }}
    >
      {children}
    </DriverContext.Provider>
  );
};

export const useDriverContext = () => {
  const context = useContext(DriverContext);
  if (!context) {
    throw new Error('useDriverContext must be used within a DriverProvider');
  }
  return context;
};
