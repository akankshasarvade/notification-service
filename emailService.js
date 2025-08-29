// services/emailService.js
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: process.env.EMAIL_SECURE === "true", // converts string "false" to boolean
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

async function sendEmail(to, subject, text) {
  try {
    const info = await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to,
      subject,
      text, message,
    });
    console.log("✅ Email sent:", info.messageId);
    return true;
  } catch (err) {
    console.error("❌ Email failed:", err.message);
    return false;
  }
}

module.exports = { sendEmail };
