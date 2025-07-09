import { Router } from 'express';
import parkingSpaceController from '../controllers/parkingSpaceController';
import { auth } from '../middleware/auth';

const router = Router();

// Middleware de autenticação para todas as rotas
router.use(auth);

// Rotas para vagas de estacionamento
router.get('/my-spaces', parkingSpaceController.getMySpaces);
router.get('/my-status', parkingSpaceController.getMyStatus);

// Rotas para controle de veículos
router.get('/search-vehicles', parkingSpaceController.searchVehicles);
router.post('/:id/occupy', parkingSpaceController.occupySpace);
router.post('/:id/free', parkingSpaceController.freeSpace);

// Rota para atualizar status (método simplificado)
router.put('/:id/status', parkingSpaceController.updateSpaceStatus);

// Rotas para configuração das vagas
router.get('/configuration', parkingSpaceController.getConfiguration);
router.post('/configuration', parkingSpaceController.saveConfiguration);
router.post('/generate', parkingSpaceController.generateSpaces);

export default router; 