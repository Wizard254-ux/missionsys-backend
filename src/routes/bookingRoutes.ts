import { Router, Request, Response } from 'express';
import { addJobToQueue } from '../services/emailService';

const router = Router();

router.post('/booking', async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      name,
      email,
      phone,
      preferredDate,
      additionalInfo,
      experienceTitle,
      experienceCategory,
      emailTo // Optional: specific email to send to, if provided
    } = req.body;

    // Validate required fields
    if (!name || !email) {
      res.status(400).json({ success: false, message: 'Name and email are required' });
      return;
    }

    // Format the message
    const formattedMessage = `
      New Booking Request
      
      Experience Details:
      - Title: ${experienceTitle || 'Not specified'}
      - Category: ${experienceCategory || 'Not specified'}
      
      Customer Details:
      - Name: ${name}
      - Email: ${email}
      - Phone: ${phone || 'Not provided'}
      - Preferred Date: ${preferredDate || 'Not provided'}
      
      Additional Information:
      ${additionalInfo || 'None provided'}
    `;

    await addJobToQueue({
      emailTo: process.env.ADMIN_EMAIL || "brianndesa262@gmail.com", // Default if not provided
      code: formattedMessage
    });

    res.status(200).json({ success: true, message: 'Your booking request has been sent successfully' });
  } catch (error) {
    console.error('Error processing booking request:', error);
    res.status(500).json({ success: false, message: 'Failed to send booking request' });
  }
});

export default router;