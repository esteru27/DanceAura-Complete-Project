import { Response } from 'express';
import { Enrollment } from '../models/Enrollment';
import { DanceCourse } from '../models/DanceCourse';
import { User } from '../models/User';
import { AuthenticatedRequest } from '../types';

// @desc    Enroll student in a dance course
// @route   POST /api/enrollments
// @access  Private
export const enrollCourse = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { courseId, scheduleTime } = req.body;
    const studentId = req.user!._id;

    if (!courseId) {
      res.status(400).json({ success: false, message: 'Please provide courseId' });
      return;
    }

    const course = await DanceCourse.findById(courseId);
    if (!course) {
      res.status(404).json({ success: false, message: 'Dance course not found' });
      return;
    }

    // Check if already enrolled
    const existing = await Enrollment.findOne({
      student: studentId,
      course: courseId,
      paymentStatus: { $ne: 'cancelled' },
    });

    if (existing) {
      res.status(400).json({ success: false, message: 'You are already enrolled in this course' });
      return;
    }

    const enrollment = await Enrollment.create({
      student: studentId,
      course: courseId,
      amountPaid: course.price,
      paymentStatus: 'paid',
      danceType: course.category,
      scheduleTime: scheduleTime || course.schedule,
    });

    // Increment enrolled count
    await DanceCourse.findByIdAndUpdate(courseId, { $inc: { enrolledCount: 1 } });

    // Mark user as isPaid = true
    await User.findByIdAndUpdate(studentId, { isPaid: true });

    res.status(201).json({
      success: true,
      message: `Enrolled successfully in ${course.title}!`,
      enrollment,
    });
  } catch (error: any) {
    console.error('[Enrollment] Error:', error);
    res.status(500).json({ success: false, message: error.message || 'Error enrolling in course' });
  }
};

// @desc    Get current student's enrollments
// @route   GET /api/enrollments/my
// @access  Private
export const getStudentEnrollments = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const enrollments = await Enrollment.find({ student: req.user!._id })
      .populate('course')
      .sort({ enrolledAt: -1 });

    res.json({
      success: true,
      count: enrollments.length,
      enrollments,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Error fetching enrollments' });
  }
};

// @desc    Cancel an enrollment
// @route   PUT /api/enrollments/:id/cancel
// @access  Private
export const cancelEnrollment = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const enrollment = await Enrollment.findOne({
      _id: req.params.id,
      student: req.user!._id,
    });

    if (!enrollment) {
      res.status(404).json({ success: false, message: 'Enrollment not found' });
      return;
    }

    enrollment.paymentStatus = 'cancelled';
    await enrollment.save();

    await DanceCourse.findByIdAndUpdate(enrollment.course, { $inc: { enrolledCount: -1 } });

    res.json({ success: true, message: 'Enrollment cancelled successfully', enrollment });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Error cancelling enrollment' });
  }
};
