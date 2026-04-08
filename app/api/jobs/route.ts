import { NextResponse, NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const search = searchParams.get("search") || "";
  const source = searchParams.get("source") || "";
  const remote = searchParams.get("remote") || "";
  const minSalary = Math.max(0, parseInt(searchParams.get("minSalary") || "0") || 0);
  const page = Math.max(1, parseInt(searchParams.get("page") || "1") || 1);
  const limit = Math.max(1, Math.min(100, parseInt(searchParams.get("limit") || "20") || 20));
  const skip = (page - 1) * limit;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const where: any = {};

  if (search) {
    where.OR = [
      { title: { contains: search, mode: "insensitive" } },
      { company: { contains: search, mode: "insensitive" } },
      { description: { contains: search, mode: "insensitive" } },
    ];
  }
  if (source && source !== "all") {
    where.source = source;
  }
  if (remote === "remote" || remote === "true" || remote === "yes") {
    where.remote = true;
  } else if (remote === "onsite" || remote === "false") {
    where.remote = false;
  }
  if (minSalary > 0) {
    where.salaryMin = { gte: minSalary };
  }

  const [jobs, total] = await Promise.all([
    prisma.job.findMany({
      where,
      orderBy: [{ trustScore: "desc" }, { postedAt: "desc" }],
      skip,
      take: limit,
    }),
    prisma.job.count({ where }),
  ]);

  const parsed = jobs.map((j) => ({
    ...j,
    skills: JSON.parse(j.skills || "[]"),
  }));

  return NextResponse.json({ jobs: parsed, total, page, pages: Math.ceil(total / limit) });
}
