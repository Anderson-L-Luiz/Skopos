import { NextResponse, NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { aiChat } from "@/lib/ai/client";
import { coverLetterPrompt } from "@/lib/ai/prompts";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const userId = (session.user as { id: string }).id;

  const coverLetters = await prisma.coverLetter.findMany({
    where: { userId },
    include: { job: { select: { title: true, company: true } } },
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  return NextResponse.json({ coverLetters });
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const userId = (session.user as { id: string }).id;
  const { jobId, applicationId, tone = "professional" } = await req.json();

  if (!jobId) return NextResponse.json({ error: "jobId is required" }, { status: 400 });

  const [profile, job] = await Promise.all([
    prisma.profile.findUnique({ where: { userId } }),
    prisma.job.findUnique({ where: { id: jobId } }),
  ]);

  if (!job) return NextResponse.json({ error: "Job not found" }, { status: 404 });

  const skills: string[] = profile?.skills ? JSON.parse(profile.skills) : [];
  const currentRole = profile?.currentRole || "Professional";
  const cvText = profile?.cvRaw || profile?.summary || "";

  try {
    const response = await aiChat({
      messages: coverLetterPrompt(cvText, skills, currentRole, job.title, job.company, job.description, tone),
      temperature: 0.7,
    });

    const coverLetter = await prisma.coverLetter.create({
      data: {
        userId,
        jobId,
        applicationId: applicationId || null,
        content: response.content,
        tone,
      },
      include: { job: { select: { title: true, company: true } } },
    });

    return NextResponse.json(coverLetter);
  } catch (err) {
    console.error("Cover letter generation error:", err);
    return NextResponse.json({ error: "Failed to generate cover letter. Ensure an AI provider is configured." }, { status: 503 });
  }
}
