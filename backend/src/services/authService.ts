import bcrypt from 'bcryptjs';
import jwt, { Secret, SignOptions, Jwt } from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { User, UserRole } from '@prisma/client';
import { prisma } from '../config/prisma';
import { ApiError } from '../utils/apiError';
import { logger } from '../utils/logger';
import { EmailService } from './emailService';
import { redis } from '../config/redis';

// Interface para dados de registro
interface RegisterData {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  companyId?: string;
}

// Interface para dados do usuário autenticado
interface AuthUserData {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  companyId: string | null;
  avatarUrl: string | null;
}

// Interface para resultado de login
interface LoginResult {
  accessToken: string;
  refreshToken: string;
  user: AuthUserData;
}

// Interface para resultado de refresh token
interface RefreshTokenResult {
  accessToken: string;
  newRefreshToken?: string;
  user: AuthUserData;
}

export class AuthService {
  private emailService: EmailService;

  constructor() {
    this.emailService = new EmailService();
  }

  /**
   * Autenticar usuário com email e senha
   */
  async login(email: string, password: string): Promise<LoginResult> {
    // Buscar usuário pelo email
    const user = await prisma.user.findUnique({
      where: { email, isActive: true },
    });

    // Verificar se o usuário existe
    if (!user) {
      throw ApiError.unauthorized('Credenciais inválidas');
    }

    // Verificar a senha
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      throw ApiError.unauthorized('Credenciais inválidas');
    }

    // Gerar tokens
    const accessToken = this.generateAccessToken(user);
    const refreshToken = this.generateRefreshToken(user);

    // Salvar refresh token no Redis
    await redis.set(`refresh_token:${refreshToken}`, user.id, 'EX', 7 * 24 * 60 * 60); // 7 dias

    // Retornar tokens e dados do usuário
    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        companyId: user.companyId,
        avatarUrl: user.avatarUrl,
      },
    };
  }

  /**
   * Registrar novo usuário
   */
  async register(data: RegisterData): Promise<User> {
    const { name, email, password, role, companyId } = data;

    // Verificar se o email já está em uso
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw ApiError.conflict('Email já está em uso');
    }

    // Verificar se a empresa existe (se fornecida)
    if (companyId) {
      const company = await prisma.company.findUnique({
        where: { id: companyId },
      });

      if (!company) {
        throw ApiError.badRequest('Empresa não encontrada');
      }

      // Verificar se o tipo de usuário é compatível com o tipo de empresa
      if (
        (role === UserRole.TRANSPORTADORA && company.companyType !== 'TRANSPORTADORA') ||
        (role === UserRole.ESTACIONAMENTO && company.companyType !== 'ESTACIONAMENTO')
      ) {
        throw ApiError.badRequest('Tipo de usuário incompatível com o tipo de empresa');
      }
    } else if (role !== UserRole.ADMIN) {
      // Se não é admin, deve ter uma empresa associada
      throw ApiError.badRequest('Usuários não-admin devem estar associados a uma empresa');
    }

    // Hash da senha
    const passwordHash = await bcrypt.hash(password, 10);

    // Criar usuário
    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        passwordHash,
        role,
        companyId,
      },
    });

    // Gerar token de verificação de email
    const verificationToken = jwt.sign(
      { id: newUser.id, type: 'email-verification' },
      process.env.JWT_SECRET || 'default-secret',
      { expiresIn: '24h' }
    );

    // Salvar token no Redis
    await redis.set(`email_verification:${verificationToken}`, newUser.id, 'EX', 24 * 60 * 60); // 24 horas

    // Enviar email de verificação
    try {
      await this.emailService.sendVerificationEmail(
        newUser.email,
        newUser.name,
        verificationToken
      );
    } catch (error) {
      logger.error('Erro ao enviar email de verificação:', error);
      // Não falhar o registro se o email falhar
    }

    return newUser;
  }

  /**
   * Renovar token de acesso usando refresh token
   */
  async refreshToken(refreshToken: string): Promise<RefreshTokenResult> {
    try {
      // Verificar se o token está no Redis
      const userId = await redis.get(`refresh_token:${refreshToken}`);
      
      if (!userId) {
        throw ApiError.unauthorized('Refresh token inválido ou expirado');
      }

      // Buscar usuário
      const user = await prisma.user.findUnique({
        where: { id: userId, isActive: true },
      });

      if (!user) {
        throw ApiError.unauthorized('Usuário não encontrado ou inativo');
      }

      // Gerar novo token de acesso
      const accessToken = this.generateAccessToken(user);
      
      // Decidir se gera novo refresh token (rotação de tokens)
      const shouldRotateToken = Math.random() < 0.1; // 10% de chance
      let newRefreshToken: string | undefined;

      if (shouldRotateToken) {
        // Gerar novo refresh token
        newRefreshToken = this.generateRefreshToken(user);
        
        // Salvar novo refresh token no Redis
        await redis.set(`refresh_token:${newRefreshToken}`, user.id, 'EX', 7 * 24 * 60 * 60); // 7 dias
        
        // Revogar token antigo
        await this.revokeRefreshToken(refreshToken);
      }

      return {
        accessToken,
        newRefreshToken,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          companyId: user.companyId,
          avatarUrl: user.avatarUrl,
        },
      };
    } catch (error) {
      if (error instanceof ApiError) throw error;
      
      throw ApiError.unauthorized('Falha na autenticação');
    }
  }

  /**
   * Revogar refresh token
   */
  async revokeRefreshToken(refreshToken: string): Promise<void> {
    await redis.del(`refresh_token:${refreshToken}`);
  }

  /**
   * Gerar token de acesso JWT
   */
  private generateAccessToken(user: User): string {
    return jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role,
        companyId: user.companyId,
      },
      process.env.JWT_SECRET || 'default-secret',
      { expiresIn: '15m' }
    );
  }

  /**
   * Gerar refresh token
   */
  private generateRefreshToken(user: User): string {
    // Usar UUID para refresh token em vez de JWT para evitar análise do conteúdo
    return uuidv4();
  }

  /**
   * Enviar email de recuperação de senha
   */
  async forgotPassword(email: string): Promise<void> {
    // Buscar usuário pelo email
    const user = await prisma.user.findUnique({
      where: { email, isActive: true },
    });

    // Se o usuário não existir, não revelar isso na resposta por segurança
    if (!user) {
      logger.info(`Tentativa de recuperação de senha para email não registrado: ${email}`);
      return;
    }

    // Gerar token de reset de senha
    const resetToken = jwt.sign(
      { id: user.id, type: 'password-reset' },
      process.env.JWT_SECRET || 'default-secret',
      { expiresIn: '1h' }
    );

    // Salvar token no Redis
    await redis.set(`password_reset:${resetToken}`, user.id, 'EX', 60 * 60); // 1 hora

    // Enviar email de reset de senha
    try {
      await this.emailService.sendPasswordResetEmail(
        user.email,
        user.name,
        resetToken
      );
      logger.info(`Email de recuperação de senha enviado para: ${email}`);
    } catch (error) {
      logger.error('Erro ao enviar email de recuperação de senha:', error);
      throw ApiError.serviceUnavailable('Não foi possível enviar o email de recuperação de senha');
    }
  }

  /**
   * Redefinir senha com token
   */
  async resetPassword(token: string, newPassword: string): Promise<void> {
    try {
      // Verificar se o token está no Redis
      const userId = await redis.get(`password_reset:${token}`);
      
      if (!userId) {
        throw ApiError.badRequest('Token inválido ou expirado');
      }

      // Verificar usuário
      const user = await prisma.user.findUnique({
        where: { id: userId, isActive: true },
      });

      if (!user) {
        throw ApiError.badRequest('Usuário não encontrado ou inativo');
      }

      // Hash da nova senha
      const passwordHash = await bcrypt.hash(newPassword, 10);

      // Atualizar senha
      await prisma.user.update({
        where: { id: user.id },
        data: { passwordHash },
      });

      // Invalidar token após uso
      await redis.del(`password_reset:${token}`);

      // Invalidar todos os refresh tokens do usuário (logout em todos os dispositivos)
      const pattern = `refresh_token:*`;
      const keys = await redis.keys(pattern);
      
      for (const key of keys) {
        const tokenUserId = await redis.get(key);
        if (tokenUserId === user.id) {
          await redis.del(key);
        }
      }

      logger.info(`Senha redefinida com sucesso para usuário: ${user.email}`);
    } catch (error) {
      if (error instanceof ApiError) throw error;
      
      logger.error('Erro ao redefinir senha:', error);
      throw ApiError.badRequest('Não foi possível redefinir a senha');
    }
  }

  /**
   * Verificar email do usuário
   */
  async verifyEmail(token: string): Promise<void> {
    try {
      // Verificar se o token está no Redis
      const userId = await redis.get(`email_verification:${token}`);
      
      if (!userId) {
        throw ApiError.badRequest('Token inválido ou expirado');
      }

      // Verificar usuário
      const user = await prisma.user.findUnique({
        where: { id: userId },
      });

      if (!user) {
        throw ApiError.badRequest('Usuário não encontrado');
      }

      if (user.emailVerified) {
        // Email já verificado
        await redis.del(`email_verification:${token}`);
        return;
      }

      // Marcar email como verificado
      await prisma.user.update({
        where: { id: user.id },
        data: { emailVerified: true },
      });

      // Invalidar token após uso
      await redis.del(`email_verification:${token}`);

      logger.info(`Email verificado com sucesso para usuário: ${user.email}`);
    } catch (error) {
      if (error instanceof ApiError) throw error;
      
      logger.error('Erro ao verificar email:', error);
      throw ApiError.badRequest('Não foi possível verificar o email');
    }
  }
} 