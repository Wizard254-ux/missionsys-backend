import axios from 'axios';

/**
 * Function to send email via Brevo API
 * @param toEmail - Recipient email address
 * @param messageContent - Content of the message to be sent
 * @returns Promise resolving to boolean indicating success/failure
 */
async function sendEmail(toEmail: string, messageContent: string): Promise<boolean> {
  try {
    console.log('Sending email to:', toEmail);
    
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
          "api-key": process.env.BREVO_API_KEY, // Replace with actual API key from environment
          "content-type": "application/json"
        }
      }
    );
    
    console.log('Email API response status:', response.status);
    return response.status === 201;
  } catch (error: any) {
    console.error("Email sending failed:", error.response?.data || error.message);
    return false;
  }
}

/**
 * Direct email send function - use this as the main export
 * @param emailTo - Recipient email address
 * @param code - Email content/message to send
 * @returns Promise resolving to boolean indicating success/failure
 */
export const sendEmailDirectly = async (emailTo: string, code: string): Promise<boolean> => {
  console.log('Sending email directly to:', emailTo);
  try {
    const result = await sendEmail(emailTo, code);
    console.log('Email sent successfully:', result);
    return result;
  } catch (error) {
    console.error('Error in direct email send:', error);
    return false;
  }
};

// Default export for direct imports
export default sendEmail;