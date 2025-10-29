import express from 'express';
import Exercise from '../models/Exercise.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();
router.use(protect);

// @route   GET /api/exercises
// @desc    Listar todos os exercícios (padrão + customizados do trainer)
// @access  Private
router.get('/', async (req, res) => {
  try {
    console.log('💪 GET /api/exercises - Requisição recebida');
    console.log('Query params:', req.query);
    
    const { search, category, muscleGroup, equipment, difficulty, popular } = req.query;
    
    let query = {
      $or: [
        { isCustom: false }, // Exercícios padrão
        { trainer: req.user._id } // Exercícios customizados do próprio trainer
      ]
    };
    
    // Filtro por busca (nome ou tags)
    if (search) {
      query.$text = { $search: search };
    }
    
    // Filtro por categoria
    if (category) {
      query.category = category;
    }
    
    // Filtro por grupo muscular
    if (muscleGroup) {
      query.muscleGroup = muscleGroup;
    }
    
    // Filtro por equipamento
    if (equipment) {
      query.equipment = equipment;
    }
    
    // Filtro por dificuldade
    if (difficulty) {
      query.difficulty = difficulty;
    }
    
    // Filtro por populares
    if (popular === 'true') {
      query.popular = true;
    }
    
    console.log('Query final:', JSON.stringify(query));
    
    const exercises = await Exercise.find(query)
      .sort({ isCustom: -1, popular: -1, name: 1 }) // Customizados primeiro, depois populares, depois alfabético
      .limit(1000);
    
    console.log(`✅ ${exercises.length} exercícios encontrados`);
    
    res.json({ success: true, data: exercises });
  } catch (error) {
    console.error('Erro ao buscar exercícios:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   GET /api/exercises/:id
// @desc    Buscar exercício por ID
// @access  Private
router.get('/:id', async (req, res) => {
  try {
    const exercise = await Exercise.findById(req.params.id);
    
    if (!exercise) {
      return res.status(404).json({ success: false, message: 'Exercício não encontrado' });
    }
    
    // Verificar se o exercício é customizado e pertence ao trainer
    if (exercise.isCustom && exercise.trainer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Acesso negado' });
    }
    
    res.json({ success: true, data: exercise });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   POST /api/exercises
// @desc    Criar exercício customizado
// @access  Private (Trainer)
router.post('/', async (req, res) => {
  try {
    const exercise = await Exercise.create({
      ...req.body,
      isCustom: true,
      trainer: req.user._id
    });
    
    res.status(201).json({ success: true, data: exercise });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// @route   PUT /api/exercises/:id
// @desc    Atualizar exercício customizado
// @access  Private (Trainer)
router.put('/:id', async (req, res) => {
  try {
    const exercise = await Exercise.findById(req.params.id);
    
    if (!exercise) {
      return res.status(404).json({ success: false, message: 'Exercício não encontrado' });
    }
    
    // Apenas exercícios customizados podem ser editados
    if (!exercise.isCustom) {
      return res.status(403).json({ success: false, message: 'Não é possível editar exercícios padrão' });
    }
    
    // Verificar se pertence ao trainer
    if (exercise.trainer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Acesso negado' });
    }
    
    const updatedExercise = await Exercise.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    res.json({ success: true, data: updatedExercise });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// @route   DELETE /api/exercises/:id
// @desc    Deletar exercício customizado
// @access  Private (Trainer)
router.delete('/:id', async (req, res) => {
  try {
    const exercise = await Exercise.findById(req.params.id);
    
    if (!exercise) {
      return res.status(404).json({ success: false, message: 'Exercício não encontrado' });
    }
    
    // Apenas exercícios customizados podem ser deletados
    if (!exercise.isCustom) {
      return res.status(403).json({ success: false, message: 'Não é possível deletar exercícios padrão' });
    }
    
    // Verificar se pertence ao trainer
    if (exercise.trainer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Acesso negado' });
    }
    
    await exercise.deleteOne();
    
    res.json({ success: true, message: 'Exercício deletado com sucesso' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
