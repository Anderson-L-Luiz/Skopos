import { NextResponse, NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { scoreJobWithAI } from "@/lib/scoring/aiScorer";
import { buildEvaluation } from "@/lib/scoring/evaluator";
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

  const url0 = new URL(req.url);
  const take = Math.max(1, Math.min(50, parseInt(url0.searchParams.get("limit") || "50") || 50));
  const [profile, jobs] = await Promise.all([
    prisma.profile.findUnique({ where: { userId } }),
    prisma.job.findMany({ take, orderBy: { trustScore: "desc" } }),
  ]);

  const userSkills: string[] = profile ? JSON.parse(profile.skills || "[]") : [];

  const withEvaluations = url0.searchParams.get("withEvaluations") === "true";

  let created = 0;
  let evaluationsUpserted = 0;
  for (const job of jobs) {
    const jobSkills: string[] = JSON.parse(job.skills || "[]");
    const result = await scoreJobWithAI({
      userSkills,
      userYearsExp: profile?.yearsExp || 0,
      cvText: profile?.cvRaw || undefined,
      jobSkills,
      jobTitle: job.title,
      jobDescription: job.description,
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

    if (withEvaluations) {
      const report = buildEvaluation({
        userSkills,
        userYearsExp: profile?.yearsExp || 0,
        userCurrentRole: profile?.currentRole || undefined,
        userHeadline: profile?.headline || undefined,
        cvText: profile?.cvRaw || undefined,
        jobTitle: job.title,
        jobCompany: job.company,
        jobDescription: job.description,
        jobSkills,
        jobLocation: job.location || undefined,
        jobRemote: job.remote,
        jobSalaryMin: job.salaryMin || undefined,
        jobSalaryMax: job.salaryMax || undefined,
      });
      const data = {
        grade: report.grade,
        overallScore: report.overallScore,
        dimensions: JSON.stringify(report.dimensions),
        roleSummary: report.roleSummary,
        cvMatch: report.cvMatch,
        levelStrategy: report.levelStrategy,
        compResearch: report.compResearch,
        personalization: report.personalization,
        interviewPrep: report.interviewPrep,
      };
      await prisma.evaluation.upsert({
        where: { userId_jobId: { userId, jobId: job.id } },
        create: { userId, jobId: job.id, ...data },
        update: data,
      });
      evaluationsUpserted++;
    }
  }

  return NextResponse.json({ scored: jobs.length, created, evaluationsUpserted });
}
