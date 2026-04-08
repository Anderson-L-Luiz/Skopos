import { NextResponse, NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const userId = (session.user as { id: string }).id;
  const contact = await prisma.contact.findFirst({ where: { id: params.id, userId } });
  if (!contact) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(contact);
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const userId = (session.user as { id: string }).id;
  const existing = await prisma.contact.findFirst({ where: { id: params.id, userId } });
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const body = await req.json();
  const updated = await prisma.contact.update({
    where: { id: params.id },
    data: {
      ...(body.name !== undefined && { name: body.name }),
      ...(body.email !== undefined && { email: body.email }),
      ...(body.phone !== undefined && { phone: body.phone }),
      ...(body.company !== undefined && { company: body.company }),
      ...(body.role !== undefined && { role: body.role }),
      ...(body.linkedinUrl !== undefined && { linkedinUrl: body.linkedinUrl }),
      ...(body.relationship !== undefined && { relationship: body.relationship }),
      ...(body.notes !== undefined && { notes: body.notes }),
      ...(body.followUpDate !== undefined && { followUpDate: body.followUpDate ? new Date(body.followUpDate) : null }),
      ...(body.lastContactedAt !== undefined && { lastContactedAt: body.lastContactedAt ? new Date(body.lastContactedAt) : null }),
    },
  });

  return NextResponse.json(updated);
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const userId = (session.user as { id: string }).id;
  const existing = await prisma.contact.findFirst({ where: { id: params.id, userId } });
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

  await prisma.contact.delete({ where: { id: params.id } });
  return NextResponse.json({ deleted: true });
}
