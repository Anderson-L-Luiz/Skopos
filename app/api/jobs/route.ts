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
  const minSalary = parseInt(searchParams.get("minSalary") || "0");
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "20");
  const skip = (page - 1) * limit;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const where: any = {};

  if (search) {
    where.OR = [
      { title: { contains: search } },
      { company: { contains: search } },
      { description: { contains: search } },
    ];
  }
  if (source && source !== "all") {
    where.source = source;
  }
  if (remote === "remote") {
    where.remote = true;
  } else if (remote === "onsite") {
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
