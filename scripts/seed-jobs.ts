import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const companies = [
  "Google", "Microsoft", "Stripe", "Airbnb", "Netflix", "Meta", "Amazon",
  "Apple", "Shopify", "Figma", "Notion", "Vercel", "Linear", "Supabase",
  "GitHub", "Atlassian", "Salesforce", "Databricks", "Snowflake", "Palantir",
];

const locations = [
  "San Francisco, CA", "New York, NY", "Seattle, WA", "Austin, TX",
  "Boston, MA", "Remote", "London, UK",
];

const sources = ["indeed", "linkedin", "glassdoor"];
const trustScores: Record<string, number> = { indeed: 0.85, linkedin: 0.9, glassdoor: 0.8 };

const templates = [
  { title: "Senior Software Engineer", skills: ["TypeScript", "React", "Node.js", "PostgreSQL", "AWS"], salaryMin: 150000, salaryMax: 220000 },
  { title: "Full Stack Engineer", skills: ["React", "Next.js", "Python", "PostgreSQL", "Redis"], salaryMin: 120000, salaryMax: 180000 },
  { title: "Machine Learning Engineer", skills: ["Python", "TensorFlow", "PyTorch", "Spark", "SQL"], salaryMin: 160000, salaryMax: 250000 },
  { title: "Data Engineer", skills: ["Python", "Spark", "Kafka", "dbt", "Snowflake"], salaryMin: 130000, salaryMax: 190000 },
  { title: "DevOps Engineer", skills: ["Kubernetes", "Terraform", "AWS", "CI/CD", "Python"], salaryMin: 130000, salaryMax: 200000 },
  { title: "Frontend Engineer", skills: ["React", "TypeScript", "CSS", "GraphQL", "Webpack"], salaryMin: 120000, salaryMax: 180000 },
  { title: "Backend Engineer", skills: ["Go", "PostgreSQL", "gRPC", "Docker", "Redis"], salaryMin: 140000, salaryMax: 200000 },
  { title: "iOS Engineer", skills: ["Swift", "SwiftUI", "Objective-C", "CoreData", "XCode"], salaryMin: 130000, salaryMax: 190000 },
  { title: "Android Engineer", skills: ["Kotlin", "Android SDK", "Jetpack Compose", "Room"], salaryMin: 130000, salaryMax: 190000 },
  { title: "Security Engineer", skills: ["Penetration Testing", "AWS Security", "Python", "SIEM"], salaryMin: 150000, salaryMax: 220000 },
  { title: "Data Scientist", skills: ["Python", "Machine Learning", "Statistics", "SQL", "TensorFlow"], salaryMin: 130000, salaryMax: 200000 },
  { title: "Staff Engineer", skills: ["System Design", "TypeScript", "Go", "PostgreSQL", "Kubernetes"], salaryMin: 200000, salaryMax: 300000 },
];

async function main() {
  console.log("Seeding 50+ jobs...");
  let count = 0;

  for (let i = 0; i < templates.length; i++) {
    for (let j = 0; j < 5; j++) {
      const template = templates[i];
      const company = companies[(i * 5 + j) % companies.length];
      const source = sources[(i + j) % sources.length];
      const location = locations[(i + j) % locations.length];
      const isRemote = location === "Remote" || Math.random() > 0.5;
      const externalId = `${source}-${Date.now()}-${i}-${j}`;

      await prisma.job.create({
        data: {
          externalId,
          title: template.title,
          company,
          location: isRemote ? "Remote" : location,
          remote: isRemote,
          salaryMin: template.salaryMin + j * 5000,
          salaryMax: template.salaryMax + j * 8000,
          description: `${company} is looking for a ${template.title} to join the team. You will work on exciting challenges and help build products used by millions.\n\nResponsibilities:\n- Design and implement scalable solutions\n- Collaborate with cross-functional teams\n- Mentor junior engineers\n- Drive technical excellence\n\nRequirements:\n- Strong technical background\n- Experience with ${template.skills.slice(0, 3).join(", ")}\n- Excellent communication skills`,
          skills: JSON.stringify(template.skills),
          source,
          sourceUrl: `https://${source}.com/jobs/${1000 + i * 100 + j}`,
          trustScore: trustScores[source],
          postedAt: new Date(Date.now() - (i + j * 2) * 24 * 60 * 60 * 1000),
        },
      });
      count++;
    }
  }

  console.log(`Created ${count} jobs!`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
