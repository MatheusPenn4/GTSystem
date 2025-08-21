import { VercelRequest, VercelResponse } from '@vercel/node';

// Usuários mockados para demo
const mockUsers = {
  'admin@gtsystem.com': {
    id: 'admin-1234-5678-9012',
    name: 'Administrador',
    email: 'admin@gtsystem.com',
    password: 'admin123',
    role: 'admin',
    avatar: null,
    companyId: null,
    companyName: null
  },
  'usuario@transportadoramodelo.com.br': {
    id: 'transp-1234-5678-9012',
    name: 'Transportadora Modelo',
    email: 'usuario@transportadoramodelo.com.br',
    password: 'trans123',
    role: 'transportadora',
    companyId: 'comp-transp-1234',
    companyName: 'Transportadora Modelo LTDA',
    avatar: null
  },
  'usuario@estacionamentoseguro.com.br': {
    id: 'estac-1234-5678-9012',
    name: 'Estacionamento Seguro',
    email: 'usuario@estacionamentoseguro.com.br',
    password: 'estac123',
    role: 'estacionamento',
    companyId: 'comp-estac-1234',
    companyName: 'Estacionamento Seguro S.A.',
    avatar: null
  }
};

// Função simples para gerar token JWT simulado
const generateMockToken = (payload: any): string => {
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const payloadEncoded = btoa(JSON.stringify(payload));
  const signature = btoa('mock-signature-' + Date.now());
  return `${header}.${payloadEncoded}.${signature}`;
};

// Validação básica
const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validatePassword = (password: string): boolean => {
  return password.length >= 6;
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Configurar CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  try {
    console.log('Login attempt:', req.body);
    
    const { email, password } = req.body;
    
    // Validação básica
    if (!validateEmail(email) || !validatePassword(password)) {
      return res.status(400).json({ error: 'Dados inválidos' });
    }
    
    const user = mockUsers[email as keyof typeof mockUsers];
    
    if (!user) {
      console.log('User not found:', email);
      return res.status(401).json({ error: 'Email ou senha inválidos' });
    }

    // Verificação simples de senha
    if (user.password !== password) {
      console.log('Invalid password for user:', email);
      return res.status(401).json({ error: 'Email ou senha inválidos' });
    }

    // Gerar tokens simulados
    const token = generateMockToken({ 
      id: user.id, 
      email: user.email, 
      role: user.role,
      companyId: user.companyId 
    });

    const refreshToken = generateMockToken({ id: user.id });

    console.log('Login successful for user:', email);

    return res.status(200).json({
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
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
}
