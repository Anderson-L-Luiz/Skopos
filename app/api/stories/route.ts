import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const userId = (session.user as { id: string }).id;
  const stories = await prisma.interviewStory.findMany({
    where: { userId },
    orderBy: { updatedAt: "desc" },
  });
  return NextResponse.json(stories.map((s) => ({ ...s, tags: JSON.parse(s.tags || "[]") })));
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const userId = (session.user as { id: string }).id;
  const body = await req.json();
  if (!body?.title || !body?.situation || !body?.task || !body?.action || !body?.result) {
    return NextResponse.json({ error: "Missing STAR fields" }, { status: 400 });
  }
  const created = await prisma.interviewStory.create({
    data: {
      userId,
      title: String(body.title),
      situation: String(body.situation),
      task: String(body.task),
      action: String(body.action),
      result: String(body.result),
      reflection: body.reflection ? String(body.reflection) : null,
      tags: JSON.stringify(Array.isArray(body.tags) ? body.tags : []),
    },
  });
  return NextResponse.json({ ...created, tags: JSON.parse(created.tags) });
}
