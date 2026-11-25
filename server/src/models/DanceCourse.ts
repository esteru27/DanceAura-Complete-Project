import mongoose, { Schema } from 'mongoose';
import { IDanceCourse } from '../types';

const danceCourseSchema = new Schema<IDanceCourse>(
  {
    title: { type: String, required: [true, 'Course title is required'], trim: true },
    description: { type: String, required: [true, 'Course description is required'] },
    category: {
      type: String,
      required: [true, 'Course category is required'],
      enum: [
        'Bharatanatyam',
        'Kathak',
        'Kuchipudi',
        'Ballet',
        'Contemporary',
        'Hip Hop',
        'Salsa',
        'Zumba',
        'K-Pop',
        'Belly Dance',
        'Bhangra',
        'Garba',
        'Aerobics',
        'Other'
      ],
    },
    level: {
      type: String,
      required: true,
      enum: ['Beginner', 'Intermediate', 'Advanced', 'All Levels'],
      default: 'Beginner',
    },
    instructor: { type: Schema.Types.ObjectId, ref: 'Instructor' },
    instructorName: { type: String, required: true },
    durationWeeks: { type: Number, required: true, default: 8 },
    price: { type: Number, required: true, default: 49 },
    schedule: { type: String, required: true, default: 'Mon & Wed, 6:00 PM' },
    image: { type: String, default: '/slide1.jpg' },
    enrolledCount: { type: Number, default: 0 },
    maxStudents: { type: Number, default: 25 },
    syllabus: [{ type: String }],
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const DanceCourse = mongoose.model<IDanceCourse>('DanceCourse', danceCourseSchema);
