import winston from 'winston';
import { config } from 'dotenv';

// Carrega as variáveis de ambiente
config();

// Define os níveis de log
const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
};

// Define a cor para cada nível
const colors = {
  error: 'red',
  warn: 'yellow',
  info: 'green',
  http: 'magenta',
  debug: 'white',
};

// Adiciona as cores ao winston
winston.addColors(colors);

// Define o formato do log
const format = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
  winston.format.colorize({ all: true }),
  winston.format.printf(
    (info) => `${info.timestamp} ${info.level}: ${info.message}`,
  ),
);

// Define os transportes (onde os logs serão gravados)
const transports = [
  // Console para desenvolvimento
  new winston.transports.Console(),
  // Arquivo para logs de erro
  new winston.transports.File({
    filename: 'logs/error.log',
    level: 'error',
  }),
  // Arquivo para todos os logs
  new winston.transports.File({ filename: 'logs/all.log' }),
];

// Configura o logger
export const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  levels,
  format,
  transports,
}); 