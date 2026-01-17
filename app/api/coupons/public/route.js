import { prisma } from "@/prisma/prisma";

export async function GET() {
    try {
        const coupons = await prisma.coupon.findMany({
            where: {
                isPublic: true,
                expiresAt: {
                    gt: new Date()
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        return Response.json({ success: true, coupons });
    } catch (error) {
        console.error("GET_PUBLIC_COUPONS_ERROR", error);
        return Response.json({ error: "Internal server error" }, { status: 500 });
    }
}
