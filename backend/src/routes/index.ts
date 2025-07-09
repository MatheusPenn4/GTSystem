import { Router } from 'express';
import authRoutes from './authRoutes';
import userRoutes from './userRoutes';
import companyRoutes from './companyRoutes';
import parkingLotRoutes from './parkingLotRoutes';
import parkingSpaceRoutes from './parkingSpaceRoutes';
import vehicleRoutes from './vehicleRoutes';
import driverRoutes from './driverRoutes';
import reservationRoutes from './reservationRoutes';
import dashboardRoutes from './dashboardRoutes';
import financialRoutes from './financialRoutes';
import reportsRoutes from './reportsRoutes';

const router = Router();

// Rotas de autenticação
router.use('/auth', authRoutes);

// Rotas de usuários
router.use('/users', userRoutes);

// Rotas de empresas
router.use('/empresas', companyRoutes);

// Rotas de estacionamentos
router.use('/estacionamentos', parkingLotRoutes);

// Rotas de vagas de estacionamento
router.use('/parking-spaces', parkingSpaceRoutes);

// Rotas de veículos
router.use('/veiculos', vehicleRoutes);

// Rotas de motoristas
router.use('/motoristas', driverRoutes);

// Rotas de reservas
router.use('/reservas', reservationRoutes);

// Rotas de dashboard
router.use('/dashboard', dashboardRoutes);

// Rotas financeiras
router.use('/financial', financialRoutes);

// Rotas de relatórios
router.use('/reports', reportsRoutes);

// Rota para checar o status da API
router.get('/health', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'API is running',
    timestamp: new Date().toISOString(),
  });
});

// Exportar router
export default router; 