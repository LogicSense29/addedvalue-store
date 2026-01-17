import { prisma } from "@/prisma/prisma";
import { randomInt } from "crypto";
import { sendEmail } from "@/lib/email/email";
import { otpEmailTemplate } from "@/lib/email/emailTemplates";

export async function POST(req) {
  try {
    const { email, purpose = "SIGNUP" } = await req.json();

    if (!email) {
      return Response.json({ error: "Email is required" }, { status: 400 });
    }

    const lastOtp = await prisma.otpCode.findFirst({
      where: { email },
      orderBy: { createdAt: "desc" },
    });

    if (lastOtp && Date.now() - lastOtp.createdAt.getTime() < 1000) {
      return Response.json(
        { error: "Please wait before requesting another code" },
        { status: 429 }
      );
    }

    await prisma.otpCode.updateMany({
      where: { email, used: false },
      data: { used: true },
    });

    const code = randomInt(1000, 9999).toString();

    await prisma.otpCode.create({
      data: {
        email,
        code,
        purpose,
        expiresAt: new Date(Date.now() + 600000),
      },
    });

    await sendEmail({
      to: email,
      subject: "Verification Code",
      html: otpEmailTemplate({ code }),
    });

    return Response.json({ success: true });
  } catch (error) {
    console.error("OTP_ERROR:", error);
    return Response.json({ error: "Internal error" }, { status: 500 });
  }
}
