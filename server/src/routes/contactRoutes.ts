import { Router } from 'express';
import { submitContact, getContactMessages } from '../controllers/contactController';
import { protect, authorize } from '../middleware/authMiddleware';

const router = Router();

router.post('/', submitContact);
router.get('/', protect, authorize('instructor', 'admin'), getContactMessages);

export default router;
