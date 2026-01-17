import { prisma } from "@/prisma/prisma";
import { verifyJWT, getAdmin } from "@/lib/auth";
import { cookies } from "next/headers";

export async function GET(req) {
    try {
        const { searchParams } = new URL(req.url);
        const showAll = searchParams.get('all') === 'true';
        const userRole = searchParams.get('userRole');
        
        let where = {
            store: { isActive: true },
            inStock: true
        };

        if (showAll || userRole === 'ADMIN') {
            const admin = await getAdmin();
            if (admin) {
                where = {}; // Admin can see all 
            }
        }

        const products = await prisma.product.findMany({
            where,
            include: {
                store: true
            }
        });
        return Response.json({ success: true, products });
    } catch (error) {
        console.error("GET_PRODUCTS_ERROR", error);
        return Response.json({ error: "Internal server error" }, { status: 500 });
    }
}

export async function POST(request) {
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

        // Get user's store
        const store = await prisma.store.findUnique({
            where: { userId: payload.userId }
        });

        if (!store) {
            return Response.json({ error: "You must create a store first" }, { status: 400 });
        }

        if (!store.isActive) {
            return Response.json({ error: "Your store must be approved by an admin before you can add products" }, { status: 403 });
        }

        const body = await request.json();
        const { name, description, mrp, price, images, category } = body;

        // Basic validation
        if (!name || !description || !mrp || !price || !category || !images || images.length === 0) {
            return Response.json({ error: "All fields are required" }, { status: 400 });
        }

        const product = await prisma.product.create({
            data: {
                name,
                description,
                mrp: parseFloat(mrp),
                price: parseFloat(price),
                inStock: true,
                images, // This should be an array of ImageKit URLs
                category,
                storeId: store.id
            }
        });

        return Response.json({ success: true, product });

    } catch (error) {
        console.error("CREATE_PRODUCT_ERROR", error);
        return Response.json({ error: "Internal server error" }, { status: 500 });
    }
}
