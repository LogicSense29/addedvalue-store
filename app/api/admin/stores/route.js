import { prisma } from "@/prisma/prisma";
import { verifyJWT } from "@/lib/auth";
import { cookies } from "next/headers";

// GET: Fetch all pending stores
export async function GET(req) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    
    if (!token) return Response.json({ error: "Unauthorized" }, { status: 401 });

    const payload = await verifyJWT(token);
    if (!payload || payload.role !== 'ADMIN') {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');
    const where = status ? { status } : {};

    const stores = await prisma.store.findMany({
      where,
      include: {
        user: {
          select: { id: true, name: true, email: true, image: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    return Response.json({ stores });
  } catch (error) {
    console.error("Error fetching stores:", error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// PATCH: Approve or Reject a store
export async function PATCH(req) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) return Response.json({ error: "Unauthorized" }, { status: 401 });

    const payload = await verifyJWT(token);
    if (!payload || payload.role !== 'ADMIN') {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { storeId, status, isActive: explicitIsActive } = await req.json();

    if (!storeId) {
      return Response.json({ error: "Missing storeId" }, { status: 400 });
    }

    const data = {};
    if (status) {
        if (!['approved', 'rejected', 'pending'].includes(status)) {
            return Response.json({ error: "Invalid status" }, { status: 400 });
        }
        data.status = status;
        data.isActive = status === 'approved';
    }

    if (explicitIsActive !== undefined) {
        data.isActive = explicitIsActive;
    }

    const updatedStore = await prisma.store.update({
      where: { id: storeId },
      data
    });

    return Response.json({ success: true, store: updatedStore });

  } catch (error) {
    console.error("Error updating store:", error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
