import { Router } from 'express';
import { getInstructors, getInstructorById, getInstructorDashboardStats } from '../controllers/instructorController';
import { protect, authorize } from '../middleware/authMiddleware';

const router = Router();

router.get('/', getInstructors);
router.get('/dashboard/stats', protect, authorize('instructor', 'admin'), getInstructorDashboardStats);
router.get('/:id', getInstructorById);

export default router;
