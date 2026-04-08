import { NextResponse, NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { aiJSON } from "@/lib/ai/client";
import { salaryInsightPrompt } from "@/lib/ai/prompts";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const role = searchParams.get("role") || "";
  const location = searchParams.get("location") || "";
  const experience = searchParams.get("experience") || "";

  if (!role) return NextResponse.json({ error: "role parameter is required" }, { status: 400 });

  // 1. Aggregate salary data from existing jobs in DB
  const jobs = await prisma.job.findMany({
    where: {
      title: { contains: role, mode: "insensitive" },
      salaryMin: { not: null },
      salaryMax: { not: null },
      ...(location ? { location: { contains: location, mode: "insensitive" } } : {}),
    },
    select: { salaryMin: true, salaryMax: true, title: true, company: true, location: true },
  });

  let fromJobs = null;
  if (jobs.length > 0) {
    const mins = jobs.map((j) => j.salaryMin!).sort((a, b) => a - b);
    const maxes = jobs.map((j) => j.salaryMax!).sort((a, b) => a - b);
    const mids = jobs.map((j) => Math.round((j.salaryMin! + j.salaryMax!) / 2)).sort((a, b) => a - b);
    const median = mids[Math.floor(mids.length / 2)];

    fromJobs = {
      salaryMin: mins[0],
      salaryMedian: median,
      salaryMax: maxes[maxes.length - 1],
      dataPoints: jobs.length,
      source: "database" as const,
    };
  }

  // 2. Check cache
  const cached = await prisma.salaryInsight.findFirst({
    where: {
      roleTitle: { equals: role, mode: "insensitive" },
      ...(location ? { location: { equals: location, mode: "insensitive" } } : {}),
    },
  });

  let aiEstimate = cached
    ? { salaryMin: cached.salaryMin, salaryMedian: cached.salaryMedian, salaryMax: cached.salaryMax, source: "ai" as const }
    : null;

  // 3. If no cache and fewer than 5 data points, ask AI
  if (!aiEstimate && (jobs.length < 5)) {
    try {
      const result = await aiJSON<{
        salaryMin: number;
        salaryMedian: number;
        salaryMax: number;
        currency: string;
        factors: string[];
        notes: string;
      }>({
        messages: salaryInsightPrompt(role, location || null, experience ? parseInt(experience) : null),
        temperature: 0,
      });

      // Cache the result
      await prisma.salaryInsight.upsert({
        where: {
          roleTitle_location_experienceLevel: {
            roleTitle: role,
            location: location || "",
            experienceLevel: experience || "",
          },
        },
        create: {
          roleTitle: role,
          location: location || null,
          experienceLevel: experience || null,
          salaryMin: result.salaryMin,
          salaryMedian: result.salaryMedian,
          salaryMax: result.salaryMax,
          currency: result.currency || "USD",
          source: "ai",
          dataPoints: 0,
        },
        update: {
          salaryMin: result.salaryMin,
          salaryMedian: result.salaryMedian,
          salaryMax: result.salaryMax,
        },
      });

      aiEstimate = {
        salaryMin: result.salaryMin,
        salaryMedian: result.salaryMedian,
        salaryMax: result.salaryMax,
        source: "ai" as const,
      };
    } catch (err) {
      console.warn("AI salary estimate failed:", err);
    }
  }

  // 4. Combine
  const combined = fromJobs && aiEstimate
    ? {
        salaryMin: Math.min(fromJobs.salaryMin, aiEstimate.salaryMin),
        salaryMedian: Math.round((fromJobs.salaryMedian + aiEstimate.salaryMedian) / 2),
        salaryMax: Math.max(fromJobs.salaryMax, aiEstimate.salaryMax),
        source: "combined" as const,
      }
    : fromJobs || aiEstimate;

  return NextResponse.json({
    role,
    location: location || "All",
    experience: experience || "All levels",
    fromJobs,
    aiEstimate,
    combined,
    jobSamples: jobs.slice(0, 5).map((j) => ({ title: j.title, company: j.company, location: j.location, min: j.salaryMin, max: j.salaryMax })),
  });
}
