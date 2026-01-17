import { prisma } from "@/prisma/prisma";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { email } = await req.json();

    // Verify connection to Neon
    const user = await prisma.user.findUnique({
      where: { email: email },
    });

    return NextResponse.json({ success: true, exists: !!user, user });
  } catch (error) {
    console.error("Neon/Prisma Error:", error.message);
    // Returning JSON here prevents the "Unexpected token <" error on the frontend
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
