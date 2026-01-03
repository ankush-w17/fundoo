const nodemailer = require('nodemailer');
const config = require('../config/config');

const transporter = nodemailer.createTransport({
  host: config.email.host,
  port: config.email.port,
  secure: false, // true for 465, false for other ports
  auth: {
    user: config.email.user,
    pass: config.email.password
  }
});

exports.sendWelcomeEmail = async (email, name) => {
  const message = {
    from: `${config.email.from}`,
    to: email,
    subject: 'Welcome to FundooNotes',
    text: `Hello ${name},\n\nWelcome to FundooNotes! We are excited to have you on board.\n\nBest regards,\nFundooNotes Team`
  };

  try {
    await transporter.sendMail(message);
    console.log('Welcome email sent to: ' + email);
  } catch (error) {
    console.error('Error sending welcome email:', error);
  }
};

exports.sendPasswordResetEmail = async (email, token) => {
  // In a real app, this should be a link to the frontend
  const resetUrl = `${config.appUrl || 'http://localhost:3000'}/reset-password/${token}`;

  const message = {
    from: `${config.email.from}`,
    to: email,
    subject: 'Password Reset Request',
    text: `You requested a password reset. Please click the link below to reset your password:\n\n${resetUrl}\n\nIf you did not request this, please ignore this email.`
  };

  try {
    await transporter.sendMail(message);
    console.log('Password reset email sent to: ' + email);
  } catch (error) {
    console.error('Error sending password reset email:', error);
  }
};
