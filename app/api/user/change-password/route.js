import { prisma } from "@/prisma/prisma";
import bcrypt from "bcryptjs";
import { verifyJWT } from "@/lib/auth";
import { cookies } from "next/headers";

export async function PATCH(req) {
  try {
    const { oldPassword, newPassword } = await req.json();

    // 1. Verify Authentication
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const payload = await verifyJWT(token);
    if (!payload || !payload.userId) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = payload.userId;

    // 2. Fetch User
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return Response.json({ error: "User not found" }, { status: 404 });
    }

    // 3. Verify Old Password
    // If user has no password (e.g. social login only - though not applicable here yet), handle gracefully
    if (user.password) {
        const isValid = await bcrypt.compare(oldPassword, user.password);
        if (!isValid) {
        return Response.json({ error: "Incorrect current password" }, { status: 400 });
        }
    }

    // 4. Hash New Password
    const hashedPassword = await bcrypt.hash(newPassword, 12);

    // 5. Update User
    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });

    return Response.json({ success: true, message: "Password updated successfully" });

  } catch (error) {
    console.error("CHANGE_PASSWORD_ERROR", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
