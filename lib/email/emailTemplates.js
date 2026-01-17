export function otpEmailTemplate({ code }) {
  return `
    <div style="font-family: Arial, sans-serif; background: #f9f9f9; padding: 24px;">
      <div style="max-width: 480px; margin: auto; background: #ffffff; padding: 24px; border-radius: 8px;">
        <h2 style="color: #111;">Confirm your email</h2>
        <p style="color: #555;">
          Use the OTP below to continue. This code expires in <b>10 minutes</b>.
        </p>

        <div style="
          margin: 24px 0;
          font-size: 28px;
          letter-spacing: 6px;
          font-weight: bold;
          text-align: center;
          color: #111;
        ">
          ${code}
        </div>

        <p style="color: #777; font-size: 14px;">
          If you did not request this, please ignore this email.
        </p>

        <p style="color: #aaa; font-size: 12px; margin-top: 24px;">
          © ${new Date().getFullYear()} AddedValue
        </p>
      </div>
    </div>
  `;
}
