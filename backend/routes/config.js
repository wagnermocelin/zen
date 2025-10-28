import express from 'express';
import Config from '../models/Config.js';
import { protect, authorize } from '../middleware/auth.js';
import nodemailer from 'nodemailer';

const router = express.Router();
router.use(protect);
router.use(authorize('trainer', 'professional'));

router.get('/', async (req, res) => {
  try {
    let config = await Config.findOne({ trainer: req.user._id });
    if (!config) {
      config = await Config.create({ trainer: req.user._id });
    }
    res.json({ success: true, data: config });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.put('/', async (req, res) => {
  try {
    let config = await Config.findOne({ trainer: req.user._id });
    if (!config) {
      config = await Config.create({ ...req.body, trainer: req.user._id });
    } else {
      config = await Config.findByIdAndUpdate(config._id, req.body, { new: true });
    }
    res.json({ success: true, data: config });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// @route   POST /api/config/test-email
// @desc    Testar configuração de email
// @access  Private (Trainer)
router.post('/test-email', async (req, res) => {
  try {
    const { testEmail } = req.body;
    
    if (!testEmail) {
      return res.status(400).json({
        success: false,
        message: 'Email de teste é obrigatório'
      });
    }

    // Buscar configurações
    const config = await Config.findOne({ trainer: req.user._id }).select('+emailConfig.smtpUser +emailConfig.smtpPassword');
    
    if (!config || !config.emailConfig) {
      return res.status(400).json({
        success: false,
        message: 'Configurações de email não encontradas'
      });
    }

    const emailConfig = config.emailConfig;

    // Criar transporter baseado na configuração
    let transporter;
    
    switch (emailConfig.provider) {
      case 'gmail':
        transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: emailConfig.smtpUser,
            pass: emailConfig.smtpPassword
          }
        });
        break;
        
      case 'sendgrid':
        transporter = nodemailer.createTransport({
          host: 'smtp.sendgrid.net',
          port: 587,
          auth: {
            user: 'apikey',
            pass: emailConfig.smtpPassword
          }
        });
        break;
        
      case 'smtp':
        transporter = nodemailer.createTransport({
          host: emailConfig.smtpHost,
          port: emailConfig.smtpPort,
          secure: emailConfig.smtpSecure,
          auth: {
            user: emailConfig.smtpUser,
            pass: emailConfig.smtpPassword
          }
        });
        break;
        
      case 'ethereal':
      default:
        const testAccount = await nodemailer.createTestAccount();
        transporter = nodemailer.createTransport({
          host: 'smtp.ethereal.email',
          port: 587,
          secure: false,
          auth: {
            user: testAccount.user,
            pass: testAccount.pass
          }
        });
    }

    // Enviar email de teste
    const info = await transporter.sendMail({
      from: `"${emailConfig.fromName}" <${emailConfig.fromEmail}>`,
      to: testEmail,
      subject: '✅ Teste de Configuração de Email - Zen',
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
            .success-box {
              background: #d4edda;
              border: 1px solid #c3e6cb;
              color: #155724;
              padding: 15px;
              border-radius: 5px;
              margin: 20px 0;
            }
            .info-table {
              width: 100%;
              margin: 20px 0;
              border-collapse: collapse;
            }
            .info-table td {
              padding: 8px;
              border-bottom: 1px solid #ddd;
            }
            .info-table td:first-child {
              font-weight: bold;
              width: 40%;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>✅ Teste de Email</h1>
          </div>
          <div class="content">
            <div class="success-box">
              <strong>✓ Sucesso!</strong> Sua configuração de email está funcionando corretamente.
            </div>
            
            <h2>Informações da Configuração</h2>
            <table class="info-table">
              <tr>
                <td>Provedor:</td>
                <td>${emailConfig.provider}</td>
              </tr>
              <tr>
                <td>Nome do Remetente:</td>
                <td>${emailConfig.fromName}</td>
              </tr>
              <tr>
                <td>Email do Remetente:</td>
                <td>${emailConfig.fromEmail}</td>
              </tr>
              <tr>
                <td>Data/Hora:</td>
                <td>${new Date().toLocaleString('pt-BR')}</td>
              </tr>
            </table>
            
            <p>Este é um email de teste enviado pelo sistema Zen Personal Trainer para validar suas configurações de SMTP.</p>
            
            <p>Se você recebeu este email, significa que tudo está configurado corretamente e seus alunos receberão os emails de ativação de conta normalmente.</p>
          </div>
        </body>
        </html>
      `
    });

    const previewUrl = nodemailer.getTestMessageUrl(info);

    res.json({
      success: true,
      message: 'Email de teste enviado com sucesso!',
      data: {
        messageId: info.messageId,
        provider: emailConfig.provider,
        previewUrl: previewUrl // Para Ethereal
      }
    });
  } catch (error) {
    console.error('❌ Erro ao testar email:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao enviar email de teste',
      error: error.message,
      details: error.toString()
    });
  }
});

export default router;
