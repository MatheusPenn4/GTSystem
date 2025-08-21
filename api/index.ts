import { VercelRequest, VercelResponse } from '@vercel/node';

// Schema de validação para login (simplificado sem Zod)
const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validatePassword = (password: string): boolean => {
  return password.length >= 6;
};

// Usuários mockados para demo (sem bcrypt por enquanto)
const mockUsers = {
  'admin@gtsystem.com': {
    id: 'admin-1234-5678-9012',
    name: 'Administrador',
    email: 'admin@gtsystem.com',
    password: 'admin123', // Senha em texto plano para demo
    role: 'admin',
    avatar: null,
    companyId: null,
    companyName: null
  },
  'usuario@transportadoramodelo.com.br': {
    id: 'transp-1234-5678-9012',
    name: 'Transportadora Modelo',
    email: 'usuario@transportadoramodelo.com.br',
    password: 'trans123', // Senha em texto plano para demo
    role: 'transportadora',
    companyId: 'comp-transp-1234',
    companyName: 'Transportadora Modelo LTDA',
    avatar: null
  },
  'usuario@estacionamentoseguro.com.br': {
    id: 'estac-1234-5678-9012',
    name: 'Estacionamento Seguro',
    email: 'usuario@estacionamentoseguro.com.br',
    password: 'estac123', // Senha em texto plano para demo
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

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Configurar CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Extrair o path da URL
  const url = new URL(req.url || '', `http://${req.headers.host}`);
  const path = url.pathname;

  try {
    console.log(`API Request: ${req.method} ${path}`);

    // Health check
    if (path === '/api/health') {
      return res.status(200).json({ 
        status: 'success', 
        message: 'API is running',
        timestamp: new Date().toISOString() 
      });
    }

    // Login
    if (path === '/api/auth/login' && req.method === 'POST') {
      console.log('Login attempt:', req.body);
      
      try {
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

        // Verificação simples de senha (sem bcrypt por enquanto)
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
      } catch (validationError) {
        console.log('Validation error:', validationError);
        return res.status(400).json({ error: 'Dados inválidos' });
      }
    }

    // Get current user
    if (path === '/api/auth/me' && req.method === 'GET') {
      const authHeader = req.headers.authorization;
      
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Token não fornecido' });
      }

      const token = authHeader.split(' ')[1];
      
      try {
        // Decodificar token simulado
        const payload = JSON.parse(atob(token.split('.')[1]));
        const user = mockUsers[payload.email as keyof typeof mockUsers];
        
        if (!user) {
          return res.status(401).json({ error: 'Usuário não encontrado' });
        }

        return res.status(200).json({
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          avatar: user.avatar,
          companyId: user.companyId,
          companyName: user.companyName
        });
      } catch (tokenError) {
        return res.status(401).json({ error: 'Token inválido' });
      }
    }

    // Refresh token
    if (path === '/api/auth/refresh-token' && req.method === 'POST') {
      const { refreshToken } = req.body;
      
      if (!refreshToken) {
        return res.status(400).json({ error: 'Refresh token não fornecido' });
      }

      try {
        // Decodificar refresh token simulado
        const payload = JSON.parse(atob(refreshToken.split('.')[1]));
        const user = Object.values(mockUsers).find(u => u.id === payload.id);
        
        if (!user) {
          return res.status(401).json({ error: 'Usuário não encontrado' });
        }

        // Gerar novos tokens
        const newToken = generateMockToken({ 
          id: user.id, 
          email: user.email, 
          role: user.role,
          companyId: user.companyId 
        });

        const newRefreshToken = generateMockToken({ id: user.id });

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
          token: newToken,
          refreshToken: newRefreshToken
        });
      } catch (tokenError) {
        return res.status(401).json({ error: 'Refresh token inválido' });
      }
    }

    // Logout
    if (path === '/api/auth/logout' && req.method === 'POST') {
      return res.status(200).json({ message: 'Logout realizado com sucesso' });
    }

    // Dashboard data
    if (path === '/api/dashboard' && req.method === 'GET') {
      const mockData = {
        empresasAtivas: 15,
        veiculosCadastrados: 127,
        motoristasAtivos: 89,
        vagasOcupadas: {
          total: 78,
          capacidade: 100,
          percentual: 78
        },
        atividadesRecentes: [
          {
            tipo: 'veiculo',
            descricao: 'Novo veículo cadastrado: ABC-1234',
            data: new Date(Date.now() - 1000 * 60 * 30).toISOString() // 30 min atrás
          },
          {
            tipo: 'motorista',
            descricao: 'Motorista João Silva atualizou documentos',
            data: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString() // 2h atrás
          },
          {
            tipo: 'alerta',
            descricao: 'Estacionamento Centro atingiu 90% de ocupação',
            data: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString() // 4h atrás
          }
        ]
      };

      return res.status(200).json(mockData);
    }

    // Empresas
    if (path === '/api/empresas' && req.method === 'GET') {
      const mockEmpresas = [
        {
          id: '1',
          nome: 'Transportadora Modelo LTDA',
          cnpj: '12.345.678/0001-90',
          email: 'contato@transportadoramodelo.com.br',
          telefone: '(11) 99999-9999',
          endereco: 'Rua das Flores, 123 - São Paulo/SP',
          status: 'ativo'
        },
        {
          id: '2',
          nome: 'Estacionamento Seguro S.A.',
          cnpj: '98.765.432/0001-10',
          email: 'contato@estacionamentoseguro.com.br',
          telefone: '(11) 88888-8888',
          endereco: 'Av. Principal, 456 - São Paulo/SP',
          status: 'ativo'
        }
      ];

      return res.status(200).json(mockEmpresas);
    }

    // Veículos
    if (path === '/api/veiculos' && req.method === 'GET') {
      const mockVeiculos = [
        {
          id: '1',
          placa: 'ABC-1234',
          modelo: 'Mercedes-Benz Actros',
          marca: 'Mercedes-Benz',
          ano: 2022,
          cor: 'Branco',
          tipo: 'Caminhão',
          status: 'ativo',
          motoristaId: '1'
        },
        {
          id: '2',
          placa: 'DEF-5678',
          modelo: 'Volkswagen Delivery',
          marca: 'Volkswagen',
          ano: 2021,
          cor: 'Azul',
          tipo: 'Caminhão',
          status: 'ativo',
          motoristaId: '2'
        }
      ];

      return res.status(200).json(mockVeiculos);
    }

    // Motoristas
    if (path === '/api/motoristas' && req.method === 'GET') {
      const mockMotoristas = [
        {
          id: '1',
          nome: 'João Silva',
          cpf: '123.456.789-00',
          cnh: '12345678901',
          categoria: 'E',
          vencimento: '2025-12-31',
          telefone: '(11) 99999-9999',
          email: 'joao.silva@email.com',
          status: 'ativo'
        },
        {
          id: '2',
          nome: 'Maria Santos',
          cpf: '987.654.321-00',
          cnh: '98765432109',
          categoria: 'E',
          vencimento: '2025-06-30',
          telefone: '(11) 88888-8888',
          email: 'maria.santos@email.com',
          status: 'ativo'
        }
      ];

      return res.status(200).json(mockMotoristas);
    }

    // Estacionamentos
    if (path === '/api/estacionamentos' && req.method === 'GET') {
      const mockEstacionamentos = [
        {
          id: '1',
          nome: 'Estacionamento Centro',
          endereco: 'Rua Central, 100 - Centro',
          vagas: 50,
          vagasOcupadas: 35,
          precoHora: 15.00,
          status: 'ativo'
        },
        {
          id: '2',
          nome: 'Estacionamento Shopping',
          endereco: 'Av. Shopping, 200 - Zona Sul',
          vagas: 100,
          vagasOcupadas: 78,
          precoHora: 20.00,
          status: 'ativo'
        }
      ];

      return res.status(200).json(mockEstacionamentos);
    }

    // Reservas
    if (path === '/api/reservas' && req.method === 'GET') {
      const mockReservas = [
        {
          id: '1',
          estacionamentoId: '1',
          veiculoId: '1',
          motoristaId: '1',
          dataEntrada: '2024-01-15T08:00:00Z',
          dataSaida: '2024-01-15T18:00:00Z',
          status: 'ativa',
          valor: 150.00
        },
        {
          id: '2',
          estacionamentoId: '2',
          veiculoId: '2',
          motoristaId: '2',
          dataEntrada: '2024-01-15T09:00:00Z',
          dataSaida: '2024-01-15T17:00:00Z',
          status: 'ativa',
          valor: 160.00
        }
      ];

      return res.status(200).json(mockReservas);
    }

    // Usuários
    if (path === '/api/usuarios' && req.method === 'GET') {
      const mockUsuarios = [
        {
          id: '1',
          nome: 'Administrador',
          email: 'admin@gtsystem.com',
          role: 'admin',
          status: 'ativo',
          createdAt: '2024-01-01T00:00:00Z'
        },
        {
          id: '2',
          nome: 'Usuário Transportadora',
          email: 'usuario@transportadora.com',
          role: 'transportadora',
          status: 'ativo',
          createdAt: '2024-01-02T00:00:00Z'
        }
      ];

      return res.status(200).json(mockUsuarios);
    }

    // Relatórios
    if (path === '/api/relatorios' && req.method === 'GET') {
      const mockRelatorios = {
        financeiro: {
          receitaTotal: 45600.50,
          receitaMensal: 15200.17,
          receitaSemanal: 3800.04,
          reservasPagas: 342,
          reservasPendentes: 23
        },
        ocupacao: {
          mediaGeral: 78.5,
          estacionamentoMaisOcupado: 'Estacionamento Shopping',
          vagasDisponiveis: 45,
          taxaOcupacao: 0.785
        },
        veiculos: {
          total: 127,
          ativos: 120,
          inativos: 7,
          tipos: {
            caminhao: 85,
            van: 25,
            carro: 17
          }
        }
      };

      return res.status(200).json(mockRelatorios);
    }

    // Rota não encontrada
    console.log('Endpoint não encontrado:', path);
    return res.status(404).json({ error: 'Endpoint não encontrado' });

  } catch (error) {
    console.error('Erro na API:', error);
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
}
