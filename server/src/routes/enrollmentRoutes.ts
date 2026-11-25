import { Router } from 'express';
import { enrollCourse, getStudentEnrollments, cancelEnrollment } from '../controllers/enrollmentController';
import { protect } from '../middleware/authMiddleware';

const router = Router();

router.use(protect);
router.post('/', enrollCourse);
router.get('/my', getStudentEnrollments);
router.put('/:id/cancel', cancelEnrollment);

export default router;
