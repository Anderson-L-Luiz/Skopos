import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

function generateHTMLCV(profile: any): string {
  const enriched = profile.enrichedData ? JSON.parse(profile.enrichedData) : null;
  const skills = Array.isArray(profile.skills) ? profile.skills : JSON.parse(profile.skills || "[]");

  const name = enriched?.linkedin?.name || profile.user?.name || "Your Name";
  const headline = profile.headline || enriched?.linkedin?.headline || profile.currentRole || "Professional";
  const summary = profile.summary || enriched?.linkedin?.summary || "";

  const experiences = enriched?.linkedin?.experience || [];
  const education = enriched?.linkedin?.education || [];
  const github = enriched?.github;
  const scholar = enriched?.scholar;

  const experienceHtml = experiences.length > 0
    ? `
    <section style="margin-bottom: 24px;">
      <h2 style="font-size: 14px; font-weight: bold; margin-bottom: 12px; border-bottom: 2px solid #4f46e5; padding-bottom: 4px; text-transform: uppercase; letter-spacing: 1px;">EXPERIENCE</h2>
      ${experiences
        .map((exp: any) => `
        <div style="margin-bottom: 16px;">
          <div style="display: flex; justify-content: space-between; align-items: flex-start;">
            <div>
              <p style="font-weight: bold; margin: 0; font-size: 12px;">${exp.title}</p>
              <p style="color: #666; margin: 4px 0 0 0; font-size: 11px;">${exp.company}</p>
            </div>
            <span style="color: #888; font-size: 10px; white-space: nowrap;">${exp.duration}</span>
          </div>
          ${exp.description ? `<p style="color: #555; margin: 6px 0 0 0; font-size: 11px; line-height: 1.4;">${exp.description}</p>` : ""}
        </div>
      `)
        .join("")}
    </section>`
    : "";

  const educationHtml = education.length > 0
    ? `
    <section style="margin-bottom: 24px;">
      <h2 style="font-size: 14px; font-weight: bold; margin-bottom: 12px; border-bottom: 2px solid #4f46e5; padding-bottom: 4px; text-transform: uppercase; letter-spacing: 1px;">EDUCATION</h2>
      ${education
        .map((edu: any) => `
        <div style="margin-bottom: 12px; display: flex; justify-content: space-between;">
          <div>
            <p style="font-weight: bold; margin: 0; font-size: 12px;">${edu.degree}</p>
            <p style="color: #666; margin: 2px 0 0 0; font-size: 11px;">${edu.institution}</p>
          </div>
          <span style="color: #888; font-size: 10px;">${edu.year}</span>
        </div>
      `)
        .join("")}
    </section>`
    : "";

  const skillsHtml = skills.length > 0
    ? `
    <section style="margin-bottom: 24px;">
      <h2 style="font-size: 14px; font-weight: bold; margin-bottom: 12px; border-bottom: 2px solid #4f46e5; padding-bottom: 4px; text-transform: uppercase; letter-spacing: 1px;">TECHNICAL SKILLS</h2>
      <div style="display: flex; flex-wrap: wrap; gap: 6px;">
        ${skills.map((s: string) => `<span style="display: inline-block; background: #f0f0f0; padding: 4px 8px; border-radius: 4px; font-size: 11px; font-weight: 500; color: #333;">${s}</span>`).join("")}
      </div>
    </section>`
    : "";

  const githubHtml = github
    ? `
    <section style="margin-bottom: 24px;">
      <h2 style="font-size: 14px; font-weight: bold; margin-bottom: 12px; border-bottom: 2px solid #4f46e5; padding-bottom: 4px; text-transform: uppercase; letter-spacing: 1px;">OPEN SOURCE / GITHUB</h2>
      <p style="color: #666; font-size: 11px; margin-bottom: 8px;">
        ${github.repos || 0} repositories · ${github.stars || 0} stars · ${github.contributions || 0} contributions
      </p>
      ${github.topRepos && github.topRepos.length > 0
        ? `
        <div style="display: flex; flex-direction: column; gap: 6px;">
          ${github.topRepos.slice(0, 5).map((repo: any) => `
            <div style="font-size: 11px;">
              <span style="font-weight: bold;">${repo.name}</span>
              ${repo.description ? ` - <span style="color: #666;">${repo.description}</span>` : ""}
              <span style="color: #888; margin-left: 4px;">★ ${repo.stars}</span>
            </div>
          `).join("")}
        </div>
      `
        : ""}
    </section>`
    : "";

  const scholarHtml = scholar
    ? `
    <section style="margin-bottom: 24px;">
      <h2 style="font-size: 14px; font-weight: bold; margin-bottom: 12px; border-bottom: 2px solid #4f46e5; padding-bottom: 4px; text-transform: uppercase; letter-spacing: 1px;">PUBLICATIONS</h2>
      <p style="color: #666; font-size: 11px;">
        ${scholar.publications || 0} publications · ${scholar.citations || 0} citations · h-index: ${scholar.hIndex || 0}
      </p>
    </section>`
    : "";

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${name} - CV</title>
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          line-height: 1.6;
          color: #333;
          background: white;
        }
        .container {
          max-width: 8.5in;
          height: 11in;
          margin: 0 auto;
          padding: 0.5in;
          background: white;
          box-shadow: 0 0 1px rgba(0,0,0,0.1);
        }
        .header {
          margin-bottom: 24px;
          border-bottom: 3px solid #4f46e5;
          padding-bottom: 12px;
        }
        .name {
          font-size: 24px;
          font-weight: bold;
          margin-bottom: 2px;
          color: #1f2937;
        }
        .headline {
          font-size: 14px;
          color: #4f46e5;
          margin-bottom: 8px;
        }
        .summary {
          font-size: 12px;
          color: #555;
          line-height: 1.5;
          margin-bottom: 0;
        }
        section {
          margin-bottom: 24px;
        }
        h2 {
          font-size: 14px;
          font-weight: bold;
          margin-bottom: 12px;
          border-bottom: 2px solid #4f46e5;
          padding-bottom: 4px;
          text-transform: uppercase;
          letter-spacing: 1px;
        }
        @media print {
          body {
            margin: 0;
            padding: 0;
          }
          .container {
            max-width: 100%;
            height: auto;
            margin: 0;
            padding: 0.5in;
            box-shadow: none;
          }
          section {
            page-break-inside: avoid;
          }
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="name">${name}</div>
          <div class="headline">${headline}</div>
          ${summary ? `<div class="summary">${summary}</div>` : ""}
        </div>

        ${skillsHtml}
        ${experienceHtml}
        ${educationHtml}
        ${githubHtml}
        ${scholarHtml}
      </div>
    </body>
    </html>
  `;
}

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const userId = (session.user as { id: string }).id;

  try {
    const profile = await prisma.profile.findUnique({
      where: { userId },
      include: {
        user: {
          select: { name: true, email: true },
        },
      },
    });

    if (!profile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    const html = generateHTMLCV(profile);

    return new NextResponse(html, {
      headers: {
        "Content-Type": "text/html; charset=utf-8",
        "Content-Disposition": "attachment; filename=cv.html",
      },
    });
  } catch (err) {
    console.error("CV export error:", err);
    const message = err instanceof Error ? err.message : "Export failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
