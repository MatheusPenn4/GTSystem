import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { NotificationProvider } from "@/contexts/NotificationContext";
import PrivateRoute from "@/components/PrivateRoute";
import RoleProtectedRoute from "@/components/RoleProtectedRoute";
import Layout from "@/components/Layout";

// Pages
import Index from "@/pages/Index";
import Login from "@/pages/Login";
import Dashboard from "@/pages/Dashboard";
import EstacionamentosCadastrados from "@/pages/EstacionamentosCadastrados";
import Empresas from "@/pages/Empresas";
import Transportadoras from "@/pages/Transportadoras";
import Usuarios from "@/pages/Usuarios";
import Veiculos from "@/pages/Veiculos";
import Motoristas from "@/pages/Motoristas";
import Estacionamento from "@/pages/Estacionamento";
import MinhasVagas from "@/pages/MinhasVagas";
import Relatorios from "@/pages/Relatorios";
import Financeiro from "@/pages/Financeiro";
import Configuracoes from "@/pages/Configuracoes";
import ReservaVagas from "@/pages/ReservaVagas";
import MinhasReservas from "@/pages/MinhasReservas";
import ReservasRecebidas from "@/pages/ReservasRecebidas";
import MeuEstacionamento from "@/pages/MeuEstacionamento";
import NotFound from "@/pages/NotFound";

// Configuração otimizada do QueryClient baseada no TanStack Query v5
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Cache por 5 minutos por padrão
      staleTime: 1000 * 60 * 5,
      // Manter dados em cache por 10 minutos quando não utilizados
      gcTime: 1000 * 60 * 10,
      // Retry configurado para melhor UX
      retry: (failureCount, error: any) => {
        // Não retry para erros 4xx (client errors)
        if (error?.response?.status >= 400 && error?.response?.status < 500) {
          return false;
        }
        // Retry até 3 vezes para outros erros
        return failureCount < 3;
      },
      // Delay exponencial para retries
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      // Refetch em focus apenas se dados estão stale
      refetchOnWindowFocus: false,
      // Refetch on reconnect apenas se dados estão stale
      refetchOnReconnect: 'always',
    },
    mutations: {
      // Retry para mutations apenas em caso de erro de rede
      retry: (failureCount, error: any) => {
        if (error?.response?.status >= 400 && error?.response?.status < 500) {
          return false;
        }
        return failureCount < 2;
      },
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <NotificationProvider>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route 
              path="/dashboard" 
              element={
                <PrivateRoute>
                  <Layout>
                    <Dashboard />
                  </Layout>
                </PrivateRoute>
              } 
            />
            <Route 
              path="/estacionamentos-cadastrados" 
              element={
                <PrivateRoute>
                  <RoleProtectedRoute allowedRoles={['admin']}>
                    <Layout>
                      <EstacionamentosCadastrados />
                    </Layout>
                  </RoleProtectedRoute>
                </PrivateRoute>
              } 
            />
            <Route 
              path="/transportadoras" 
              element={
                <PrivateRoute>
                  <RoleProtectedRoute allowedRoles={['admin']}>
                    <Layout>
                      <Transportadoras />
                    </Layout>
                  </RoleProtectedRoute>
                </PrivateRoute>
              } 
            />
            <Route 
              path="/usuarios" 
              element={
                <PrivateRoute>
                  <RoleProtectedRoute allowedRoles={['admin']}>
                    <Layout>
                      <Usuarios />
                    </Layout>
                  </RoleProtectedRoute>
                </PrivateRoute>
              } 
            />
            <Route 
              path="/minhas-vagas" 
              element={
                <PrivateRoute>
                  <RoleProtectedRoute allowedRoles={['estacionamento']}>
                    <Layout>
                      <MinhasVagas />
                    </Layout>
                  </RoleProtectedRoute>
                </PrivateRoute>
              } 
            />
            <Route 
              path="/estacionamento/:id" 
              element={
                <PrivateRoute>
                  <Layout>
                    <Estacionamento />
                  </Layout>
                </PrivateRoute>
              } 
            />
            <Route 
              path="/estacionamento" 
              element={
                <PrivateRoute>
                  <Layout>
                    <Estacionamento />
                  </Layout>
                </PrivateRoute>
              } 
            />
            <Route 
              path="/empresas" 
              element={
                <PrivateRoute>
                  <RoleProtectedRoute allowedRoles={['admin']}>
                    <Layout>
                      <Empresas />
                    </Layout>
                  </RoleProtectedRoute>
                </PrivateRoute>
              } 
            />
            <Route 
              path="/veiculos" 
              element={
                <PrivateRoute>
                  <RoleProtectedRoute allowedRoles={['admin', 'transportadora']}>
                    <Layout>
                      <Veiculos />
                    </Layout>
                  </RoleProtectedRoute>
                </PrivateRoute>
              } 
            />
            <Route 
              path="/motoristas" 
              element={
                <PrivateRoute>
                  <RoleProtectedRoute allowedRoles={['admin', 'transportadora']}>
                    <Layout>
                      <Motoristas />
                    </Layout>
                  </RoleProtectedRoute>
                </PrivateRoute>
              } 
            />
            <Route 
              path="/relatorios" 
              element={
                <PrivateRoute>
                  <Layout>
                    <Relatorios />
                  </Layout>
                </PrivateRoute>
              } 
            />
            <Route 
              path="/financeiro" 
              element={
                <PrivateRoute>
                  <Layout>
                    <Financeiro />
                  </Layout>
                </PrivateRoute>
              } 
            />
            <Route 
              path="/configuracoes" 
              element={
                <PrivateRoute>
                  <Layout>
                    <Configuracoes />
                  </Layout>
                </PrivateRoute>
              } 
            />
            <Route 
              path="/reserva-vagas" 
              element={
                <PrivateRoute>
                  <Layout>
                    <ReservaVagas />
                  </Layout>
                </PrivateRoute>
              } 
            />
            <Route 
              path="/minhas-reservas" 
              element={
                <PrivateRoute>
                  <Layout>
                    <MinhasReservas />
                  </Layout>
                </PrivateRoute>
              } 
            />
            <Route 
              path="/reservas-recebidas" 
              element={
                <PrivateRoute>
                  <Layout>
                    <ReservasRecebidas />
                  </Layout>
                </PrivateRoute>
              } 
            />
            <Route 
              path="/meu-estacionamento" 
              element={
                <PrivateRoute>
                  <Layout>
                    <MeuEstacionamento />
                  </Layout>
                </PrivateRoute>
              } 
            />
            <Route path="/" element={<Index />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          </NotificationProvider>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
