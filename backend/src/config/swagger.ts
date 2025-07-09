import { Express } from 'express';
import swaggerJsDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { config } from 'dotenv';

// Carrega as variáveis de ambiente
config();

// Opções para o Swagger
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'GTSystem API',
      version: '1.0.0',
      description: 'API para o Sistema de Gerenciamento de Estacionamentos GTSystem',
      contact: {
        name: 'Suporte GTSystem',
        email: 'suporte@gtsystem.com',
      },
    },
    servers: [
      {
        url: process.env.API_URL || 'http://localhost:3000/api',
        description: 'Servidor de desenvolvimento',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ['./src/routes/*.ts', './src/models/*.ts'],
};

// Configura o Swagger
const swaggerSpec = swaggerJsDoc(swaggerOptions);

/**
 * Configura o Swagger na aplicação Express
 * @param app Instância do Express
 */
const swaggerDocs = (app: Express) => {
  // Rota para a documentação UI
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

  // Rota para o JSON da documentação
  app.get('/api-docs.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
  });
};

export default swaggerDocs; 