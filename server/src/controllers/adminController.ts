import { Request, Response } from 'express';
import { User } from '../models/User';
import { Instructor } from '../models/Instructor';
import { DanceCourse } from '../models/DanceCourse';
import { Enrollment } from '../models/Enrollment';
import { Lesson } from '../models/Lesson';
import { LessonProgress } from '../models/LessonProgress';
import { AuthenticatedRequest } from '../types';

// ==========================================
// A. DASHBOARD OVERVIEW
// ==========================================

export const getAdminDashboard = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const [
      totalStudents,
      totalInstructors,
      totalCourses,
      totalEnrollments,
      completedCoursesCount,
      activeEnrollments,
      recentEnrollments,
      courses,
    ] = await Promise.all([
      User.countDocuments({ role: 'student' }),
      Instructor.countDocuments({ active: true }),
      DanceCourse.countDocuments({ active: true }),
      Enrollment.countDocuments({ paymentStatus: { $ne: 'cancelled' } }),
      Enrollment.countDocuments({ isCompleted: true }),
      Enrollment.find({ paymentStatus: { $ne: 'cancelled' } }),
      Enrollment.find({ paymentStatus: { $ne: 'cancelled' } })
        .populate('student', 'firstName lastName email danceType')
        .populate('course', 'title category level price')
        .sort({ enrolledAt: -1 })
        .limit(6),
      DanceCourse.find({ active: true }).select('title category level enrolledCount price'),
    ]);

    // Distinct active students who have at least one enrollment
    const activeStudentIds = new Set(activeEnrollments.map((e) => e.student.toString()));
    const activeStudents = activeStudentIds.size;

    // Total gross tuition fees
    const totalRevenue = activeEnrollments.reduce((sum, e) => sum + (e.amountPaid || 0), 0);

    // Category distribution for charts
    const categoryMap: Record<string, number> = {};
    courses.forEach((c) => {
      categoryMap[c.category] = (categoryMap[c.category] || 0) + 1;
    });

    const categoryBreakdown = Object.entries(categoryMap).map(([name, count]) => ({
      name,
      count,
    }));

    res.json({
      success: true,
      stats: {
        totalStudents,
        totalInstructors,
        totalCourses,
        totalEnrollments,
        activeStudents,
        completedCourses: completedCoursesCount,
        totalRevenue,
      },
      categoryBreakdown,
      recentEnrollments,
    });
  } catch (error: any) {
    console.error('[Admin] Dashboard error:', error);
    res.status(500).json({ success: false, message: error.message || 'Error fetching admin dashboard stats' });
  }
};

// ==========================================
// B. STUDENT MANAGEMENT
// ==========================================

export const getStudents = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { search } = req.query;
    const filter: any = { role: 'student' };

    if (search) {
      const regex = new RegExp(search as string, 'i');
      filter.$or = [
        { firstName: regex },
        { lastName: regex },
        { email: regex },
        { phone: regex },
        { danceType: regex },
      ];
    }

    const students = await User.find(filter)
      .select('-password -resetPasswordToken -resetPasswordExpire')
      .sort({ createdAt: -1 });

    // Fetch enrollment metrics for each student
    const studentIds = students.map((s) => s._id);
    const enrollments = await Enrollment.find({ student: { $in: studentIds } });

    const studentData = students.map((s) => {
      const studentEnrs = enrollments.filter((e) => e.student.toString() === s._id.toString());
      const completedCount = studentEnrs.filter((e) => e.isCompleted).length;
      return {
        ...s.toObject(),
        enrolledCount: studentEnrs.length,
        completedCoursesCount: completedCount,
      };
    });

    res.json({ success: true, count: studentData.length, students: studentData });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Error fetching students' });
  }
};

export const getStudentById = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const student = await User.findById(req.params.id).select(
      '-password -resetPasswordToken -resetPasswordExpire'
    );
    if (!student) {
      res.status(404).json({ success: false, message: 'Student not found' });
      return;
    }

    const enrollments = await Enrollment.find({ student: student._id })
      .populate('course')
      .sort({ enrolledAt: -1 });

    const lessonProgress = await LessonProgress.find({ student: student._id })
      .populate('lesson', 'title order duration')
      .populate('course', 'title category');

    res.json({
      success: true,
      student,
      enrollments,
      completedLessons: lessonProgress,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Error fetching student details' });
  }
};

export const updateStudent = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { firstName, lastName, phone, danceType, isPaid, streetAddress1, city, region, zipCode } = req.body;
    const student = await User.findById(req.params.id);

    if (!student) {
      res.status(404).json({ success: false, message: 'Student not found' });
      return;
    }

    if (firstName) student.firstName = firstName;
    if (lastName) student.lastName = lastName;
    if (phone) student.phone = phone;
    if (danceType) student.danceType = danceType;
    if (typeof isPaid === 'boolean') student.isPaid = isPaid;
    if (streetAddress1) student.streetAddress1 = streetAddress1;
    if (city) student.city = city;
    if (region) student.region = region;
    if (zipCode) student.zipCode = zipCode;

    await student.save();

    res.json({
      success: true,
      message: 'Student updated successfully',
      student: {
        _id: student._id,
        firstName: student.firstName,
        lastName: student.lastName,
        email: student.email,
        phone: student.phone,
        danceType: student.danceType,
        isPaid: student.isPaid,
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Error updating student' });
  }
};

export const deleteStudent = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const student = await User.findById(req.params.id);
    if (!student) {
      res.status(404).json({ success: false, message: 'Student not found' });
      return;
    }

    // Cascade delete enrollments and progress for this student
    await Promise.all([
      Enrollment.deleteMany({ student: student._id }),
      LessonProgress.deleteMany({ student: student._id }),
      User.findByIdAndDelete(student._id),
    ]);

    res.json({ success: true, message: 'Student account and associated records deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Error deleting student' });
  }
};

// ==========================================
// C. INSTRUCTOR MANAGEMENT
// ==========================================

export const getInstructors = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const instructors = await Instructor.find().sort({ rating: -1 });
    const courses = await DanceCourse.find({ active: true }).select('title category instructor instructorName');

    const instructorsWithCourses = instructors.map((ins) => {
      const assigned = courses.filter(
        (c) => (c.instructor && c.instructor.toString() === ins._id.toString()) || c.instructorName === ins.name
      );
      return {
        ...ins.toObject(),
        assignedCourses: assigned,
      };
    });

    res.json({ success: true, count: instructorsWithCourses.length, instructors: instructorsWithCourses });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Error fetching instructors' });
  }
};

export const createInstructor = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { name, email, phone, bio, danceStyles, experienceYears, image, rating } = req.body;

    if (!name || !email || !phone || !bio) {
      res.status(400).json({ success: false, message: 'Name, email, phone, and bio are required' });
      return;
    }

    const existing = await Instructor.findOne({ email: email.toLowerCase() });
    if (existing) {
      res.status(400).json({ success: false, message: 'Instructor with this email already exists' });
      return;
    }

    const instructor = await Instructor.create({
      name,
      email: email.toLowerCase(),
      phone,
      bio,
      danceStyles: Array.isArray(danceStyles) ? danceStyles : [danceStyles || 'Contemporary'],
      experienceYears: Number(experienceYears) || 5,
      image: image || '/ins1.png',
      rating: Number(rating) || 4.9,
    });

    res.status(201).json({ success: true, message: 'Instructor created successfully', instructor });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Error creating instructor' });
  }
};

export const updateInstructor = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const instructor = await Instructor.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!instructor) {
      res.status(404).json({ success: false, message: 'Instructor not found' });
      return;
    }

    res.json({ success: true, message: 'Instructor updated successfully', instructor });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Error updating instructor' });
  }
};

export const deleteInstructor = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const instructor = await Instructor.findById(req.params.id);
    if (!instructor) {
      res.status(404).json({ success: false, message: 'Instructor not found' });
      return;
    }

    await Instructor.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Instructor removed successfully' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Error deleting instructor' });
  }
};

// ==========================================
// D. COURSE MANAGEMENT
// ==========================================

export const getCourses = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const courses = await DanceCourse.find().populate('instructor', 'name email').sort({ createdAt: -1 });
    res.json({ success: true, count: courses.length, courses });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Error fetching courses' });
  }
};

export const createCourse = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const {
      title,
      description,
      category,
      level,
      instructorId,
      instructorName,
      durationWeeks,
      price,
      schedule,
      image,
      syllabus,
      maxStudents,
    } = req.body;

    if (!title || !description || !category) {
      res.status(400).json({ success: false, message: 'Title, description, and category are required' });
      return;
    }

    let finalInstructorName = instructorName;
    if (instructorId && !finalInstructorName) {
      const ins = await Instructor.findById(instructorId);
      if (ins) finalInstructorName = ins.name;
    }

    const course = await DanceCourse.create({
      title,
      description,
      category,
      level: level || 'Beginner',
      instructor: instructorId || undefined,
      instructorName: finalInstructorName || 'Studio Faculty',
      durationWeeks: Number(durationWeeks) || 8,
      price: Number(price) || 49,
      schedule: schedule || 'Mon & Wed, 6:00 PM',
      image: image || '/slide1.jpg',
      maxStudents: Number(maxStudents) || 25,
      syllabus: Array.isArray(syllabus) ? syllabus : ['Foundations', 'Technique', 'Choreography'],
      active: true,
    });

    res.status(201).json({ success: true, message: 'Dance course created successfully', course });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Error creating course' });
  }
};

export const updateCourse = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const course = await DanceCourse.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!course) {
      res.status(404).json({ success: false, message: 'Course not found' });
      return;
    }

    res.json({ success: true, message: 'Course updated successfully', course });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Error updating course' });
  }
};

export const deleteCourse = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const course = await DanceCourse.findById(req.params.id);
    if (!course) {
      res.status(404).json({ success: false, message: 'Course not found' });
      return;
    }

    // Remove or soft-delete
    await DanceCourse.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Course deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Error deleting course' });
  }
};
