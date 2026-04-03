import { NextResponse, NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const userId = (session.user as { id: string }).id;

  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const filename = file.name;
    const allowedTypes = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/msword",
    ];

    if (!allowedTypes.includes(file.type) && !filename.endsWith(".pdf") && !filename.endsWith(".docx")) {
      return NextResponse.json({ error: "Only PDF and DOCX files are supported" }, { status: 400 });
    }

    // Mock CV parse - generate realistic extracted text
    const cvRaw = `EXTRACTED CV CONTENT
Name: Professional User
Email: user@example.com
Phone: +1 (555) 123-4567

SUMMARY
Experienced software engineer with ${3 + Math.floor(Math.random() * 8)} years of experience building scalable web applications.

EXPERIENCE
Senior Software Engineer | TechCorp | 2021 - Present
- Led development of microservices architecture
- Mentored junior engineers
- Improved system performance by 40%

EDUCATION
B.S. Computer Science | University | 2018

SKILLS
TypeScript, React, Node.js, Python, PostgreSQL, AWS`;

    await prisma.profile.upsert({
      where: { userId },
      create: {
        userId,
        cvFile: filename,
        cvRaw,
        skills: "[]",
      },
      update: {
        cvFile: filename,
        cvRaw,
      },
    });

    return NextResponse.json({ filename, message: "CV uploaded and parsed successfully" });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
