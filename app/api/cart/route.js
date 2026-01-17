import { prisma } from "@/prisma/prisma";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");

  if (!userId) {
    return Response.json({ error: "User ID is required" }, { status: 400 });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { cart: true },
    });

    if (!user) {
      return Response.json({ error: "User not found" }, { status: 404 });
    }

    return Response.json({ cart: user.cart });
  } catch (error) {
    console.error("GET_CART_ERROR", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req) {
  const startTime = Date.now();
  try {
    const { userId, cart } = await req.json();
    console.log(`[CART_POST] Starting sync for user: ${userId}`);

    if (!userId) {
      return Response.json({ error: "User ID is required" }, { status: 400 });
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { cart: cart || {} },
      select: { cart: true },
    });

    console.log(`[CART_POST] Completed sync for user: ${userId} in ${Date.now() - startTime}ms`);
    return Response.json({ success: true, cart: updatedUser.cart });
  } catch (error) {
    console.error("POST_CART_ERROR", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
