import Queue from 'bull';
import axios from 'axios';

// Create email queue
const emailQueue = new Queue('emailQueue', {
  redis: {
    host: 'redis-16260.c91.us-east-1-3.ec2.redns.redis-cloud.com',
    port: 16260,
    username: 'default',
    password: 'ioxboBnMjxrr1JzwFOdBNxy0vrSdXK3i',
  },
});

// Process email jobs
emailQueue.process(async (job) => {
  try {
    console.log('Processing email job:', job.id);
    const result = await sendEmail(job.data.emailTo, job.data.code);
    console.log('Email sent:', result);
    return result;
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  } finally {
    // Clean up job
    await job.remove();
  }
});

// Function to send email via Brevo API
async function sendEmail(toEmail: string, messageContent: string): Promise<boolean> {
  try {
    const response = await axios.post(
      "https://api.brevo.com/v3/smtp/email",
      {
        sender: {
          name: "Lynnie Travis Adventures",
          email: "brianndesa262@gmail.com"
        },
        to: [{ email: toEmail }],
        subject: "New Contact Form Submission",
        htmlContent: `
          <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f4f4f4;">
            <div style="max-width: 600px; margin: auto; background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 0 10px rgba(0,0,0,0.1);">
              <div style="background-color: #4CAF50; padding: 20px; color: white; text-align: center;">
                <h2>New Contact Form Submission</h2>
              </div>
              <div style="padding: 30px;">
                <p>You have received a new message from your website's contact form:</p>
                <pre style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; white-space: pre-wrap;">${messageContent}</pre>
                <p style="margin-top: 30px;">This is an automated email. Please respond to the customer directly.</p>
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
          "api-key": process.env.BREVO_API_KEY , // Replace with actual API key from environment
          "content-type": "application/json"
        }
      }
    );
    
    return response.status === 201;
  } catch (error: any) {
    console.error("Email sending failed:", error.response?.data || error.message);
    return false;
  }
}

// Add job to queue
export const addJobToQueue = async (data: { emailTo: string, code: string }): Promise<void> => {
  console.log('Adding job to email queue:', data.emailTo);
  await emailQueue.add(data, {
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 1000
    }
  });
};

export default emailQueue;