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
    // Log detalhado da requisição
    console.log(`>>> REQUEST URL: ${config.method?.toUpperCase()} ${config.url}`);
    if (config.data) {
      console.log('>>> REQUEST DATA:', JSON.stringify(config.data, null, 2));
    }
    console.log('>>> REQUEST HEADERS:', config.headers);
    
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
    
    // Log da resposta
    console.log(`<<< RESPONSE STATUS: ${response.status}`);
    console.log('<<< RESPONSE DATA:', response.data);
    
    return response;
  },
  (error) => {
    console.error('Erro na requisição API:', error.message, error.code);
    
    // Log detalhado do erro
    if (error.response) {
      console.log(`<<< ERROR STATUS: ${error.response.status}`);
      console.log('<<< ERROR DATA:', error.response.data);
      console.log('<<< ERROR HEADERS:', error.response.headers);
      
      // Log dos dados enviados na requisição que falhou
      if (error.config && error.config.data) {
        console.log('<<< ERROR REQUEST DATA:', error.config.data);
      }
    } else {
      console.log('<<< NO RESPONSE FROM SERVER');
    }
    
    // Verificar se o erro está relacionado com problemas de conexão ou servidor
    // Só ativar modo offline em casos realmente críticos
    if (!error.response && (error.code === 'ECONNABORTED' || error.message.includes('timeout') || error.message.includes('Network Error'))) {
      const timeSinceLastSuccess = Date.now() - lastSuccessfulRequest;
      
      // Só ativar modo offline se passou muito tempo desde a última requisição bem-sucedida
      if (timeSinceLastSuccess > 30000) { // 30 segundos
        console.warn('Erro de conexão persistente com o backend, ativando modo offline:', error.message);
        isOfflineMode = true;
      } else {
        console.warn('Erro de conexão temporário, mantendo modo online:', error.message);
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
    
    // Adicionar informações mais específicas sobre o erro
    if (error.response && error.response.data) {
      console.error('Resposta de erro do servidor:', error.response.data);
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
    console.error('Backend não está respondendo:', error);
    return false;
  }
};

// Função para forçar o modo online
export const forceOnlineMode = (): void => {
  isOfflineMode = false;
  lastSuccessfulRequest = Date.now();
  console.log('Modo online forçado');
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
    console.error('Erro ao testar conectividade:', error);
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
