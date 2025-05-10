import Queue,{Job} from 'bull'

const axios = require("axios");

async function sendVerificationEmail(toEmail:string, code:string) {
  try {
    const response = await axios.post(
      "https://api.brevo.com/v3/smtp/email",
      {
        sender: {
          name: "MissionConnect",
          email: "brianndesa262@gmail.com"
        },
        to: [{ email: toEmail }],
        subject: "Your Verification Code",
        htmlContent: `
    <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f4f4f4;">
      <div style="max-width: 600px; margin: auto; background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 0 10px rgba(0,0,0,0.1);">
        <div style="background-color: #0d6efd; padding: 20px; color: white; text-align: center;">
          <h2>Welcome to Our Service</h2>
        </div>
        <div style="padding: 30px;">
          <p>Hi <strong>User</strong>,</p>
          <p>Your account has been created successfully. Please find your login credentials below:</p>
          <table style="width: 100%; margin-top: 20px;">
            <tr>
              <td style="padding: 10px 0; font-weight: bold;">Email:</td>
              <td>${toEmail}</td>
            </tr>
            <tr>
              <td style="padding: 10px 0; font-weight: bold;">Verification Code:</td>
              <td><strong style="color: #dc3545;">${code}</strong></td>
            </tr>
          </table>
          <p style="margin-top: 30px;">
            🔒 <strong>Security Notice:</strong><br>
            Please do not share this email or your credentials with anyone.<br>
            If you did not request this email, Ignore it
          <p style="margin-top: 30px;">Thank you,<br>The Team</p>
        </div>
        <div style="background-color: #f1f1f1; text-align: center; padding: 15px; font-size: 12px; color: #888;">
          &copy; 2025EduCore. All rights reserved.
        </div>
      </div>
    </div>`
      },
      {
        headers: {
          "accept": "application/json",
          "api-key": process.env.BREVO_API_KEY, // Keep this secret
          "content-type": "application/json"
        }
      }
    );

    return response.status === 201;
  } catch (error:any) {
    console.error("Email sending failed:", error.response?.data || error.message);
    return false;
  }
}


  


const emailQueue = new Queue('emailQueue', {
  redis: {
    host: 'redis-16260.c91.us-east-1-3.ec2.redns.redis-cloud.com',
        port: 16260,
    username: 'default',
    password: 'ioxboBnMjxrr1JzwFOdBNxy0vrSdXK3i',  },
});

emailQueue.process(async (job: any) => {
    try {
      console.log('executing job',job)
        const res= await sendVerificationEmail(job.data.emailTo, job.data.code);
       console.log('email sent ')

    } catch (error) {
        console.error('Error sending email', error);
    } finally {
        // Release the job back into the queue
        await job.remove();
    }
    
})

export const addJobToQueue=async(data:{emailTo:string,code:string})=> {
  console.log(data,'Adding job to queue');
  await emailQueue.add(data);
}


  
  

