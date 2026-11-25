import { Request } from 'express';
import { Document, Types } from 'mongoose';

export type UserRole = 'student' | 'instructor' | 'admin';

export interface IUser extends Document {
  _id: Types.ObjectId;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  gender?: string;
  streetAddress1: string;
  streetAddress2?: string;
  city: string;
  region: string;
  zipCode: string;
  country: string;
  danceType: string;
  startDate: Date;
  startTime: string;
  comments?: string;
  password?: string;
  isPaid: boolean;
  role: UserRole;
  resetPasswordToken?: string;
  resetPasswordExpire?: Date;
  progress: Record<string, Record<string, string[]>>;
  createdAt: Date;
  updatedAt: Date;
  matchPassword(enteredPassword: string): Promise<boolean>;
  getResetPasswordToken(): string;
}

export interface AuthenticatedRequest extends Request {
  user?: IUser;
}

export interface IDanceCourse extends Document {
  _id: Types.ObjectId;
  title: string;
  description: string;
  category: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'All Levels';
  instructor: Types.ObjectId | string;
  instructorName: string;
  durationWeeks: number;
  price: number;
  schedule: string;
  image: string;
  enrolledCount: number;
  maxStudents: number;
  syllabus: string[];
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface IEnrollment extends Document {
  _id: Types.ObjectId;
  student: Types.ObjectId;
  course: Types.ObjectId;
  enrolledAt: Date;
  paymentStatus: 'pending' | 'paid' | 'cancelled';
  amountPaid: number;
  danceType: string;
  scheduleTime: string;
  completedLessonsCount: number;
  totalLessonsCount: number;
  progressPercentage: number;
  isCompleted: boolean;
  completedAt?: Date;
  lastAccessedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface ILesson extends Document {
  _id: Types.ObjectId;
  course: Types.ObjectId;
  title: string;
  description?: string;
  duration: string;
  order: number;
  videoUrl: string;
  type: 'Moves' | 'Choreography' | 'Technique' | 'Theory' | 'Warmup';
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced' | 'All Levels';
  resources?: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ILessonProgress extends Document {
  _id: Types.ObjectId;
  student: Types.ObjectId;
  course: Types.ObjectId;
  lesson: Types.ObjectId;
  completed: boolean;
  completedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface IDanceProgress extends Document {
  _id: Types.ObjectId;
  student: Types.ObjectId;
  course: Types.ObjectId;
  danceStyle: string;
  level: string;
  completedLessons: string[];
  totalLessons: number;
  overallPercentage: number;
  lastAccessed: Date;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IInstructor extends Document {
  _id: Types.ObjectId;
  name: string;
  email: string;
  phone: string;
  bio: string;
  danceStyles: string[];
  experienceYears: number;
  image: string;
  rating: number;
  socialLinks?: {
    instagram?: string;
    youtube?: string;
  };
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface IContactMessage extends Document {
  _id: Types.ObjectId;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  status: 'new' | 'read' | 'replied';
  createdAt: Date;
  updatedAt: Date;
}
