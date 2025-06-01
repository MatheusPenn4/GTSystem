import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import AppRoutes from './routes';
import AuthProvider from './context/AuthContext';
import ThemeProvider from './context/ThemeContext';
import { VehicleProvider } from './context/VehicleContext';
import { DriverProvider } from './context/DriverContext';
import { SettingsProvider } from './context/SettingsContext';
import { BranchProvider } from './context/BranchContext';

// Configuração do React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutos
    },
  },
});

const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <VehicleProvider>
            <DriverProvider>
              <BranchProvider>
                <SettingsProvider>
                  <AppRoutes />
                </SettingsProvider>
              </BranchProvider>
            </DriverProvider>
          </VehicleProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
