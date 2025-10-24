import express from 'express';
import Diet from '../models/Diet.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();
router.use(protect);

router.get('/', async (req, res) => {
  try {
    // Remover filtro por trainer - retorna todas as dietas
    const diets = await Diet.find({}).populate('student', 'name');
    res.json({ success: true, data: diets });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.post('/', authorize('trainer', 'professional'), async (req, res) => {
  try {
    const diet = await Diet.create({ ...req.body, trainer: req.user._id });
    res.status(201).json({ success: true, data: diet });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

router.put('/:id', authorize('trainer', 'professional'), async (req, res) => {
  try {
    const diet = await Diet.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, data: diet });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

router.delete('/:id', authorize('trainer', 'professional'), async (req, res) => {
  try {
    await Diet.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Dieta deletada' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
