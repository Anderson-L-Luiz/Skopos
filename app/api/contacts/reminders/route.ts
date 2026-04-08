import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const userId = (session.user as { id: string }).id;

  // Get contacts with follow-up dates within the next 7 days
  const now = new Date();
  const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

  const reminders = await prisma.contact.findMany({
    where: {
      userId,
      followUpDate: { lte: nextWeek, not: null },
    },
    orderBy: { followUpDate: "asc" },
  });

  // Also get application follow-ups
  const appReminders = await prisma.application.findMany({
    where: {
      userId,
      followUpDate: { lte: nextWeek, not: null },
    },
    include: { job: { select: { title: true, company: true } } },
    orderBy: { followUpDate: "asc" },
  });

  return NextResponse.json({ contactReminders: reminders, applicationReminders: appReminders });
}
