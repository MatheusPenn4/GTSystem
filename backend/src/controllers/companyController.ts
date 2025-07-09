import { Request, Response, NextFunction } from 'express';
import { PrismaClient, CompanyType } from '@prisma/client';
import { ApiError } from '../utils/apiError';
import { logger } from '../utils/logger';

const prisma = new PrismaClient();

/**
 * Controlador de empresas
 */
const companyController = {
  /**
   * Obter todas as empresas
   */
  getAllCompanies: async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Verificar permissões - admin pode ver todas as empresas, outros usuários apenas a própria
      const isAdmin = req.user.role === 'ADMIN';
      
      // Filtros
      const { type, active, search } = req.query;
      
      const where: any = {};
      
      // Filtrar por tipo de empresa
      if (type) {
        where.companyType = type.toString().toUpperCase();
      }
      
      // Filtrar por status ativo/inativo
      if (active !== undefined) {
        where.isActive = active === 'true';
      }
      
      // Filtrar por nome ou CNPJ
      if (search) {
        where.OR = [
          { name: { contains: search.toString(), mode: 'insensitive' } },
          { cnpj: { contains: search.toString() } },
        ];
      }
      
      // Se não for admin, mostrar apenas a própria empresa
      if (!isAdmin) {
        where.id = req.user.companyId;
      }
      
      const companies = await prisma.company.findMany({
        where,
        orderBy: {
          name: 'asc',
        },
      });
      
      return res.status(200).json(companies);
    } catch (error) {
      next(error);
    }
  },

  /**
   * Criar uma nova empresa
   */
  createCompany: async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Verificar permissões - apenas admin pode criar empresas
      if (req.user.role !== 'ADMIN') {
        throw new ApiError(403, 'Acesso negado. Apenas administradores podem criar empresas.');
      }
      
      const { name, cnpj, companyType, phone, email, address } = req.body;
      
      // Verificar se já existe empresa com este CNPJ
      const existingCompany = await prisma.company.findUnique({
        where: { cnpj },
      });
      
      if (existingCompany) {
        throw new ApiError(400, 'Já existe uma empresa com este CNPJ.');
      }
      
      // Criar a empresa
      const company = await prisma.company.create({
        data: {
          name,
          cnpj,
          companyType: companyType.toUpperCase() as CompanyType,
          phone,
          email,
          address,
          isActive: true,
        },
      });
      
      // Log da ação
      logger.info(`Empresa criada: ${company.id}`, { userId: req.user.id, action: 'create_company' });
      
      return res.status(201).json(company);
    } catch (error) {
      next(error);
    }
  },

  /**
   * Obter uma empresa específica
   */
  getCompanyById: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      
      // Verificar permissões - admin pode ver qualquer empresa, outros usuários apenas a própria
      if (req.user.role !== 'ADMIN' && req.user.companyId !== id) {
        throw new ApiError(403, 'Acesso negado. Você só pode visualizar sua própria empresa.');
      }
      
      const company = await prisma.company.findUnique({
        where: { id },
      });
      
      if (!company) {
        throw new ApiError(404, 'Empresa não encontrada.');
      }
      
      return res.status(200).json(company);
    } catch (error) {
      next(error);
    }
  },

  /**
   * Atualizar uma empresa
   */
  updateCompany: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const { name, phone, email, address, isActive } = req.body;
      
      // Verificar permissões - admin pode atualizar qualquer empresa, outros usuários apenas a própria
      if (req.user.role !== 'ADMIN' && req.user.companyId !== id) {
        throw new ApiError(403, 'Acesso negado. Você só pode atualizar sua própria empresa.');
      }
      
      // Verificar se a empresa existe
      const existingCompany = await prisma.company.findUnique({
        where: { id },
      });
      
      if (!existingCompany) {
        throw new ApiError(404, 'Empresa não encontrada.');
      }
      
      // Não-admin não pode mudar o status ativo
      if (req.user.role !== 'ADMIN' && isActive !== undefined) {
        throw new ApiError(403, 'Acesso negado. Você não pode alterar o status da empresa.');
      }
      
      // Preparar dados para atualização
      const updateData: any = {};
      
      if (name) updateData.name = name;
      if (phone) updateData.phone = phone;
      if (email) updateData.email = email;
      if (address) updateData.address = address;
      if (req.user.role === 'ADMIN' && isActive !== undefined) {
        updateData.isActive = isActive;
      }
      
      // Atualizar a empresa
      const updatedCompany = await prisma.company.update({
        where: { id },
        data: updateData,
      });
      
      // Log da ação
      logger.info(`Empresa atualizada: ${id}`, { userId: req.user.id, action: 'update_company' });
      
      return res.status(200).json(updatedCompany);
    } catch (error) {
      next(error);
    }
  },

  /**
   * Excluir uma empresa (exclusão lógica)
   */
  deleteCompany: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      
      // Verificar permissões - apenas admin pode excluir empresas
      if (req.user.role !== 'ADMIN') {
        throw new ApiError(403, 'Acesso negado. Apenas administradores podem excluir empresas.');
      }
      
      // Verificar se a empresa existe
      const company = await prisma.company.findUnique({
        where: { id },
      });
      
      if (!company) {
        throw new ApiError(404, 'Empresa não encontrada.');
      }
      
      // Exclusão lógica - apenas marcar como inativo
      await prisma.company.update({
        where: { id },
        data: { isActive: false },
      });
      
      // Log da ação
      logger.info(`Empresa excluída (lógico): ${id}`, { userId: req.user.id, action: 'delete_company' });
      
      return res.status(200).json({ message: 'Empresa excluída com sucesso.' });
    } catch (error) {
      next(error);
    }
  },
};

export default companyController; 