import { NextResponse, NextRequest } from "next/server";
import bcryptjs from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { authLimiter } from "@/lib/rateLimit";

function getClientIp(request: Request): string {
  if (request instanceof NextRequest) {
    return (
      request.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
      request.headers.get("x-real-ip") ||
      "unknown"
    );
  }
  return "unknown";
}

export async function POST(req: Request) {
  // Rate limiting: 10 requests per minute per IP
  const clientIp = getClientIp(req);
  const rateLimitResult = authLimiter(clientIp);
  if (!rateLimitResult.success) {
    const retryAfter = Math.ceil((rateLimitResult.reset.getTime() - Date.now()) / 1000);
    return NextResponse.json(
      { error: "Too many registration attempts. Please try again later." },
      { status: 429, headers: { "Retry-After": retryAfter.toString() } }
    );
  }
  try {
    const { email, password, name } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password required" }, { status: 400 });
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({ error: "Email already registered" }, { status: 400 });
    }

    const hashed = await bcryptjs.hash(password, 12);

    const user = await prisma.user.create({
      data: {
        email,
        name: name || null,
        password: hashed,
        profile: {
          create: {
            skills: "[]",
          },
        },
      },
    });

    return NextResponse.json({ id: user.id, email: user.email, name: user.name });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
