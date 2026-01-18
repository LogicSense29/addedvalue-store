import nodemailer from "nodemailer";
import 'dotenv/config'

const isSecure = process.env.EMAIL_PORT === '465';

export const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: Number(process.env.EMAIL_PORT) || 465,
  secure: true, 
  auth: {
    user: process.env.EMAIL_MAIL,
    pass: process.env.EMAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false,
  }
});

export async function sendEmail({ to, subject, html }) {
  return transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to,
    subject,
    html,
  });
}
