import { NextResponse, NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { analyzeBrand } from "@/lib/brand/brandAnalyzer";
import { authLimiter } from "@/lib/rateLimit";

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
  // Rate limiting: 10 requests per minute per IP
  const clientIp = getClientIp(req);
  const rateLimitResult = authLimiter(clientIp);
  if (!rateLimitResult.success) {
    const retryAfter = Math.ceil((rateLimitResult.reset.getTime() - Date.now()) / 1000);
    return NextResponse.json(
      { error: "Too many brand analysis requests. Please try again later." },
      { status: 429, headers: { "Retry-After": retryAfter.toString() } }
    );
  }

  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const userId = (session.user as { id: string }).id;
  const profile = await prisma.profile.findUnique({ where: { userId } });

  const analysis = analyzeBrand({
    linkedinUrl: profile?.linkedinUrl || undefined,
    githubUrl: profile?.githubUrl || undefined,
    twitterUrl: profile?.twitterUrl || undefined,
    instagramUrl: profile?.instagramUrl || undefined,
    cvFile: profile?.cvFile || undefined,
    skills: profile ? JSON.parse(profile.skills || "[]") : [],
    yearsExp: profile?.yearsExp || undefined,
  });

  // Save brand score to profile
  await prisma.profile.upsert({
    where: { userId },
    create: { userId, brandScore: analysis.overallScore, skills: "[]" },
    update: { brandScore: analysis.overallScore },
  });

  return NextResponse.json({ analysis });
}
