import { NextResponse, NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { scoreJob } from "@/lib/scoring/matchScorer";
import { expensiveOpLimiter } from "@/lib/rateLimit";

function getClientIp(request: Request): string {
  if (request instanceof NextRequest) {
    return (
      request.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
      request.headers.get("x-real-ip") ||
      "unknown"
    );
  }
  return "unknown";
}

export async function POST(req: Request) {
  // Rate limiting: 5 requests per minute per IP (expensive operation)
  const clientIp = getClientIp(req);
  const rateLimitResult = expensiveOpLimiter(clientIp);
  if (!rateLimitResult.success) {
    const retryAfter = Math.ceil((rateLimitResult.reset.getTime() - Date.now()) / 1000);
    return NextResponse.json(
      { error: "Too many scoring requests. Please try again later." },
      { status: 429, headers: { "Retry-After": retryAfter.toString() } }
    );
  }

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
