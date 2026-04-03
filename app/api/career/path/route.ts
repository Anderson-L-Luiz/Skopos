import { NextResponse, NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import type { CareerPathStep } from "@/types";

const careerPaths: Record<string, CareerPathStep[]> = {
  "Junior Software Engineer": [
    { role: "Software Engineer", timeframe: "1-2 years", skills: ["System Design Basics", "Code Reviews", "Testing"], salaryRange: "$100k-$140k", description: "Level up to mid-level by owning feature development end-to-end." },
    { role: "Senior Software Engineer", timeframe: "3-5 years", skills: ["Architecture", "Mentoring", "Technical Leadership"], salaryRange: "$140k-$200k", description: "Lead larger initiatives, mentor juniors, and drive technical decisions." },
    { role: "Staff Engineer / Tech Lead", timeframe: "6-9 years", skills: ["Cross-team Collaboration", "Strategy", "Executive Communication"], salaryRange: "$200k-$280k", description: "Influence engineering direction across multiple teams." },
  ],
  "Software Engineer": [
    { role: "Senior Software Engineer", timeframe: "2-3 years", skills: ["Architecture", "Mentoring", "Leadership"], salaryRange: "$150k-$200k", description: "Own complex systems and lead cross-functional projects." },
    { role: "Staff Engineer", timeframe: "4-6 years", skills: ["Technical Strategy", "Org-wide Impact", "Communication"], salaryRange: "$200k-$280k", description: "Define engineering standards and drive company-wide initiatives." },
    { role: "Principal Engineer", timeframe: "7-10 years", skills: ["Executive Presence", "Long-term Vision", "Industry Expertise"], salaryRange: "$280k-$400k", description: "Shape the technical future of the organization." },
  ],
  "Senior Software Engineer": [
    { role: "Staff Engineer", timeframe: "2-4 years", skills: ["Cross-team Influence", "Technical Strategy", "System Design"], salaryRange: "$200k-$280k", description: "Define solutions that span multiple teams and services." },
    { role: "Engineering Manager", timeframe: "1-3 years", skills: ["People Management", "Roadmapping", "Hiring"], salaryRange: "$180k-$260k", description: "Transition to leading people and teams rather than code." },
    { role: "Principal Engineer", timeframe: "5-8 years", skills: ["Org-wide Vision", "Technical Roadmap", "Industry Influence"], salaryRange: "$280k-$400k", description: "Highest individual contributor level with company-wide impact." },
  ],
  "Data Scientist": [
    { role: "Senior Data Scientist", timeframe: "2-3 years", skills: ["ML System Design", "Business Impact", "Mentoring"], salaryRange: "$150k-$200k", description: "Lead complex ML projects and mentor junior scientists." },
    { role: "Staff Data Scientist", timeframe: "4-6 years", skills: ["ML Strategy", "Cross-functional Leadership", "Platform Thinking"], salaryRange: "$200k-$260k", description: "Define ML strategy and build data science platforms." },
    { role: "ML Platform Lead / Director of AI", timeframe: "7-10 years", skills: ["Executive Communication", "Org Design", "AI Strategy"], salaryRange: "$260k-$400k", description: "Lead AI/ML strategy at the organizational level." },
  ],
};

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const userId = (session.user as { id: string }).id;
  const { searchParams } = new URL(req.url);
  const targetRole = searchParams.get("targetRole") || "";

  const profile = await prisma.profile.findUnique({ where: { userId } });
  const currentRole = profile?.currentRole || "Software Engineer";

  let path = careerPaths[currentRole] || careerPaths["Software Engineer"];

  if (targetRole) {
    // Filter path to show how to reach target role
    const targetIdx = path.findIndex((step) =>
      step.role.toLowerCase().includes(targetRole.toLowerCase())
    );
    if (targetIdx !== -1) {
      path = path.slice(0, targetIdx + 1);
    }
  }

  return NextResponse.json({
    currentRole,
    targetRole: targetRole || path[path.length - 1]?.role,
    path,
    estimatedYears: path.length * 2,
  });
}
