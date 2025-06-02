
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import PrivateRoute from "@/components/PrivateRoute";
import Layout from "@/components/Layout";

// Pages
import Login from "@/pages/Login";
import Dashboard from "@/pages/Dashboard";
import Empresas from "@/pages/Empresas";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
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
              path="/empresas" 
              element={
                <PrivateRoute>
                  <Layout>
                    <Empresas />
                  </Layout>
                </PrivateRoute>
              } 
            />
            <Route 
              path="/veiculos" 
              element={
                <PrivateRoute>
                  <Layout>
                    <div className="text-white">Página de Veículos (Em construção)</div>
                  </Layout>
                </PrivateRoute>
              } 
            />
            <Route 
              path="/motoristas" 
              element={
                <PrivateRoute>
                  <Layout>
                    <div className="text-white">Página de Motoristas (Em construção)</div>
                  </Layout>
                </PrivateRoute>
              } 
            />
            <Route 
              path="/estacionamento" 
              element={
                <PrivateRoute>
                  <Layout>
                    <div className="text-white">Página de Estacionamento (Em construção)</div>
                  </Layout>
                </PrivateRoute>
              } 
            />
            <Route 
              path="/relatorios" 
              element={
                <PrivateRoute>
                  <Layout>
                    <div className="text-white">Página de Relatórios (Em construção)</div>
                  </Layout>
                </PrivateRoute>
              } 
            />
            <Route 
              path="/configuracoes" 
              element={
                <PrivateRoute>
                  <Layout>
                    <div className="text-white">Página de Configurações (Em construção)</div>
                  </Layout>
                </PrivateRoute>
              } 
            />
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
