import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: 'smtp-relay.brevo.com',
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER, // Your Brevo Login Email
    pass: process.env.EMAIL_PASS, // Your Brevo SMTP Key (NOT your login password)
  },
});

export const sendEmail = async ({ to, subject, html }) => {
  try {
    const info = await transporter.sendMail({
      from: `"Rekur Team" <${process.env.EMAIL_FROM || process.env.EMAIL_USER}>`, // Use a verified sender
      to,
      subject,
      html,
    });
    console.log('Email sent successfully:', info.messageId);
    return { success: true };
  } catch (error) {
    console.error('Nodemailer error:', error);
    return { success: false, error: error.message };
  }
};