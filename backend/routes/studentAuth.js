import express from 'express';
import Student from '../models/Student.js';
import { generateVerificationToken, sendVerificationEmail, sendPasswordResetEmail } from '../utils/emailService.js';

const router = express.Router();

// @route   POST /api/student-auth/activate
// @desc    Ativar conta do aluno e criar senha
// @access  Public
router.post('/activate', async (req, res) => {
  try {
    const { email, token, password } = req.body;

    if (!email || !token || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email, token e senha são obrigatórios'
      });
    }

    // Buscar aluno com o token
    const student = await Student.findOne({
      email: email.toLowerCase(),
      emailVerificationToken: token,
      emailVerificationExpires: { $gt: Date.now() }
    }).select('+emailVerificationToken +emailVerificationExpires +password');

    if (!student) {
      return res.status(400).json({
        success: false,
        message: 'Token inválido ou expirado'
      });
    }

    // Verificar se já está ativado
    if (student.isEmailVerified) {
      return res.status(400).json({
        success: false,
        message: 'Esta conta já foi ativada'
      });
    }

    // Validar senha
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'A senha deve ter no mínimo 6 caracteres'
      });
    }

    // Atualizar aluno
    student.password = password;
    student.isEmailVerified = true;
    student.emailVerificationToken = undefined;
    student.emailVerificationExpires = undefined;
    
    await student.save();

    console.log('✅ Conta ativada com sucesso:', student.email);

    res.json({
      success: true,
      message: 'Conta ativada com sucesso! Você já pode fazer login.',
      data: {
        email: student.email,
        name: student.name
      }
    });
  } catch (error) {
    console.error('❌ Erro ao ativar conta:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao ativar conta',
      error: error.message
    });
  }
});

// @route   POST /api/student-auth/resend-verification
// @desc    Reenviar email de verificação
// @access  Public
router.post('/resend-verification', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email é obrigatório'
      });
    }

    const student = await Student.findOne({ 
      email: email.toLowerCase(),
      isEmailVerified: false 
    });

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Aluno não encontrado ou já ativado'
      });
    }

    // Gerar novo token
    const verificationToken = generateVerificationToken();
    student.emailVerificationToken = verificationToken;
    student.emailVerificationExpires = Date.now() + 24 * 60 * 60 * 1000; // 24 horas
    
    await student.save();

    // Enviar email
    const emailResult = await sendVerificationEmail(student, verificationToken, student.trainer);

    res.json({
      success: true,
      message: 'Email de verificação reenviado com sucesso',
      previewUrl: emailResult.previewUrl // Apenas para desenvolvimento
    });
  } catch (error) {
    console.error('❌ Erro ao reenviar email:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao reenviar email de verificação',
      error: error.message
    });
  }
});

// @route   POST /api/student-auth/forgot-password
// @desc    Solicitar redefinição de senha
// @access  Public
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email é obrigatório'
      });
    }

    const student = await Student.findOne({ 
      email: email.toLowerCase(),
      isEmailVerified: true 
    });

    if (!student) {
      // Por segurança, não revelar se o email existe ou não
      return res.json({
        success: true,
        message: 'Se o email existir, você receberá instruções para redefinir sua senha'
      });
    }

    // Gerar token de reset
    const resetToken = generateVerificationToken();
    student.passwordResetToken = resetToken;
    student.passwordResetExpires = Date.now() + 60 * 60 * 1000; // 1 hora
    
    await student.save();

    // Enviar email
    const emailResult = await sendPasswordResetEmail(student, resetToken, student.trainer);

    res.json({
      success: true,
      message: 'Se o email existir, você receberá instruções para redefinir sua senha',
      previewUrl: emailResult.previewUrl // Apenas para desenvolvimento
    });
  } catch (error) {
    console.error('❌ Erro ao solicitar redefinição de senha:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao processar solicitação',
      error: error.message
    });
  }
});

// @route   POST /api/student-auth/reset-password
// @desc    Redefinir senha com token
// @access  Public
router.post('/reset-password', async (req, res) => {
  try {
    const { email, token, password } = req.body;

    if (!email || !token || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email, token e nova senha são obrigatórios'
      });
    }

    // Buscar aluno com o token
    const student = await Student.findOne({
      email: email.toLowerCase(),
      passwordResetToken: token,
      passwordResetExpires: { $gt: Date.now() }
    }).select('+passwordResetToken +passwordResetExpires +password');

    if (!student) {
      return res.status(400).json({
        success: false,
        message: 'Token inválido ou expirado'
      });
    }

    // Validar senha
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'A senha deve ter no mínimo 6 caracteres'
      });
    }

    // Atualizar senha
    student.password = password;
    student.passwordResetToken = undefined;
    student.passwordResetExpires = undefined;
    
    await student.save();

    console.log('✅ Senha redefinida com sucesso:', student.email);

    res.json({
      success: true,
      message: 'Senha redefinida com sucesso! Você já pode fazer login.',
      data: {
        email: student.email,
        name: student.name
      }
    });
  } catch (error) {
    console.error('❌ Erro ao redefinir senha:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao redefinir senha',
      error: error.message
    });
  }
});

// @route   GET /api/student-auth/verify-token
// @desc    Verificar se um token é válido
// @access  Public
router.get('/verify-token', async (req, res) => {
  try {
    const { email, token, type } = req.query;

    if (!email || !token || !type) {
      return res.status(400).json({
        success: false,
        message: 'Email, token e tipo são obrigatórios'
      });
    }

    let query = { email: email.toLowerCase() };
    
    if (type === 'activation') {
      query.emailVerificationToken = token;
      query.emailVerificationExpires = { $gt: Date.now() };
    } else if (type === 'reset') {
      query.passwordResetToken = token;
      query.passwordResetExpires = { $gt: Date.now() };
    } else {
      return res.status(400).json({
        success: false,
        message: 'Tipo de token inválido'
      });
    }

    const student = await Student.findOne(query);

    if (!student) {
      return res.status(400).json({
        success: false,
        message: 'Token inválido ou expirado'
      });
    }

    res.json({
      success: true,
      message: 'Token válido',
      data: {
        name: student.name,
        email: student.email
      }
    });
  } catch (error) {
    console.error('❌ Erro ao verificar token:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao verificar token',
      error: error.message
    });
  }
});

export default router;
