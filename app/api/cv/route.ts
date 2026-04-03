import { NextResponse, NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const userId = (session.user as { id: string }).id;
  const profile = await prisma.profile.findUnique({ where: { userId } });

  if (!profile) return NextResponse.json({ error: "Profile not found" }, { status: 404 });

  return NextResponse.json({
    ...profile,
    skills: JSON.parse(profile.skills || "[]"),
    enrichedData: profile.enrichedData ? JSON.parse(profile.enrichedData) : null,
  });
}

export async function PUT(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const userId = (session.user as { id: string }).id;
  const body = await req.json();

  const {
    headline, summary, currentRole, yearsExp, skills,
    linkedinUrl, githubUrl, scholarUrl, twitterUrl, instagramUrl,
  } = body;

  const profile = await prisma.profile.upsert({
    where: { userId },
    create: {
      userId,
      headline,
      summary,
      currentRole,
      yearsExp: yearsExp ? parseInt(yearsExp) : null,
      skills: JSON.stringify(skills || []),
      linkedinUrl,
      githubUrl,
      scholarUrl,
      twitterUrl,
      instagramUrl,
    },
    update: {
      headline,
      summary,
      currentRole,
      yearsExp: yearsExp ? parseInt(yearsExp) : null,
      skills: JSON.stringify(skills || []),
      linkedinUrl,
      githubUrl,
      scholarUrl,
      twitterUrl,
      instagramUrl,
    },
  });

  return NextResponse.json({
    ...profile,
    skills: JSON.parse(profile.skills || "[]"),
    enrichedData: profile.enrichedData ? JSON.parse(profile.enrichedData) : null,
  });
}
