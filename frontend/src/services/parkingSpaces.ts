import api from '@/lib/api';

export interface ParkingSpace {
  id: string;
  numero: string;
  tipo: 'caminhao' | 'carreta';
  status: 'livre' | 'ocupada' | 'reservada' | 'manutencao';
  parkingLotId: string;
  setor?: string;
  veiculo?: {
    placa: string;
    modelo: string;
    transportadora: string;
  };
  reserva?: {
    inicio: string;
    fim: string;
    motorista: string;
    reservationId: string;
  };
  ultimaAtualizacao: string;
  createdAt: string;
  updatedAt: string;
}

// Interface para status do estacionamento
export interface ParkingLotStatus {
  total: number;
  livres: number;
  ocupadas: number;
  reservadas: number;
  manutencao: number;
  ocupacaoPercentual: number;
}

export interface ParkingSpaceConfig {
  totalVagas: number;
  vagasCaminhao: number;
  vagasCarreta: number;
  precoHoraCaminhao: number;
  precoHoraCarreta: number;
  horarioAbertura: string;
  horarioFechamento: string;
  funcionamento24h: boolean;
  prefixoNumeracao: string;
  numeroInicial: number;
  autoReserva: boolean;
  tempoLimiteReserva: number;
}

const ParkingSpaceService = {
  // Buscar todas as vagas do usuário (estacionamento)
  getMySpaces: async (): Promise<ParkingSpace[]> => {
    try {
      console.log('Carregando vagas reais do banco de dados...');
      
      const response = await api.get('/parking-spaces/my-spaces', {
        timeout: 8000
      });
      
      console.log('Vagas carregadas com sucesso!', response.data.length);
      return response.data.map(mapToFrontend);
    } catch (error: any) {
      console.error('Erro ao buscar vagas:', error);
      
      if (error.response?.status === 404) {
        console.warn('Endpoint de vagas não implementado ainda no backend');
        return [];
      }
      throw error;
    }
  },

  // Buscar vagas por estacionamento específico
  getByParkingLot: async (parkingLotId: string): Promise<ParkingSpace[]> => {
    try {
      console.log('Carregando vagas do estacionamento...', { parkingLotId });
      
      const response = await api.get(`/parking-spaces/parking-lot/${parkingLotId}`, {
        timeout: 8000
      });
      
      console.log('Vagas do estacionamento carregadas com sucesso!', response.data.length);
      return response.data.map(mapToFrontend);
    } catch (error: any) {
      console.error('Erro ao buscar vagas do estacionamento:', error);
      
      if (error.response?.status === 404) {
        console.warn('Endpoint de vagas por estacionamento não implementado ainda no backend');
        return [];
      }
      throw error;
    }
  },

  // Buscar status geral do estacionamento
  getParkingLotStatus: async (parkingLotId?: string): Promise<ParkingLotStatus> => {
    try {
      console.log('Carregando status do estacionamento...', { parkingLotId });
      
      const url = parkingLotId 
        ? `/parking-spaces/status/${parkingLotId}`
        : '/parking-spaces/my-status';
        
      const response = await api.get(url, {
        timeout: 8000
      });
      
      console.log('Status do estacionamento carregado com sucesso!');
      return response.data;
    } catch (error: any) {
      console.error('Erro ao buscar status do estacionamento:', error);
      
      if (error.response?.status === 404) {
        console.warn('Endpoint de status não implementado ainda no backend');
        return {
          total: 0,
          livres: 0,
          ocupadas: 0,
          reservadas: 0,
          manutencao: 0,
          ocupacaoPercentual: 0
        };
      }
      throw error;
    }
  },

  // Atualizar status de uma vaga
  updateSpaceStatus: async (spaceId: string, novoStatus: string): Promise<ParkingSpace> => {
    try {
      console.log('Atualizando status da vaga...', { spaceId, novoStatus });
      
      const response = await api.put(`/parking-spaces/${spaceId}/status`, {
        status: novoStatus
      }, {
        timeout: 8000
      });
      
      console.log('Status da vaga atualizado com sucesso!');
      return mapToFrontend(response.data);
    } catch (error: any) {
      console.error('Erro ao atualizar status da vaga:', error);
      
      if (error.response?.status === 404) {
        throw new Error('Funcionalidade de atualização de status ainda não implementada no backend');
      }
      throw error;
    }
  },

  // Criar uma nova vaga
  createSpace: async (spaceData: {
    numero: string;
    tipo: string;
    setor?: string;
    parkingLotId?: string;
  }): Promise<ParkingSpace> => {
    try {
      console.log('Criando nova vaga...', spaceData);
      
      const response = await api.post('/parking-spaces', spaceData, {
        timeout: 8000
      });
      
      console.log('Vaga criada com sucesso!');
      return mapToFrontend(response.data);
    } catch (error: any) {
      console.error('Erro ao criar vaga:', error);
      
      if (error.response?.status === 404) {
        throw new Error('Funcionalidade de criação de vagas ainda não implementada no backend');
      }
      throw error;
    }
  },

  // Deletar uma vaga
  deleteSpace: async (spaceId: string): Promise<void> => {
    try {
      console.log('Deletando vaga...', { spaceId });
      
      await api.delete(`/parking-spaces/${spaceId}`, {
        timeout: 8000
      });
      
      console.log('Vaga deletada com sucesso!');
    } catch (error: any) {
      console.error('Erro ao deletar vaga:', error);
      
      if (error.response?.status === 404) {
        throw new Error('Funcionalidade de exclusão de vagas ainda não implementada no backend');
      }
      throw error;
    }
  },

  // Buscar vagas disponíveis para reserva
  getAvailableSpaces: async (dataInicio: string, dataFim: string, tipoVeiculo?: string): Promise<ParkingSpace[]> => {
    try {
      console.log('Carregando vagas disponíveis...', { dataInicio, dataFim, tipoVeiculo });
      
      const params: any = { dataInicio, dataFim };
      if (tipoVeiculo) params.tipoVeiculo = tipoVeiculo;
      
      const response = await api.get('/parking-spaces/available', {
        params,
        timeout: 8000
      });
      
      console.log('Vagas disponíveis carregadas com sucesso!', response.data.length);
      return response.data.map(mapToFrontend);
    } catch (error: any) {
      console.error('Erro ao buscar vagas disponíveis:', error);
      
      if (error.response?.status === 404) {
        console.warn('Endpoint de vagas disponíveis não implementado ainda no backend');
        return [];
      }
      throw error;
    }
  },

  // Buscar veículos por placa (autocomplete)
  searchVehicles: async (query: string): Promise<any[]> => {
    try {
      console.log('Buscando veículos...', { query });
      
      const response = await api.get('/parking-spaces/search-vehicles', {
        params: { query },
        timeout: 8000
      });
      
      console.log('Veículos encontrados:', response.data.length);
      return response.data;
    } catch (error: any) {
      console.error('Erro ao buscar veículos:', error);
      
      if (error.response?.status === 404) {
        console.warn('Endpoint de busca de veículos não implementado ainda no backend');
        return [];
      }
      throw error;
    }
  },

  // Ocupar vaga com veículo
  occupySpace: async (spaceId: string, vehicleData: { vehicleId?: string; licensePlate?: string }): Promise<any> => {
    try {
      console.log('Ocupando vaga...', { spaceId, vehicleData });
      
      const response = await api.post(`/parking-spaces/${spaceId}/occupy`, vehicleData, {
        timeout: 8000
      });
      
      console.log('Vaga ocupada com sucesso!');
      return response.data;
    } catch (error: any) {
      console.error('Erro ao ocupar vaga:', error);
      
      if (error.response?.status === 404) {
        throw new Error('Funcionalidade de ocupação de vagas ainda não implementada no backend');
      }
      if (error.response?.status === 400) {
        throw new Error(error.response.data.message || 'Erro ao ocupar vaga');
      }
      throw error;
    }
  },

  // Liberar vaga
  freeSpace: async (spaceId: string): Promise<any> => {
    try {
      console.log('Liberando vaga...', { spaceId });
      
      const response = await api.post(`/parking-spaces/${spaceId}/free`, {}, {
        timeout: 8000
      });
      
      console.log('Vaga liberada com sucesso!');
      return response.data;
    } catch (error: any) {
      console.error('Erro ao liberar vaga:', error);
      
      if (error.response?.status === 404) {
        throw new Error('Funcionalidade de liberação de vagas ainda não implementada no backend');
      }
      if (error.response?.status === 400) {
        throw new Error(error.response.data.message || 'Erro ao liberar vaga');
      }
      throw error;
    }
  },

  // Configurações das vagas
  async getConfiguration(): Promise<ParkingSpaceConfig> {
    const response = await api.get('/parking-spaces/configuration');
    return response.data;
  },

  async saveConfiguration(config: ParkingSpaceConfig): Promise<void> {
    await api.post('/parking-spaces/configuration', config);
  },

  async generateSpaces(config: ParkingSpaceConfig): Promise<void> {
    await api.post('/parking-spaces/generate', config);
  }
};

// Função para mapear dados do backend para o formato do frontend
const mapToFrontend = (space: any): ParkingSpace => {
  // Mapear tipos do backend para frontend
  const mapTipo = (backendType: string): 'caminhao' | 'carreta' => {
    switch (backendType) {
      case 'truck':
      case 'caminhao':
        return 'caminhao';
      case 'semi-truck':
      case 'carreta':
        return 'carreta';
      // Fallback para tipos antigos
      case 'car':
      case 'carro':
        return 'caminhao';
      case 'motorcycle':
      case 'moto':
        return 'caminhao';
      default:
        return 'caminhao';
    }
  };

  return {
    id: space.id,
    numero: space.number || space.numero,
    tipo: mapTipo(space.type || space.tipo || space.spaceType || 'truck'),
    status: space.status,
    parkingLotId: space.parkingLotId,
    setor: space.sector || space.setor,
    veiculo: space.vehicle ? {
      placa: space.vehicle.plate || space.vehicle.placa,
      modelo: space.vehicle.model || space.vehicle.modelo,
      transportadora: space.vehicle.company || space.vehicle.transportadora
    } : undefined,
    reserva: space.reservation ? {
      inicio: space.reservation.startTime || space.reservation.inicio,
      fim: space.reservation.endTime || space.reservation.fim,
      motorista: space.reservation.driverName || space.reservation.motorista,
      reservationId: space.reservation.id || space.reservation.reservationId
    } : undefined,
    ultimaAtualizacao: space.updatedAt || space.ultimaAtualizacao || new Date().toISOString(),
    createdAt: space.createdAt || new Date().toISOString(),
    updatedAt: space.updatedAt || new Date().toISOString()
  };
};

export default ParkingSpaceService; 