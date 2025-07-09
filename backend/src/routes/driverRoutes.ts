import { Router } from 'express';
import driverController from '../controllers/driverController';
import { auth } from '../middleware/auth';
import { validateRequest } from '../middleware/validateRequest';
import { createDriverSchema, updateDriverSchema } from '../validators/driverValidator';

const router = Router();

// Middleware de autenticação para todas as rotas
router.use(auth);

// Rotas para motoristas
router.get('/', driverController.getAllDrivers);
router.post('/', validateRequest(createDriverSchema), driverController.createDriver);
router.get('/:id', driverController.getDriverById);
router.put('/:id', validateRequest(updateDriverSchema), driverController.updateDriver);
router.delete('/:id', driverController.deleteDriver);

export default router;
