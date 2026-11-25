import { Response } from 'express';
import { DanceProgress } from '../models/DanceProgress';
import { AuthenticatedRequest } from '../types';

// @desc    Get progress details for student across all styles
// @route   GET /api/progress/summary
// @access  Private
export const getProgressSummary = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const progressRecords = await DanceProgress.find({ student: req.user!._id }).populate('course');

    const totalStylesTracked = progressRecords.length;
    const avgCompletion =
      totalStylesTracked > 0
        ? Math.round(
            progressRecords.reduce((acc, curr) => acc + curr.overallPercentage, 0) / totalStylesTracked
          )
        : 0;

    res.json({
      success: true,
      summary: {
        totalStylesTracked,
        avgCompletion,
        records: progressRecords,
        userProgress: req.user!.progress || {},
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Error fetching progress summary' });
  }
};

// @desc    Get detailed progress for a specific style and level
// @route   GET /api/progress/:style/:level
// @access  Private
export const getProgressByStyle = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { style, level } = req.params;
    const record = await DanceProgress.findOne({
      student: req.user!._id,
      danceStyle: new RegExp(`^${style}$`, 'i'),
      level: new RegExp(`^${level}$`, 'i'),
    });

    res.json({
      success: true,
      record: record || {
        danceStyle: style,
        level: level,
        completedLessons: [],
        totalLessons: 12,
        overallPercentage: 0,
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Error fetching progress' });
  }
};
