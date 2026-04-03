import { NextResponse, NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { scoreATS } from "@/lib/scoring/atsScorer";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const userId = (session.user as { id: string }).id;

  try {
    const body = await req.json();
    const { jobId } = body;

    if (!jobId) {
      return NextResponse.json({ error: "jobId is required" }, { status: 400 });
    }

    // Get user profile with CV data
    const profile = await prisma.profile.findUnique({ where: { userId } });
    if (!profile || !profile.cvRaw) {
      return NextResponse.json(
        { error: "No CV data found. Please upload a CV first." },
        { status: 404 }
      );
    }

    // Get job description
    const job = await prisma.job.findUnique({ where: { id: jobId } });
    if (!job) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 });
    }

    // Score the CV against the job
    const atsResult = scoreATS(profile.cvRaw, job.description);

    return NextResponse.json(atsResult);
  } catch (err) {
    console.error("ATS scoring error:", err);
    const message = err instanceof Error ? err.message : "ATS scoring failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
