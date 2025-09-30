import { prisma } from "@/lib/db"
import { NextResponse } from "next/server";

export async function GET(req: Request) {
    const url = new URL(req.url);
    const email = url.searchParams.get("email");

    if (!email) {
        return NextResponse.json({ exists: false });
    }
    const existing = await prisma.user.findUnique({ where: { email } });
    return NextResponse.json({ exists: !!existing });
}