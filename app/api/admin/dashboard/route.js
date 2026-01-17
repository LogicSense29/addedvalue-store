import { prisma } from "@/prisma/prisma";
import { getAdmin } from "@/lib/auth";

export async function GET() {
    try {
        const admin = await getAdmin();
        if (!admin) return Response.json({ error: "Unauthorized" }, { status: 401 });

        const productsCount = await prisma.product.count();
        const storesCount = await prisma.store.count();
        const ordersCount = await prisma.order.count();
        
        // Revenue (Optimized with aggregate)
        const revenueRes = await prisma.order.aggregate({
            _sum: { total: true },
            where: { status: 'DELIVERED' }
        });
        const revenue = revenueRes._sum.total || 0;
        
        // Count for chart optimization: group by date is better but let's keep allOrders for now if requested, 
        // however we only take top 100 which is fine.

        // All orders for chart 
        const allOrders = await prisma.order.findMany({
            include: { user: true },
            orderBy: { createdAt: 'desc' },
            take: 100 // Last 100 orders for the chart 
        });

        return Response.json({
            success: true,
            products: productsCount,
            revenue: revenue,
            orders: ordersCount,
            stores: storesCount,
            allOrders: allOrders
        });

    } catch (error) {
        console.error("ADMIN_DASHBOARD_STATS_ERROR:", error);
        // Include error message in response for easier debugging during dev
        return Response.json({ 
            error: "Internal server error", 
            message: error.message,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        }, { status: 500 });
    }
}
