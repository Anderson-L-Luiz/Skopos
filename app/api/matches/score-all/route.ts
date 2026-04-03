import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { scoreJob } from "@/lib/scoring/matchScorer";

export async function POST() {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const userId = (session.user as { id: string }).id;

  const [profile, jobs] = await Promise.all([
    prisma.profile.findUnique({ where: { userId } }),
    prisma.job.findMany({ take: 50, orderBy: { trustScore: "desc" } }),
  ]);

  const userSkills: string[] = profile ? JSON.parse(profile.skills || "[]") : [];

  let created = 0;
  for (const job of jobs) {
    const jobSkills: string[] = JSON.parse(job.skills || "[]");
    const result = scoreJob({
      userSkills,
      userYearsExp: profile?.yearsExp || 0,
      jobSkills,
      jobTitle: job.title,
      jobSalaryMin: job.salaryMin || undefined,
      jobSalaryMax: job.salaryMax || undefined,
      jobRemote: job.remote,
      jobLocation: job.location || undefined,
    });

    const existing = await prisma.jobMatch.findFirst({ where: { userId, jobId: job.id } });

    if (existing) {
      await prisma.jobMatch.update({
        where: { id: existing.id },
        data: { score: result.score, category: result.category, gapAnalysis: JSON.stringify(result.gapAnalysis) },
      });
    } else {
      await prisma.jobMatch.create({
        data: {
          userId,
          jobId: job.id,
          score: result.score,
          category: result.category,
          gapAnalysis: JSON.stringify(result.gapAnalysis),
        },
      });
      created++;
    }
  }

  return NextResponse.json({ scored: jobs.length, created });
}
