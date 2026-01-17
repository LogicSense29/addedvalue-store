import { prisma } from "@/prisma/prisma";
import { verifyJWT } from "@/lib/auth";
import { cookies } from "next/headers";

export async function GET(req) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    const payload = await verifyJWT(token);

    if (!payload) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = payload.userId;
    const { searchParams } = new URL(req.url);
    const otherUserId = searchParams.get("userId");

    if (!otherUserId) {
      return Response.json({ error: "User ID required" }, { status: 400 });
    }

    // Fetch messages between the two users
    const messages = await prisma.message.findMany({
      where: {
        OR: [
          { senderId: userId, receiverId: otherUserId },
          { senderId: otherUserId, receiverId: userId }
        ]
      },
      orderBy: { createdAt: 'asc' },
      include: {
        sender: { select: { name: true, role: true } }
      }
    });

    // Mark received messages as read
    await prisma.message.updateMany({
      where: {
        senderId: otherUserId,
        receiverId: userId,
        isRead: false
      },
      data: { isRead: true }
    });

    return Response.json({ messages });
  } catch (error) {
    console.error("Error fetching messages:", error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    const payload = await verifyJWT(token);

    if (!payload) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = payload.userId;
    const { receiverId, content } = await req.json();

    if (!receiverId || !content) {
      return Response.json({ error: "Missing fields" }, { status: 400 });
    }

    const message = await prisma.message.create({
      data: {
        senderId: userId,
        receiverId,
        content
      }
    });

    return Response.json({ success: true, message });
  } catch (error) {
    console.error("Error sending message:", error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
