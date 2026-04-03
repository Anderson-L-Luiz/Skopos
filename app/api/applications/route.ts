import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const userId = (session.user as { id: string }).id;

  const applications = await prisma.application.findMany({
    where: { userId },
    include: { job: true },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(
    applications.map((app) => ({
      ...app,
      job: { ...app.job, skills: JSON.parse(app.job.skills || "[]") },
    }))
  );
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const userId = (session.user as { id: string }).id;
  const { jobId, status = "saved", notes = "" } = await req.json();

  if (!jobId) {
    return NextResponse.json({ error: "jobId is required" }, { status: 400 });
  }

  // Check if application already exists
  const existing = await prisma.application.findFirst({
    where: { userId, jobId },
  });

  if (existing) {
    return NextResponse.json(
      { error: "Application already exists for this job" },
      { status: 409 }
    );
  }

  // Check if job exists
  const job = await prisma.job.findUnique({ where: { id: jobId } });
  if (!job) {
    return NextResponse.json({ error: "Job not found" }, { status: 404 });
  }

  const application = await prisma.application.create({
    data: {
      userId,
      jobId,
      status,
      notes,
      appliedAt: status === "applied" ? new Date() : null,
    },
    include: { job: true },
  });

  return NextResponse.json(
    {
      ...application,
      job: { ...application.job, skills: JSON.parse(application.job.skills || "[]") },
    },
    { status: 201 }
  );
}
