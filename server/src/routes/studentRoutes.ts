import { Router } from 'express';
import {
  getStudentDashboard,
  getStudentProgress,
  getCourseLessonsProgress,
  completeLesson,
  uncompleteLesson,
} from '../controllers/studentProgressController';
import { protect } from '../middleware/authMiddleware';

const router = Router();

// Protected for authenticated students (and instructors/admins)
router.use(protect);

router.get('/dashboard', getStudentDashboard);
router.get('/progress', getStudentProgress);
router.get('/courses/:courseId/progress', getCourseLessonsProgress);
router.post('/lessons/:lessonId/complete', completeLesson);
router.post('/lessons/:lessonId/uncomplete', uncompleteLesson);

export default router;
