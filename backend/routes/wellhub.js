import express from 'express';
import wellhubService from '../services/wellhubService.js';
import WellhubUser from '../models/WellhubUser.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

/**
 * @route   GET /api/wellhub/auth
 * @desc    Endpoint para Wellhub obter access token
 * @access  Public (requer API Key)
 */
router.get('/auth', async (req, res) => {
  try {
    const apiKey = req.headers['x-api-key'];

    // Validar API Key
    if (!apiKey || apiKey !== process.env.WELLHUB_API_KEY) {
      return res.status(403).json({
        error: 'Forbidden',
        message: 'Missing or invalid API key'
      });
    }

    // Para simplificar, vamos usar um trainer padrão
    // Em produção, você pode ter lógica para identificar o trainer
    const trainerId = process.env.DEFAULT_TRAINER_ID;

    const tokenData = await wellhubService.getAccessToken(trainerId);

    res.status(200).json(tokenData);

  } catch (error) {
    console.error('Erro no endpoint /auth:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: error.message
    });
  }
});

/**
 * @route   POST /api/wellhub/register
 * @desc    Endpoint para Wellhub registrar usuário
 * @access  Public (requer Bearer token)
 */
router.post('/register', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;

    // Validar Bearer token
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Missing or invalid access token'
      });
    }

    const token = authHeader.split(' ')[1];

    // Validar token (simplificado - em produção, validar contra o banco)
    // TODO: Implementar validação completa do token

    const {
      gympass_user_id,
      email,
      first_name,
      last_name,
      origin,
      user_status,
      country_code
    } = req.body;

    // Validar dados obrigatórios
    if (!gympass_user_id) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'gympass_user_id is required'
      });
    }

    // Para simplificar, vamos usar um trainer padrão
    const trainerId = process.env.DEFAULT_TRAINER_ID;

    const result = await wellhubService.registerUser({
      gympass_user_id,
      email,
      first_name,
      last_name,
      origin,
      user_status,
      country_code
    }, trainerId);

    res.status(200).json(result);

  } catch (error) {
    console.error('Erro no endpoint /register:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: error.message
    });
  }
});

/**
 * @route   POST /api/wellhub/checkin
 * @desc    Registrar check-in de usuário Wellhub
 * @access  Protected
 */
router.post('/checkin', protect, async (req, res) => {
  try {
    const { gympass_user_id, origin, notes } = req.body;

    if (!gympass_user_id) {
      return res.status(400).json({
        success: false,
        message: 'gympass_user_id é obrigatório'
      });
    }

    const result = await wellhubService.registerCheckIn(
      gympass_user_id,
      origin,
      notes
    );

    res.status(200).json(result);

  } catch (error) {
    console.error('Erro ao registrar check-in:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

/**
 * @route   GET /api/wellhub/users
 * @desc    Listar usuários Wellhub
 * @access  Protected
 */
router.get('/users', protect, async (req, res) => {
  try {
    const users = await WellhubUser.find({ trainer: req.user._id })
      .populate('student', 'name email phone')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: users.length,
      data: users
    });

  } catch (error) {
    console.error('Erro ao listar usuários:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

/**
 * @route   GET /api/wellhub/users/:gympassUserId
 * @desc    Obter detalhes de um usuário Wellhub
 * @access  Protected
 */
router.get('/users/:gympassUserId', protect, async (req, res) => {
  try {
    const user = await WellhubUser.findOne({
      gympassUserId: req.params.gympassUserId,
      trainer: req.user._id
    }).populate('student', 'name email phone photo');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuário não encontrado'
      });
    }

    res.status(200).json({
      success: true,
      data: user
    });

  } catch (error) {
    console.error('Erro ao obter usuário:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

/**
 * @route   POST /api/wellhub/link-student
 * @desc    Vincular usuário Wellhub a um aluno existente
 * @access  Protected
 */
router.post('/link-student', protect, async (req, res) => {
  try {
    const { gympass_user_id, student_id } = req.body;

    if (!gympass_user_id || !student_id) {
      return res.status(400).json({
        success: false,
        message: 'gympass_user_id e student_id são obrigatórios'
      });
    }

    const result = await wellhubService.linkToStudent(
      gympass_user_id,
      student_id
    );

    res.status(200).json({
      success: true,
      data: result
    });

  } catch (error) {
    console.error('Erro ao vincular usuário:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

/**
 * @route   GET /api/wellhub/stats
 * @desc    Obter estatísticas de check-ins
 * @access  Protected
 */
router.get('/stats', protect, async (req, res) => {
  try {
    const { start_date, end_date } = req.query;

    const stats = await wellhubService.getCheckInStats(
      req.user._id,
      start_date,
      end_date
    );

    res.status(200).json({
      success: true,
      data: stats
    });

  } catch (error) {
    console.error('Erro ao obter estatísticas:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

export default router;
