const nodemailer = require('nodemailer');
const config = require('../config/config');

class EmailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: config.email.host,
      port: config.email.port,
      secure: false,
      auth: {
        user: config.email.user,
        pass: config.email.password
      }
    });
  }

  async sendCollaboratorInvitation(toEmail, fromUser, noteTitle, noteId) {
    const mailOptions = {
      from: config.email.from,
      to: toEmail,
      subject: `${fromUser.firstName} ${fromUser.lastName} shared a note with you`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #4CAF50; color: white; padding: 20px; text-align: center; }
            .content { padding: 20px; background-color: #f9f9f9; }
            .note-title { font-size: 18px; font-weight: bold; color: #4CAF50; margin: 10px 0; }
            .button { display: inline-block; padding: 10px 20px; background-color: #4CAF50; color: white; text-decoration: none; border-radius: 5px; margin-top: 15px; }
            .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>FundooNotes Collaboration</h1>
            </div>
            <div class="content">
              <p>Hello,</p>
              <p><strong>${fromUser.firstName} ${fromUser.lastName}</strong> (${fromUser.email}) has shared a note with you on FundooNotes.</p>
              <div class="note-title">"${noteTitle}"</div>
              <p>You can now view and collaborate on this note.</p>
              <a href="${config.appUrl || 'http://localhost:3000'}/notes/${noteId}" class="button">View Note</a>
            </div>
            <div class="footer">
              <p>This is an automated email from FundooNotes. Please do not reply.</p>
            </div>
          </div>
        </body>
        </html>
      `
    };

    try {
      await this.transporter.sendMail(mailOptions);
      return { success: true, message: 'Invitation email sent successfully' };
    } catch (error) {
      console.error('Email sending error:', error);
      throw new Error('Failed to send invitation email');
    }
  }
}

module.exports = new EmailService();
