import { Router } from 'express';
import { getProgressSummary, getProgressByStyle } from '../controllers/progressController';
import { protect } from '../middleware/authMiddleware';

const router = Router();

router.use(protect);
router.get('/summary', getProgressSummary);
router.get('/:style/:level', getProgressByStyle);

export default router;
