import nodemailer from 'nodemailer';
import crypto from 'crypto';
import Config from '../models/Config.js';

// Configurar transporter com base nas configurações do banco
const createTransporter = async (trainerId) => {
  try {
    // Buscar configurações do trainer
    const config = await Config.findOne({ trainer: trainerId }).select('+emailConfig.smtpUser +emailConfig.smtpPassword');
    
    // Se não tiver config ou email desabilitado, usar Ethereal
    if (!config || !config.emailConfig || !config.emailConfig.enabled) {
      const testAccount = await nodemailer.createTestAccount();
      return nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass
        }
      });
    }
    
    const emailConfig = config.emailConfig;
    
    // Configurar baseado no provider
    switch (emailConfig.provider) {
      case 'gmail':
        return nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: emailConfig.smtpUser,
            pass: emailConfig.smtpPassword
          }
        });
        
      case 'sendgrid':
        return nodemailer.createTransport({
          host: 'smtp.sendgrid.net',
          port: 587,
          auth: {
            user: 'apikey',
            pass: emailConfig.smtpPassword
          }
        });
        
      case 'smtp':
        return nodemailer.createTransport({
          host: emailConfig.smtpHost,
          port: emailConfig.smtpPort,
          secure: emailConfig.smtpSecure,
          auth: {
            user: emailConfig.smtpUser,
            pass: emailConfig.smtpPassword
          }
        });
        
      case 'ethereal':
      default:
        const testAccount = await nodemailer.createTestAccount();
        return nodemailer.createTransport({
          host: 'smtp.ethereal.email',
          port: 587,
          secure: false,
          auth: {
            user: testAccount.user,
            pass: testAccount.pass
          }
        });
    }
  } catch (error) {
    console.error('Erro ao criar transporter, usando Ethereal:', error);
    const testAccount = await nodemailer.createTestAccount();
    return nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass
      }
    });
  }
};

// Gerar token de verificação
export const generateVerificationToken = () => {
  return crypto.randomBytes(32).toString('hex');
};

// Enviar email de verificação
export const sendVerificationEmail = async (student, token, trainerId) => {
  try {
    // Buscar configurações do trainer
    const config = await Config.findOne({ trainer: trainerId });
    const emailConfig = config?.emailConfig || {};
    
    const transporter = await createTransporter(trainerId);
    const verificationUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/activate-account?token=${token}&email=${student.email}`;

    const fromName = emailConfig.fromName || 'Power Training';
    const fromEmail = emailConfig.fromEmail || 'noreply@powertraining.com';
    const subject = emailConfig.emailTemplates?.welcomeSubject || 'Bem-vindo ao Power Training - Ative sua conta';

    const mailOptions = {
      from: `"${fromName}" <${fromEmail}>`,
      to: student.email,
      subject: subject,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <style>
            body {
              font-family: Arial, sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
            }
            .header {
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              color: white;
              padding: 30px;
              text-align: center;
              border-radius: 10px 10px 0 0;
            }
            .content {
              background: #f9f9f9;
              padding: 30px;
              border-radius: 0 0 10px 10px;
            }
            .button {
              display: inline-block;
              padding: 12px 30px;
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              color: white;
              text-decoration: none;
              border-radius: 5px;
              margin: 20px 0;
              font-weight: bold;
            }
            .footer {
              text-align: center;
              margin-top: 30px;
              color: #666;
              font-size: 12px;
            }
            .info-box {
              background: white;
              padding: 15px;
              border-left: 4px solid #667eea;
              margin: 20px 0;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>🧘 Bem-vindo ao Zen</h1>
          </div>
          <div class="content">
            <h2>Olá, ${student.name}!</h2>
            <p>Sua conta foi criada com sucesso no sistema Power Training.</p>
            
            <p>Para começar a usar a plataforma, você precisa ativar sua conta e criar sua senha de acesso.</p>
            
            <div style="text-align: center;">
              <a href="${verificationUrl}" class="button">Ativar Conta e Criar Senha</a>
            </div>
            
            <div class="info-box">
              <strong>⚠️ Importante:</strong>
              <ul>
                <li>Este link é válido por 24 horas</li>
                <li>Após ativar, você poderá acessar seus treinos, dietas e acompanhamento</li>
                <li>Seu email de acesso é: <strong>${student.email}</strong></li>
              </ul>
            </div>
            
            <p>Se você não solicitou este cadastro, por favor ignore este email.</p>
            
            <p>Caso o botão não funcione, copie e cole o link abaixo no seu navegador:</p>
            <p style="word-break: break-all; color: #667eea; font-size: 12px;">${verificationUrl}</p>
          </div>
          <div class="footer">
            <p>© ${new Date().getFullYear()} Power Training. Todos os direitos reservados.</p>
            <p>Este é um email automático, por favor não responda.</p>
          </div>
        </body>
        </html>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    
    // Em desenvolvimento, mostrar o link do Ethereal
    if (process.env.NODE_ENV !== 'production') {
      console.log('📧 Email de verificação enviado (DEV)');
      console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
      console.log('Verification URL: %s', verificationUrl);
    }
    
    return {
      success: true,
      messageId: info.messageId,
      previewUrl: nodemailer.getTestMessageUrl(info)
    };
  } catch (error) {
    console.error('❌ Erro ao enviar email:', error);
    throw new Error('Erro ao enviar email de verificação');
  }
};

// Enviar email de redefinição de senha
export const sendPasswordResetEmail = async (student, token, trainerId) => {
  try {
    // Buscar configurações do trainer
    const config = await Config.findOne({ trainer: trainerId });
    const emailConfig = config?.emailConfig || {};
    
    const transporter = await createTransporter(trainerId);
    const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password?token=${token}&email=${student.email}`;

    const fromName = emailConfig.fromName || 'Power Training';
    const fromEmail = emailConfig.fromEmail || 'noreply@powertraining.com';
    const subject = emailConfig.emailTemplates?.resetPasswordSubject || 'Redefinir Senha - Power Training';

    const mailOptions = {
      from: `"${fromName}" <${fromEmail}>`,
      to: student.email,
      subject: subject,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <style>
            body {
              font-family: Arial, sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
            }
            .header {
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              color: white;
              padding: 30px;
              text-align: center;
              border-radius: 10px 10px 0 0;
            }
            .content {
              background: #f9f9f9;
              padding: 30px;
              border-radius: 0 0 10px 10px;
            }
            .button {
              display: inline-block;
              padding: 12px 30px;
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              color: white;
              text-decoration: none;
              border-radius: 5px;
              margin: 20px 0;
              font-weight: bold;
            }
            .footer {
              text-align: center;
              margin-top: 30px;
              color: #666;
              font-size: 12px;
            }
            .warning {
              background: #fff3cd;
              padding: 15px;
              border-left: 4px solid #ffc107;
              margin: 20px 0;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>🔐 Redefinir Senha</h1>
          </div>
          <div class="content">
            <h2>Olá, ${student.name}!</h2>
            <p>Recebemos uma solicitação para redefinir a senha da sua conta.</p>
            
            <div style="text-align: center;">
              <a href="${resetUrl}" class="button">Redefinir Senha</a>
            </div>
            
            <div class="warning">
              <strong>⚠️ Atenção:</strong>
              <ul>
                <li>Este link é válido por 1 hora</li>
                <li>Se você não solicitou esta redefinição, ignore este email</li>
                <li>Sua senha atual permanecerá ativa até que você crie uma nova</li>
              </ul>
            </div>
            
            <p>Caso o botão não funcione, copie e cole o link abaixo no seu navegador:</p>
            <p style="word-break: break-all; color: #667eea; font-size: 12px;">${resetUrl}</p>
          </div>
          <div class="footer">
            <p>© ${new Date().getFullYear()} Power Training. Todos os direitos reservados.</p>
            <p>Este é um email automático, por favor não responda.</p>
          </div>
        </body>
        </html>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    
    if (process.env.NODE_ENV !== 'production') {
      console.log('📧 Email de redefinição de senha enviado (DEV)');
      console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
      console.log('Reset URL: %s', resetUrl);
    }
    
    return {
      success: true,
      messageId: info.messageId,
      previewUrl: nodemailer.getTestMessageUrl(info)
    };
  } catch (error) {
    console.error('❌ Erro ao enviar email:', error);
    throw new Error('Erro ao enviar email de redefinição de senha');
  }
};
