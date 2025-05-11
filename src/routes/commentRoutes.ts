import express, { Request, Response } from 'express';
import { handleNewComment } from '../services/commentQueue';

const router = express.Router();

// Route to handle new comment submissions
router.post('/comment', async (req: Request, res: Response):Promise<void> => {
  try {
    const { name, email, comment, postId } = req.body;
    console.log(req.body)
    // Basic validation
    if (!name || !email || !comment || !postId) {
       res.status(400).json({ 
        success: false, 
        message: 'Missing required fields' 
    });
    return
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
       res.status(400).json({ 
        success: false, 
        message: 'Invalid email format' 
      });
         return
    }
    
    // Add to queue for processing
    await handleNewComment({
      name,
      email,
      comment,
      postId,
      createdAt: new Date().toISOString()
    });
    
    // Send success response
    res.status(201).json({ 
      success: true, 
      message: 'Comment submitted successfully' 
    });
  } catch (error) {
    console.error('Error submitting comment:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to submit comment' 
    });
  }
});

export default router;