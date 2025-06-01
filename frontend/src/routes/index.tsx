import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from '../pages/auth/Login';
import MainLayout from '../components/layout/MainLayout';
import ThemeProvider from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';

// Lazy loading para as páginas
const Dashboard = React.lazy(() => import('../pages/Dashboard'));
const Branches = React.lazy(() => import('../pages/Branches'));
const Vehicles = React.lazy(() => import('../pages/Vehicles'));
const VehicleForm = React.lazy(() => import('../pages/VehicleForm'));
const Drivers = React.lazy(() => import('../pages/Drivers'));
const DriverForm = React.lazy(() => import('../pages/DriverForm'));
const Settings = React.lazy(() => import('../pages/Settings'));

// Novas páginas conforme o plano
const Transportadoras = React.lazy(() => import('../pages/Transportadoras'));
const Estacionamentos = React.lazy(() => import('../pages/Estacionamentos'));
const ParkingForm = React.lazy(() => import('../pages/ParkingForm'));
const Reservas = React.lazy(() => import('../pages/Reservas'));

// Componente de carregamento
const Loading = () => (
  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
    Carregando...
  </div>
);

// Componente de rota protegida
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <Loading />;
  if (!user) return <Navigate to="/login" replace />;
  return <MainLayout>{children}</MainLayout>;
};

// Componente de rota pública
const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <Loading />;
  if (user) return <Navigate to="/dashboard" replace />;
  return <>{children}</>;
};

const AppRoutes: React.FC = () => {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <React.Suspense fallback={<Loading />}>
          <Routes>
            {/* Rotas públicas */}
            <Route
              path="/login"
              element={
                <PublicRoute>
                  <Login />
                </PublicRoute>
              }
            />

            {/* Rotas protegidas */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            {/* Novas rotas conforme o plano */}
            <Route
              path="/transportadoras"
              element={
                <ProtectedRoute>
                  <Transportadoras />
                </ProtectedRoute>
              }
            />
            <Route
              path="/estacionamentos"
              element={
                <ProtectedRoute>
                  <Estacionamentos />
                </ProtectedRoute>
              }
            />
            <Route
              path="/estacionamentos/new"
              element={
                <ProtectedRoute>
                  <ParkingForm />
                </ProtectedRoute>
              }
            />
            <Route
              path="/estacionamentos/edit/:id"
              element={
                <ProtectedRoute>
                  <ParkingForm />
                </ProtectedRoute>
              }
            />
            <Route
              path="/reservas"
              element={
                <ProtectedRoute>
                  <Reservas />
                </ProtectedRoute>
              }
            />
            {/* Rotas antigas que ainda serão usadas */}
            <Route
              path="/branches"
              element={
                <ProtectedRoute>
                  <Branches />
                </ProtectedRoute>
              }
            />
            <Route
              path="/vehicles"
              element={
                <ProtectedRoute>
                  <Vehicles />
                </ProtectedRoute>
              }
            />
            <Route
              path="/vehicles/new"
              element={
                <ProtectedRoute>
                  <VehicleForm />
                </ProtectedRoute>
              }
            />
            <Route
              path="/vehicles/edit/:id"
              element={
                <ProtectedRoute>
                  <VehicleForm />
                </ProtectedRoute>
              }
            />
            <Route
              path="/drivers"
              element={
                <ProtectedRoute>
                  <Drivers />
                </ProtectedRoute>
              }
            />
            <Route
              path="/drivers/new"
              element={
                <ProtectedRoute>
                  <DriverForm />
                </ProtectedRoute>
              }
            />
            <Route
              path="/drivers/edit/:id"
              element={
                <ProtectedRoute>
                  <DriverForm />
                </ProtectedRoute>
              }
            />
            <Route
              path="/settings"
              element={
                <ProtectedRoute>
                  <Settings />
                </ProtectedRoute>
              }
            />

            {/* Redirecionamento padrão */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </React.Suspense>
      </ThemeProvider>
    </BrowserRouter>
  );
};

export default AppRoutes;
