import { prisma } from "@/prisma/prisma";

export async function GET(req, { params }) {
  const { id } = await params;

  try {
    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        orderItems: {
          include: {
            product: true,
          },
        },
        store: true,
        address: true,
      },
    });

    if (!order) {
      return Response.json({ error: "Order not found" }, { status: 404 });
    }

    return Response.json({ order });
  } catch (error) {
    console.error("GET_ORDER_ERROR", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
