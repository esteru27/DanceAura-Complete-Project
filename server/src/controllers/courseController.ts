import { Request, Response } from 'express';
import { DanceCourse } from '../models/DanceCourse';
import { AuthenticatedRequest } from '../types';

// @desc    Get all dance courses (with optional category & level filter, and search)
// @route   GET /api/courses
// @access  Public
export const getCourses = async (req: Request, res: Response): Promise<void> => {
  try {
    const { category, level, search } = req.query;
    const filter: any = { active: true };

    if (category && category !== 'All') {
      filter.category = new RegExp(`^${category}$`, 'i');
    }

    if (level && level !== 'All') {
      filter.level = level;
    }

    if (search) {
      filter.$or = [
        { title: { $regex: search as string, $options: 'i' } },
        { description: { $regex: search as string, $options: 'i' } },
        { category: { $regex: search as string, $options: 'i' } },
        { instructorName: { $regex: search as string, $options: 'i' } },
      ];
    }

    const courses = await DanceCourse.find(filter).sort({ createdAt: -1 });

    res.json({
      success: true,
      count: courses.length,
      courses,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Error fetching courses' });
  }
};

// @desc    Get course by ID
// @route   GET /api/courses/:id
// @access  Public
export const getCourseById = async (req: Request, res: Response): Promise<void> => {
  try {
    const course = await DanceCourse.findById(req.params.id).populate('instructor');
    if (!course) {
      res.status(404).json({ success: false, message: 'Course not found' });
      return;
    }

    res.json({ success: true, course });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Error fetching course details' });
  }
};

// @desc    Get dance categories with course count and cover image
// @route   GET /api/courses/categories
// @access  Public
export const getCategories = async (req: Request, res: Response): Promise<void> => {
  try {
    const categories = [
      { name: 'Bharatanatyam', origin: 'Tamil Nadu, India', image: '/bharatanatyam.jpg', description: 'Ancient Indian classical dance form known for grace, purity, and sculptured poses.' },
      { name: 'Kathak', origin: 'Northern India', image: '/kathak.jpg', description: 'Classical storytelling dance featuring intricate footwork, rhythmic spins, and expressive mime.' },
      { name: 'Kuchipudi', origin: 'Andhra Pradesh, India', image: '/kuchipudi.jpg', description: 'Dynamic classical dance drama balancing swift rhythmic footwork and dramatic expressions.' },
      { name: 'Ballet', origin: 'European Classical', image: '/ballet.jpg', description: 'Artistic dance form characterized by precision, highly formalized set steps, and light, graceful movements.' },
      { name: 'Contemporary', origin: 'Global Modern', image: '/slide2.jpg', description: 'Fluid, expressive movement style combining elements of modern, jazz, and classical ballet.' },
      { name: 'Hip Hop', origin: 'Urban Street', image: '/hiphop.jpg', description: 'Energetic street dance including breaking, popping, locking, and urban choreography.' },
      { name: 'Salsa', origin: 'Latin America', image: '/salsa.jpg', description: 'Lively, sensual partner dance characterized by syncopated footwork, fluid turns, and Latin rhythms.' },
      { name: 'Zumba', origin: 'Fitness & Cardio', image: '/zumba.avif', description: 'High-energy dance workout fusing Latin and international music with easy-to-follow choreography.' },
      { name: 'K-Pop', origin: 'Korea / Global Pop', image: '/k pop.jpg', description: 'Sharp, synchronization-heavy routines inspired by popular Korean music idol performances.' },
      { name: 'Belly Dance', origin: 'Middle East', image: '/belly.jpeg', description: 'Expressive dance emphasizing complex movements of the torso, hips, and graceful articulation.' },
      { name: 'Bhangra', origin: 'Punjab, India', image: '/bhangra.jpg', description: 'High-spirited folk dance with vigorous athletic kicks, leaps, and festive Punjabi rhythms.' },
      { name: 'Garba', origin: 'Gujarat, India', image: '/garba1.jpg', description: 'Traditional Gujarati folk dance with circular formations, graceful claps, and energetic twirls.' },
      { name: 'Aerobics', origin: 'Fitness Dance', image: '/aerobics.jpeg', description: 'Rhythmic aerobic exercise with dance routines to boost stamina, endurance, and flexibility.' },
    ];

    res.json({ success: true, categories });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Error fetching categories' });
  }
};

// @desc    Create course (Instructor / Admin only)
// @route   POST /api/courses
// @access  Private
export const createCourse = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { title, description, category, level, durationWeeks, price, schedule, image, syllabus } = req.body;

    const course = await DanceCourse.create({
      title,
      description,
      category,
      level,
      instructor: req.user!._id,
      instructorName: `${req.user!.firstName} ${req.user!.lastName}`,
      durationWeeks: durationWeeks || 8,
      price: price || 49,
      schedule: schedule || 'Mon & Wed 6:00 PM',
      image: image || '/slide1.jpg',
      syllabus: syllabus || ['Introduction & Rhythm Basics', 'Core Technique & Postures', 'Choreography Sequence', 'Showcase Performance'],
    });

    res.status(201).json({ success: true, message: 'Course created successfully', course });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Error creating course' });
  }
};

// @desc    Update course
// @route   PUT /api/courses/:id
// @access  Private
export const updateCourse = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const course = await DanceCourse.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!course) {
      res.status(404).json({ success: false, message: 'Course not found' });
      return;
    }
    res.json({ success: true, message: 'Course updated', course });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Error updating course' });
  }
};

// @desc    Delete / deactivate course
// @route   DELETE /api/courses/:id
// @access  Private
export const deleteCourse = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const course = await DanceCourse.findByIdAndUpdate(req.params.id, { active: false }, { new: true });
    if (!course) {
      res.status(404).json({ success: false, message: 'Course not found' });
      return;
    }
    res.json({ success: true, message: 'Course deactivated successfully' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Error deleting course' });
  }
};
