import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import { config } from 'dotenv';
import { logger } from './utils/logger';
import { errorHandler } from './middleware/errorHandler';
import routes from './routes';
import swaggerDocs from './config/swagger';

// Carregar variáveis de ambiente
config();

const app = express();
const PORT = process.env.PORT || 3002;

// Middleware básicos
app.use(cors());
app.use(helmet());
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging
app.use(morgan('combined', {
  stream: {
    write: (message: string) => logger.info(message.trim()),
  },
}));

// Prefixo da API
const API_PREFIX = '/api';

// Rotas da API
app.use(API_PREFIX, routes);

// Documentação Swagger
swaggerDocs(app);

// Rota para verificar o status da API
app.get('/', (req: Request, res: Response) => {
  res.json({
    status: 'success',
    message: 'GT System API',
    version: process.env.npm_package_version || '1.0.0',
  });
});

// Middleware de tratamento de erros
app.use(errorHandler);

// Tratamento para rotas não encontradas
app.use((req: Request, res: Response) => {
  res.status(404).json({
    status: 'error',
    message: 'Rota não encontrada',
  });
});

// Iniciar o servidor
app.listen(PORT, () => {
  logger.info(`Servidor rodando na porta ${PORT}`);
  logger.info(`Documentação disponível em http://localhost:${PORT}/api-docs`);
}); 