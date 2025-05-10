import Queue from 'bull';
import axios from 'axios';

// Define comment data interface
interface CommentData {
  name: string;
  email: string;
  comment: string;
  postId: string;
  createdAt: string;
}

// Create comment queue
const commentQueue = new Queue('commentQueue', {
  redis: {
    host: process.env.REDIS_HOST || 'redis-16260.c91.us-east-1-3.ec2.redns.redis-cloud.com',
    port: Number(process.env.REDIS_PORT) || 16260,
    username: process.env.REDIS_USERNAME || 'default',
    password: process.env.REDIS_PASSWORD || 'ioxboBnMjxrr1JzwFOdBNxy0vrSdXK3i',
  },
});

// Process comment jobs
commentQueue.process(async (job) => {
  try {
    console.log('Processing comment job:', job.id);
    const commentData = job.data as CommentData;
    
    // // 1. Save to database (mock implementation)
    // const dbSaved = await saveCommentToDatabase(commentData);
    // if (!dbSaved) throw new Error('Failed to save comment to database');
    
    // 2. Send notification email
    const notificationSent = await sendCommentNotification(commentData);
    console.log('email sent ')
    
    return { notificationSent };
  } catch (error) {
    console.error('Error processing comment:', error);
    throw error;
  }
});

// Mock function to save comment to database
// // In a real implementation, this would use an ORM like Prisma, Mongoose, TypeORM, etc.
// async function saveCommentToDatabase(data: CommentData): Promise<boolean> {
//   try {
//     // Simulate database operation
//     console.log('Saving comment to database:', data);
    
//     // This would be replaced with actual database operations
//     // e.g., await prisma.comment.create({ data })
    
//     return true;
//   } catch (error) {
//     console.error('Database error:', error);
//     return false;
//   }
// }

// Function to send notification email to admin
async function sendCommentNotification(data: CommentData): Promise<boolean> {
  try {
    const messageContent = `
      Name: ${data.name}
      Email: ${data.email}
      Post ID: ${data.postId}
      Date: ${new Date(data.createdAt).toLocaleString()}
      
      Comment:
      ${data.comment}
    `;
    
    // Use your existing email API
    const response = await axios.post(
      "https://api.brevo.com/v3/smtp/email",
      {
        sender: {
          name: "Lynnie Travis Adventures",
          email: "brianndesa262@gmail.com"
        },
        to: [{ email: process.env.ADMIN_EMAIL }],
        subject: "New Blog Comment Submission",
        htmlContent: `
          <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f4f4f4;">
            <div style="max-width: 600px; margin: auto; background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 0 10px rgba(0,0,0,0.1);">
              <div style="background-color: #4CAF50; padding: 20px; color: white; text-align: center;">
                <h2>New Blog Comment</h2>
              </div>
              <div style="padding: 30px;">
                <p>A new comment has been submitted on your blog:</p>
                <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
                  <tr>
                    <td style="padding: 8px; border-bottom: 1px solid #ddd; font-weight: bold;">Name:</td>
                    <td style="padding: 8px; border-bottom: 1px solid #ddd;">${data.name}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px; border-bottom: 1px solid #ddd; font-weight: bold;">Email:</td>
                    <td style="padding: 8px; border-bottom: 1px solid #ddd;">${data.email}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px; border-bottom: 1px solid #ddd; font-weight: bold;">Post ID:</td>
                    <td style="padding: 8px; border-bottom: 1px solid #ddd;">${data.postId}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px; border-bottom: 1px solid #ddd; font-weight: bold;">Date:</td>
                    <td style="padding: 8px; border-bottom: 1px solid #ddd;">${new Date(data.createdAt).toLocaleString()}</td>
                  </tr>
                </table>
                <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px;">
                  <p style="font-weight: bold;">Comment:</p>
                  <p style="white-space: pre-wrap;">${data.comment}</p>
                </div>
              </div>
              <div style="background-color: #f1f1f1; text-align: center; padding: 15px; font-size: 12px; color: #888;">
                &copy; 2025 Lynnie Travis Adventures. All rights reserved.
              </div>
            </div>
          </div>
        `
      },
      {
        headers: {
          "accept": "application/json",
          "api-key": process.env.BREVO_API_KEY || "your-api-key-here",
          "content-type": "application/json"
        }
      }
    );
    
    return response.status === 201;
  } catch (error: any) {
    console.error("Email notification failed:", error.response?.data || error.message);
    return false;
  }
}

// Add job to queue
export const addToCommentQueue = async (data: CommentData): Promise<void> => {
  console.log('Adding comment to queue:', data);
  await commentQueue.add(data, {
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 2000
    }
  });
};

export default commentQueue;