
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './contexts/AuthContext';
import { Toaster } from './components/ui/toaster';
import PrivateRoute from './components/PrivateRoute';
import Layout from './components/Layout';
import Index from './pages/Index';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Empresas from './pages/Empresas';
import Veiculos from './pages/Veiculos';
import Motoristas from './pages/Motoristas';
import EstacionamentosList from './pages/EstacionamentosList';
import Estacionamento from './pages/Estacionamento';
import ReservaVagas from './pages/ReservaVagas';
import Relatorios from './pages/Relatorios';
import Configuracoes from './pages/Configuracoes';
import NotFound from './pages/NotFound';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <div className="min-h-screen bg-ajh-dark">
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              
              {/* Private routes */}
              <Route path="/dashboard" element={
                <PrivateRoute>
                  <Layout>
                    <Dashboard />
                  </Layout>
                </PrivateRoute>
              } />
              
              <Route path="/empresas" element={
                <PrivateRoute>
                  <Layout>
                    <Empresas />
                  </Layout>
                </PrivateRoute>
              } />
              
              <Route path="/veiculos" element={
                <PrivateRoute>
                  <Layout>
                    <Veiculos />
                  </Layout>
                </PrivateRoute>
              } />
              
              <Route path="/motoristas" element={
                <PrivateRoute>
                  <Layout>
                    <Motoristas />
                  </Layout>
                </PrivateRoute>
              } />
              
              <Route path="/estacionamentos" element={
                <PrivateRoute>
                  <Layout>
                    <EstacionamentosList />
                  </Layout>
                </PrivateRoute>
              } />
              
              <Route path="/estacionamento/:id?" element={
                <PrivateRoute>
                  <Layout>
                    <Estacionamento />
                  </Layout>
                </PrivateRoute>
              } />
              
              <Route path="/reserva-vagas" element={
                <PrivateRoute>
                  <Layout>
                    <ReservaVagas />
                  </Layout>
                </PrivateRoute>
              } />
              
              <Route path="/relatorios" element={
                <PrivateRoute>
                  <Layout>
                    <Relatorios />
                  </Layout>
                </PrivateRoute>
              } />
              
              <Route path="/configuracoes" element={
                <PrivateRoute>
                  <Layout>
                    <Configuracoes />
                  </Layout>
                </PrivateRoute>
              } />
              
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
          <Toaster />
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
