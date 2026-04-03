import { NextResponse, NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import * as mammoth from "mammoth";

async function extractTextFromPdf(buffer: Buffer): Promise<string> {
  // Use pdf-parse if available, otherwise do basic text extraction
  try {
    const pdfParse = require("pdf-parse");
    const data = await pdfParse(buffer);
    return data.text || "";
  } catch {
    // Fallback: try to extract visible ASCII text from the buffer
    const text = buffer
      .toString("utf-8", 0, Math.min(buffer.length, 500000))
      .replace(/[^\x20-\x7E\n\r\t]/g, " ")
      .replace(/\s{3,}/g, "\n")
      .trim();
    return text.length > 50 ? text : "";
  }
}

async function extractTextFromDocx(buffer: Buffer): Promise<string> {
  const result = await mammoth.extractRawText({ buffer });
  return result.value || "";
}

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

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    let cvRaw = "";
    const isPdf = file.type === "application/pdf" || filename.toLowerCase().endsWith(".pdf");
    const isDocx = file.type.includes("wordprocessingml") || filename.toLowerCase().endsWith(".docx");

    if (isPdf) {
      cvRaw = await extractTextFromPdf(buffer);
    } else if (isDocx) {
      cvRaw = await extractTextFromDocx(buffer);
    }

    if (!cvRaw || cvRaw.trim().length < 20) {
      cvRaw = `[File uploaded: ${filename}] — Text extraction produced minimal results. The file may be image-based or password-protected.`;
    }

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

    return NextResponse.json({ filename, message: "CV uploaded and parsed successfully", extractedLength: cvRaw.length });
  } catch (err) {
    console.error("CV upload error:", err);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
