import { Router } from 'express';
import {
  getAdminDashboard,
  getStudents,
  getStudentById,
  updateStudent,
  deleteStudent,
  getInstructors,
  createInstructor,
  updateInstructor,
  deleteInstructor,
  getCourses,
  createCourse,
  updateCourse,
  deleteCourse,
} from '../controllers/adminController';
import { protect, authorize } from '../middleware/authMiddleware';

const router = Router();

// Strict Admin Security: All routes require authenticated Admin
router.use(protect);
router.use(authorize('admin'));

// A. Overview
router.get('/dashboard', getAdminDashboard);

// B. Students
router.get('/students', getStudents);
router.get('/students/:id', getStudentById);
router.put('/students/:id', updateStudent);
router.delete('/students/:id', deleteStudent);

// C. Instructors
router.get('/instructors', getInstructors);
router.post('/instructors', createInstructor);
router.put('/instructors/:id', updateInstructor);
router.delete('/instructors/:id', deleteInstructor);

// D. Courses
router.get('/courses', getCourses);
router.post('/courses', createCourse);
router.put('/courses/:id', updateCourse);
router.delete('/courses/:id', deleteCourse);

export default router;
