import { prisma } from "@/prisma/prisma";
import { getAdmin } from "@/lib/auth";

export async function GET() {
    try {
        const admin = await getAdmin();
        if (!admin) return Response.json({ error: "Unauthorized" }, { status: 401 });

        const coupons = await prisma.coupon.findMany({
            orderBy: { createdAt: 'desc' }
        });

        return Response.json({ success: true, coupons });
    } catch (error) {
        console.error("ADMIN_GET_COUPONS_ERROR", error);
        return Response.json({ error: "Internal server error" }, { status: 500 });
    }
}

export async function POST(request) {
    try {
        const admin = await getAdmin();
        if (!admin) return Response.json({ error: "Unauthorized" }, { status: 401 });

        const body = await request.json();
        const { code, description, discount, forNewUser, forMember, expiresAt } = body;

        if (!code || !discount) {
            return Response.json({ error: "Code and discount are required" }, { status: 400 });
        }

        const coupon = await prisma.coupon.create({
            data: {
                code: code.toUpperCase(),
                description,
                discount: parseFloat(discount),
                forNewUser: !!forNewUser,
                forMember: !!forMember,
                expiresAt: new Date(expiresAt)
            }
        });

        return Response.json({ success: true, coupon });
    } catch (error) {
        console.error("ADMIN_POST_COUPON_ERROR", error);
        if (error.code === 'P2002') {
            return Response.json({ error: "Coupon code already exists" }, { status: 400 });
        }
        return Response.json({ error: "Internal server error" }, { status: 500 });
    }
}

export async function DELETE(request) {
    try {
        const admin = await getAdmin();
        if (!admin) return Response.json({ error: "Unauthorized" }, { status: 401 });

        const { searchParams } = new URL(request.url);
        const code = searchParams.get('code');

        if (!code) {
            return Response.json({ error: "Coupon code is required" }, { status: 400 });
        }

        await prisma.coupon.delete({
            where: { code }
        });

        return Response.json({ success: true, message: "Coupon deleted" });
    } catch (error) {
        console.error("ADMIN_DELETE_COUPON_ERROR", error);
        return Response.json({ error: "Internal server error" }, { status: 500 });
    }
}
