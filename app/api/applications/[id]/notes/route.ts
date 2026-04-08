import { NextResponse, NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const userId = (session.user as { id: string }).id;
  const app = await prisma.application.findFirst({ where: { id: params.id, userId } });
  if (!app) return NextResponse.json({ error: "Application not found" }, { status: 404 });

  const notes = await prisma.applicationNote.findMany({
    where: { applicationId: params.id },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ notes });
}

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const userId = (session.user as { id: string }).id;
  const app = await prisma.application.findFirst({ where: { id: params.id, userId } });
  if (!app) return NextResponse.json({ error: "Application not found" }, { status: 404 });

  const { content } = await req.json();
  if (!content) return NextResponse.json({ error: "content is required" }, { status: 400 });

  const note = await prisma.applicationNote.create({
    data: { applicationId: params.id, content },
  });

  return NextResponse.json(note, { status: 201 });
}
