import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const userId = (session.user as { id: string }).id;

  const matches = await prisma.jobMatch.findMany({
    where: { userId },
    include: { job: true },
    orderBy: { score: "desc" },
    take: 50,
  });

  return NextResponse.json(
    matches.map((m) => ({
      ...m,
      job: { ...m.job, skills: JSON.parse(m.job.skills || "[]") },
      gapAnalysis: JSON.parse(m.gapAnalysis || "{}"),
    }))
  );
}
