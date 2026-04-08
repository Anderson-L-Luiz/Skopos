import { NextResponse, NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { scrapeRealJobs } from "@/lib/scrapers/realJobScraper";
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
      { error: "Too many scrape requests. Please try again later." },
      { status: 429, headers: { "Retry-After": retryAfter.toString() } }
    );
  }

  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const jobs = await scrapeRealJobs();
  let created = 0;
  let skipped = 0;

  for (const job of jobs) {
    // Deduplicate by externalId
    const existing = job.externalId
      ? await prisma.job.findFirst({ where: { externalId: job.externalId } })
      : null;

    if (existing) {
      skipped++;
      continue;
    }

    await prisma.job.create({
      data: {
        externalId: job.externalId,
        title: job.title,
        company: job.company,
        location: job.location,
        remote: job.remote,
        salaryMin: job.salaryMin,
        salaryMax: job.salaryMax,
        description: job.description,
        skills: JSON.stringify(job.skills),
        source: job.source,
        sourceUrl: job.sourceUrl,
        trustScore: job.trustScore,
        postedAt: job.postedAt,
      },
    });
    created++;
  }

  return NextResponse.json({ created, skipped, total: jobs.length });
}
