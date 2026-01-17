
import { sendEmail } from "./lib/email/email.js";

async function main() {
  try {
    console.log("Attempting to send email...");
    const info = await sendEmail({
      to: "meetbjfunk@gmail.com", // Sending to self/sender to test
      subject: "Test Email from Debug Script",
      html: "<p>This is a test.</p>",
    });
    console.log("Email sent successfully:", info.messageId);
  } catch (error) {
    console.error("Failed to send email:", error);
  }
}

main();
