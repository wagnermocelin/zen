import express from 'express';
import Payment from '../models/Payment.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();
router.use(protect);

router.get('/', async (req, res) => {
  try {
    const query = req.userRole === 'student' 
      ? { student: req.user._id }
      : { trainer: req.user._id };
    const payments = await Payment.find(query).populate('student', 'name').sort('-year -month');
    res.json({ success: true, data: payments });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.post('/', authorize('trainer', 'professional'), async (req, res) => {
  try {
    const payment = await Payment.create({ ...req.body, trainer: req.user._id });
    res.status(201).json({ success: true, data: payment });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

router.put('/:id', authorize('trainer', 'professional'), async (req, res) => {
  try {
    const payment = await Payment.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, data: payment });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

router.delete('/:id', authorize('trainer', 'professional'), async (req, res) => {
  try {
    await Payment.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Pagamento deletado' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
