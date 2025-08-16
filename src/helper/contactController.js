const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.OWNER_EMAIL, 
    pass: process.env.OWNER_PASSWORD  
  }
});

const contactController = {
  submitContact: async (req, res) => {
    try {
      const { name, email, subject, message, timestamp } = req.body;

      
      const adminMailOptions = {
        from: `"SebAttY Support" <no-reply@seb-atty.com>`, // Generic no-reply email
        to: 'libinseban97@gmail.com', 
        subject: `New Contact Form Submission: ${subject}`,
        html: `
          <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: auto;">
            <h2 style="color: #007BFF; text-align: center;">New Contact Form Submission</h2>
            <p><strong>From:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Subject:</strong> ${subject}</p>
            <p><strong>Message:</strong></p>
            <p style="background: #f9f9f9; padding: 10px; border-left: 4px solid #007BFF;">${message}</p>
            <p><strong>Timestamp:</strong> ${new Date(timestamp).toLocaleString()}</p>
          </div>
        `
      };

      const userMailOptions = {
        from: `"SebAttY Support" <no-reply@seb-atty.com>`,
        to: email,
        subject: 'Thank you for contacting us',
        html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: auto; background: #f4f4f4; padding: 20px; border: 1px solid #ddd;">
          <h2 style="color: #28a745; text-align: center;">Thank You for Reaching Out!</h2>
          <p>Dear <strong>${name}</strong>,</p>
          <p>We have received your message and our team will get back to you shortly.</p>
          <p>Here is a summary of your submission:</p>
          <div style="background: #fff; padding: 15px; border: 1px solid #ddd; margin: 10px 0;">
            <p><strong>Subject:</strong> ${subject}</p>
            <p><strong>Message:</strong> ${message}</p>
          </div>
          <p>Thank you for choosing <strong>SebAttY</strong>. Have a wonderful day!</p>
          <p style="text-align: center; color: #888; font-size: 12px;">This is an automated message, please do not reply.</p>
        </div>
      `
      };

      // Send both emails
      await transporter.sendMail(adminMailOptions);
      await transporter.sendMail(userMailOptions);

      res.status(200).json({ 
        success: true, 
        message: 'Contact form submitted successfully' 
      });
    } catch (error) {
      console.error('Contact form error:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Failed to submit contact form' 
      });
    }
  }
};

module.exports = {
    submitContact: contactController.submitContact
};