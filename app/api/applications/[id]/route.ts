import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const userId = (session.user as { id: string }).id;
  const { status, notes } = await req.json();

  // Verify ownership
  const app = await prisma.application.findUnique({
    where: { id: params.id },
    include: { job: true },
  });

  if (!app) {
    return NextResponse.json({ error: "Application not found" }, { status: 404 });
  }

  if (app.userId !== userId) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const updated = await prisma.application.update({
    where: { id: params.id },
    data: {
      ...(status !== undefined && {
        status,
        appliedAt: status === "applied" && !app.appliedAt ? new Date() : app.appliedAt,
      }),
      ...(notes !== undefined && { notes }),
    },
    include: { job: true },
  });

  return NextResponse.json({
    ...updated,
    job: { ...updated.job, skills: JSON.parse(updated.job.skills || "[]") },
  });
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const userId = (session.user as { id: string }).id;

  // Verify ownership
  const app = await prisma.application.findUnique({
    where: { id: params.id },
  });

  if (!app) {
    return NextResponse.json({ error: "Application not found" }, { status: 404 });
  }

  if (app.userId !== userId) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  await prisma.application.delete({
    where: { id: params.id },
  });

  return NextResponse.json({ success: true });
}
