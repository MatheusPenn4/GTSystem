import { PrismaClient, UserRole, CompanyType, VehicleType } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Iniciando seed do banco de dados...');
  
  // Criar empresas
  const transportadoraCompany = await prisma.company.upsert({
    where: { cnpj: '12.345.678/0001-00' },
    update: {},
    create: {
      name: 'Transportadora Modelo',
      cnpj: '12.345.678/0001-00',
      phone: '(11) 98765-4321',
      email: 'contato@transportadoramodelo.com.br',
      address: 'Av. Paulista, 1000, São Paulo, SP',
      companyType: CompanyType.TRANSPORTADORA,
    },
  });

  const estacionamentoCompany = await prisma.company.upsert({
    where: { cnpj: '98.765.432/0001-10' },
    update: {},
    create: {
      name: 'Estacionamento Seguro',
      cnpj: '98.765.432/0001-10',
      phone: '(11) 91234-5678',
      email: 'contato@estacionamentoseguro.com.br',
      address: 'Rua Augusta, 500, São Paulo, SP',
      companyType: CompanyType.ESTACIONAMENTO,
    },
  });

  console.log('Empresas criadas:');
  console.log(transportadoraCompany);
  console.log(estacionamentoCompany);

  // Criar usuário admin
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@gtsystem.com' },
    update: {},
    create: {
      name: 'Administrador',
      email: 'admin@gtsystem.com',
      passwordHash: await bcrypt.hash('admin123', 10),
      role: UserRole.ADMIN,
      emailVerified: true,
    },
  });

  // Criar usuário de transportadora
  const transportadoraUser = await prisma.user.upsert({
    where: { email: 'usuario@transportadoramodelo.com.br' },
    update: {},
    create: {
      name: 'Usuário Transportadora',
      email: 'usuario@transportadoramodelo.com.br',
      passwordHash: await bcrypt.hash('trans123', 10),
      role: UserRole.TRANSPORTADORA,
      emailVerified: true,
      companyId: transportadoraCompany.id,
    },
  });

  // Criar usuário de estacionamento
  const estacionamentoUser = await prisma.user.upsert({
    where: { email: 'usuario@estacionamentoseguro.com.br' },
    update: {},
    create: {
      name: 'Usuário Estacionamento',
      email: 'usuario@estacionamentoseguro.com.br',
      passwordHash: await bcrypt.hash('estac123', 10),
      role: UserRole.ESTACIONAMENTO,
      emailVerified: true,
      companyId: estacionamentoCompany.id,
    },
  });

  console.log('Usuários criados:');
  console.log(adminUser);
  console.log(transportadoraUser);
  console.log(estacionamentoUser);

  // Criar estacionamento
  const parkingLot = await prisma.parkingLot.upsert({
    where: { 
      id: '00000000-0000-0000-0000-000000000001'
    },
    update: {},
    create: {
      id: '00000000-0000-0000-0000-000000000001',
      companyId: estacionamentoCompany.id,
      name: 'Estacionamento Central',
      address: 'Av. Paulista, 2000, São Paulo, SP',
      latitude: -23.5505,
      longitude: -46.6333,
      totalSpaces: 100,
      availableSpaces: 80,
      pricePerHour: 15.00,
      operatingHours: {
        monday: { open: '06:00', close: '22:00' },
        tuesday: { open: '06:00', close: '22:00' },
        wednesday: { open: '06:00', close: '22:00' },
        thursday: { open: '06:00', close: '22:00' },
        friday: { open: '06:00', close: '22:00' },
        saturday: { open: '08:00', close: '20:00' },
        sunday: { open: '08:00', close: '18:00' }
      },
      amenities: ['security', 'covered', 'camera'],
      images: [
        'https://example.com/parking1.jpg', 
        'https://example.com/parking2.jpg'
      ],
    },
  });

  console.log('Estacionamento criado:');
  console.log(parkingLot);

  // Criar vagas para o estacionamento
  const parkingSpaces: any[] = [];
  
  // Criar 100 vagas (80 para carros, 15 para caminhões, 5 para motos)
  for (let i = 1; i <= 80; i++) {
    parkingSpaces.push({
      parkingLotId: parkingLot.id,
      spaceNumber: `A${i.toString().padStart(3, '0')}`,
      spaceType: 'CAR',
      isActive: true
    });
  }
  
  for (let i = 1; i <= 15; i++) {
    parkingSpaces.push({
      parkingLotId: parkingLot.id,
      spaceNumber: `T${i.toString().padStart(3, '0')}`,
      spaceType: 'TRUCK',
      isActive: true
    });
  }
  
  for (let i = 1; i <= 5; i++) {
    parkingSpaces.push({
      parkingLotId: parkingLot.id,
      spaceNumber: `M${i.toString().padStart(3, '0')}`,
      spaceType: 'MOTORCYCLE',
      isActive: true
    });
  }

  // Inserir vagas em lote
  await prisma.parkingSpace.createMany({
    data: parkingSpaces
  });

  console.log(`${parkingSpaces.length} vagas criadas para o estacionamento!`);

  // Criar veículo
  const vehicle = await prisma.vehicle.upsert({
    where: { licensePlate: 'ABC1234' },
    update: {},
    create: {
      companyId: transportadoraCompany.id,
      licensePlate: 'ABC1234',
      vehicleType: VehicleType.TRUCK,
      brand: 'Volvo',
      model: 'FH 460',
      year: 2022,
      color: 'Branco',
    },
  });

  console.log('Veículo criado:');
  console.log(vehicle);

  // Criar motorista
  const driver = await prisma.driver.upsert({
    where: { cpf: '123.456.789-00' },
    update: {},
    create: {
      companyId: transportadoraCompany.id,
      name: 'João Motorista',
      cpf: '123.456.789-00',
      cnh: '12345678900',
      phone: '(11) 98888-7777',
      email: 'joao@transportadoramodelo.com.br',
    },
  });

  console.log('Motorista criado:');
  console.log(driver);

  // Vincular motorista ao veículo
  await prisma.vehicle.update({
    where: { id: vehicle.id },
    data: { driverId: driver.id }
  });

  console.log('Motorista vinculado ao veículo com sucesso!');

  // Criar reserva
  const reservation = await prisma.reservation.upsert({
    where: { 
      id: '00000000-0000-0000-0000-000000000001'
    },
    update: {},
    create: {
      id: '00000000-0000-0000-0000-000000000001',
      parkingLotId: parkingLot.id,
      companyId: transportadoraCompany.id,
      vehicleId: vehicle.id,
      driverId: driver.id,
      startTime: new Date(Date.now() + 24 * 60 * 60 * 1000), // Amanhã
      endTime: new Date(Date.now() + 28 * 60 * 60 * 1000),   // Amanhã + 4h
      status: 'CONFIRMED',
      specialRequests: 'Espaço para veículo de grande porte',
    },
  });

  console.log('Reserva criada:');
  console.log(reservation);

  console.log('Seed concluído com sucesso!');
}

main()
  .catch((e) => {
    console.error('Erro durante o seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 