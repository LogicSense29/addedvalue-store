import { prisma } from "@/prisma/prisma";
import { getAdmin } from "@/lib/auth";

export async function GET(req) {
  try {
    const admin = await getAdmin();
    if (!admin) return Response.json({ error: "Unauthorized" }, { status: 401 });

    const orders = await prisma.order.findMany({
      include: {
        user: true,
        address: true,
        orderItems: {
          include: {
            product: true,
          },
        },
        store: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return Response.json({ orders });
  } catch (error) {
    console.error("ADMIN_GET_ORDERS_ERROR", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PATCH(req) {
  try {
    const admin = await getAdmin();
    if (!admin) return Response.json({ error: "Unauthorized" }, { status: 401 });

    const { orderId, status } = await req.json();

    if (!orderId || !status) {
      return Response.json({ error: "Missing orderId or status" }, { status: 400 });
    }

    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: { status },
    });

    return Response.json({ success: true, order: updatedOrder });
  } catch (error) {
    console.error("ADMIN_PATCH_ORDER_ERROR", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
