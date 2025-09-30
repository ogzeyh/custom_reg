import { email, success, z } from "zod";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import * as argon2 from "argon2"

const RegisterSchema = z.object({
    email: z.email(),
    password: z.string()
    .min(5)
    .regex(/\d/)
    .regex(/[!@#$%^&*(),.?":{}|<>]/)
})

type RegisterFormData = z.infer<typeof RegisterSchema>

export async function POST(req: Request) {
    const body = await req.json();

    const parsed = RegisterSchema.safeParse(body);

    if (!parsed.success) {
        return NextResponse.json({ error: "Nieprawidłowe dane" }, { status: 400 });
    }

    const existing = await prisma.user.findUnique({ where: { email: parsed.data.email } });

    if (existing) {
        return NextResponse.json({ error: "Ten email już jest zarejestrowany" }, { status: 409 });
    }

    const hashedPassword = await argon2.hash(parsed.data.password, { type: argon2.argon2id });

    const user = await prisma.user.create({
        data: {
            email: parsed.data.email,
            password: hashedPassword
        }
    })

    return NextResponse.json({ id: user.id, email: user.email }, { status: 201 });
}