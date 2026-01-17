import nodemailer from "nodemailer";
import 'dotenv/config'

export const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  // port: Number(process.env.EMAIL_PORT),
  port: 587,
  secure: false, // true for 465, false for 587
  auth: {
    user: process.env.EMAIL_MAIL,
    pass: process.env.EMAIL_PASS,
  },
});

export async function sendEmail({ to, subject, html }) {
  return transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to,
    subject,
    html,
  });
}
