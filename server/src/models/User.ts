import mongoose, { Schema } from 'mongoose';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { IUser } from '../types';

const userSchema = new Schema<IUser>(
  {
    firstName: { type: String, required: [true, 'First name is required'], trim: true },
    lastName: { type: String, required: [true, 'Last name is required'], trim: true },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      trim: true,
      lowercase: true,
      match: [/\S+@\S+\.\S+/, 'Please provide a valid email address'],
    },
    phone: { type: String, required: [true, 'Phone number is required'], trim: true },
    gender: { type: String, enum: ['male', 'female', 'other', 'prefer_not_to_say', 'Male', 'Female', 'Other'], default: 'prefer_not_to_say' },
    streetAddress1: { type: String, required: [true, 'Street address is required'], trim: true },
    streetAddress2: { type: String, trim: true },
    city: { type: String, required: [true, 'City is required'], trim: true },
    region: { type: String, required: [true, 'Region/State is required'], trim: true },
    zipCode: { type: String, required: [true, 'Zip code is required'], trim: true },
    country: { type: String, required: [true, 'Country is required'], trim: true },
    danceType: { type: String, required: [true, 'Dance type is required'], trim: true },
    startDate: { type: Date, required: [true, 'Start date is required'] },
    startTime: { type: String, required: [true, 'Start time is required'], trim: true },
    comments: { type: String, trim: true },
    password: { type: String, required: [true, 'Password is required'], minlength: 4 },
    isPaid: { type: Boolean, default: false },
    role: { type: String, enum: ['student', 'instructor', 'admin'], default: 'student' },
    resetPasswordToken: { type: String },
    resetPasswordExpire: { type: Date },
    progress: {
      type: Schema.Types.Mixed,
      default: {},
    },
  },
  { timestamps: true }
);

// Password hashing before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password') || !this.password) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Match entered password
userSchema.methods.matchPassword = async function (enteredPassword: string): Promise<boolean> {
  if (!this.password) return false;
  return bcrypt.compare(enteredPassword, this.password);
};

// Generate and hash password reset token
userSchema.methods.getResetPasswordToken = function (): string {
  const resetToken = crypto.randomBytes(20).toString('hex');
  this.resetPasswordToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');
  this.resetPasswordExpire = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
  return resetToken;
};

export const User = mongoose.model<IUser>('User', userSchema);
