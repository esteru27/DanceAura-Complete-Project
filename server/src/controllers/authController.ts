import { Request, Response } from 'express';
import crypto from 'crypto';
import { User } from '../models/User';
import { DanceProgress } from '../models/DanceProgress';
import { generateToken } from '../services/tokenService';
import { sendEmail } from '../services/emailService';
import { AuthenticatedRequest } from '../types';

// @desc    Register a new student
// @route   POST /api/auth/register
// @access  Public
export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      firstName,
      lastName,
      email,
      phone,
      gender,
      streetAddress1,
      streetAddress2,
      city,
      region,
      zipCode,
      country,
      danceType,
      startDate,
      startTime,
      comments,
      password,
      role,
    } = req.body;

    if (!firstName || !lastName || !email || !phone || !password || !danceType) {
      res.status(400).json({
        success: false,
        message: 'Please provide firstName, lastName, email, phone, danceType, and password',
      });
      return;
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      res.status(400).json({ success: false, message: 'User already exists with this email address' });
      return;
    }

    const user = await User.create({
      firstName,
      lastName,
      email: email.toLowerCase(),
      phone,
      gender: gender || 'prefer_not_to_say',
      streetAddress1: streetAddress1 || 'Main Studio Road',
      streetAddress2,
      city: city || 'City',
      region: region || 'State',
      zipCode: zipCode || '00000',
      country: country || 'India',
      danceType,
      startDate: startDate ? new Date(startDate) : new Date(),
      startTime: startTime || '10:00 AM',
      comments,
      password,
      role: role === 'instructor' ? 'instructor' : 'student',
      isPaid: false,
      progress: {},
    });

    const token = generateToken(user._id, user.role);

    res.status(201).json({
      success: true,
      message: 'Registration successful',
      token,
      user: {
        _id: user._id,
        name: `${user.firstName} ${user.lastName}`,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        danceType: user.danceType,
        role: user.role,
        isPaid: user.isPaid,
        progress: user.progress || {},
      },
    });
  } catch (error: any) {
    console.error('[Auth] Register error:', error);
    res.status(500).json({ success: false, message: error.message || 'Server error during registration' });
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ success: false, message: 'Please provide both email and password' });
      return;
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      res.status(401).json({ success: false, message: 'Invalid email or password' });
      return;
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      res.status(401).json({ success: false, message: 'Invalid email or password' });
      return;
    }

    const token = generateToken(user._id, user.role);

    res.json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        _id: user._id,
        name: `${user.firstName} ${user.lastName}`,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        danceType: user.danceType,
        role: user.role,
        isPaid: user.isPaid,
        progress: user.progress || {},
      },
    });
  } catch (error: any) {
    console.error('[Auth] Login error:', error);
    res.status(500).json({ success: false, message: error.message || 'Server error during login' });
  }
};

// @desc    Request Password Reset Link
// @route   POST /api/auth/forgotpassword
// @access  Public
export const forgotPassword = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email } = req.body;

    if (!email) {
      res.status(400).json({ success: false, message: 'Please provide an email address' });
      return;
    }

    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      // Prevent email enumeration
      res.json({
        success: true,
        message: 'If that email is registered, a password reset link has been dispatched.',
      });
      return;
    }

    const resetToken = user.getResetPasswordToken();
    await user.save({ validateBeforeSave: false });

    const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
    const resetUrl = `${clientUrl}/reset-password/${resetToken}`;

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
        <h2 style="color: #4a1c6f;">DanceAura Studio Password Reset</h2>
        <p>Hello ${user.firstName},</p>
        <p>You recently requested to reset your password for your DanceAura account. Click the button below to reset it:</p>
        <p style="text-align: center; margin: 30px 0;">
          <a href="${resetUrl}" style="background-color: #27ae60; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold;">Reset Password</a>
        </p>
        <p>Or paste this link into your browser: <br/><a href="${resetUrl}">${resetUrl}</a></p>
        <p style="color: #777; font-size: 13px;">This link is valid for 10 minutes. If you did not make this request, you can safely ignore this email.</p>
      </div>
    `;

    await sendEmail({
      email: user.email,
      subject: 'DanceAura - Password Reset Request',
      html,
    });

    console.log(`[Auth] Password reset token for ${user.email}: ${resetToken}`);

    res.json({
      success: true,
      message: 'If that email is registered, a password reset link has been dispatched.',
      // In development mode, provide token directly to facilitate testing
      devToken: process.env.NODE_ENV !== 'production' ? resetToken : undefined,
    });
  } catch (error: any) {
    console.error('[Auth] Forgot password error:', error);
    res.status(500).json({ success: false, message: 'Error processing password reset request' });
  }
};

// @desc    Reset password via token
// @route   POST /api/auth/resetpassword/:resetToken
// @access  Public
export const resetPassword = async (req: Request, res: Response): Promise<void> => {
  try {
    const { resetToken } = req.params;
    const { password } = req.body;

    if (!password || password.length < 4) {
      res.status(400).json({ success: false, message: 'Password must be at least 4 characters long' });
      return;
    }

    const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpire: { $gt: new Date() },
    });

    if (!user) {
      res.status(400).json({ success: false, message: 'Invalid or expired password reset token' });
      return;
    }

    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    res.json({
      success: true,
      message: 'Password reset successful! You can now log in with your new password.',
    });
  } catch (error: any) {
    console.error('[Auth] Reset password error:', error);
    res.status(500).json({ success: false, message: 'Server error during password reset' });
  }
};

// @desc    Get current user profile
// @route   GET /api/auth/profile
// @access  Private
export const getProfile = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const user = req.user!;
    res.json({
      success: true,
      user: {
        _id: user._id,
        name: `${user.firstName} ${user.lastName}`,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        gender: user.gender,
        streetAddress1: user.streetAddress1,
        streetAddress2: user.streetAddress2,
        city: user.city,
        region: user.region,
        zipCode: user.zipCode,
        country: user.country,
        danceType: user.danceType,
        startDate: user.startDate,
        startTime: user.startTime,
        comments: user.comments,
        role: user.role,
        isPaid: user.isPaid,
        progress: user.progress || {},
        createdAt: user.createdAt,
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Error fetching profile' });
  }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
export const updateProfile = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const user = await User.findById(req.user!._id);
    if (!user) {
      res.status(404).json({ success: false, message: 'User not found' });
      return;
    }

    const {
      firstName,
      lastName,
      phone,
      gender,
      streetAddress1,
      streetAddress2,
      city,
      region,
      zipCode,
      country,
      danceType,
      comments,
      password,
    } = req.body;

    if (firstName) user.firstName = firstName;
    if (lastName) user.lastName = lastName;
    if (phone) user.phone = phone;
    if (gender) user.gender = gender;
    if (streetAddress1) user.streetAddress1 = streetAddress1;
    if (streetAddress2 !== undefined) user.streetAddress2 = streetAddress2;
    if (city) user.city = city;
    if (region) user.region = region;
    if (zipCode) user.zipCode = zipCode;
    if (country) user.country = country;
    if (danceType) user.danceType = danceType;
    if (comments !== undefined) user.comments = comments;
    if (password && password.trim().length >= 4) {
      user.password = password;
    }

    await user.save();

    res.json({
      success: true,
      message: 'Profile updated successfully',
      user: {
        _id: user._id,
        name: `${user.firstName} ${user.lastName}`,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        danceType: user.danceType,
        role: user.role,
        isPaid: user.isPaid,
        progress: user.progress || {},
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Error updating profile' });
  }
};

// @desc    Track lesson/video progress
// @route   POST /api/auth/trackprogress
// @access  Private
export const trackProgress = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { danceStyle, level, videoId } = req.body;

    if (!danceStyle || !level || !videoId) {
      res.status(400).json({ success: false, message: 'Please provide danceStyle, level, and videoId' });
      return;
    }

    const user = await User.findById(req.user!._id);
    if (!user) {
      res.status(404).json({ success: false, message: 'User not found' });
      return;
    }

    const styleKey = danceStyle.trim();
    const levelKey = level.trim();
    const videoKey = videoId.trim();

    if (!user.progress) {
      user.progress = {};
    }
    if (!user.progress[styleKey]) {
      user.progress[styleKey] = {};
    }
    if (!user.progress[styleKey][levelKey]) {
      user.progress[styleKey][levelKey] = [];
    }

    const completed = user.progress[styleKey][levelKey];
    let isNew = false;

    if (!completed.includes(videoKey)) {
      completed.push(videoKey);
      isNew = true;
      user.markModified('progress');
      await user.save();
    }

    // Also update or create DanceProgress record
    const totalLessons = 12;
    const completedCount = completed.length;
    const percentage = Math.min(100, Math.round((completedCount / totalLessons) * 100));

    await DanceProgress.findOneAndUpdate(
      { student: user._id, danceStyle: styleKey, level: levelKey },
      {
        completedLessons: completed,
        totalLessons,
        overallPercentage: percentage,
        lastAccessed: new Date(),
      },
      { upsert: true, new: true }
    );

    res.json({
      success: true,
      message: isNew ? 'Progress recorded successfully' : 'Lesson already completed',
      completedCount,
      percentage,
      progress: user.progress,
    });
  } catch (error: any) {
    console.error('[Auth] Track progress error:', error);
    res.status(500).json({ success: false, message: 'Error tracking progress' });
  }
};

// @desc    Get user progress
// @route   GET /api/auth/progress
// @access  Private
export const getProgress = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const user = req.user!;
    const detailedProgress = await DanceProgress.find({ student: user._id });

    res.json({
      success: true,
      progress: user.progress || {},
      details: detailedProgress,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Error fetching progress' });
  }
};
