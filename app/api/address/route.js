import { prisma } from "@/prisma/prisma";
import { verifyJWT } from "@/lib/auth";
import { cookies } from "next/headers";

export async function GET() {
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

        const addresses = await prisma.address.findMany({
            where: { userId: payload.userId },
            orderBy: { createdAt: 'desc' },
        });

        return Response.json({ success: true, addresses });

    } catch (error) {
        console.error("GET_ADDRESSES_ERROR", error);
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

        const { name, email, street, city, state, zip, country, phone } = await req.json();

        const newAddress = await prisma.address.create({
            data: {
                userId: payload.userId,
                name,
                email,
                street,
                city,
                state,
                zip,
                country,
                phone,
            },
        });

        return Response.json({ success: true, address: newAddress });

    } catch (error) {
        console.error("POST_ADDRESS_ERROR", error);
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

        const { searchParams } = new URL(req.url);
        const addressId = searchParams.get("id");

        if (!addressId) {
            return Response.json({ error: "Address ID required" }, { status: 400 });
        }

        await prisma.address.delete({
            where: { 
                id: addressId,
                userId: payload.userId // Ensure user owns the address
            },
        });

        return Response.json({ success: true, message: "Address deleted" });

    } catch (error) {
        console.error("DELETE_ADDRESS_ERROR", error);
        return Response.json({ error: "Internal server error" }, { status: 500 });
    }
}
