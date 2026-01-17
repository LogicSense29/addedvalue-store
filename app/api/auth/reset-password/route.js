import { prisma } from "@/prisma/prisma";
import bcrypt from "bcryptjs";

export async function POST(req) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
        return Response.json({ error: "Missing email or password" }, { status: 400 });
    }

    // 1. Check if user exists
    const user = await prisma.user.findUnique({
        where: { email },
    });

    if (!user) {
        // Return success even if user not found to prevent enumeration, or specific error if preferred
        return Response.json({ error: "User not found" }, { status: 404 });
    }

    // 2. Hash New Password
    const hashedPassword = await bcrypt.hash(password, 12);

    // 3. Update User
    await prisma.user.update({
      where: { email },
      data: { password: hashedPassword },
    });

    return Response.json({ success: true, message: "Password reset successfully" });

  } catch (error) {
    console.error("RESET_PASSWORD_ERROR", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
