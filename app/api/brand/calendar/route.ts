import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { generateContentCalendar } from "@/lib/brand/contentCalendar";
import { analyzeBrand } from "@/lib/brand/brandAnalyzer";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const userId = (session.user as { id: string }).id;
  const profile = await prisma.profile.findUnique({ where: { userId } });

  if (!profile) {
    return NextResponse.json({ error: "Profile not found" }, { status: 404 });
  }

  // Parse skills from database string
  const parsedSkills = JSON.parse(profile.skills || "[]");

  // Generate brand analysis to use as basis for calendar
  const analysis = analyzeBrand({
    linkedinUrl: profile.linkedinUrl || undefined,
    githubUrl: profile.githubUrl || undefined,
    twitterUrl: profile.twitterUrl || undefined,
    instagramUrl: profile.instagramUrl || undefined,
    cvFile: profile.cvFile || undefined,
    skills: parsedSkills,
    yearsExp: profile.yearsExp || undefined,
  });

  // Create a profile object compatible with UserProfile type
  const userProfile = {
    id: profile.id,
    userId: profile.userId,
    skills: parsedSkills,
    currentRole: profile.currentRole,
    yearsExp: profile.yearsExp,
    headline: profile.headline,
    summary: profile.summary,
    cvRaw: profile.cvRaw,
    cvFile: profile.cvFile,
    linkedinUrl: profile.linkedinUrl,
    githubUrl: profile.githubUrl,
    scholarUrl: profile.scholarUrl,
    twitterUrl: profile.twitterUrl,
    instagramUrl: profile.instagramUrl,
  };

  // Generate content calendar
  const calendar = generateContentCalendar(userProfile, analysis);

  return NextResponse.json({ calendar });
}
