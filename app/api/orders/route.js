import { prisma } from "@/prisma/prisma";
import { sendEmail } from "@/lib/email/email";
import { orderReceiptTemplate } from "@/lib/email/orderReceiptTemplate";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");

  if (!userId) {
    return Response.json({ error: "User ID is required" }, { status: 400 });
  }

  try {
    const orders = await prisma.order.findMany({
      where: { userId },
      include: {
        orderItems: {
          include: {
            product: true,
          },
        },
        store: true,
        address: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return Response.json({ orders });
  } catch (error) {
    console.error("GET_ORDERS_ERROR", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const { userId, addressId, paymentMethod, items } = await req.json();

    if (!userId || !addressId || !paymentMethod || !items || items.length === 0) {
      return Response.json({ error: "Missing required fields" }, { status: 400 });
    }

    // 0. Pre-verify User and Address (reduces work inside transaction)
    const [userCheck, addressCheck] = await Promise.all([
        prisma.user.findUnique({ where: { id: userId } }),
        prisma.address.findUnique({ where: { id: addressId } })
    ]);

    if (!userCheck) return Response.json({ error: "User not found" }, { status: 404 });
    if (!addressCheck) return Response.json({ error: "Address not found" }, { status: 404 });

    // 1. Group items by storeId
    const itemsByStore = items.reduce((acc, item) => {
      const sId = item.storeId || 'default';
      if (!acc[sId]) {
        acc[sId] = [];
      }
      acc[sId].push(item);
      return acc;
    }, {});

    const createdOrders = [];

    // 2. Create an order for each store in a transaction
    await prisma.$transaction(async (tx) => {
      for (const storeId in itemsByStore) {
        const storeItems = itemsByStore[storeId];
        const orderTotal = storeItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

        // Ensure store exists or find a fallback
        let finalStoreId = storeId;
        if (storeId === 'default') {
          const firstStore = await tx.store.findFirst();
          finalStoreId = firstStore?.id || storeId;
        }

        const order = await tx.order.create({
          data: {
            userId,
            storeId: finalStoreId,
            addressId,
            paymentMethod,
            total: orderTotal,
            orderItems: {
              create: storeItems.map((item) => ({
                productId: item.productId,
                quantity: item.quantity,
                price: item.price,
                customizations: item.customizations || {}
              })),
            },
          },
        });
        createdOrders.push(order);
      }

      // 3. Clear the user's cart after successful order creation
      await tx.user.update({
        where: { id: userId },
        data: { cart: {} },
      });
    }, {
      timeout: 30000, 
    });

    // 4. Send Email Receipts (Outside transaction to avoid timeouts)
    try {
      const adminEmail = process.env.ADMIN_EMAIL || process.env.EMAIL_USER || "info@addedvaluehubltd.co.uk";
      
      if (userCheck.email) {
          for (const order of createdOrders) {
              const fullOrder = await prisma.order.findUnique({
                  where: { id: order.id },
                  include: { orderItems: { include: { product: true } } }
              });
              
              const emailPayload = {
                  userName: userCheck.name || "Customer",
                  orderItems: fullOrder.orderItems,
                  total: order.total,
                  orderId: order.id
              };

              // Send to User
              await sendEmail({
                  to: userCheck.email,
                  subject: `Order Confirmation - #${order.id.slice(-8).toUpperCase()}`,
                  html: orderReceiptTemplate(emailPayload)
              });

              // Send to Admin
              await sendEmail({
                  to: adminEmail,
                  subject: `NEW ORDER ALERT - #${order.id.slice(-8).toUpperCase()}`,
                  html: orderReceiptTemplate({
                      ...emailPayload,
                      userName: `ADMIN (Customer: ${userCheck.name || userCheck.email})`
                  })
              });
          }
      }
    } catch (emailError) {
      console.error("Failed to send order email:", emailError);
    }

    return Response.json({ success: true, orders: createdOrders });
  } catch (error) {
    console.error("POST_ORDER_ERROR", error);
    return Response.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}
