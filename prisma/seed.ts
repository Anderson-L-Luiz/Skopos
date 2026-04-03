import { PrismaClient } from "@prisma/client";
import bcryptjs from "bcryptjs";

const prisma = new PrismaClient();

const jobTemplates = [
  {
    title: "Senior Software Engineer",
    company: "Google",
    location: "Mountain View, CA",
    remote: true,
    salaryMin: 180000,
    salaryMax: 280000,
    skills: ["TypeScript", "Go", "Kubernetes", "Distributed Systems"],
    source: "linkedin",
    trustScore: 0.9,
  },
  {
    title: "Full Stack Engineer",
    company: "Stripe",
    location: "San Francisco, CA",
    remote: false,
    salaryMin: 150000,
    salaryMax: 220000,
    skills: ["React", "Ruby", "PostgreSQL", "AWS"],
    source: "indeed",
    trustScore: 0.85,
  },
  {
    title: "Machine Learning Engineer",
    company: "OpenAI",
    location: "San Francisco, CA",
    remote: false,
    salaryMin: 200000,
    salaryMax: 350000,
    skills: ["Python", "PyTorch", "CUDA", "Distributed Training"],
    source: "linkedin",
    trustScore: 0.9,
  },
  {
    title: "Frontend Engineer",
    company: "Vercel",
    location: "Remote",
    remote: true,
    salaryMin: 140000,
    salaryMax: 200000,
    skills: ["React", "Next.js", "TypeScript", "Rust"],
    source: "glassdoor",
    trustScore: 0.8,
  },
  {
    title: "Data Engineer",
    company: "Databricks",
    location: "San Francisco, CA",
    remote: true,
    salaryMin: 160000,
    salaryMax: 240000,
    skills: ["Python", "Spark", "Kafka", "dbt", "Snowflake"],
    source: "indeed",
    trustScore: 0.85,
  },
];

async function main() {
  console.log("Seeding database...");

  // Create demo user
  const password = await bcryptjs.hash("password123", 12);
  const user = await prisma.user.upsert({
    where: { email: "demo@skopos.dev" },
    update: {},
    create: {
      email: "demo@skopos.dev",
      name: "Demo User",
      password,
      profile: {
        create: {
          headline: "Senior Software Engineer",
          summary: "Experienced software engineer with 6 years building scalable web applications.",
          currentRole: "Senior Software Engineer",
          yearsExp: 6,
          skills: JSON.stringify(["TypeScript", "React", "Node.js", "PostgreSQL", "AWS", "Docker"]),
        },
      },
    },
  });

  console.log(`Created demo user: ${user.email} (password: password123)`);

  // Seed jobs
  for (const template of jobTemplates) {
    await prisma.job.upsert({
      where: { id: template.company.toLowerCase().replace(/\s/g, "-") + "-" + template.title.toLowerCase().replace(/\s/g, "-") },
      update: {},
      create: {
        id: template.company.toLowerCase().replace(/\s/g, "-") + "-" + template.title.toLowerCase().replace(/\s/g, "-"),
        externalId: `seed-${Date.now()}-${Math.random()}`,
        title: template.title,
        company: template.company,
        location: template.location,
        remote: template.remote,
        salaryMin: template.salaryMin,
        salaryMax: template.salaryMax,
        description: `${template.company} is looking for a talented ${template.title} to join their team. You will work on cutting-edge technology and make a real impact. Benefits include competitive salary, equity, health insurance, and flexible PTO.`,
        skills: JSON.stringify(template.skills),
        source: template.source,
        sourceUrl: `https://${template.source}.com/jobs/${Math.floor(Math.random() * 100000)}`,
        trustScore: template.trustScore,
        postedAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000),
      },
    });
  }

  console.log(`Seeded ${jobTemplates.length} jobs`);
  console.log("Seeding complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
