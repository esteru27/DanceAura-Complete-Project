export type UserRole = 'student' | 'instructor' | 'admin';

export interface User {
  _id: string;
  name?: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  gender?: string;
  streetAddress1?: string;
  streetAddress2?: string;
  city?: string;
  region?: string;
  zipCode?: string;
  country?: string;
  danceType: string;
  startDate?: string;
  startTime?: string;
  comments?: string;
  role: UserRole;
  isPaid: boolean;
  progress?: Record<string, Record<string, string[]>>;
  createdAt?: string;
}

export interface Course {
  _id: string;
  title: string;
  description: string;
  category: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'All Levels';
  instructor?: string;
  instructorName: string;
  durationWeeks: number;
  price: number;
  schedule: string;
  image: string;
  enrolledCount: number;
  maxStudents: number;
  syllabus: string[];
  active: boolean;
}

export interface Category {
  name: string;
  origin: string;
  image: string;
  description: string;
}

export interface Instructor {
  _id: string;
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
}

export interface Enrollment {
  _id: string;
  student: string | User;
  course: Course;
  enrolledAt: string;
  paymentStatus: 'pending' | 'paid' | 'cancelled';
  amountPaid: number;
  danceType: string;
  scheduleTime: string;
}

export interface DanceProgressRecord {
  _id: string;
  student: string;
  course?: Course;
  danceStyle: string;
  level: string;
  completedLessons: string[];
  totalLessons: number;
  overallPercentage: number;
  lastAccessed: string;
}

export interface VideoClass {
  id: string;
  title: string;
  danceStyle: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  duration: string;
  type: 'Moves' | 'Choreography' | 'Technique';
  tags: string[];
  videoUrl: string;
  thumbnail: string;
  instructor: string;
}
