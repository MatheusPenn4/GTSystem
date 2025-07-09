import { PrismaClient } from '@prisma/client';
import { mockDeep, DeepMockProxy } from 'jest-mock-extended';

// Declaração do mock global do Prisma
export const prismaMock = mockDeep<PrismaClient>();

// Mock do Prisma Client
jest.mock('../config/prisma', () => ({
  prisma: prismaMock,
  connectDB: jest.fn(),
  disconnectDB: jest.fn(),
}));

// Mock do Redis
const redisMock = {
  connect: jest.fn(),
  disconnect: jest.fn(),
  get: jest.fn(),
  set: jest.fn(),
  del: jest.fn(),
  keys: jest.fn(),
  on: jest.fn(),
};

jest.mock('../config/redis', () => ({
  redis: redisMock,
  connectRedis: jest.fn(),
  getCache: jest.fn(),
  setCache: jest.fn(),
  deleteCache: jest.fn(),
  invalidatePattern: jest.fn(),
}));

// Mock do nodemailer
jest.mock('nodemailer', () => ({
  createTransport: jest.fn().mockReturnValue({
    sendMail: jest.fn().mockResolvedValue(true),
  }),
}));

// Configuração de variáveis de ambiente para testes
process.env.JWT_SECRET = 'test-jwt-secret';
process.env.JWT_REFRESH_SECRET = 'test-jwt-refresh-secret';
process.env.JWT_EXPIRE = '15m';
process.env.JWT_REFRESH_EXPIRE = '7d';
process.env.NODE_ENV = 'test';
process.env.DATABASE_URL = 'postgresql://test:test@localhost:5432/test';

// Limpar todos os mocks antes de cada teste
beforeEach(() => {
  jest.clearAllMocks();
  
  // Resetar o mock do Prisma usando a instância mockDeep
  jest.clearAllMocks();
  
  // Resetar todos os mocks do Redis
  Object.values(redisMock).forEach((method) => {
    if (jest.isMockFunction(method)) {
      method.mockReset();
    }
  });
}); 