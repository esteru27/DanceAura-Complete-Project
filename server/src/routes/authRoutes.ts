import { Router } from 'express';
import {
  register,
  login,
  forgotPassword,
  resetPassword,
  getProfile,
  updateProfile,
  trackProgress,
  getProgress,
} from '../controllers/authController';
import { protect } from '../middleware/authMiddleware';

const router = Router();

// Public auth routes
router.post('/register', register);
router.post('/login', login);
router.post('/forgotpassword', forgotPassword);
router.post('/resetpassword/:resetToken', resetPassword);

// Protected routes
router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);
router.post('/trackprogress', protect, trackProgress);
router.get('/progress', protect, getProgress);

export default router;
