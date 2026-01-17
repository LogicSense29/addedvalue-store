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

    // Find all unique users the current user has exchanged messages with
    // We fetch distinct senderId from received messages AND distinct receiverId from sent messages
    
    // 1. Get IDs of people who sent us messages
    const senders = await prisma.message.findMany({
      where: { receiverId: userId },
      select: { senderId: true },
      distinct: ['senderId']
    });

    // 2. Get IDs of people we sent messages to
    const receivers = await prisma.message.findMany({
      where: { senderId: userId },
      select: { receiverId: true },
      distinct: ['receiverId']
    });

    // Combine and unique
    const uniqueContactIds = [...new Set([
      ...senders.map(s => s.senderId),
      ...receivers.map(r => r.receiverId)
    ])];

    // Fetch user details and latest message for each contact
    const conversations = await Promise.all(
      uniqueContactIds.map(async (contactId) => {
        const contact = await prisma.user.findUnique({
          where: { id: contactId },
          select: { id: true, name: true, email: true, image: true, role: true }
        });

        // Get latest message between userId and contactId
        const lastMessage = await prisma.message.findFirst({
          where: {
            OR: [
              { senderId: userId, receiverId: contactId },
              { senderId: contactId, receiverId: userId }
            ]
          },
          orderBy: { createdAt: 'desc' },
        });

        // Count unread messages from this contact
        const unreadCount = await prisma.message.count({
          where: {
            senderId: contactId,
            receiverId: userId,
            isRead: false
          }
        });

        return {
          id: contact.id,
          name: contact.name || contact.email,
          email: contact.email,
          image: contact.image,
          role: contact.role,
          lastMessage: lastMessage?.content || "",
          time: lastMessage?.createdAt,
          unread: unreadCount,
          isOfficial: contact.role === 'ADMIN' // Treat admin as "Official"
        };
      })
    );

    // Sort by latest message time
    conversations.sort((a, b) => new Date(b.time) - new Date(a.time));

    return Response.json({ conversations });
  } catch (error) {
    console.error("Error fetching conversations:", error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
