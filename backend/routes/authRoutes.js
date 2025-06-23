import express from 'express';
import { registerUser, loginUser, getUser, getProfile, updateAdminProfile, logoutUser, getCurrentUser, deleteUser, getUsers, updateUserByAdmin, getUserById } from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';
import upload from '../lib/multer.js';

const router = express.Router();



router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/me', protect, getUser);
router.get('/profile', protect, getProfile);
router.put('/profile', protect, upload.fields([{ name: 'profilePic', maxCount: 1 }]), updateAdminProfile);
router.get('/users', protect, getUsers);
router.get('/current-user', protect, getCurrentUser);
router.delete('/users/:id', protect, deleteUser);
router.put('/users/:id', protect, updateUserByAdmin);
router.get('/users/:id', protect, getUserById);
router.post('/logout', protect, logoutUser);

export default router;