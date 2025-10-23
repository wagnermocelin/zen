import express from 'express';
import Config from '../models/Config.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();
router.use(protect);
router.use(authorize('trainer', 'professional'));

router.get('/', async (req, res) => {
  try {
    let config = await Config.findOne({ trainer: req.user._id });
    if (!config) {
      config = await Config.create({ trainer: req.user._id });
    }
    res.json({ success: true, data: config });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.put('/', async (req, res) => {
  try {
    let config = await Config.findOne({ trainer: req.user._id });
    if (!config) {
      config = await Config.create({ ...req.body, trainer: req.user._id });
    } else {
      config = await Config.findByIdAndUpdate(config._id, req.body, { new: true });
    }
    res.json({ success: true, data: config });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

export default router;
