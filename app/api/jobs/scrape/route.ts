import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { generateMockJobs } from "@/lib/scrapers/jobScraper";

export async function POST() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const jobs = generateMockJobs();
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
