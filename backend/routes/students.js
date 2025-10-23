import express from 'express';
import Student from '../models/Student.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

// @route   GET /api/students
// @desc    Listar todos os alunos do trainer
// @access  Private (Trainer)
router.get('/', authorize('trainer', 'professional'), async (req, res) => {
  try {
    const students = await Student.find({ trainer: req.user._id }).select('-password');
    
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
    const studentData = {
      ...req.body,
      trainer: req.user._id
    };
    
    const student = await Student.create(studentData);
    
    res.status(201).json({
      success: true,
      data: student
    });
  } catch (error) {
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

export default router;
