import { jwtVerify } from "jose";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export const runtime = 'edge';

export async function middleware(req: NextRequest) {
const token = req.cookies.get('token')?.value || req.headers.get('cookie')?.split('token=')[1];
    if(!token) return NextResponse.redirect(new URL("/login", req.url));

    try {
        await jwtVerify(token, new TextEncoder().encode(process.env.JWT_SECRET));
        return NextResponse.next();
    } catch {
        return NextResponse.redirect(new URL("/login", req.url));
    }
}

export const config = {
    matcher: ["/dashboard/:path*"]
}