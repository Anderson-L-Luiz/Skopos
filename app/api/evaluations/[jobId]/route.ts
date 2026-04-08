import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { buildEvaluation } from "@/lib/scoring/evaluator";

export async function POST(_req: Request, { params }: { params: { jobId: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const userId = (session.user as { id: string }).id;
  const { jobId } = params;

  const [profile, job] = await Promise.all([
    prisma.profile.findUnique({ where: { userId } }),
    prisma.job.findUnique({ where: { id: jobId } }),
  ]);
  if (!job) return NextResponse.json({ error: "Job not found" }, { status: 404 });

  const report = buildEvaluation({
    userSkills: profile ? JSON.parse(profile.skills || "[]") : [],
    userYearsExp: profile?.yearsExp || 0,
    userCurrentRole: profile?.currentRole || undefined,
    userHeadline: profile?.headline || undefined,
    cvText: profile?.cvRaw || undefined,
    jobTitle: job.title,
    jobCompany: job.company,
    jobDescription: job.description,
    jobSkills: JSON.parse(job.skills || "[]"),
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

  const saved = await prisma.evaluation.upsert({
    where: { userId_jobId: { userId, jobId } },
    create: { userId, jobId, ...data },
    update: data,
  });

  return NextResponse.json({ ...saved, dimensions: report.dimensions, job });
}

export async function GET(_req: Request, { params }: { params: { jobId: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const userId = (session.user as { id: string }).id;
  const evalRow = await prisma.evaluation.findUnique({
    where: { userId_jobId: { userId, jobId: params.jobId } },
    include: { job: true },
  });
  if (!evalRow) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ ...evalRow, dimensions: JSON.parse(evalRow.dimensions) });
}
