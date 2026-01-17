import { prisma } from "@/prisma/prisma";

export async function POST(req) {
  const { email, code } = await req.json();

  // 1️⃣ Find latest unused OTP
  const otp = await prisma.otpCode.findFirst({
    where: {
      email,
      code,
      used: false,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  // 2️⃣ Validate OTP exists
  if (!otp) {
    return Response.json(
      { error: "Invalid verification code" },
      { status: 400 }
    );
  }

  // 3️⃣ Check expiration
  if (otp.expiresAt < new Date()) {
    return Response.json(
      { error: "Verification code expired" },
      { status: 400 }
    );
  }

  // 4️⃣ Mark OTP as used
  await prisma.otpCode.update({
    where: { id: otp.id },
    data: { used: true },
  });

  // 5️⃣ Mark user as verified (if exists)
  await prisma.user.updateMany({
    where: { email },
    data: { isVerified: true },
  });

  // 6️⃣ Success
  return Response.json({ success: true });
}
