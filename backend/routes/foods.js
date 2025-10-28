import express from 'express';
import Food from '../models/Food.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();
router.use(protect);

// @route   GET /api/foods
// @desc    Listar todos os alimentos (padrão + customizados do trainer)
// @access  Private
router.get('/', async (req, res) => {
  try {
    const { search, category, popular } = req.query;
    
    let query = {
      $or: [
        { isCustom: false }, // Alimentos padrão (TACO)
        { trainer: req.user._id } // Alimentos customizados do próprio trainer
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
    
    // Filtro por populares
    if (popular === 'true') {
      query.popular = true;
    }
    
    const foods = await Food.find(query)
      .sort({ popular: -1, name: 1 })
      .limit(100);
    
    res.json({ success: true, data: foods });
  } catch (error) {
    console.error('Erro ao buscar alimentos:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   GET /api/foods/:id
// @desc    Buscar alimento por ID
// @access  Private
router.get('/:id', async (req, res) => {
  try {
    const food = await Food.findById(req.params.id);
    
    if (!food) {
      return res.status(404).json({ success: false, message: 'Alimento não encontrado' });
    }
    
    // Verificar se o alimento é customizado e pertence ao trainer
    if (food.isCustom && food.trainer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Acesso negado' });
    }
    
    res.json({ success: true, data: food });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   POST /api/foods
// @desc    Criar alimento customizado
// @access  Private (Trainer)
router.post('/', async (req, res) => {
  try {
    const food = await Food.create({
      ...req.body,
      isCustom: true,
      trainer: req.user._id,
      source: 'Manual'
    });
    
    res.status(201).json({ success: true, data: food });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// @route   PUT /api/foods/:id
// @desc    Atualizar alimento customizado
// @access  Private (Trainer)
router.put('/:id', async (req, res) => {
  try {
    const food = await Food.findById(req.params.id);
    
    if (!food) {
      return res.status(404).json({ success: false, message: 'Alimento não encontrado' });
    }
    
    // Apenas alimentos customizados podem ser editados
    if (!food.isCustom) {
      return res.status(403).json({ success: false, message: 'Não é possível editar alimentos padrão' });
    }
    
    // Verificar se pertence ao trainer
    if (food.trainer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Acesso negado' });
    }
    
    const updatedFood = await Food.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    res.json({ success: true, data: updatedFood });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// @route   DELETE /api/foods/:id
// @desc    Deletar alimento customizado
// @access  Private (Trainer)
router.delete('/:id', async (req, res) => {
  try {
    const food = await Food.findById(req.params.id);
    
    if (!food) {
      return res.status(404).json({ success: false, message: 'Alimento não encontrado' });
    }
    
    // Apenas alimentos customizados podem ser deletados
    if (!food.isCustom) {
      return res.status(403).json({ success: false, message: 'Não é possível deletar alimentos padrão' });
    }
    
    // Verificar se pertence ao trainer
    if (food.trainer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Acesso negado' });
    }
    
    await food.deleteOne();
    
    res.json({ success: true, message: 'Alimento deletado com sucesso' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   GET /api/foods/categories/list
// @desc    Listar categorias disponíveis
// @access  Private
router.get('/categories/list', async (req, res) => {
  try {
    const categories = [
      { value: 'proteina', label: 'Proteína', icon: '🥩' },
      { value: 'carboidrato', label: 'Carboidrato', icon: '🍞' },
      { value: 'vegetal', label: 'Vegetal', icon: '🥬' },
      { value: 'fruta', label: 'Fruta', icon: '🍎' },
      { value: 'gordura', label: 'Gordura', icon: '🥑' },
      { value: 'lacteo', label: 'Laticínio', icon: '🥛' },
      { value: 'bebida', label: 'Bebida', icon: '🥤' },
      { value: 'outro', label: 'Outro', icon: '🍽️' }
    ];
    
    res.json({ success: true, data: categories });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   POST /api/foods/:id/calculate
// @desc    Calcular macros para quantidade específica
// @access  Private
router.post('/:id/calculate', async (req, res) => {
  try {
    const { amount, unit } = req.body;
    
    const food = await Food.findById(req.params.id);
    
    if (!food) {
      return res.status(404).json({ success: false, message: 'Alimento não encontrado' });
    }
    
    const macros = food.calculateMacros(amount, unit);
    
    res.json({ 
      success: true, 
      data: {
        food: food.name,
        amount,
        unit,
        macros
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
