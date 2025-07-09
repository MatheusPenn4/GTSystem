import Redis from 'ioredis';
import { logger } from '../utils/logger';
import { config } from 'dotenv';

// Carrega as variáveis de ambiente
config();

// Configuração do Redis
const redisConfig = {
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379'),
  password: process.env.REDIS_PASSWORD,
  db: parseInt(process.env.REDIS_DB || '0'),
  retryStrategy: (times: number) => {
    // Estratégia de reconexão
    const delay = Math.min(times * 100, 3000);
    return delay;
  },
  // Configurar timeout para conexão
  connectTimeout: 10000,
  // Modo de falha segura (não quebra a aplicação se Redis falhar)
  enableOfflineQueue: false,
  maxRetriesPerRequest: 3,
};

// Instância do Redis com tratamento de falha
let redisClient: Redis;

try {
  redisClient = new Redis(redisConfig);
  logger.info('Iniciando conexão com Redis...');
} catch (error) {
  logger.error(`Erro crítico ao iniciar conexão com Redis: ${error}`);
  // Criar um cliente fake para não quebrar a aplicação
  redisClient = createFakeRedisClient();
}

// Cliente fake do Redis para modo fallback
function createFakeRedisClient() {
  logger.warn('Usando cliente Redis em modo fake (fallback)');
  
  const cache = new Map<string, string>();
  
  const fakeMethods = {
    set: async (key: string, value: string, mode?: string, duration?: number) => 'OK',
    get: async (key: string) => null,
    del: async (key: string) => 1,
    expire: async (key: string, seconds: number) => 1,
    keys: async (pattern: string) => [],
    on: (event: string, callback: Function) => {},
  };

  return fakeMethods as unknown as Redis;
}

// Exporta o cliente Redis
export const redis = redisClient;

// Tratamento de eventos de conexão
redis.on('connect', () => {
  logger.info('Conectado ao Redis');
});

redis.on('error', (error) => {
  logger.error(`Erro na conexão com Redis: ${error.message}`);
});

redis.on('reconnecting', () => {
  logger.warn('Reconectando ao Redis...');
});

// Obtém um valor do cache
export const getCache = async <T>(key: string): Promise<T | null> => {
  try {
    const cachedData = await redis.get(key);
    if (!cachedData) return null;
    return JSON.parse(cachedData) as T;
  } catch (error) {
    logger.error(`Erro ao obter cache para chave ${key}:`, error);
    return null;
  }
};

// Define um valor no cache
export const setCache = async <T>(
  key: string,
  value: T,
  expireInSeconds = 3600 // 1 hora por padrão
): Promise<void> => {
  try {
    const stringValue = JSON.stringify(value);
    await redis.set(key, stringValue);
    
    // Define o tempo de expiração separadamente
    if (expireInSeconds > 0) {
      await redis.expire(key, expireInSeconds);
    }
  } catch (error) {
    logger.error(`Erro ao definir cache para chave ${key}:`, error);
  }
};

// Remove um valor do cache
export const deleteCache = async (key: string): Promise<void> => {
  try {
    await redis.del(key);
  } catch (error) {
    logger.error(`Erro ao excluir cache para chave ${key}:`, error);
  }
};

// Invalida todas as chaves que correspondem a um padrão
export const invalidatePattern = async (pattern: string): Promise<void> => {
  try {
    const keys = await redis.keys(pattern);
    if (keys.length > 0) {
      await redis.del(keys);
      logger.info(`Invalidado ${keys.length} chaves de cache com padrão: ${pattern}`);
    }
  } catch (error) {
    logger.error(`Erro ao invalidar padrão de cache ${pattern}:`, error);
  }
}; 