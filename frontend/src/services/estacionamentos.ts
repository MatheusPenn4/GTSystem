import api from '@/lib/api';

// Interface para Estacionamento (formato do frontend)
export interface Estacionamento {
  id: string;
  nome: string;
  endereco: string;
  cidade: string;
  estado: string;
  cep: string;
  totalVagas: number;
  vagasDisponiveis: number;
  valorDiaria: number;
  valorHora?: number; // Adicionado para compatibilidade com o formulário
  telefone: string;
  email: string;
  responsavel: string;
  status: 'ativo' | 'inativo' | 'manutencao';
  dataCredenciamento: string;
}

// Interface do backend para mapeamento
interface ParkingLotBackend {
  id: string;
  name: string;
  address: string;
  latitude?: number;
  longitude?: number;
  totalSpaces: number;
  availableSpaces: number;
  pricePerHour: number;
  operatingHours?: any;
  amenities?: string[];
  images?: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  company?: {
    name: string;
    phone: string;
    email: string;
  };
}

// Serviço para manipular estacionamentos
const EstacionamentoService = {
  // Buscar todos os estacionamentos
  getAll: async (): Promise<Estacionamento[]> => {
    try {
      console.log('Tentando buscar dados reais de estacionamentos...');
      
      // Adicionar timestamp para evitar cache
      const timestamp = new Date().getTime();
      const response = await api.get(`/estacionamentos?_t=${timestamp}`, { timeout: 8000 });
      
      // Mapear os dados do backend para o formato esperado pelo frontend
      const estacionamentos = response.data.map((item: ParkingLotBackend) => mapToFrontend(item));
      
      console.log('Dados reais de estacionamentos obtidos com sucesso!', estacionamentos.length);
      console.log('Status dos estacionamentos:', estacionamentos.map(e => ({ nome: e.nome, status: e.status })));
      
      return estacionamentos;
    } catch (error) {
      console.error('Erro ao buscar estacionamentos:', error);
      throw error; // Remover fallback para dados mockados
    }
  },

  // Buscar um estacionamento pelo ID
  getById: async (id: string): Promise<Estacionamento> => {
    try {
      console.log(`Tentando buscar dados reais do estacionamento ${id}...`);
      const response = await api.get(`/estacionamentos/${id}`, { timeout: 5000 });
      
      // Mapear os dados do backend para o formato esperado pelo frontend
      const estacionamento = mapToFrontend(response.data);
      
      console.log('Dados reais do estacionamento obtidos com sucesso!');
      return estacionamento;
    } catch (error) {
      console.error(`Erro ao buscar estacionamento com ID ${id}:`, error);
      throw error; // Remover fallback para dados mockados
    }
  },

  // Criar um novo estacionamento
  create: async (estacionamento: Omit<Estacionamento, 'id' | 'dataCredenciamento'>): Promise<Estacionamento> => {
    try {
      console.log('Tentando criar estacionamento no backend...', estacionamento);
      
      // Mapear os dados do frontend para o formato esperado pelo backend
      const backendData = {
        name: estacionamento.nome,
        address: `${estacionamento.endereco}, ${estacionamento.cidade || ''}, ${estacionamento.estado || ''}, ${estacionamento.cep || ''}`.trim(),
        totalSpaces: Number(estacionamento.totalVagas),
        availableSpaces: Number(estacionamento.vagasDisponiveis || estacionamento.totalVagas),
        pricePerHour: Number(estacionamento.valorHora || (estacionamento.valorDiaria / 24)),
        isActive: estacionamento.status === 'ativo',
        // Campos obrigatórios de acordo com o validator
        latitude: 0,
        longitude: 0,
        // Adicionando valores default para campos obrigatórios
        operatingHours: {
          monday: { open: "08:00", close: "18:00" },
          tuesday: { open: "08:00", close: "18:00" },
          wednesday: { open: "08:00", close: "18:00" },
          thursday: { open: "08:00", close: "18:00" },
          friday: { open: "08:00", close: "18:00" },
          saturday: { open: "08:00", close: "12:00" },
          sunday: { open: "00:00", close: "00:00" }
        },
        amenities: ["security", "covered"],
        images: []
      };
      
      console.log('Dados enviados para o backend:', backendData);
      
      // Verificar se os campos numéricos são válidos
      if (isNaN(backendData.totalSpaces) || backendData.totalSpaces <= 0) {
        throw new Error('O total de vagas deve ser um número positivo');
      }
      
      if (isNaN(backendData.pricePerHour) || backendData.pricePerHour <= 0) {
        throw new Error('O valor por hora deve ser um número positivo');
      }
      
      if (isNaN(backendData.availableSpaces) || backendData.availableSpaces < 0) {
        throw new Error('O número de vagas disponíveis não pode ser negativo');
      }
      
      const response = await api.post('/estacionamentos', backendData, { timeout: 8000 });
      console.log('Estacionamento criado com sucesso no backend!', response.data);
      
      // Mapear a resposta de volta para o formato do frontend
      return mapToFrontend(response.data);
    } catch (error: any) {
      console.error('Erro ao criar estacionamento:', error);
      
      // Melhor tratamento de erros
      if (error.response) {
        // O servidor respondeu com um status diferente de 2xx
        console.error('Resposta de erro:', error.response.data);
        
        // Se houver mensagens de erro específicas, exibi-las
        if (error.response.data && error.response.data.errors) {
          const errors = error.response.data.errors;
          const errorMessages = errors.map((err: any) => err.message || err).join(', ');
          throw new Error(`Dados inválidos: ${errorMessages}`);
        }
        
        const errorMessage = error.response.data?.message || 'Erro ao criar estacionamento';
        throw new Error(errorMessage);
      } else if (error.request) {
        // A requisição foi feita mas não houve resposta
        throw new Error('Servidor não respondeu. Verifique sua conexão.');
      } else {
        // Outros erros
        throw error;
      }
    }
  },

  // Atualizar um estacionamento existente
  update: async (id: string, estacionamento: Partial<Estacionamento>): Promise<Estacionamento> => {
    try {
      console.log(`Tentando atualizar estacionamento ${id} no backend...`, estacionamento);
      
      // Mapear os dados do frontend para o formato esperado pelo backend
      const backendData: any = {};
      
      if (estacionamento.nome) backendData.name = estacionamento.nome;
      if (estacionamento.endereco) backendData.address = estacionamento.endereco;
      if (estacionamento.cidade) backendData.city = estacionamento.cidade;
      if (estacionamento.estado) backendData.state = estacionamento.estado;
      if (estacionamento.cep) backendData.zipCode = estacionamento.cep;
      if (estacionamento.totalVagas !== undefined) backendData.totalSpaces = estacionamento.totalVagas;
      if (estacionamento.vagasDisponiveis !== undefined) backendData.availableSpaces = estacionamento.vagasDisponiveis;
      if (estacionamento.valorDiaria !== undefined) backendData.pricePerHour = estacionamento.valorDiaria / 24;
      if (estacionamento.responsavel) backendData.manager = estacionamento.responsavel;
      if (estacionamento.status) backendData.isActive = estacionamento.status === 'ativo';
      
      const response = await api.put(`/estacionamentos/${id}`, backendData, { timeout: 8000 });
      console.log('Estacionamento atualizado com sucesso no backend!');
      
      // Mapear a resposta de volta para o formato do frontend
      return mapToFrontend(response.data);
    } catch (error: any) {
      console.error(`Erro ao atualizar estacionamento com ID ${id}:`, error);
      
      // Melhor tratamento de erros
      if (error.response) {
        // O servidor respondeu com um status diferente de 2xx
        const errorMessage = error.response.data?.message || 'Erro ao atualizar estacionamento';
        throw new Error(errorMessage);
      } else if (error.request) {
        // A requisição foi feita mas não houve resposta
        throw new Error('Servidor não respondeu. Verifique sua conexão.');
      } else {
        // Outros erros
        throw error;
      }
    }
  },

  // Excluir um estacionamento
  delete: async (id: string): Promise<void> => {
    try {
      console.log(`Tentando excluir estacionamento ${id} no backend...`);
      await api.delete(`/estacionamentos/${id}`, { timeout: 5000 });
      console.log('Estacionamento excluído com sucesso no backend!');
    } catch (error: any) {
      console.error(`Erro ao excluir estacionamento com ID ${id}:`, error);
      
      // Melhor tratamento de erros
      if (error.response) {
        // O servidor respondeu com um status diferente de 2xx
        const errorMessage = error.response.data?.message || 'Erro ao excluir estacionamento';
        throw new Error(errorMessage);
      } else if (error.request) {
        // A requisição foi feita mas não houve resposta
        throw new Error('Servidor não respondeu. Verifique sua conexão.');
      } else {
        // Outros erros
        throw error;
      }
    }
  },
  
  // Buscar vagas de um estacionamento
  getVagas: async (id: string): Promise<any[]> => {
    try {
      console.log(`Tentando buscar vagas do estacionamento ${id}...`);
      const response = await api.get(`/estacionamentos/${id}/vagas`, { timeout: 5000 });
      console.log('Vagas obtidas com sucesso!', response.data.length);
      return response.data;
    } catch (error) {
      console.error(`Erro ao buscar vagas do estacionamento ${id}:`, error);
      return [];
    }
  }
};



// Função para mapear dados do backend para o formato do frontend
const mapToFrontend = (parkingLot: ParkingLotBackend): Estacionamento => {
  return {
    id: parkingLot.id,
    nome: parkingLot.name,
    endereco: parkingLot.address,
    cidade: '', // Extrair da address se necessário
    estado: '', // Extrair da address se necessário
    cep: '', // Extrair da address se necessário
    totalVagas: parkingLot.totalSpaces,
    vagasDisponiveis: parkingLot.availableSpaces,
    valorDiaria: parkingLot.pricePerHour * 24, // Convertendo valor por hora para diária
    telefone: parkingLot.company?.phone || '',
    email: parkingLot.company?.email || '',
    responsavel: '', // Não disponível no schema atual
    status: parkingLot.isActive ? 'ativo' : 'inativo' as 'ativo' | 'inativo' | 'manutencao',
    dataCredenciamento: parkingLot.createdAt
  };
};

// Função para retornar dados mockados consistentes
const getMockEstacionamentos = (): Estacionamento[] => {
  return [
    {
      id: '1',
      nome: 'Estacionamento Central',
      endereco: 'Rua das Flores, 123',
      cidade: 'São Paulo',
      estado: 'SP',
      cep: '01234-567',
      totalVagas: 50,
      vagasDisponiveis: 12,
      valorDiaria: 120.00,
      telefone: '(11) 9999-8888',
      email: 'contato@central.com',
      responsavel: 'João Silva',
      status: 'ativo',
      dataCredenciamento: '2024-01-15'
    },
    {
      id: '2',
      nome: 'Park Shopping Norte',
      endereco: 'Av. Principal, 456',
      cidade: 'São Paulo',
      estado: 'SP',
      cep: '02345-678',
      totalVagas: 80,
      vagasDisponiveis: 25,
      valorDiaria: 120.00,
      telefone: '(11) 8888-7777',
      email: 'admin@parknorte.com',
      responsavel: 'Maria Santos',
      status: 'ativo',
      dataCredenciamento: '2024-02-10'
    },
    {
      id: '3',
      nome: 'Estacionamento Vila Madalena',
      endereco: 'Rua Augusta, 789',
      cidade: 'São Paulo',
      estado: 'SP',
      cep: '03456-789',
      totalVagas: 30,
      vagasDisponiveis: 0,
      valorDiaria: 120.00,
      telefone: '(11) 7777-6666',
      email: 'contato@vilamadalena.com',
      responsavel: 'Carlos Oliveira',
      status: 'manutencao',
      dataCredenciamento: '2024-03-05'
    }
  ];
};

export default EstacionamentoService;