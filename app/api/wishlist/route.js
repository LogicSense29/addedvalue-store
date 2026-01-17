import { prisma } from "@/prisma/prisma";
import { verifyJWT } from "@/lib/auth";
import { cookies } from "next/headers";

export async function GET(req) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get("token")?.value;

        if (!token) {
            return Response.json({ error: "Unauthorized" }, { status: 401 });
        }

        const payload = await verifyJWT(token);
        if (!payload || !payload.userId) {
            return Response.json({ error: "Unauthorized" }, { status: 401 });
        }

        const wishlist = await prisma.wishlist.findMany({
            where: { userId: payload.userId },
            include: {
                product: true
            }
        });

        return Response.json({ success: true, wishlist: wishlist.map(item => item.product) });
    } catch (error) {
        console.error("GET_WISHLIST_ERROR", error);
        return Response.json({ error: "Internal server error" }, { status: 500 });
    }
}

export async function POST(req) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get("token")?.value;

        if (!token) {
            return Response.json({ error: "Unauthorized" }, { status: 401 });
        }

        const payload = await verifyJWT(token);
        if (!payload || !payload.userId) {
            return Response.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { productId } = await req.json();

        if (!productId) {
            return Response.json({ error: "Product ID is required" }, { status: 400 });
        }

        const wishlistItem = await prisma.wishlist.upsert({
            where: {
                userId_productId: {
                    userId: payload.userId,
                    productId
                }
            },
            update: {},
            create: {
                userId: payload.userId,
                productId
            }
        });

        return Response.json({ success: true, message: "Product added to wishlist" });
    } catch (error) {
        console.error("POST_WISHLIST_ERROR", error);
        return Response.json({ error: "Internal server error" }, { status: 500 });
    }
}

export async function DELETE(req) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get("token")?.value;

        if (!token) {
            return Response.json({ error: "Unauthorized" }, { status: 401 });
        }

        const payload = await verifyJWT(token);
        if (!payload || !payload.userId) {
            return Response.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { productId } = await req.json();

        if (!productId) {
            return Response.json({ error: "Product ID is required" }, { status: 400 });
        }

        await prisma.wishlist.delete({
            where: {
                userId_productId: {
                    userId: payload.userId,
                    productId
                }
            }
        });

        return Response.json({ success: true, message: "Product removed from wishlist" });
    } catch (error) {
        console.error("DELETE_WISHLIST_ERROR", error);
        return Response.json({ error: "Internal server error" }, { status: 500 });
    }
}
