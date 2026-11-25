import mongoose, { Schema } from 'mongoose';
import { ILesson } from '../types';

const lessonSchema = new Schema<ILesson>(
  {
    course: { type: Schema.Types.ObjectId, ref: 'DanceCourse', required: true },
    title: { type: String, required: [true, 'Lesson title is required'], trim: true },
    description: { type: String, trim: true, default: '' },
    duration: { type: String, default: '10 min' },
    order: { type: Number, required: true, default: 1 },
    videoUrl: { type: String, default: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
    type: {
      type: String,
      enum: ['Moves', 'Choreography', 'Technique', 'Theory', 'Warmup'],
      default: 'Moves',
    },
    difficulty: {
      type: String,
      enum: ['Beginner', 'Intermediate', 'Advanced', 'All Levels'],
      default: 'Beginner',
    },
    resources: [{ type: String }],
  },
  { timestamps: true }
);

// Optimize queries for a course's lessons sorted by order
lessonSchema.index({ course: 1, order: 1 });

export const Lesson = mongoose.model<ILesson>('Lesson', lessonSchema);
