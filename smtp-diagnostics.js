
import nodemailer from "nodemailer";
import 'dotenv/config'

const configs = [
  { name: 'addedvalue-587-starttls', host: process.env.EMAIL_HOST, port: 587, secure: false },
  { name: 'addedvalue-465-ssl', host: process.env.EMAIL_HOST, port: 465, secure: true },
  { name: 'addedvalue-25-none', host: process.env.EMAIL_HOST, port: 25, secure: false },
];

async function test(config) {
  console.log(`\nTesting: ${config.name} (${config.host}:${config.port}, secure: ${config.secure})`);
  const transporter = nodemailer.createTransport({
    host: config.host,
    port: config.port,
    secure: config.secure,
    auth: {
      user: process.env.EMAIL_MAIL,
      pass: process.env.EMAIL_PASS,
    },
    tls: {
      rejectUnauthorized: false
    },
    timeout: 10000
  });

  try {
    await transporter.verify();
    console.log(`✅ ${config.name} SUCCESS!`);
  } catch (error) {
    console.log(`❌ ${config.name} FAILED: ${error.message}`);
  } finally {
    transporter.close();
  }
}

async function run() {
  for (const config of configs) {
    await test(config);
  }
}

run();
