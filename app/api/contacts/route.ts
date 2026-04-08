import { NextResponse, NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const userId = (session.user as { id: string }).id;
  const { searchParams } = new URL(req.url);
  const company = searchParams.get("company") || "";
  const relationship = searchParams.get("relationship") || "";

  const where: Record<string, unknown> = { userId };
  if (company) where.company = { contains: company, mode: "insensitive" };
  if (relationship) where.relationship = relationship;

  const contacts = await prisma.contact.findMany({
    where,
    include: { application: { include: { job: { select: { title: true, company: true } } } } },
    orderBy: { updatedAt: "desc" },
  });

  return NextResponse.json({ contacts });
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const userId = (session.user as { id: string }).id;
  const body = await req.json();
  const { name, email, phone, company, role, linkedinUrl, relationship, notes, applicationId, followUpDate } = body;

  if (!name) return NextResponse.json({ error: "name is required" }, { status: 400 });

  const contact = await prisma.contact.create({
    data: {
      userId,
      name,
      email: email || null,
      phone: phone || null,
      company: company || null,
      role: role || null,
      linkedinUrl: linkedinUrl || null,
      relationship: relationship || "other",
      notes: notes || null,
      applicationId: applicationId || null,
      followUpDate: followUpDate ? new Date(followUpDate) : null,
    },
  });

  return NextResponse.json(contact, { status: 201 });
}
