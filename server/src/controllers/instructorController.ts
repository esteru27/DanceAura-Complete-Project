import { Request, Response } from 'express';
import { Instructor } from '../models/Instructor';
import { DanceCourse } from '../models/DanceCourse';
import { Enrollment } from '../models/Enrollment';
import { AuthenticatedRequest } from '../types';

// @desc    Get all studio instructors
// @route   GET /api/instructors
// @access  Public
export const getInstructors = async (req: Request, res: Response): Promise<void> => {
  try {
    const instructors = await Instructor.find({ active: true }).sort({ rating: -1 });
    res.json({
      success: true,
      count: instructors.length,
      instructors,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Error fetching instructors' });
  }
};

// @desc    Get single instructor by ID
// @route   GET /api/instructors/:id
// @access  Public
export const getInstructorById = async (req: Request, res: Response): Promise<void> => {
  try {
    const instructor = await Instructor.findById(req.params.id);
    if (!instructor) {
      res.status(404).json({ success: false, message: 'Instructor not found' });
      return;
    }

    const courses = await DanceCourse.find({
      $or: [{ instructor: instructor._id }, { instructorName: instructor.name }],
    });

    res.json({ success: true, instructor, courses });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Error fetching instructor details' });
  }
};

// @desc    Instructor Dashboard Stats & enrolled students
// @route   GET /api/instructors/dashboard/stats
// @access  Private (Instructor or Admin)
export const getInstructorDashboardStats = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const courses = await DanceCourse.find({ active: true });
    const enrollments = await Enrollment.find({ paymentStatus: 'paid' }).populate('student', 'firstName lastName email phone danceType');

    const totalStudents = enrollments.length;
    const totalCourses = courses.length;
    const totalRevenue = enrollments.reduce((sum, curr) => sum + (curr.amountPaid || 0), 0);

    res.json({
      success: true,
      stats: {
        totalCourses,
        totalStudents,
        totalRevenue,
        recentEnrollments: enrollments.slice(0, 10),
        activeCourses: courses,
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Error loading instructor stats' });
  }
};
