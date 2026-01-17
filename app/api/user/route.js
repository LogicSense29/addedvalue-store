import { prisma } from "@/prisma/prisma";
import { verifyJWT } from "@/lib/auth";
import { cookies } from "next/headers";

export async function PATCH(req) {
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

        const { name, image } = await req.json();

        const updatedUser = await prisma.user.update({
            where: { id: payload.userId },
            data: {
                ...(name && { name }),
                ...(image && { image }),
            },
        });

        const { password: _, ...userWithoutPassword } = updatedUser;
        return Response.json({ success: true, user: userWithoutPassword });

    } catch (error) {
        console.error("PATCH_USER_ERROR", error);
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

        await prisma.user.delete({
            where: { id: payload.userId },
        });

        // Clear the auth cookie
        cookieStore.delete("token");

        return Response.json({ success: true, message: "Account deleted successfully" });
    } catch (error) {
        console.error("DELETE_USER_ERROR", error);
        return Response.json({ error: "Internal server error" }, { status: 500 });
    }
}
