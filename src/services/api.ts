import axios from 'axios';

// Variável para controlar se estamos em modo offline
let isOfflineMode = false;
let lastSuccessfulRequest = Date.now();

// Configuração da API - Usar a mesma URL do frontend para serverless functions
const API_URL = import.meta.env.VITE_API_URL || '/api';

// Criando uma instância do Axios com configurações padrão
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  // Aumentar tempo limite para requisições
  timeout: 15000,
});

// Interceptor para adicionar o token de autenticação a todas as requisições
api.interceptors.request.use(
  (config) => {
    // Log apenas em desenvolvimento
    if (import.meta.env.DEV) {
      console.log(`>>> REQUEST: ${config.method?.toUpperCase()} ${config.url}`);
    }
    
    const token = localStorage.getItem('ajh_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para tratar respostas
api.interceptors.response.use(
  (response) => {
    // Resetar o modo offline se uma requisição for bem-sucedida
    isOfflineMode = false;
    lastSuccessfulRequest = Date.now();
    
    // Log apenas em desenvolvimento
    if (import.meta.env.DEV) {
      console.log(`<<< RESPONSE: ${response.status}`);
    }
    
    return response;
  },
  (error) => {
    // Log de erro apenas em desenvolvimento
    if (import.meta.env.DEV) {
      console.error('Erro na requisição API:', error.message);
    }
    
    // Verificar se o erro está relacionado com problemas de conexão ou servidor
    if (!error.response && (error.code === 'ECONNABORTED' || error.message.includes('timeout') || error.message.includes('Network Error'))) {
      const timeSinceLastSuccess = Date.now() - lastSuccessfulRequest;
      
      // Só ativar modo offline se passou muito tempo desde a última requisição bem-sucedida
      if (timeSinceLastSuccess > 30000) { // 30 segundos
        if (import.meta.env.DEV) {
          console.warn('Erro de conexão persistente, ativando modo offline');
        }
        isOfflineMode = true;
      }
    }

    // Tratar erros de autenticação
    if (error.response && error.response.status === 401) {
      // Redirecionar para a página de login em caso de erro de autenticação
      localStorage.removeItem('ajh_token');
      localStorage.removeItem('ajh_user_type');
      localStorage.removeItem('ajh_refresh_token');
      
      // Redirecionar apenas se não estiver na página de login
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    
    return Promise.reject(error);
  }
);

// Função para verificar se o backend está online
export const checkBackendStatus = async (): Promise<boolean> => {
  try {
    const response = await api.get('/health');
    return response.status === 200;
  } catch (error) {
    if (import.meta.env.DEV) {
      console.error('Backend não está respondendo:', error);
    }
    return false;
  }
};

// Função para forçar o modo online
export const forceOnlineMode = (): void => {
  isOfflineMode = false;
  lastSuccessfulRequest = Date.now();
  if (import.meta.env.DEV) {
    console.log('Modo online forçado');
  }
};

// Função para testar conectividade e recuperar se necessário
export const testConnectivityAndRecover = async (): Promise<boolean> => {
  try {
    const isOnline = await checkBackendStatus();
    if (isOnline) {
      forceOnlineMode();
      return true;
    }
    return false;
  } catch (error) {
    if (import.meta.env.DEV) {
      console.error('Erro ao testar conectividade:', error);
    }
    return false;
  }
};

// Função para definir o modo offline
export const setOfflineMode = (offline: boolean): void => {
  isOfflineMode = offline;
  if (!offline) {
    lastSuccessfulRequest = Date.now();
  }
};

// Função para verificar se está em modo offline
export const isInOfflineMode = (): boolean => {
  return isOfflineMode;
};

export default api;
