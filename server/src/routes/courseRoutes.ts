import { Router } from 'express';
import {
  getCourses,
  getCourseById,
  getCategories,
  createCourse,
  updateCourse,
  deleteCourse,
} from '../controllers/courseController';
import { protect, authorize } from '../middleware/authMiddleware';

const router = Router();

// Public routes
router.get('/categories', getCategories);
router.get('/', getCourses);
router.get('/:id', getCourseById);

// Protected management routes
router.post('/', protect, authorize('instructor', 'admin'), createCourse);
router.put('/:id', protect, authorize('instructor', 'admin'), updateCourse);
router.delete('/:id', protect, authorize('instructor', 'admin'), deleteCourse);

export default router;
