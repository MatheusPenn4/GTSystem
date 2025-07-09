/**
 * Classe para representar erros da API
 */
export class ApiError extends Error {
  statusCode: number;
  isOperational: boolean;
  errors?: string[];
  
  /**
   * Construtor
   * @param statusCode Código HTTP do erro
   * @param message Mensagem de erro
   * @param isOperational Se é um erro operacional (esperado)
   * @param errors Lista de erros específicos
   */
  constructor(
    statusCode: number,
    message: string,
    isOperational = true,
    errors?: string[]
  ) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.errors = errors;
    
    // Necessário para fazer instanceof funcionar em classes que estendem tipos nativos
    Object.setPrototypeOf(this, ApiError.prototype);
    
    // Capturar stack trace
    Error.captureStackTrace(this, this.constructor);
    
    // Define o nome para correspondência com o nome da classe
    this.name = this.constructor.name;
  }

  /**
   * Cria um erro de recurso não encontrado (404)
   */
  static notFound(message = 'Recurso não encontrado'): ApiError {
    return new ApiError(404, message, true);
  }
  
  /**
   * Cria um erro de requisição inválida (400)
   */
  static badRequest(message = 'Requisição inválida', errors?: string[]): ApiError {
    return new ApiError(400, message, true, errors);
  }

  /**
   * Cria um erro de não autorizado (401)
   */
  static unauthorized(message = 'Não autorizado'): ApiError {
    return new ApiError(401, message, true);
  }

  /**
   * Cria um erro de acesso proibido (403)
   */
  static forbidden(message = 'Acesso negado'): ApiError {
    return new ApiError(403, message, true);
  }

  /**
   * Cria um erro de validação (422)
   */
  static validation(message = 'Erro de validação', errors?: string[]): ApiError {
    return new ApiError(422, message, true, errors);
  }

  /**
   * Cria um erro de conflito (409)
   */
  static conflict(message = 'Conflito de recurso'): ApiError {
    return new ApiError(409, message, true);
  }

  /**
   * Cria um erro de serviço indisponível (503)
   */
  static serviceUnavailable(message = 'Serviço indisponível'): ApiError {
    return new ApiError(503, message, true);
  }
} 