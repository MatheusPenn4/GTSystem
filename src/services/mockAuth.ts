// Serviço de autenticação mockado - funciona 100% no frontend
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'transportadora' | 'estacionamento';
  avatar?: string;
  companyId?: string;
  companyName?: string;
}

export interface LoginResponse {
  user: User;
  token: string;
  refreshToken: string;
}

// Usuários mockados
const mockUsers: Record<string, User & { password: string }> = {
  'admin@gtsystem.com': {
    id: 'admin-123',
    name: 'Administrador',
    email: 'admin@gtsystem.com',
    password: 'admin123',
    role: 'admin',
    avatar: null,
    companyId: null,
    companyName: null
  },
  'usuario@transportadoramodelo.com.br': {
    id: 'transp-123',
    name: 'Transportadora Modelo',
    email: 'usuario@transportadoramodelo.com.br',
    password: 'trans123',
    role: 'transportadora',
    avatar: null,
    companyId: 'comp-transp-123',
    companyName: 'Transportadora Modelo LTDA'
  },
  'usuario@estacionamentoseguro.com.br': {
    id: 'estac-123',
    name: 'Estacionamento Seguro',
    email: 'usuario@estacionamentoseguro.com.br',
    password: 'estac123',
    role: 'estacionamento',
    avatar: null,
    companyId: 'comp-estac-123',
    companyName: 'Estacionamento Seguro S.A.'
  }
};

// Simular delay de rede
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Gerar token mock
const generateMockToken = (payload: any): string => {
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const payloadEncoded = btoa(JSON.stringify(payload));
  const signature = btoa('mock-signature-' + Date.now());
  return `${header}.${payloadEncoded}.${signature}`;
};

export const MockAuthService = {
  // Login mockado
  login: async (email: string, password: string): Promise<LoginResponse> => {
    await delay(800); // Simular delay de rede
    
    console.log('🔄 [MOCK] Tentativa de login:', email);
    
    const user = mockUsers[email];
    
    if (!user) {
      console.error('❌ [MOCK] Usuário não encontrado:', email);
      throw new Error('Email ou senha inválidos');
    }

    if (user.password !== password) {
      console.error('❌ [MOCK] Senha inválida para:', email);
      throw new Error('Email ou senha inválidos');
    }

    const token = generateMockToken({ 
      id: user.id, 
      email: user.email, 
      role: user.role,
      companyId: user.companyId 
    });

    const refreshToken = generateMockToken({ id: user.id });

    console.log('✅ [MOCK] Login bem-sucedido:', email);

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        companyId: user.companyId,
        companyName: user.companyName
      },
      token,
      refreshToken
    };
  },

  // Logout mockado
  logout: async (): Promise<void> => {
    await delay(300);
    console.log('🔄 [MOCK] Logout realizado');
  },

  // Obter usuário atual mockado
  getCurrentUser: async (): Promise<User> => {
    await delay(500);
    
    // Simular obtenção do usuário a partir do token
    const email = 'admin@gtsystem.com'; // Simular decodificação do token
    const user = mockUsers[email];
    
    if (!user) {
      throw new Error('Usuário não encontrado');
    }

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
      companyId: user.companyId,
      companyName: user.companyName
    };
  },

  // Refresh token mockado
  refreshToken: async (refreshToken: string): Promise<{ token: string; refreshToken: string }> => {
    await delay(400);
    
    return {
      token: generateMockToken({ id: 'admin-123' }),
      refreshToken: generateMockToken({ id: 'admin-123' })
    };
  }
};
