import express from 'express';
import { getPaymentInfo } from '../controllers/paymentController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Only allow authenticated users with payment_viewer or admin role
router.get('/', protect, (req, res, next) => {
  
  if (req.user.type !== 'admin' && req.user.type !== 'payment_viewer' && req.user.type !== 'super_admin') {
    return res.status(403).json({ 
      message: 'Not authorized for payment access',
      userType: req.user.type // Include user type in response for debugging
    });
  }
  next();
}, getPaymentInfo);

export default router;
