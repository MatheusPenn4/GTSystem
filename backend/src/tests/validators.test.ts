import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';

// Importação dos tipos Jest
import '@jest/globals';
import { jest, describe, it, expect, beforeEach } from '@jest/globals';

// Mock do logger
jest.mock('../utils/logger', () => ({
  logger: {
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
  },
}));

// Import do middleware e schemas após os mocks
import { validateRequest } from '../middleware/validateRequest';
import { authValidators } from '../validators/authValidator';
import { userValidators } from '../validators/userValidator';

describe('Validators', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNext: jest.MockedFunction<any>;

  beforeEach(() => {
    jest.clearAllMocks();
    // Mock do console.log para evitar logs durante os testes
    console.log = jest.fn();
    console.error = jest.fn();
    
    mockRequest = {
      body: {},
      query: {},
      params: {},
      headers: {},
    };
    
    mockResponse = {
      status: jest.fn().mockReturnThis() as any,
      json: jest.fn().mockReturnThis() as any,
    };
    
    mockNext = jest.fn();
  });

  describe('authValidators', () => {
    describe('login', () => {
      it('should pass validation with valid email and password', async () => {
        // Arrange
        mockRequest.body = {
          email: 'test@example.com',
          password: 'password123'
        };

        const validationMiddleware = validateRequest(authValidators.login);

        // Act
        await validationMiddleware(mockRequest as Request, mockResponse as Response, mockNext);

        // Assert
        expect(mockNext).toHaveBeenCalledWith();
        expect(mockResponse.status).not.toHaveBeenCalled();
      });

      it('should fail validation with invalid email', async () => {
        // Arrange
        mockRequest.body = {
          email: '', // Email vazio para garantir que falhe
          password: 'password123'
        };

        const validationMiddleware = validateRequest(authValidators.login);

        // Act
        await validationMiddleware(mockRequest as Request, mockResponse as Response, mockNext);

        // Assert
        expect(mockNext).not.toHaveBeenCalled();
        expect(mockResponse.status).toHaveBeenCalledWith(400);
        expect(mockResponse.json).toHaveBeenCalledWith(
          expect.objectContaining({
            status: 'error',
            message: 'Dados de entrada inválidos',
            errors: expect.any(Array)
          })
        );
      });

      it('should fail validation with missing password', async () => {
        // Arrange
        mockRequest.body = {
          email: 'test@example.com'
        };

        const validationMiddleware = validateRequest(authValidators.login);

        // Act
        await validationMiddleware(mockRequest as Request, mockResponse as Response, mockNext);

        // Assert
        expect(mockNext).not.toHaveBeenCalled();
        expect(mockResponse.status).toHaveBeenCalledWith(400);
        expect(mockResponse.json).toHaveBeenCalledWith(
          expect.objectContaining({
            status: 'error',
            message: 'Dados de entrada inválidos',
            errors: expect.any(Array)
          })
        );
      });

      it('should fail validation with empty body', async () => {
        // Arrange
        mockRequest.body = {};

        const validationMiddleware = validateRequest(authValidators.login);

        // Act
        await validationMiddleware(mockRequest as Request, mockResponse as Response, mockNext);

        // Assert
        expect(mockNext).not.toHaveBeenCalled();
        expect(mockResponse.status).toHaveBeenCalledWith(400);
        expect(mockResponse.json).toHaveBeenCalledWith(
          expect.objectContaining({
            status: 'error',
            message: 'Dados de entrada vazios ou inválidos'
          })
        );
      });
    });
  });

  describe('userValidators', () => {
    describe('createUser', () => {
      it('should pass validation with valid user data', async () => {
        // Arrange
        mockRequest.body = {
          name: 'Test User',
          email: 'test@example.com',
          password: 'password123',
          role: 'admin',
          companyId: '123e4567-e89b-12d3-a456-426614174000'
        };

        const validationMiddleware = validateRequest(userValidators.createUser);

        // Act
        await validationMiddleware(mockRequest as Request, mockResponse as Response, mockNext);

        // Assert
        expect(mockNext).toHaveBeenCalledWith();
        expect(mockResponse.status).not.toHaveBeenCalled();
      });

      it('should fail validation with missing required fields', async () => {
        // Arrange
        mockRequest.body = {
          name: 'Test User'
          // Missing email, password, role
        };

        const validationMiddleware = validateRequest(userValidators.createUser);

        // Act
        await validationMiddleware(mockRequest as Request, mockResponse as Response, mockNext);

        // Assert
        expect(mockNext).not.toHaveBeenCalled();
        expect(mockResponse.status).toHaveBeenCalledWith(400);
        expect(mockResponse.json).toHaveBeenCalledWith(
          expect.objectContaining({
            status: 'error',
            message: 'Dados de entrada inválidos',
            errors: expect.any(Array)
          })
        );
      });
    });

    describe('updateUser', () => {
      it('should pass validation with valid update data', async () => {
        // Arrange
        mockRequest.body = {
          name: 'Updated User',
          email: 'updated@example.com'
        };

        const validationMiddleware = validateRequest(userValidators.updateUser);

        // Act
        await validationMiddleware(mockRequest as Request, mockResponse as Response, mockNext);

        // Assert
        expect(mockNext).toHaveBeenCalledWith();
        expect(mockResponse.status).not.toHaveBeenCalled();
      });
    });
  });
}); 