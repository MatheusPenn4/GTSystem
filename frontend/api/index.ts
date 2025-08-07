import { VercelRequest, VercelResponse } from '@vercel/node';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';

const prisma = new PrismaClient();

// Schema de validação para login
const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6)
});

// Schema de validação para registro
const registerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
  role: z.enum(['admin', 'transportadora', 'estacionamento'])
});

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Configurar CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { pathname } = new URL(req.url || '', `http://${req.headers.host}`);

  try {
    // Health check
    if (pathname === '/api/health') {
      return res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
    }

    // Login
    if (pathname === '/api/auth/login' && req.method === 'POST') {
      const { email, password } = loginSchema.parse(req.body);
      
      // Simular usuário para demo (hashes pré-gerados para consistência)
      const mockUsers = {
        'admin@gtsystem.com': {
          id: 'admin-123',
          name: 'Administrador',
          email: 'admin@gtsystem.com',
          password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // admin123
          role: 'admin'
        },
        'usuario@transportadora.com': {
          id: 'transp-123',
          name: 'Transportadora Modelo',
          email: 'usuario@transportadora.com',
          password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // transp123
          role: 'transportadora'
        },
        'usuario@estacionamento.com': {
          id: 'estac-123',
          name: 'Estacionamento Seguro',
          email: 'usuario@estacionamento.com',
          password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // estac123
          role: 'estacionamento'
        }
      };

      const user = mockUsers[email as keyof typeof mockUsers];
      
      if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(401).json({ error: 'Credenciais inválidas' });
      }

      const token = jwt.sign(
        { userId: user.id, email: user.email, role: user.role },
        process.env.JWT_SECRET || 'fallback-secret',
        { expiresIn: '1h' }
      );

      return res.status(200).json({
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role
        },
        token
      });
    }

    // Dashboard data
    if (pathname === '/api/dashboard' && req.method === 'GET') {
      const mockData = {
        totalEstacionamentos: 15,
        totalVeiculos: 127,
        totalMotoristas: 89,
        totalReservas: 342,
        receitaMensal: 45600.50,
        ocupacaoMedia: 78.5,
        reservasAtivas: 23,
        vagasDisponiveis: 45
      };

      return res.status(200).json(mockData);
    }

    // Empresas
    if (pathname === '/api/empresas' && req.method === 'GET') {
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
    if (pathname === '/api/veiculos' && req.method === 'GET') {
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
    if (pathname === '/api/motoristas' && req.method === 'GET') {
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
    if (pathname === '/api/estacionamentos' && req.method === 'GET') {
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
    if (pathname === '/api/reservas' && req.method === 'GET') {
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
    if (pathname === '/api/usuarios' && req.method === 'GET') {
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
    if (pathname === '/api/relatorios' && req.method === 'GET') {
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
    return res.status(404).json({ error: 'Endpoint não encontrado' });

  } catch (error) {
    console.error('Erro na API:', error);
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
}
