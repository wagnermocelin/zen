import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Student from '../models/Student.js';

const router = express.Router();

// Gerar JWT Token
const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE
  });
};

// @route   POST /api/auth/login
// @desc    Login de usuário (trainer/professional) ou aluno
// @access  Public
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Por favor, forneça email e senha'
      });
    }

    // Verificar se é um profissional
    let user = await User.findOne({ email }).select('+password');
    
    if (user) {
      if (user.status !== 'active') {
        return res.status(401).json({
          success: false,
          message: 'Usuário inativo'
        });
      }

      const isMatch = await user.matchPassword(password);
      
      if (!isMatch) {
        return res.status(401).json({
          success: false,
          message: 'Credenciais inválidas'
        });
      }

      const token = generateToken(user._id, user.role);

      return res.json({
        success: true,
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role
        }
      });
    }

    // Verificar se é um aluno
    user = await Student.findOne({ email }).select('+password');
    
    if (user) {
      if (user.status !== 'active') {
        return res.status(401).json({
          success: false,
          message: 'Aluno inativo'
        });
      }

      const isMatch = await user.matchPassword(password);
      
      if (!isMatch) {
        return res.status(401).json({
          success: false,
          message: 'Credenciais inválidas'
        });
      }

      const token = generateToken(user._id, 'student');

      return res.json({
        success: true,
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: 'student'
        }
      });
    }

    return res.status(401).json({
      success: false,
      message: 'Credenciais inválidas'
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erro no servidor',
      error: error.message
    });
  }
});

// @route   POST /api/auth/register
// @desc    Registrar primeiro usuário admin
// @access  Public (apenas se não houver usuários)
router.post('/register', async (req, res) => {
  try {
    const userCount = await User.countDocuments();
    
    if (userCount > 0) {
      return res.status(403).json({
        success: false,
        message: 'Registro não permitido. Use a área administrativa.'
      });
    }

    const { name, email, password } = req.body;

    const user = await User.create({
      name,
      email,
      password,
      role: 'trainer',
      status: 'active'
    });

    const token = generateToken(user._id, user.role);

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erro ao criar usuário',
      error: error.message
    });
  }
});

export default router;
