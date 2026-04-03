import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { scoreJob } from "@/lib/scoring/matchScorer";

export async function POST(req: Request, { params }: { params: { jobId: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const userId = (session.user as { id: string }).id;
  const { jobId } = params;

  const [profile, job] = await Promise.all([
    prisma.profile.findUnique({ where: { userId } }),
    prisma.job.findUnique({ where: { id: jobId } }),
  ]);

  if (!job) return NextResponse.json({ error: "Job not found" }, { status: 404 });

  const userSkills: string[] = profile ? JSON.parse(profile.skills || "[]") : [];
  const jobSkills: string[] = JSON.parse(job.skills || "[]");

  const result = scoreJob({
    userSkills,
    userYearsExp: profile?.yearsExp || 0,
    userCurrentRole: profile?.currentRole || undefined,
    jobSkills,
    jobTitle: job.title,
    jobSalaryMin: job.salaryMin || undefined,
    jobSalaryMax: job.salaryMax || undefined,
    jobRemote: job.remote,
    jobLocation: job.location || undefined,
  });

  // Check if match already exists
  const existing = await prisma.jobMatch.findFirst({ where: { userId, jobId } });

  let match;
  if (existing) {
    match = await prisma.jobMatch.update({
      where: { id: existing.id },
      data: {
        score: result.score,
        category: result.category,
        gapAnalysis: JSON.stringify(result.gapAnalysis),
      },
    });
  } else {
    match = await prisma.jobMatch.create({
      data: {
        userId,
        jobId,
        score: result.score,
        category: result.category,
        gapAnalysis: JSON.stringify(result.gapAnalysis),
      },
    });
  }

  return NextResponse.json({
    ...match,
    gapAnalysis: result.gapAnalysis,
    job: { ...job, skills: jobSkills },
  });
}
