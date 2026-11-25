import { Response } from 'express';
import { Enrollment } from '../models/Enrollment';
import { DanceCourse } from '../models/DanceCourse';
import { Lesson } from '../models/Lesson';
import { LessonProgress } from '../models/LessonProgress';
import { User } from '../models/User';
import { AuthenticatedRequest } from '../types';

// ==========================================
// FEATURE 2: STUDENT LEARNING PROGRESS APIS
// ==========================================

// @desc    Get student overall progress overview and dashboard summary
// @route   GET /api/student/dashboard
// @access  Private (Student)
export const getStudentDashboard = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const studentId = req.user!._id;

    // Fetch student's enrollments populated with course
    const enrollments = await Enrollment.find({
      student: studentId,
      paymentStatus: { $ne: 'cancelled' },
    })
      .populate('course')
      .sort({ lastAccessedAt: -1 });

    const totalEnrolledCourses = enrollments.length;

    // Fetch all completed lessons for this student
    const completedProgressRecords = await LessonProgress.find({
      student: studentId,
      completed: true,
    });

    const completedLessonsCount = completedProgressRecords.length;

    // Fetch total lessons across all enrolled courses
    const enrolledCourseIds = enrollments.map((e) => e.course?._id).filter(Boolean);
    const totalLessonsAvailable = await Lesson.countDocuments({
      course: { $in: enrolledCourseIds },
    });

    const pendingLessonsCount = Math.max(0, totalLessonsAvailable - completedLessonsCount);

    const overallProgress =
      totalLessonsAvailable > 0
        ? Math.min(100, Math.round((completedLessonsCount / totalLessonsAvailable) * 100))
        : 0;

    const completedCoursesCount = enrollments.filter((e) => e.isCompleted).length;

    // Recently accessed courses
    const recentlyAccessed = enrollments.slice(0, 3).map((e: any) => ({
      enrollmentId: e._id,
      courseId: e.course?._id,
      title: e.course?.title,
      category: e.course?.category,
      level: e.course?.level,
      image: e.course?.image,
      progressPercentage: e.progressPercentage,
      isCompleted: e.isCompleted,
      lastAccessedAt: e.lastAccessedAt,
    }));

    res.json({
      success: true,
      student: {
        _id: req.user!._id,
        name: `${req.user!.firstName} ${req.user!.lastName}`,
        email: req.user!.email,
        phone: req.user!.phone,
        danceType: req.user!.danceType,
        isPaid: req.user!.isPaid,
      },
      stats: {
        totalEnrolledCourses,
        completedLessonsCount,
        pendingLessonsCount,
        totalLessonsAvailable,
        overallProgress,
        completedCoursesCount,
      },
      recentlyAccessed,
    });
  } catch (error: any) {
    console.error('[StudentProgress] getStudentDashboard error:', error);
    res.status(500).json({ success: false, message: 'Error loading student dashboard' });
  }
};

// @desc    Get progress details across all enrolled courses
// @route   GET /api/student/progress
// @access  Private (Student)
export const getStudentProgress = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const studentId = req.user!._id;

    const enrollments = await Enrollment.find({
      student: studentId,
      paymentStatus: { $ne: 'cancelled' },
    })
      .populate('course')
      .sort({ enrolledAt: -1 });

    const courseProgressList = await Promise.all(
      enrollments.map(async (enr: any) => {
        const course = enr.course;
        if (!course) return null;

        const totalLessons = await Lesson.countDocuments({ course: course._id });
        const completedCount = await LessonProgress.countDocuments({
          student: studentId,
          course: course._id,
          completed: true,
        });

        const percentage =
          totalLessons > 0 ? Math.min(100, Math.round((completedCount / totalLessons) * 100)) : 0;

        return {
          enrollmentId: enr._id,
          courseId: course._id,
          title: course.title,
          category: course.category,
          level: course.level,
          image: course.image,
          instructorName: course.instructorName,
          schedule: enr.scheduleTime || course.schedule,
          enrolledAt: enr.enrolledAt,
          lastAccessedAt: enr.lastAccessedAt,
          completedLessons: completedCount,
          totalLessons: totalLessons,
          progressPercentage: percentage,
          isCompleted: enr.isCompleted || (totalLessons > 0 && completedCount >= totalLessons),
          completedAt: enr.completedAt,
        };
      })
    );

    res.json({
      success: true,
      count: courseProgressList.filter(Boolean).length,
      courses: courseProgressList.filter(Boolean),
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Error loading course progress' });
  }
};

// @desc    Get detailed lesson progress for a specific course
// @route   GET /api/student/courses/:courseId/progress
// @access  Private (Student)
export const getCourseLessonsProgress = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { courseId } = req.params;
    const studentId = req.user!._id;

    // Check enrollment
    const enrollment = await Enrollment.findOne({
      student: studentId,
      course: courseId,
      paymentStatus: { $ne: 'cancelled' },
    });

    if (!enrollment) {
      res.status(403).json({ success: false, message: 'You are not enrolled in this course' });
      return;
    }

    const course = await DanceCourse.findById(courseId);
    if (!course) {
      res.status(404).json({ success: false, message: 'Course not found' });
      return;
    }

    // Update last accessed
    enrollment.lastAccessedAt = new Date();
    await enrollment.save();

    // Fetch all lessons for this course ordered
    const lessons = await Lesson.find({ course: courseId }).sort({ order: 1 });

    // Fetch student's completed lessons for this course
    const completedRecords = await LessonProgress.find({
      student: studentId,
      course: courseId,
      completed: true,
    });

    const completedLessonIds = new Set(completedRecords.map((r) => r.lesson.toString()));

    const totalLessons = lessons.length;
    const completedCount = completedLessonIds.size;
    const progressPercentage =
      totalLessons > 0 ? Math.min(100, Math.round((completedCount / totalLessons) * 100)) : 0;

    const isCompleted = totalLessons > 0 && completedCount >= totalLessons;

    const lessonsWithStatus = lessons.map((l) => ({
      _id: l._id,
      title: l.title,
      description: l.description,
      duration: l.duration,
      order: l.order,
      videoUrl: l.videoUrl,
      type: l.type,
      difficulty: l.difficulty,
      completed: completedLessonIds.has(l._id.toString()),
    }));

    res.json({
      success: true,
      course: {
        _id: course._id,
        title: course.title,
        category: course.category,
        level: course.level,
        image: course.image,
        instructorName: course.instructorName,
      },
      enrollment: {
        _id: enrollment._id,
        enrolledAt: enrollment.enrolledAt,
        lastAccessedAt: enrollment.lastAccessedAt,
        completedAt: enrollment.completedAt,
        isCompleted: enrollment.isCompleted || isCompleted,
      },
      progress: {
        totalLessons,
        completedLessons: completedCount,
        pendingLessons: Math.max(0, totalLessons - completedCount),
        progressPercentage,
        isCompleted: enrollment.isCompleted || isCompleted,
      },
      lessons: lessonsWithStatus,
    });
  } catch (error: any) {
    console.error('[StudentProgress] getCourseLessonsProgress error:', error);
    res.status(500).json({ success: false, message: 'Error loading course lesson progress' });
  }
};

// @desc    Mark a lesson as completed
// @route   POST /api/student/lessons/:lessonId/complete
// @access  Private (Student)
export const completeLesson = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { lessonId } = req.params;
    const studentId = req.user!._id;

    const lesson = await Lesson.findById(lessonId);
    if (!lesson) {
      res.status(404).json({ success: false, message: 'Lesson not found' });
      return;
    }

    const courseId = lesson.course;

    // Verify enrollment
    const enrollment = await Enrollment.findOne({
      student: studentId,
      course: courseId,
      paymentStatus: { $ne: 'cancelled' },
    });

    if (!enrollment) {
      res.status(403).json({ success: false, message: 'You must be enrolled in this course to track lessons' });
      return;
    }

    // Upsert LessonProgress record to prevent duplicates
    const progressRecord = await LessonProgress.findOneAndUpdate(
      { student: studentId, course: courseId, lesson: lessonId },
      { completed: true, completedAt: new Date() },
      { upsert: true, new: true }
    );

    // Count completed lessons for this course
    const totalLessons = await Lesson.countDocuments({ course: courseId });
    const completedCount = await LessonProgress.countDocuments({
      student: studentId,
      course: courseId,
      completed: true,
    });

    const progressPercentage =
      totalLessons > 0 ? Math.min(100, Math.round((completedCount / totalLessons) * 100)) : 0;

    const isNewlyCompleted = !enrollment.isCompleted && totalLessons > 0 && completedCount >= totalLessons;

    // Update enrollment
    enrollment.completedLessonsCount = completedCount;
    enrollment.totalLessonsCount = totalLessons;
    enrollment.progressPercentage = progressPercentage;
    enrollment.lastAccessedAt = new Date();

    if (completedCount >= totalLessons && totalLessons > 0) {
      enrollment.isCompleted = true;
      if (!enrollment.completedAt) {
        enrollment.completedAt = new Date();
      }
    }

    await enrollment.save();

    // Also update User.progress for backwards compatibility
    const course = await DanceCourse.findById(courseId);
    if (course) {
      const user = await User.findById(studentId);
      if (user) {
        if (!user.progress) user.progress = {};
        if (!user.progress[course.category]) user.progress[course.category] = {};
        if (!user.progress[course.category][course.level]) user.progress[course.category][course.level] = [];

        const vidKey = `lesson_${lesson.order}`;
        if (!user.progress[course.category][course.level].includes(vidKey)) {
          user.progress[course.category][course.level].push(vidKey);
          user.markModified('progress');
          await user.save();
        }
      }
    }

    res.json({
      success: true,
      message: isNewlyCompleted
        ? `Congratulations! You have completed all lessons in ${course?.title || 'the course'}!`
        : 'Lesson marked as completed!',
      completedLessonId: lessonId,
      progress: {
        completedLessons: completedCount,
        totalLessons,
        progressPercentage,
        isCompleted: enrollment.isCompleted,
        completedAt: enrollment.completedAt,
        newlyCompleted: isNewlyCompleted,
      },
    });
  } catch (error: any) {
    console.error('[StudentProgress] completeLesson error:', error);
    res.status(500).json({ success: false, message: 'Error marking lesson as completed' });
  }
};

// @desc    Unmark a lesson completion
// @route   POST /api/student/lessons/:lessonId/uncomplete
// @access  Private (Student)
export const uncompleteLesson = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { lessonId } = req.params;
    const studentId = req.user!._id;

    const lesson = await Lesson.findById(lessonId);
    if (!lesson) {
      res.status(404).json({ success: false, message: 'Lesson not found' });
      return;
    }

    const courseId = lesson.course;

    await LessonProgress.findOneAndDelete({
      student: studentId,
      course: courseId,
      lesson: lessonId,
    });

    const totalLessons = await Lesson.countDocuments({ course: courseId });
    const completedCount = await LessonProgress.countDocuments({
      student: studentId,
      course: courseId,
      completed: true,
    });

    const progressPercentage =
      totalLessons > 0 ? Math.min(100, Math.round((completedCount / totalLessons) * 100)) : 0;

    const enrollment = await Enrollment.findOne({ student: studentId, course: courseId });
    if (enrollment) {
      enrollment.completedLessonsCount = completedCount;
      enrollment.progressPercentage = progressPercentage;
      enrollment.isCompleted = totalLessons > 0 && completedCount >= totalLessons;
      if (!enrollment.isCompleted) {
        enrollment.completedAt = undefined;
      }
      await enrollment.save();
    }

    res.json({
      success: true,
      message: 'Lesson marked as uncompleted',
      progress: {
        completedLessons: completedCount,
        totalLessons,
        progressPercentage,
        isCompleted: enrollment?.isCompleted || false,
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Error unmarking lesson' });
  }
};
