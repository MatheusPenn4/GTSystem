import { Router, Request, Response, NextFunction } from 'express';
import vehicleController from '../controllers/vehicleController';
import { auth } from '../middleware/auth';
import { validateRequest } from '../middleware/validateRequest';
import { createVehicleSchema, updateVehicleSchema } from '../validators/vehicleValidator';

const router = Router();

// Middleware de autenticação para todas as rotas
router.use(auth);

// Middleware para debug - imprime o conteúdo do body antes da validação
const debugRequest = (req: Request, res: Response, next: NextFunction): void => {
  console.log('DEBUG - Recebido no veículos POST:');
  console.log('Body:', JSON.stringify(req.body, null, 2));
  console.log('Headers:', req.headers);
  next();
};

// Middleware para mapear campos do frontend para o backend
const mapFieldsMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  try {
    // Verificar se há dados no body
    if (!req.body || typeof req.body !== 'object') {
      res.status(400).json({
        status: 'error',
        message: 'Dados inválidos ou ausentes'
      });
      return;
    }
    
    // Mapear campos do frontend para o backend
    if (!req.body.licensePlate && req.body.placa) {
      console.log('Mapeando placa para licensePlate:', req.body.placa);
      req.body.licensePlate = req.body.placa.trim().toUpperCase().replace(/\s/g, '');
    }
    
    if (!req.body.vehicleType && req.body.tipo) {
      console.log('Mapeando tipo para vehicleType:', req.body.tipo);
      req.body.vehicleType = req.body.tipo;
    }
    
    if (!req.body.brand && req.body.marca) {
      console.log('Mapeando marca para brand:', req.body.marca);
      req.body.brand = req.body.marca;
    }
    
    if (!req.body.model && req.body.modelo) {
      console.log('Mapeando modelo para model:', req.body.modelo);
      req.body.model = req.body.modelo;
    }
    
    if (!req.body.year && req.body.ano) {
      console.log('Mapeando ano para year:', req.body.ano);
      req.body.year = Number(req.body.ano);
    }
    
    if (!req.body.color && req.body.cor) {
      console.log('Mapeando cor para color:', req.body.cor);
      req.body.color = req.body.cor;
    }
    
    if (!req.body.driverId && req.body.motoristaPrincipalId) {
      console.log('Mapeando motoristaPrincipalId para driverId:', req.body.motoristaPrincipalId);
      req.body.driverId = req.body.motoristaPrincipalId;
    }
    
    if (!req.body.isActive && req.body.status) {
      console.log('Mapeando status para isActive:', req.body.status);
      req.body.isActive = req.body.status === 'ativo' || req.body.status === true;
    }
    
    if (!req.body.companyId && req.body.empresaId) {
      console.log('Mapeando empresaId para companyId:', req.body.empresaId);
      req.body.companyId = req.body.empresaId;
    }
    
    console.log('Body após mapeamento de campos:', JSON.stringify(req.body, null, 2));
    next();
  } catch (error) {
    console.error('Erro no middleware de mapeamento de campos:', error);
    next(error);
  }
};

// Rotas para veículos
router.get('/', vehicleController.getAllVehicles);

// Rota para criar veículo com middleware de debug e mapeamento
router.post('/', debugRequest, mapFieldsMiddleware, validateRequest(createVehicleSchema), vehicleController.createVehicle);

router.get('/:id', vehicleController.getVehicleById);
router.put('/:id', validateRequest(updateVehicleSchema), vehicleController.updateVehicle);
router.delete('/:id', vehicleController.deleteVehicle);

export default router;
