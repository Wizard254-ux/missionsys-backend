import axios from 'axios';

// Define comment data interface
interface CommentData {
  name: string;
  email: string;
  comment: string;
  postId: string;
  createdAt: string;
}

/**
 * Function to directly process a comment submission
 * @param commentData The comment data to process
 * @returns Object containing processing result
 */
export async function processComment(commentData: CommentData): Promise<{ notificationSent: boolean }> {
  try {
    console.log('Processing comment for:', commentData.name);
    
    // // 1. Save to database (mock implementation)
    // const dbSaved = await saveCommentToDatabase(commentData);
    // if (!dbSaved) throw new Error('Failed to save comment to database');
    
    // 2. Send notification email
    const notificationSent = await sendCommentNotification(commentData);
    console.log('Email notification sent:', notificationSent);
    
    return { notificationSent };
  } catch (error) {
    console.error('Error processing comment:', error);
    return { notificationSent: false };
  }
}

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

/**
 * Function to send notification email to admin about a new comment
 * @param data The comment data to include in the notification
 * @returns Promise resolving to boolean indicating success/failure
 */
async function sendCommentNotification(data: CommentData): Promise<boolean> {
  try {
    console.log('Sending comment notification email for comment by:', data.name);
    
    // Use your existing email API
    const response = await axios.post(
      "https://api.brevo.com/v3/smtp/email",
      {
        sender: {
          name: "Lynnie Travis Adventures",
          email: "brianndesa262@gmail.com"
        },
        to: [{ email: process.env.ADMIN_EMAIL || 'brianndesa262@example.com' }],
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
    
    console.log('Comment notification email API response status:', response.status);
    return response.status === 201;
  } catch (error: any) {
    console.error("Email notification failed:", error.response?.data || error.message);
    return false;
  }
}

/**
 * Main export function to handle a new comment submission
 * @param data The comment data to process
 * @returns Promise resolving to object with notification result
 */
export const handleNewComment = async (data: CommentData): Promise<{ success: boolean }> => {
  console.log('Handling new comment from:', data.name);
  try {
    // Process the comment directly
    const result = await processComment(data);
    return { success: result.notificationSent };
  } catch (error) {
    console.error('Failed to handle comment:', error);
    return { success: false };
  }
};

export default handleNewComment;