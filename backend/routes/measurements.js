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
    const measurements = await Measurement.find(query).populate('student', 'name');
    res.json({ success: true, data: measurements });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get('/student/:studentId', authorize('trainer', 'professional'), async (req, res) => {
  try {
    const measurements = await Measurement.find({ student: req.params.studentId }).sort('-date');
    res.json({ success: true, data: measurements });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.post('/', authorize('trainer', 'professional'), async (req, res) => {
  try {
    const measurement = await Measurement.create({ ...req.body, trainer: req.user._id });
    res.status(201).json({ success: true, data: measurement });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

export default router;
