import express from 'express';
import Viewer from '../models/Viewer.js';
const router = express.Router();

// Get all viewers
router.get('/', async (req, res) => {
  try {
    const viewers = await Viewer.find().sort({ visitedAt: -1 });
    res.json(viewers);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch viewers' });
  }
});

export default router; 