import { UserRole } from '@prisma/client';

// Extensão para o Express Request
declare namespace Express {
  export interface Request {
    user?: {
      id: string;
      email: string;
      role: UserRole;
      companyId?: string;
    };
  }
}

// Interface para respostas da API
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: string[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Interface para parâmetros de paginação
export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

// Interface para filtros de pesquisa
export interface SearchFilters {
  [key: string]: string | number | boolean | Date | undefined;
}

// Extensão para o Error em TypeScript
interface Error {
  statusCode?: number;
  errors?: string[];
} 