import { PrismaClient } from '@prisma/client';
import { logger } from '../utils/logger';

// Criação da instância do Prisma com logs em desenvolvimento
const prismaClientSingleton = () => {
  const prisma = new PrismaClient({
    log: process.env.NODE_ENV === 'development' 
      ? ['query', 'info', 'warn', 'error'] 
      : ['error'],
  });

  // Adicionar middleware para logs de performance
  prisma.$use(async (params, next) => {
    const startTime = Date.now();
    const result = await next(params);
    const executionTime = Date.now() - startTime;
    
    // Registrar consultas que levam mais de 100ms
    if (executionTime > 100) {
      logger.warn(`Consulta lenta: ${params.model}.${params.action} - ${executionTime}ms`);
    }
    
    return result;
  });

  return prisma;
};

// PrismaClient é anexado ao objeto global quando possível para evitar
// múltiplas instâncias durante desenvolvimento hot-reloading
const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

// Exportar a instância única do Prisma
export const prisma = globalForPrisma.prisma || prismaClientSingleton();

// Garantir que mantemos apenas uma instância em desenvolvimento
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

// Função para conectar ao banco de dados
export async function connectDB(): Promise<void> {
  try {
    await prisma.$connect();
    logger.info('Conectado ao banco de dados com sucesso');
  } catch (error) {
    logger.error('Erro ao conectar ao banco de dados:', error);
    throw error;
  }
}

// Função para desconectar do banco de dados
export async function disconnectDB(): Promise<void> {
  try {
    await prisma.$disconnect();
    logger.info('Desconectado do banco de dados com sucesso');
  } catch (error) {
    logger.error('Erro ao desconectar do banco de dados:', error);
    throw error;
  }
} 