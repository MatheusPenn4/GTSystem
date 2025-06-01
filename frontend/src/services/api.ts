import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const endpoints = {
  // Autenticação - corrigir baseado no debug
  auth: {
    login: '/api/auth/login/', // 405 indica que existe mas método errado
    logout: '/api/auth/logout/',
    refresh: '/api/auth/refresh/',
    register: '/api/auth/register/',
    profile: '/api/auth/profile/',
    changePassword: '/api/auth/change-password/',
  },
  // Company endpoints
  company: {
    list: '/api/company/companies/',
    create: '/api/company/companies/',
    detail: (id: string) => `/api/company/companies/${id}/`,
    update: (id: string) => `/api/company/companies/${id}/`,
    delete: (id: string) => `/api/company/companies/${id}/`,
    branches: '/api/company/branches/',
    vehicles: '/api/company/vehicles/',
    drivers: '/api/company/drivers/',
  },
  // Parking endpoints
  parking: {
    lots: '/api/parking/lots/',
    spots: '/api/parking/spots/',
    records: '/api/parking/records/',
    vehicleEntry: '/api/parking/vehicle-entry/',
    vehicleExit: '/api/parking/vehicle-exit/',
    availableSpots: '/api/parking/available-spots/',
  },
  // User management
  users: {
    list: '/api/users/',
    create: '/api/users/',
    detail: (id: string) => `/api/users/${id}/`,
    update: (id: string) => `/api/users/${id}/`,
    delete: (id: string) => `/api/users/${id}/`,
  },
  // Settings
  settings: {
    get: '/api/settings/',
    update: '/api/settings/',
  },
};

// Helper para debug de endpoints - versão melhorada
export const debugEndpoints = async () => {
  console.log('=== DEBUG DE ENDPOINTS ===');
  console.log('Base URL:', api.defaults.baseURL);

  const testEndpoints = [
    // Endpoints de autenticação mais comuns
    { url: '/auth/', method: 'GET' },
    { url: '/api/auth/', method: 'GET' },
    { url: '/auth/login/', method: 'GET' },
    { url: '/api/auth/login/', method: 'GET' },
    { url: '/login/', method: 'GET' },
    { url: '/api/login/', method: 'GET' },
    // Testar endpoints DRF comuns
    { url: '/api/token/', method: 'GET' },
    { url: '/api/auth/token/', method: 'GET' },
    { url: '/api-auth/login/', method: 'GET' },
    { url: '/rest-auth/login/', method: 'GET' },
    { url: '/dj-rest-auth/login/', method: 'GET' },
    { url: '/api/v1/auth/login/', method: 'GET' },
  ];

  for (const endpoint of testEndpoints) {
    try {
      const response = await fetch(`${api.defaults.baseURL}${endpoint.url}`, {
        method: endpoint.method,
      });
      console.log(`${endpoint.method} ${endpoint.url}: ${response.status} ${response.statusText}`);

      if (response.status === 405) {
        console.log(`  ✅ Endpoint exists! Try POST for: ${endpoint.url}`);
      } else if (response.status === 200 || response.status === 401) {
        console.log(`  ✅ Endpoint accessible: ${endpoint.url}`);
      }
    } catch (error) {
      console.log(`${endpoint.method} ${endpoint.url}: ERRO - ${error}`);
    }
  }
  console.log('=== FIM DEBUG ===');
};

// Detectar automaticamente o endpoint correto
export const detectAuthEndpoint = async () => {
  const possibleEndpoints = [
    '/api/auth/login/',
    '/api/token/',
    '/api/auth/token/',
    '/auth/login/',
    '/login/',
    '/rest-auth/login/',
    '/dj-rest-auth/login/',
    '/api/v1/auth/login/',
  ];

  for (const endpoint of possibleEndpoints) {
    try {
      const response = await fetch(`${api.defaults.baseURL}${endpoint}`, {
        method: 'OPTIONS', // Verificar métodos permitidos
      });

      if (response.status === 200 || response.status === 405) {
        const allowedMethods = response.headers.get('Allow') || '';
        if (allowedMethods.includes('POST')) {
          console.log(`✅ Endpoint de login detectado: ${endpoint}`);
          return endpoint;
        }
      }
    } catch (error) {
      // Continue tentando
    }
  }

  console.log('❌ Nenhum endpoint de login válido encontrado');
  return null;
};

// Interceptador para renovação automática de token
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const refreshToken = localStorage.getItem('refresh_token');
      if (refreshToken) {
        try {
          const response = await api.post(endpoints.auth.refresh, {
            refresh: refreshToken,
          });

          const { access } = response.data;
          localStorage.setItem('access_token', access);
          api.defaults.headers.common['Authorization'] = `Bearer ${access}`;

          return api(originalRequest);
        } catch (refreshError) {
          console.error('Erro ao renovar token:', refreshError);
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
          delete api.defaults.headers.common['Authorization'];
          window.location.href = '/login';
        }
      }
    }

    return Promise.reject(error);
  }
);

export default api;
