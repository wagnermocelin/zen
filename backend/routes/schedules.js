import express from 'express';
import Schedule from '../models/Schedule.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();
router.use(protect);

router.get('/', async (req, res) => {
  try {
    const query = req.userRole === 'student' 
      ? { student: req.user._id }
      : { trainer: req.user._id };
    const schedules = await Schedule.find(query)
      .populate('student', 'name');
    res.json({ success: true, data: schedules });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.post('/', authorize('trainer', 'professional'), async (req, res) => {
  try {
    console.log('📅 POST /api/schedules - Criando ficha');
    console.log('- Dados recebidos:', JSON.stringify(req.body, null, 2));
    console.log('- weekSchedule:', req.body.weekSchedule);
    
    const schedule = await Schedule.create({ ...req.body, trainer: req.user._id });
    
    console.log('✅ Ficha criada:', schedule._id);
    console.log('- weekSchedule salvo:', schedule.weekSchedule);
    
    res.status(201).json({ success: true, data: schedule });
  } catch (error) {
    console.error('❌ Erro ao criar ficha:', error.message);
    res.status(400).json({ success: false, message: error.message });
  }
});

router.put('/:id', authorize('trainer', 'professional'), async (req, res) => {
  try {
    console.log('📅 PUT /api/schedules/:id - Atualizando ficha');
    console.log('- ID:', req.params.id);
    console.log('- Dados recebidos:', JSON.stringify(req.body, null, 2));
    console.log('- weekSchedule:', req.body.weekSchedule);
    
    const schedule = await Schedule.findByIdAndUpdate(req.params.id, req.body, { new: true });
    
    console.log('✅ Ficha atualizada');
    console.log('- weekSchedule salvo:', schedule.weekSchedule);
    
    res.json({ success: true, data: schedule });
  } catch (error) {
    console.error('❌ Erro ao atualizar ficha:', error.message);
    res.status(400).json({ success: false, message: error.message });
  }
});

router.delete('/:id', authorize('trainer', 'professional'), async (req, res) => {
  try {
    await Schedule.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Ficha deletada' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
