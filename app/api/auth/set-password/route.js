import { prisma } from "@/prisma/prisma";
import bcrypt from "bcryptjs";
import { setAuthCookie, signJWT } from "@/lib/auth";

export async function POST(req) {
  const { email, password } = await req.json();

  const hashedPassword = await bcrypt.hash(password, 12);

  const user = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      isVerified: true,
    },
  });

  const { password: _, ...userWithoutPassword } = user;

  const token = await signJWT({ userId: user.id, role: user.role });
  await setAuthCookie(token);

  return Response.json({ success: true, user: { ...userWithoutPassword, role: user.role } });
}
