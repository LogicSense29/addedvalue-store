import { prisma } from "@/prisma/prisma";
import { verifyJWT } from "@/lib/auth";
import { cookies } from "next/headers";

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

        const body = await request.json();
        const { name, username, description, address, contact, email } = body;

        // Basic validation
        if (!name || !username || !description || !address || !contact || !email) {
            return Response.json({ error: "All fields are required" }, { status: 400 });
        }

        // Check if user already has a store
        const existingStore = await prisma.store.findUnique({
            where: { userId: payload.userId }
        });

        if (existingStore) {
            return Response.json({ error: "You already have a store" }, { status: 400 });
        }

        // Check if username is taken
        const usernameTaken = await prisma.store.findUnique({
            where: { username }
        });

        if (usernameTaken) {
            return Response.json({ error: "Store username is already taken" }, { status: 400 });
        }

        // Create store
        // using a placeholder logo for now as file upload is not yet implemented
        const defaultLogo = "https://via.placeholder.com/150?text=Store+Logo"; 

        const store = await prisma.store.create({
            data: {
                userId: payload.userId,
                name,
                username,
                description,
                address,
                contact,
                email,
                logo: defaultLogo, 
                status: 'pending',
                isActive: false
            }
        });

        return Response.json({ success: true, store });

    } catch (error) {
        console.error("CREATE_STORE_ERROR", error);
        return Response.json({ error: "Internal server error" }, { status: 500 });
    }
}
