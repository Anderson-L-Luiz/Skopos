import { NextResponse, NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { recommendCourses } from "@/lib/career/courseRecommender";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const skillsParam = searchParams.get("skills") || "";

  // Parse comma-separated skills
  const skills = skillsParam
    .split(",")
    .map((s) => s.trim())
    .filter((s) => s.length > 0);

  if (skills.length === 0) {
    return NextResponse.json({ recommendations: [] });
  }

  const recommendations = recommendCourses(skills);

  return NextResponse.json({ recommendations });
}
