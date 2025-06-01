import React, { createContext, useContext, ReactNode } from 'react';
import { ParkingLot } from '../types/parking';

interface ParkingContextData {
  parkings: ParkingLot[];
  loading: boolean;
  error: string | null;
  success: string | null;
  fetchParkings: (query?: string) => void;
  clearMessages: () => void;
  deleteParking: (id: number) => Promise<void>;
  createParking: (data: Partial<ParkingLot>) => Promise<void>;
  updateParking: (id: number, data: Partial<ParkingLot>) => Promise<void>;
}

const ParkingContext = createContext<ParkingContextData>({} as ParkingContextData);

interface ParkingProviderProps {
  children: ReactNode;
}

export const ParkingProvider: React.FC<ParkingProviderProps> = ({ children }) => {
  // Context simplificado - componentes devem usar hooks diretamente
  const contextValue: ParkingContextData = {
    parkings: [],
    loading: false,
    error: null,
    success: null,
    fetchParkings: () => {
      console.warn('ParkingContext: Use useParkingLots hook directly instead');
    },
    clearMessages: () => {
      console.warn('ParkingContext: Use useParking hook directly instead');
    },
    deleteParking: async () => {
      console.warn('ParkingContext: Use useParking deleteParkingMutation instead');
    },
    createParking: async () => {
      console.warn('ParkingContext: Use useParking createParkingMutation instead');
    },
    updateParking: async () => {
      console.warn('ParkingContext: Use useParking updateParkingMutation instead');
    },
  };

  return <ParkingContext.Provider value={contextValue}>{children}</ParkingContext.Provider>;
};

export const useParkingContext = (): ParkingContextData => {
  const context = useContext(ParkingContext);
  if (!context) {
    throw new Error('useParkingContext must be used within a ParkingProvider');
  }
  return context;
};
