import express from 'express';
import { createCompany, getCompany, updateCompany, deleteCompany, getAllCompanies, getPublicCompany } from '../controllers/companyController.js';
import { protect } from '../middleware/authMiddleware.js';
import upload from '../lib/multer.js';

const router = express.Router();

// Configure multer for multiple file uploads
const uploadFields = [
  { name: 'logo', maxCount: 1 },
  { name: 'aboutImage', maxCount: 1 },
  { name: 'missionImage', maxCount: 1 },
  { name: 'visionImage', maxCount: 1 },
  { name: 'heroImage', maxCount: 1 },
  { name: 'heroImages', maxCount: 5 },
  { name: 'testimonialImages', maxCount: 10 },
  { name: 'paymentQR', maxCount: 1 },
  { name: 'professionalImages', maxCount: 10 }
];

// Basic CRUD routes
router.post('/', protect, upload.fields(uploadFields), createCompany);
router.get('/', getAllCompanies);
router.get('/public/:id', getPublicCompany);
router.get('/:id', getCompany);
router.put('/:id', protect, upload.fields(uploadFields), updateCompany);
router.delete('/:id', protect, deleteCompany);


export default router;
