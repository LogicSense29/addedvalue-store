import { prisma } from "@/prisma/prisma";
import { verifyJWT } from "@/lib/auth";
import { cookies } from "next/headers";

export async function DELETE(request, { params }) {
    try {
        const id = (await params).id;
        const cookieStore = await cookies();
        const token = cookieStore.get("token")?.value;

        if (!token) {
            return Response.json({ error: "Unauthorized" }, { status: 401 });
        }

        const payload = await verifyJWT(token);
        if (!payload || !payload.userId) {
            return Response.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Fetch product to check ownership
        const productCheck = await prisma.product.findUnique({
            where: { id },
            include: { store: true }
        });

        if (!productCheck) {
            return Response.json({ error: "Product not found" }, { status: 404 });
        }

        // Only Admin or the Store Owner (the one who created the store) should be able to delete
        const isAdmin = payload.role === 'ADMIN';
        const isOwner = productCheck.store.userId === payload.userId;

        if (!isAdmin && !isOwner) {
            return Response.json({ error: "Forbidden" }, { status: 403 });
        }

        await prisma.product.delete({
            where: { id }
        });

        return Response.json({ success: true, message: "Product deleted" });

    } catch (error) {
        console.error("DELETE_PRODUCT_ERROR", error);
        return Response.json({ error: "Internal server error" }, { status: 500 });
    }
}

export async function PATCH(request, { params }) {
    try {
        const id = (await params).id;
        const cookieStore = await cookies();
        const token = cookieStore.get("token")?.value;

        if (!token) {
            return Response.json({ error: "Unauthorized" }, { status: 401 });
        }

        const payload = await verifyJWT(token);
        if (!payload || !payload.userId) {
            return Response.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Fetch product to check ownership
        const productCheck = await prisma.product.findUnique({
            where: { id },
            include: { store: true }
        });

        if (!productCheck) {
            return Response.json({ error: "Product not found" }, { status: 404 });
        }

        const isAdmin = payload.role === 'ADMIN';
        const isOwner = productCheck.store.userId === payload.userId;

        if (!isAdmin && !isOwner) {
            return Response.json({ error: "Forbidden" }, { status: 403 });
        }

        const body = await request.json();
        
        const product = await prisma.product.update({
            where: { id },
            data: body
        });

        return Response.json({ success: true, product });
    } catch (error) {
        console.error("PATCH_PRODUCT_ERROR", error);
        return Response.json({ error: "Internal server error" }, { status: 500 });
    }
}
