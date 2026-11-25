import mongoose, { Schema } from 'mongoose';
import { IEnrollment } from '../types';

const enrollmentSchema = new Schema<IEnrollment>(
  {
    student: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    course: { type: Schema.Types.ObjectId, ref: 'DanceCourse', required: true },
    enrolledAt: { type: Date, default: Date.now },
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'cancelled'],
      default: 'paid',
    },
    amountPaid: { type: Number, default: 0 },
    danceType: { type: String, required: true },
    scheduleTime: { type: String, default: '10:00 AM' },
    // Student Learning Progress Tracking Fields
    completedLessonsCount: { type: Number, default: 0 },
    totalLessonsCount: { type: Number, default: 0 },
    progressPercentage: { type: Number, default: 0 },
    isCompleted: { type: Boolean, default: false },
    completedAt: { type: Date },
    lastAccessedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

// Optimize queries for a student's enrollments and course lookups
enrollmentSchema.index({ student: 1, course: 1 });
enrollmentSchema.index({ student: 1, isCompleted: 1 });

export const Enrollment = mongoose.model<IEnrollment>('Enrollment', enrollmentSchema);
