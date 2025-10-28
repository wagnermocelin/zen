import express from 'express';
import Student from '../models/Student.js';
import Payment from '../models/Payment.js';
import { protect, authorize } from '../middleware/auth.js';
import { generateVerificationToken, sendVerificationEmail } from '../utils/emailService.js';

const router = express.Router();

router.use(protect);

// @route   GET /api/students
// @desc    Listar todos os alunos (compartilhado entre todos os usuários)
// @access  Private (Trainer)
router.get('/', authorize('trainer', 'professional'), async (req, res) => {
  try {
    // Remover filtro por trainer - retorna todos os alunos
    const students = await Student.find({}).select('-password');
    
    res.json({
      success: true,
      count: students.length,
      data: students
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erro ao buscar alunos',
      error: error.message
    });
  }
});

// @route   GET /api/students/:id
// @desc    Buscar aluno por ID
// @access  Private
router.get('/:id', async (req, res) => {
  try {
    const student = await Student.findById(req.params.id).select('-password');
    
    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Aluno não encontrado'
      });
    }
    
    res.json({
      success: true,
      data: student
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erro ao buscar aluno',
      error: error.message
    });
  }
});

// @route   POST /api/students
// @desc    Criar novo aluno
// @access  Private (Trainer)
router.post('/', authorize('trainer', 'professional'), async (req, res) => {
  try {
    console.log('👤 POST /api/students - Criando aluno');
    console.log('- Dados recebidos:', req.body);
    console.log('- Trainer ID:', req.user._id);
    
    // Remover senha dos dados se foi enviada (será criada pelo aluno)
    const { password, ...studentDataWithoutPassword } = req.body;
    
    const studentData = {
      ...studentDataWithoutPassword,
      trainer: req.user._id,
      isEmailVerified: false
    };
    
    console.log('- Dados a serem salvos:', studentData);
    
    const student = await Student.create(studentData);
    
    console.log('✅ Aluno criado com sucesso:', student._id);
    
    // Gerar token de verificação
    const verificationToken = generateVerificationToken();
    student.emailVerificationToken = verificationToken;
    student.emailVerificationExpires = Date.now() + 24 * 60 * 60 * 1000; // 24 horas
    
    await student.save();
    
    // Enviar email de verificação
    try {
      const emailResult = await sendVerificationEmail(student, verificationToken, req.user._id);
      console.log('📧 Email de verificação enviado para:', student.email);
      
      res.status(201).json({
        success: true,
        message: 'Aluno criado com sucesso! Email de ativação enviado.',
        data: student,
        emailPreviewUrl: emailResult.previewUrl // Apenas para desenvolvimento
      });
    } catch (emailError) {
      console.error('⚠️ Erro ao enviar email, mas aluno foi criado:', emailError);
      
      // Aluno foi criado, mas email falhou
      res.status(201).json({
        success: true,
        message: 'Aluno criado, mas houve erro ao enviar email de ativação',
        data: student,
        emailError: emailError.message
      });
    }
  } catch (error) {
    console.error('❌ Erro ao criar aluno:', error.message);
    console.error('❌ Detalhes completos:', error);
    
    // Verificar se é erro de validação do Mongoose
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(e => e.message);
      return res.status(400).json({
        success: false,
        message: 'Erro de validação',
        errors: errors
      });
    }
    
    // Verificar se é erro de duplicação (email já existe)
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Email já cadastrado'
      });
    }
    
    res.status(400).json({
      success: false,
      message: 'Erro ao criar aluno',
      error: error.message
    });
  }
});

// @route   PUT /api/students/:id
// @desc    Atualizar aluno
// @access  Private (Trainer)
router.put('/:id', authorize('trainer', 'professional'), async (req, res) => {
  try {
    const student = await Student.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).select('-password');
    
    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Aluno não encontrado'
      });
    }
    
    res.json({
      success: true,
      data: student
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Erro ao atualizar aluno',
      error: error.message
    });
  }
});

// @route   DELETE /api/students/:id
// @desc    Deletar aluno
// @access  Private (Trainer)
router.delete('/:id', authorize('trainer', 'professional'), async (req, res) => {
  try {
    const student = await Student.findByIdAndDelete(req.params.id);
    
    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Aluno não encontrado'
      });
    }
    
    res.json({
      success: true,
      message: 'Aluno deletado com sucesso'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erro ao deletar aluno',
      error: error.message
    });
  }
});

// @route   POST /api/students/:id/unblock
// @desc    Desbloquear aluno
// @access  Private (Trainer)
router.post('/:id/unblock', authorize('trainer', 'professional'), async (req, res) => {
  try {
    const student = await Student.findByIdAndUpdate(
      req.params.id,
      { 
        blocked: false,
        blockReason: null
      },
      { new: true }
    ).select('-password');
    
    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Aluno não encontrado'
      });
    }
    
    res.json({
      success: true,
      message: 'Aluno desbloqueado com sucesso',
      data: student
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erro ao desbloquear aluno',
      error: error.message
    });
  }
});

// @route   POST /api/students/:id/block
// @desc    Bloquear aluno manualmente
// @access  Private (Trainer)
router.post('/:id/block', authorize('trainer', 'professional'), async (req, res) => {
  try {
    const student = await Student.findByIdAndUpdate(
      req.params.id,
      { 
        blocked: true,
        blockReason: 'manual'
      },
      { new: true }
    ).select('-password');
    
    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Aluno não encontrado'
      });
    }
    
    res.json({
      success: true,
      message: 'Aluno bloqueado com sucesso',
      data: student
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erro ao bloquear aluno',
      error: error.message
    });
  }
});

// @route   POST /api/students/check-overdue
// @desc    Verificar e bloquear alunos com pagamentos atrasados
// @access  Private (Trainer)
router.post('/check-overdue', authorize('trainer', 'professional'), async (req, res) => {
  try {
    const today = new Date();
    
    // Buscar pagamentos atrasados
    const overduePayments = await Payment.find({
      trainer: req.user._id,
      status: { $in: ['pending', 'overdue'] },
      dueDate: { $lt: today }
    });
    
    // Atualizar status dos pagamentos para overdue
    await Payment.updateMany(
      {
        trainer: req.user._id,
        status: 'pending',
        dueDate: { $lt: today }
      },
      { status: 'overdue' }
    );
    
    // Buscar IDs únicos de alunos com pagamentos atrasados
    const studentIds = [...new Set(overduePayments.map(p => p.student.toString()))];
    
    // Bloquear alunos inadimplentes
    const result = await Student.updateMany(
      {
        _id: { $in: studentIds },
        trainer: req.user._id,
        blocked: false
      },
      {
        blocked: true,
        blockReason: 'payment_overdue'
      }
    );
    
    res.json({
      success: true,
      message: `${result.modifiedCount} aluno(s) bloqueado(s) por inadimplência`,
      blockedCount: result.modifiedCount
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erro ao verificar inadimplência',
      error: error.message
    });
  }
});

export default router;
