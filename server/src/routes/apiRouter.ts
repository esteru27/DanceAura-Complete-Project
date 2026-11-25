import { Router } from 'express';
import authRoutes from './authRoutes';
import courseRoutes from './courseRoutes';
import enrollmentRoutes from './enrollmentRoutes';
import progressRoutes from './progressRoutes';
import instructorRoutes from './instructorRoutes';
import contactRoutes from './contactRoutes';
import adminRoutes from './adminRoutes';
import studentRoutes from './studentRoutes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/courses', courseRoutes);
router.use('/enrollments', enrollmentRoutes);
router.use('/progress', progressRoutes);
router.use('/instructors', instructorRoutes);
router.use('/contact', contactRoutes);
router.use('/admin', adminRoutes);
router.use('/student', studentRoutes);

export default router;
