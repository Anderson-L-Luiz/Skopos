import { NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
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
