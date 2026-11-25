import mongoose, { Schema } from 'mongoose';
import { IDanceProgress } from '../types';

const danceProgressSchema = new Schema<IDanceProgress>(
  {
    student: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    course: { type: Schema.Types.ObjectId, ref: 'DanceCourse' },
    danceStyle: { type: String, required: true },
    level: { type: String, required: true },
    completedLessons: [{ type: String }],
    totalLessons: { type: Number, default: 12 },
    overallPercentage: { type: Number, default: 0 },
    lastAccessed: { type: Date, default: Date.now },
    notes: { type: String },
  },
  { timestamps: true }
);

export const DanceProgress = mongoose.model<IDanceProgress>('DanceProgress', danceProgressSchema);
