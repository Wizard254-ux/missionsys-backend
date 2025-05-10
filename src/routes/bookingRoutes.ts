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

    // Format the message with improved layout and word-wrap
    const formattedMessage = `
<div style="font-family: Arial, sans-serif; font-size: 14px; line-height: 1.6; color: #333;">
  <div style="background-color: #f7f7f7; padding: 15px; border-left: 4px solid #4CAF50; margin-bottom: 20px;">
    <h2 style="margin-top: 0; color: #4CAF50; font-size: 20px;">New Booking Request</h2>
  </div>

  <div style="margin-bottom: 20px;">
    <h3 style="font-size: 16px; border-bottom: 1px solid #eee; padding-bottom: 8px; margin-bottom: 12px;">Experience Details</h3>
    <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
      <tr>
        <td style="padding: 5px 10px 5px 0; width: 140px; vertical-align: top;"><strong>Title:</strong></td>
        <td style="padding: 5px 0; word-break: break-word;">${experienceTitle || 'Not specified'}</td>
      </tr>
      <tr>
        <td style="padding: 5px 10px 5px 0; vertical-align: top;"><strong>Category:</strong></td>
        <td style="padding: 5px 0; word-break: break-word;">${experienceCategory || 'Not specified'}</td>
      </tr>
    </table>
  </div>

  <div style="margin-bottom: 20px;">
    <h3 style="font-size: 16px; border-bottom: 1px solid #eee; padding-bottom: 8px; margin-bottom: 12px;">Customer Details</h3>
    <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
      <tr>
        <td style="padding: 5px 10px 5px 0; width: 140px; vertical-align: top;"><strong>Name:</strong></td>
        <td style="padding: 5px 0; word-break: break-word;">${name}</td>
      </tr>
      <tr>
        <td style="padding: 5px 10px 5px 0; vertical-align: top;"><strong>Email:</strong></td>
        <td style="padding: 5px 0; word-break: break-word;">${email}</td>
      </tr>
      <tr>
        <td style="padding: 5px 10px 5px 0; vertical-align: top;"><strong>Phone:</strong></td>
        <td style="padding: 5px 0; word-break: break-word;">${phone || 'Not provided'}</td>
      </tr>
      <tr>
        <td style="padding: 5px 10px 5px 0; vertical-align: top;"><strong>Preferred Date:</strong></td>
        <td style="padding: 5px 0; word-break: break-word;">${preferredDate || 'Not provided'}</td>
      </tr>
    </table>
  </div>

  <div style="margin-bottom: 20px;">
    <h3 style="font-size: 16px; border-bottom: 1px solid #eee; padding-bottom: 8px; margin-bottom: 12px;">Additional Information</h3>
    <div style="background-color: #f9f9f9; padding: 12px; border-radius: 4px; word-wrap: break-word; font-size: 14px;">
      ${additionalInfo ? additionalInfo.replace(/\n/g, '<br>') : 'None provided'}
    </div>
  </div>
</div>`;

    await addJobToQueue({
      emailTo: process.env?.ADMIN_EMAIL ?? 'brianndesa262@gmail.com',
      code: formattedMessage
    });

    res.status(200).json({ success: true, message: 'Your booking request has been sent successfully' });
  } catch (error) {
    console.error('Error processing booking request:', error);
    res.status(500).json({ success: false, message: 'Failed to send booking request' });
  }
});

export default router;