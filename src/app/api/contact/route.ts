import { NextResponse } from "next/server";
import { unknown, z } from "zod";

const ContactSchema = z.object({
    name: z.string().min(1),
    email: z.string().email(),
    message: z.string().min(1),
})

type ContactData = z.infer<typeof ContactSchema>

const ipRequests: Record<string, { count: number, lastRequest: number }> = {};
const MAX_REQUESTS = 5;
const WINDOW_MS = 60 * 60 * 1000;

export async function POST(req: Request) {
    const ip = req.headers.get("x-forwarded-for") || unknown;
    const now = Date.now();
    const record = ipRequests[ip] || { count: 0, lastRequets: now };

    if (now - record.lastRequest > WINDOW_MS) {
        record.count = 0;
        record.lastRequest = now;
    }

    record.count++;
    ipRequests[ip] = record;

    if (record.count > MAX_REQUESTS) {
        return NextResponse.json({ error: "Too many requests, spróbuj później." }, { status: 429 })
    }

    const body: ContactData = await req.json();

    const parsed = ContactSchema.safeParse(body);

    if(!parsed.success) {
        return NextResponse.json({ errors: parsed.error.format }, { status: 400 });
    }

    return NextResponse.json({ success: true, body })
}