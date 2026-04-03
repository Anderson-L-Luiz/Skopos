import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { analyzeBrand } from "@/lib/brand/brandAnalyzer";

export async function POST() {
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
