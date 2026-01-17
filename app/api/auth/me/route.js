import { prisma } from "@/prisma/prisma";
import { verifyJWT } from "@/lib/auth";
import { cookies } from "next/headers";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return Response.json({ user: null }, { status: 200 });
    }

    const payload = await verifyJWT(token);
    if (!payload || !payload.userId) {
      return Response.json({ user: null }, { status: 200 });
    }

    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      include: { store: true }
    });

    if (!user) {
      return Response.json({ user: null }, { status: 200 });
    }

    const { password: _, ...userWithoutPassword } = user;
    return Response.json({ user: userWithoutPassword });
  } catch (error) {
    console.error("GET_ME_ERROR", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
