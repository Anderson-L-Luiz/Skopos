import { NextResponse, NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const userId = (session.user as { id: string }).id;

  const coverLetter = await prisma.coverLetter.findFirst({
    where: { id: params.id, userId },
    include: { job: { select: { title: true, company: true } } },
  });

  if (!coverLetter) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(coverLetter);
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const userId = (session.user as { id: string }).id;
  const { content } = await req.json();

  const existing = await prisma.coverLetter.findFirst({ where: { id: params.id, userId } });
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const updated = await prisma.coverLetter.update({
    where: { id: params.id },
    data: { content },
  });

  return NextResponse.json(updated);
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const userId = (session.user as { id: string }).id;

  const existing = await prisma.coverLetter.findFirst({ where: { id: params.id, userId } });
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

  await prisma.coverLetter.delete({ where: { id: params.id } });
  return NextResponse.json({ deleted: true });
}
