import { Request, Response } from 'express';
import { ContactMessage } from '../models/ContactMessage';

// @desc    Submit a contact inquiry form
// @route   POST /api/contact
// @access  Public
export const submitContact = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, phone, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
      res.status(400).json({
        success: false,
        message: 'Please provide name, email, subject, and message',
      });
      return;
    }

    const inquiry = await ContactMessage.create({
      name,
      email: email.toLowerCase(),
      phone,
      subject,
      message,
    });

    console.log(`[Contact] Received inquiry from ${name} (${email}): "${subject}"`);

    res.status(201).json({
      success: true,
      message: 'Thank you for reaching out! The DanceAura team will contact you shortly.',
      inquiryId: inquiry._id,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Error saving contact message' });
  }
};

// @desc    Get all contact messages (Admin/Instructor)
// @route   GET /api/contact
// @access  Private
export const getContactMessages = async (req: Request, res: Response): Promise<void> => {
  try {
    const messages = await ContactMessage.find().sort({ createdAt: -1 });
    res.json({ success: true, count: messages.length, messages });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Error fetching messages' });
  }
};
