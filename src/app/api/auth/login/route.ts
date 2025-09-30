import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import * as argon2 from "argon2"
import { SignJWT } from "jose";

export async function POST(req: Request) {
    const { email, password } = await req.json();

    const user = await prisma.user.findUnique({ where: { email } });
    if(!user) {
        return NextResponse.json({ error: "Niepoprawny login" }, { status: 401 });
    }

    const valid = await argon2.verify(user.password, password);
    if(!valid) {
        return NextResponse.json({ error: "Niepoprawny login" }, { status: 401 });
    }

    const token = await new SignJWT({ userId: user.id })
        .setProtectedHeader({ alg: "HS256" })
        .setExpirationTime('1h')
        .sign(new TextEncoder().encode(process.env.JWT_SECRET));

    const response = NextResponse.json({ message: "Zalogowano" });
    response.cookies.set({
        name: "token",
        value: token,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 3600,
        path: '/',
    });

    return response;
}