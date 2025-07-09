import api from '@/lib/api';

export interface Veiculo {
  id: string;
  placa: string;
  modelo: string;
  marca: string;
  ano: number;
  cor: string;
  tipo: 'TRUCK' | 'VAN' | 'CAR' | 'MOTORCYCLE';
  empresaId: string;
  empresaNome?: string;
  motoristaPrincipalId?: string;
  status: 'ativo' | 'inativo' | 'manutencao';
  chassi?: string;
  dataCadastro: string;
}

// Interface do backend para mapeamento
interface VehicleBackend {
  id: string;
  licensePlate: string;
  vehicleType: 'TRUCK' | 'VAN' | 'CAR' | 'MOTORCYCLE';
  brand: string;
  model: string;
  year: number;
  color: string;
  companyId: string;
  driverId?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  company?: {
    name: string;
  };
  _count?: {
    reservations: number;
  };
}

const VeiculoService = {
  // Buscar todos os veículos
  getAll: async (): Promise<Veiculo[]> => {
    try {
      console.log('Tentando buscar dados reais de veículos...');
      
      // Verificar se o servidor está disponível
      const isServerAvailable = await checkServerAvailability();
      if (!isServerAvailable) {
        throw new Error('Servidor indisponível');
      }
      
      const response = await api.get('/veiculos', { timeout: 5000 });
      
      // Mapear dados do backend para o formato do frontend
      const veiculos = response.data.map((vehicle: VehicleBackend) => mapToFrontend(vehicle));
      console.log('Dados reais de veículos obtidos com sucesso!', veiculos.length);
      return veiculos;
    } catch (error) {
      console.error('Erro ao buscar veículos:', error);
      throw error; // Remover fallback para dados mockados
    }
  },

  // Buscar um veículo pelo ID
  getById: async (id: string): Promise<Veiculo> => {
    try {
      console.log(`Tentando buscar dados reais do veículo ${id}...`);
      
      // Verificar se o servidor está disponível
      const isServerAvailable = await checkServerAvailability();
      if (!isServerAvailable) {
        throw new Error('Servidor indisponível');
      }
      
      const response = await api.get(`/veiculos/${id}`, { timeout: 5000 });
      console.log('Dados reais do veículo obtidos com sucesso!');
      
      // Mapear dados do backend para o formato do frontend
      return mapToFrontend(response.data);
    } catch (error) {
      console.error(`Erro ao buscar veículo com ID ${id}:`, error);
      throw error; // Remover fallback para dados mockados
    }
  },

  // Criar um novo veículo
  create: async (veiculo: Omit<Veiculo, 'id' | 'dataCadastro' | 'empresaNome'>): Promise<Veiculo> => {
    try {
      console.log('Tentando criar veículo no backend...', veiculo);
      
      // Validar dados obrigatórios antes de enviar
      if (!veiculo.placa || veiculo.placa.trim() === '') {
        throw new Error('A placa do veículo é obrigatória');
      }
      
      if (!veiculo.tipo) {
        throw new Error('O tipo do veículo é obrigatório');
      }
      
      // Preparar os dados exatamente como o backend espera
      const backendData = {
        licensePlate: veiculo.placa.trim().toUpperCase().replace(/\s/g, ''),
        vehicleType: veiculo.tipo,
        brand: veiculo.marca || "",
        model: veiculo.modelo || "",
        year: Number(veiculo.ano) || new Date().getFullYear(),
        color: veiculo.cor || "",
        driverId: veiculo.motoristaPrincipalId && veiculo.motoristaPrincipalId !== 'none' 
          ? veiculo.motoristaPrincipalId 
          : null,
        isActive: veiculo.status === 'ativo',
        companyId: veiculo.empresaId && veiculo.empresaId !== 'placeholder' && veiculo.empresaId !== 'none'
          ? veiculo.empresaId
          : null
      };
      
      console.log('Dados finais enviados para o backend:', backendData);
      
      // Último teste de validação
      if (!backendData.licensePlate || backendData.licensePlate.length < 5) {
        throw new Error(`A placa do veículo deve ter pelo menos 5 caracteres (atual: ${backendData.licensePlate})`);
      }
      
      // Verificar se o tipo de veículo é válido
      const tiposValidos = ['TRUCK', 'VAN', 'CAR', 'MOTORCYCLE'];
      if (!tiposValidos.includes(backendData.vehicleType)) {
        throw new Error(`O tipo de veículo deve ser um dos seguintes: ${tiposValidos.join(', ')}`);
      }
      
      // Garantir que os campos obrigatórios estejam presentes
      const camposObrigatorios = [
        { campo: 'licensePlate', valor: backendData.licensePlate },
        { campo: 'vehicleType', valor: backendData.vehicleType }
      ];
      
      const camposFaltantes = camposObrigatorios
        .filter(c => !c.valor)
        .map(c => c.campo);
        
      if (camposFaltantes.length > 0) {
        throw new Error(`Campos obrigatórios não preenchidos: ${camposFaltantes.join(', ')}`);
      }
      
      try {
        // Abordagem com axios primeiro
        const response = await api.post('/veiculos', backendData);
        console.log('Veículo criado com sucesso usando axios!', response.data);
        return mapToFrontend(response.data);
      } catch (axiosError) {
        console.error('Erro ao usar axios:', axiosError);
        
        // Fallback para fetch se axios falhar
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
        const token = localStorage.getItem('ajh_token');
        
        console.log('Enviando com fetch para:', `${apiUrl}/veiculos`);
        console.log('Dados JSON:', JSON.stringify(backendData));
        
        const fetchResponse = await fetch(`${apiUrl}/veiculos`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': token ? `Bearer ${token}` : ''
          },
          body: JSON.stringify(backendData)
        });
        
        // Obter a resposta em JSON
        const responseData = await fetchResponse.json();
        
        if (!fetchResponse.ok) {
          throw new Error(`Erro do servidor: ${fetchResponse.status} - ${JSON.stringify(responseData)}`);
        }
        
        console.log('Veículo criado com sucesso usando fetch!', responseData);
        return mapToFrontend(responseData);
      }
    } catch (error) {
      console.error('Erro ao criar veículo:', error);
      throw error;
    }
  },

  // Atualizar um veículo existente
  update: async (id: string, veiculo: Partial<Veiculo>): Promise<Veiculo> => {
    try {
      console.log(`Tentando atualizar veículo ${id} no backend...`, veiculo);
      
      // Verificar se o servidor está disponível
      const isServerAvailable = await checkServerAvailability();
      if (!isServerAvailable) {
        throw new Error('Servidor indisponível');
      }
      
      // Mapear dados do frontend para o formato do backend
      const backendData: any = {};
      
      if (veiculo.placa) backendData.licensePlate = veiculo.placa;
      if (veiculo.tipo) backendData.vehicleType = veiculo.tipo;
      if (veiculo.marca) backendData.brand = veiculo.marca;
      if (veiculo.modelo) backendData.model = veiculo.modelo;
      if (veiculo.ano) backendData.year = veiculo.ano;
      if (veiculo.cor) backendData.color = veiculo.cor;
      if (veiculo.status) backendData.isActive = veiculo.status === 'ativo';
      if (veiculo.motoristaPrincipalId !== undefined) backendData.driverId = veiculo.motoristaPrincipalId || null;
      
      const response = await api.put(`/veiculos/${id}`, backendData, { timeout: 5000 });
      console.log('Veículo atualizado com sucesso no backend!');
      
      // Mapear resposta do backend para o formato do frontend
      return mapToFrontend(response.data);
    } catch (error: any) {
      console.error(`Erro ao atualizar veículo com ID ${id}:`, error);
      
      // Melhor tratamento de erros
      if (error.response) {
        // O servidor respondeu com um status diferente de 2xx
        const errorMessage = error.response.data?.message || 'Erro ao atualizar veículo';
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

  // Excluir um veículo
  delete: async (id: string): Promise<void> => {
    try {
      console.log(`Tentando excluir veículo ${id} no backend...`);
      
      // Verificar se o servidor está disponível
      const isServerAvailable = await checkServerAvailability();
      if (!isServerAvailable) {
        throw new Error('Servidor indisponível');
      }
      
      await api.delete(`/veiculos/${id}`, { timeout: 5000 });
      console.log('Veículo excluído com sucesso no backend!');
    } catch (error: any) {
      console.error(`Erro ao excluir veículo com ID ${id}:`, error);
      
      // Melhor tratamento de erros
      if (error.response) {
        // O servidor respondeu com um status diferente de 2xx
        const errorMessage = error.response.data?.message || 'Erro ao excluir veículo';
        throw new Error(errorMessage);
      } else if (error.request) {
        // A requisição foi feita mas não houve resposta
        throw new Error('Servidor não respondeu. Verifique sua conexão.');
      } else {
        // Outros erros
        throw error;
      }
    }
  }
};

// Função auxiliar para verificar se o servidor está disponível
const checkServerAvailability = async (): Promise<boolean> => {
  try {
    await api.get('/health', { timeout: 3000 });
    return true;
  } catch (error) {
    console.warn('Servidor backend indisponível:', error);
    return false;
  }
};

// Função para mapear dados do backend para o formato do frontend
const mapToFrontend = (vehicle: VehicleBackend): Veiculo => {
  // Determinar status baseado no isActive
  let status: 'ativo' | 'inativo' | 'manutencao' = 'inativo';
  if (vehicle.isActive) {
    status = 'ativo';
  }
  
  return {
    id: vehicle.id || '',
    placa: vehicle.licensePlate || '',
    tipo: vehicle.vehicleType || 'VAN',
    marca: vehicle.brand || '',
    modelo: vehicle.model || '',
    ano: vehicle.year || new Date().getFullYear(),
    cor: vehicle.color || '',
    empresaId: vehicle.companyId || '',
    empresaNome: vehicle.company?.name || '',
    motoristaPrincipalId: vehicle.driverId || '',
    status: status,
    dataCadastro: vehicle.createdAt || new Date().toISOString()
  };
};

// Função para retornar dados mockados consistentes
const getMockVeiculos = (): Veiculo[] => {
  return [
    {
      id: '1',
      placa: 'ABC-1234',
      modelo: 'Mercedes Sprinter',
      marca: 'Mercedes',
      ano: 2020,
      cor: 'Branco',
      tipo: 'VAN',
      empresaId: '1',
      empresaNome: 'Transportadora ABC',
      status: 'ativo',
      chassi: '9BFZF12345678901',
      dataCadastro: '2023-01-15'
    },
    {
      id: '2',
      placa: 'DEF-5678',
      modelo: 'Iveco Daily',
      marca: 'Iveco',
      ano: 2019,
      cor: 'Azul',
      tipo: 'TRUCK',
      empresaId: '1',
      empresaNome: 'Transportadora ABC',
      status: 'ativo',
      chassi: '9BFZF12345678902',
      dataCadastro: '2023-02-20'
    },
    {
      id: '3',
      placa: 'GHI-9012',
      modelo: 'Ford Transit',
      marca: 'Ford',
      ano: 2021,
      cor: 'Prata',
      tipo: 'VAN',
      empresaId: '2',
      empresaNome: 'LogisTech Express',
      status: 'manutencao',
      chassi: '9BFZF12345678903',
      dataCadastro: '2023-03-10'
    }
  ];
};

export default VeiculoService; 