import express from 'express';
import Measurement from '../models/Measurement.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();
router.use(protect);

router.get('/', async (req, res) => {
  try {
    const query = req.userRole === 'student' 
      ? { student: req.user._id }
      : { trainer: req.user._id };
    const measurements = await Measurement.find(query)
      .populate('student', 'name')
      .populate('trainer', 'name');
    res.json({ success: true, data: measurements });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get('/student/:studentId', authorize('trainer', 'professional'), async (req, res) => {
  try {
    const measurements = await Measurement.find({ student: req.params.studentId })
      .populate('trainer', 'name')
      .sort('-date');
    res.json({ success: true, data: measurements });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.post('/', authorize('trainer', 'professional'), async (req, res) => {
  try {
    console.log('📊 POST /api/measurements - Dados recebidos:', req.body);
    console.log('👤 Trainer ID:', req.user._id);
    const measurementData = { ...req.body, trainer: req.user._id };
    console.log('📊 Dados a serem salvos:', measurementData);
    const measurement = await Measurement.create(measurementData);
    console.log('✅ Medida criada com sucesso:', measurement._id);
    res.status(201).json({ success: true, data: measurement });
  } catch (error) {
    console.error('❌ Erro ao criar medida:', error.message);
    console.error('❌ Detalhes:', error);
    res.status(400).json({ success: false, message: error.message });
  }
});

router.put('/:id', authorize('trainer', 'professional'), async (req, res) => {
  try {
    console.log('📝 PUT /api/measurements/:id - Atualizando medição');
    console.log('- ID:', req.params.id);
    console.log('- Dados recebidos:', req.body);
    
    const measurement = await Measurement.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!measurement) {
      console.log('❌ Medição não encontrada');
      return res.status(404).json({
        success: false,
        message: 'Medição não encontrada'
      });
    }
    
    console.log('✅ Medição atualizada com sucesso');
    res.json({
      success: true,
      data: measurement
    });
  } catch (error) {
    console.error('❌ Erro ao atualizar medição:', error.message);
    console.error('❌ Detalhes:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao atualizar medição',
      error: error.message
    });
  }
});

router.delete('/:id', authorize('trainer', 'professional'), async (req, res) => {
  try {
    const measurement = await Measurement.findByIdAndDelete(req.params.id);
    
    if (!measurement) {
      return res.status(404).json({
        success: false,
        message: 'Medição não encontrada'
      });
    }
    
    res.json({
      success: true,
      message: 'Medição deletada com sucesso'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erro ao deletar medição',
      error: error.message
    });
  }
});

export default router;
