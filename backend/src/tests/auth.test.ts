import { Request, Response } from 'express';
import { UserRole } from '@prisma/client';

// Importação dos tipos Jest
import '@jest/globals';
import { jest, describe, it, expect, beforeEach } from '@jest/globals';

// Definir tipo estendido do Request
interface AuthenticatedRequest extends Request {
  user: {
    id: string;
    email: string;
    role: any; // Simplificado para evitar problemas com enum mockado
    companyId?: string;
  };
}

// Mock do console.log para evitar logs durante os testes
console.log = jest.fn();
console.error = jest.fn();

// Mock do PrismaClient
const mockUser = {
  findUnique: jest.fn(),
  update: jest.fn(),
};

jest.mock('@prisma/client', () => ({
  PrismaClient: jest.fn().mockImplementation(() => ({
    user: mockUser,
  })),
}));

// Mock do redis
jest.mock('../config/redis', () => ({
  redis: {
    get: jest.fn(),
    set: jest.fn(),
    del: jest.fn(),
  },
}));

// Mock do logger
jest.mock('../utils/logger', () => ({
  logger: {
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
  },
}));

// Import do controller após os mocks
import authController from '../controllers/authController';

describe('AuthController', () => {
  let mockRequest: Partial<AuthenticatedRequest>;
  let mockResponse: Partial<Response>;
  let mockNext: jest.MockedFunction<any>;

  beforeEach(() => {
    jest.clearAllMocks();
    
    mockRequest = {
      body: {},
      user: { 
        id: 'test-user-id',
        email: 'test@example.com',
        role: 'ADMIN'
      },
    };
    
    mockResponse = {
      status: jest.fn().mockReturnThis() as any,
      json: jest.fn().mockReturnThis() as any,
    };
    
    mockNext = jest.fn();
  });

  describe('me endpoint', () => {
    it('should return user data when user exists', async () => {
      // Arrange
      const mockUserData = {
        id: 'test-user-id',
        name: 'Test User',
        email: 'test@example.com',
        passwordHash: 'hash123',
        role: 'ADMIN' as const,
        avatarUrl: null,
        companyId: null,
        isActive: true,
        emailVerified: true,
        createdAt: new Date(),
        updatedAt: new Date(),
        company: null,
      };
      
      (mockUser.findUnique as jest.MockedFunction<any>).mockResolvedValue(mockUserData);

      // Act
      await authController.me(mockRequest as AuthenticatedRequest, mockResponse as Response, mockNext);

      // Assert
      expect(mockUser.findUnique).toHaveBeenCalledWith({
        where: { id: 'test-user-id', isActive: true },
        include: {
          company: {
            select: {
              id: true,
              name: true,
              companyType: true,
            },
          },
        },
      });
      
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        id: 'test-user-id',
        name: 'Test User',
        email: 'test@example.com',
        role: 'admin', // lowercase como esperado
        avatar: null,
        companyId: null,
        companyName: undefined,
      });
    });
  });

  describe('logout endpoint', () => {
    it('should successfully logout user', async () => {
      // Arrange
      const { redis } = require('../config/redis');
      redis.del.mockResolvedValue(1);

      // Act
      await authController.logout(mockRequest as AuthenticatedRequest, mockResponse as Response, mockNext);

      // Assert
      expect(redis.del).toHaveBeenCalledWith('refresh_token:test-user-id');
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({ 
        message: 'Logout realizado com sucesso' 
      });
    });
  });
}); 