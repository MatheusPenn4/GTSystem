import { Router } from 'express';
import reservationController from '../controllers/reservationController';
import { auth } from '../middleware/auth';

const router = Router();

// Middleware de autenticação para todas as rotas
router.use(auth);

// Rotas gerais de reservas
router.get('/', reservationController.getAllReservations);
router.post('/', reservationController.createReservation);
router.get('/:id', reservationController.getReservationById);
router.put('/:id', reservationController.updateReservation);
router.delete('/:id', reservationController.cancelReservation);

// Rotas específicas que o frontend espera
router.get('/my-reservations', reservationController.getCompanyReservations);
router.get('/received', reservationController.getParkingLotReservations);

// Rotas específicas para transportadoras e estacionamentos (manter compatibilidade)
router.get('/minhas/transportadora', reservationController.getCompanyReservations);
router.get('/minhas/estacionamento', reservationController.getParkingLotReservations);

export default router;
