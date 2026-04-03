import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { enrichProfile } from "@/lib/scrapers/profileScraper";

export async function POST() {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const userId = (session.user as { id: string }).id;

  const profile = await prisma.profile.findUnique({ where: { userId } });
  if (!profile) {
    return NextResponse.json({ error: "Profile not found. Please save your profile first." }, { status: 404 });
  }

  const enriched = await enrichProfile(
    profile.linkedinUrl || undefined,
    profile.githubUrl || undefined,
    profile.scholarUrl || undefined
  );

  // Extract skills from enriched data
  const existingSkills: string[] = JSON.parse(profile.skills || "[]");
  const enrichedSkills = enriched.linkedin?.skills || [];
  const allSkills = Array.from(new Set([...existingSkills, ...enrichedSkills]));

  const updated = await prisma.profile.update({
    where: { userId },
    data: {
      enrichedData: JSON.stringify(enriched),
      skills: JSON.stringify(allSkills),
      headline: profile.headline || enriched.linkedin?.headline,
      summary: profile.summary || enriched.linkedin?.summary,
    },
  });

  return NextResponse.json({
    ...updated,
    skills: JSON.parse(updated.skills || "[]"),
    enrichedData: JSON.parse(updated.enrichedData || "{}"),
  });
}
