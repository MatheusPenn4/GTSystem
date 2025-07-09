import { Router } from 'express';
import parkingLotController from '../controllers/parkingLotController';
import { auth } from '../middleware/auth';
import { validateRequest } from '../middleware/validateRequest';
import { createParkingLotSchema, updateParkingLotSchema, createParkingSpaceSchema, updateParkingSpaceSchema } from '../validators/parkingLotValidator';

const router = Router();

// Middleware de autenticação para todas as rotas
router.use(auth);

// Rotas para estacionamentos
router.get('/', parkingLotController.getAllParkingLots);
router.post('/', validateRequest(createParkingLotSchema), parkingLotController.createParkingLot);
router.get('/:id', parkingLotController.getParkingLotById);
router.put('/:id', validateRequest(updateParkingLotSchema), parkingLotController.updateParkingLot);
router.delete('/:id', parkingLotController.deleteParkingLot);

// Rotas para vagas de estacionamento
router.get('/:id/vagas', parkingLotController.getParkingSpaces);
router.post('/:id/vagas', validateRequest(createParkingSpaceSchema), parkingLotController.createParkingSpace);
router.put('/:id/vagas/:spaceId', validateRequest(updateParkingSpaceSchema), parkingLotController.updateParkingSpace);
router.delete('/:id/vagas/:spaceId', parkingLotController.deleteParkingSpace);

export default router;
