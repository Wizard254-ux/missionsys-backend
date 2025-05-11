import { Router, Request, Response } from 'express';
import { sendEmailDirectly } from '../services/emailService';

const router = Router();

router.post('/contact', async (req: Request, res: Response):Promise<void> => {
  try {
    const { 
      name, 
      email, 
      phone, 
      travelDate, 
      partySize, 
      safariType, 
      message,
      emailTo // This comes from the frontend with the office email
    } = req.body;

    // Validate required fields
    if (!name || !email || !message) {
       res.status(400).json({ success: false, message: 'Name, email and message are required' });
       return
    }

    // Format the message
    const formattedMessage = `
      New Contact Form Submission
      
      Customer Details:
      - Name: ${name}
      - Email: ${email}
      - Phone: ${phone || 'Not provided'}
      - Travel Date: ${travelDate || 'Not provided'}
      - Safari Type: ${safariType || 'Not provided'}
      
      Message:
      ${message}
    `;

    await sendEmailDirectly(
    process.env.ADMIN_EMAIL || "brianndesa262@gmail.com", // Default if not provided
    formattedMessage // Reusing the code field to send our formatted message
    );

    res.status(200).json({ success: true, message: 'Your message has been sent successfully' });
  } catch (error) {
    console.error('Error processing contact form:', error);
    res.status(500).json({ success: false, message: 'Failed to send message' });
  }
});

export default router;