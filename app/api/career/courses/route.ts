import { NextResponse, NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { recommendCourses } from "@/lib/career/courseRecommender";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const userId = (session.user as { id: string }).id;
  const { searchParams } = new URL(req.url);
  const skillsParam = searchParams.get("skills") || "";

  // Parse comma-separated skills from query param
  let skills = skillsParam
    .split(",")
    .map((s) => s.trim())
    .filter((s) => s.length > 0);

  // If no skills provided, fetch from user profile
  if (skills.length === 0) {
    const profile = await prisma.profile.findUnique({ where: { userId } });
    if (profile?.skills) {
      const parsed = typeof profile.skills === "string"
        ? JSON.parse(profile.skills)
        : profile.skills;
      if (Array.isArray(parsed)) skills = parsed;
    }
  }

  if (skills.length === 0) {
    return NextResponse.json({ recommendations: [] });
  }

  const recommendations = recommendCourses(skills);

  return NextResponse.json({ recommendations });
}
