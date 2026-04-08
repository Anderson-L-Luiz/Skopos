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

  const tasks = await prisma.applicationTask.findMany({
    where: { applicationId: params.id },
    orderBy: [{ completed: "asc" }, { createdAt: "desc" }],
  });

  return NextResponse.json({ tasks });
}

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const userId = (session.user as { id: string }).id;
  const app = await prisma.application.findFirst({ where: { id: params.id, userId } });
  if (!app) return NextResponse.json({ error: "Application not found" }, { status: 404 });

  const { title, dueDate } = await req.json();
  if (!title) return NextResponse.json({ error: "title is required" }, { status: 400 });

  const task = await prisma.applicationTask.create({
    data: {
      applicationId: params.id,
      title,
      dueDate: dueDate ? new Date(dueDate) : null,
    },
  });

  return NextResponse.json(task, { status: 201 });
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { taskId, completed, title, dueDate } = await req.json();
  if (!taskId) return NextResponse.json({ error: "taskId is required" }, { status: 400 });

  const task = await prisma.applicationTask.update({
    where: { id: taskId },
    data: {
      ...(completed !== undefined && { completed }),
      ...(title !== undefined && { title }),
      ...(dueDate !== undefined && { dueDate: dueDate ? new Date(dueDate) : null }),
    },
  });

  return NextResponse.json(task);
}
