import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const userId = (session.user as { id: string }).id;

  const [totalJobs, totalMatches, applications, profile] = await Promise.all([
    prisma.job.count(),
    prisma.jobMatch.count({ where: { userId } }),
    prisma.application.findMany({ where: { userId } }),
    prisma.profile.findUnique({ where: { userId } }),
  ]);

  const openMatches = await prisma.jobMatch.count({ where: { userId, category: "open" } });
  const withinReachMatches = await prisma.jobMatch.count({ where: { userId, category: "within_reach" } });
  const stretchMatches = await prisma.jobMatch.count({ where: { userId, category: "stretch" } });

  const appStatuses = applications.reduce<Record<string, number>>((acc, a) => {
    acc[a.status] = (acc[a.status] || 0) + 1;
    return acc;
  }, {});

  return NextResponse.json({
    totalJobs,
    totalMatches,
    brandScore: profile?.brandScore || 0,
    applications: {
      total: applications.length,
      ...appStatuses,
    },
    matchBreakdown: {
      open: openMatches,
      withinReach: withinReachMatches,
      stretch: stretchMatches,
    },
    profileComplete: !!(profile?.skills && JSON.parse(profile.skills).length > 0 && profile.currentRole),
  });
}
