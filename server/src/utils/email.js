// server/src/utils/email.js

import nodemailer from "nodemailer";
import { 
  getEmailTemplate, 
  getVerificationEmailContent, 
  getPasswordResetEmailContent 
} from "./emailTemplates.js";

let transporter;

function getTransporter() {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: Number(process.env.EMAIL_PORT),
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  }
  return transporter;
}

/* ================= REGISTRATION EMAIL ================= */
export async function sendVerificationEmail(email, link) {
  const mailer = getTransporter();

  const emailContent = getVerificationEmailContent(link);
  const emailHTML = getEmailTemplate(emailContent);

  await mailer.sendMail({
    from: `"8JJ Games" <${process.env.EMAIL_FROM}>`,
    to: email,
    subject: "🎮 Verify your email - 8JJ Games",
    html: emailHTML,
  });
}

/* ================= PASSWORD RESET EMAIL ================= */
export async function sendResetPasswordEmail(email, link) {
  const mailer = getTransporter();

  const emailContent = getPasswordResetEmailContent(link);
  const emailHTML = getEmailTemplate(emailContent);
  const plainText = `Reset your password using the link below:\n\n${link}`;

  await mailer.sendMail({
  from: `"8JJ Games" <${process.env.EMAIL_FROM}>`,
  to: email,
  subject: "🔐 Reset your password - 8JJ Games",
  text: plainText,
  html: emailHTML,  
});
}