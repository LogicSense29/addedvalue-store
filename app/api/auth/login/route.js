import { prisma } from "@/prisma/prisma";
import bcrypt from "bcryptjs";
import { setAuthCookie, signJWT } from "@/lib/auth";

export async function POST(req) {
  const { email, password } = await req.json();

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    return Response.json({ error: "Invalid credentials" }, { status: 401 });
  }

  const isValid = await bcrypt.compare(password, user.password);

  if (!isValid) {
    return Response.json({ error: "Invalid credentials" }, { status: 401 });
  }

  const { password: _, ...userWithoutPassword } = user;

  const token = await signJWT({ userId: user.id, role: user.role });
  await setAuthCookie(token);

  return Response.json({
    success: true,
    user: { ...userWithoutPassword, role: user.role },
  });
}
