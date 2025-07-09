import nodemailer from 'nodemailer';
import { logger } from '../utils/logger';

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}

export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    // Configurar o transporter do Nodemailer
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: parseInt(process.env.SMTP_PORT || '587') === 465, // true para porta 465, false para outras portas
      auth: {
        user: process.env.SMTP_USER || '',
        pass: process.env.SMTP_PASS || '',
      },
    });
  }

  /**
   * Envia um email
   */
  async sendEmail(options: EmailOptions): Promise<void> {
    try {
      const mailOptions = {
        from: `"GTSystem" <${process.env.SMTP_USER}>`,
        to: options.to,
        subject: options.subject,
        html: options.html,
      };

      await this.transporter.sendMail(mailOptions);
      logger.info(`Email enviado para ${options.to}`);
    } catch (error) {
      logger.error('Erro ao enviar email:', error);
      throw new Error('Não foi possível enviar o email');
    }
  }

  /**
   * Envia email de verificação de conta
   */
  async sendVerificationEmail(to: string, name: string, token: string): Promise<void> {
    const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
    const verificationUrl = `${process.env.API_URL || 'http://localhost:3000'}/api/auth/verify-email/${token}`;

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Olá, ${name}!</h2>
        <p>Obrigado por se cadastrar no GTSystem.</p>
        <p>Por favor, verifique seu email clicando no botão abaixo:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${verificationUrl}" style="background-color: #4CAF50; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold;">
            Verificar meu email
          </a>
        </div>
        <p>Ou copie e cole este link no seu navegador:</p>
        <p>${verificationUrl}</p>
        <p>Este link expira em 24 horas.</p>
        <p>Se você não solicitou esta verificação, ignore este email.</p>
        <p>Atenciosamente,<br>Equipe GTSystem</p>
      </div>
    `;

    await this.sendEmail({
      to,
      subject: 'Verifique seu email - GTSystem',
      html,
    });
  }

  /**
   * Envia email de recuperação de senha
   */
  async sendPasswordResetEmail(to: string, name: string, token: string): Promise<void> {
    const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
    const resetUrl = `${clientUrl}/reset-password?token=${token}`;

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Olá, ${name}!</h2>
        <p>Recebemos uma solicitação para redefinir sua senha.</p>
        <p>Clique no botão abaixo para criar uma nova senha:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetUrl}" style="background-color: #2196F3; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold;">
            Redefinir minha senha
          </a>
        </div>
        <p>Ou copie e cole este link no seu navegador:</p>
        <p>${resetUrl}</p>
        <p>Este link expira em 1 hora.</p>
        <p>Se você não solicitou esta redefinição, ignore este email.</p>
        <p>Atenciosamente,<br>Equipe GTSystem</p>
      </div>
    `;

    await this.sendEmail({
      to,
      subject: 'Redefinir senha - GTSystem',
      html,
    });
  }

  /**
   * Envia email de confirmação de reserva
   */
  async sendReservationConfirmation(
    to: string,
    name: string,
    reservationId: string,
    parkingLotName: string,
    startTime: Date,
    endTime: Date,
    vehiclePlate: string
  ): Promise<void> {
    const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
    const reservationUrl = `${clientUrl}/reservations/${reservationId}`;

    const formatDate = (date: Date) => {
      return date.toLocaleString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    };

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Olá, ${name}!</h2>
        <p>Sua reserva foi confirmada com sucesso.</p>
        <div style="background-color: #f9f9f9; padding: 20px; border-radius: 5px; margin: 20px 0;">
          <h3>Detalhes da reserva:</h3>
          <p><strong>Estacionamento:</strong> ${parkingLotName}</p>
          <p><strong>Veículo:</strong> ${vehiclePlate}</p>
          <p><strong>Chegada:</strong> ${formatDate(startTime)}</p>
          <p><strong>Saída:</strong> ${formatDate(endTime)}</p>
        </div>
        <p>Para ver os detalhes completos ou gerenciar sua reserva, clique no botão abaixo:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${reservationUrl}" style="background-color: #FF9800; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold;">
            Ver minha reserva
          </a>
        </div>
        <p>Atenciosamente,<br>Equipe GTSystem</p>
      </div>
    `;

    await this.sendEmail({
      to,
      subject: `Reserva Confirmada - ${parkingLotName}`,
      html,
    });
  }
} 