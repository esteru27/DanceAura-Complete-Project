import mongoose, { Schema } from 'mongoose';
import { IInstructor } from '../types';

const instructorSchema = new Schema<IInstructor>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    phone: { type: String, required: true },
    bio: { type: String, required: true },
    danceStyles: [{ type: String }],
    experienceYears: { type: Number, default: 5 },
    image: { type: String, default: '/ins1.png' },
    rating: { type: Number, default: 4.9 },
    socialLinks: {
      instagram: { type: String },
      youtube: { type: String },
    },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const Instructor = mongoose.model<IInstructor>('Instructor', instructorSchema);
