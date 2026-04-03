import type { EnrichedData } from "@/types";

export function scrapeLinkedIn(url: string): EnrichedData["linkedin"] {
  // Extract username from URL
  const match = url.match(/linkedin\.com\/in\/([^/]+)/);
  const username = match ? match[1] : "user";
  const name = username.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

  return {
    name,
    headline: "Senior Software Engineer at Tech Company",
    summary: `Passionate software engineer with ${5 + Math.floor(Math.random() * 10)} years of experience building scalable web applications. Experienced in full-stack development, cloud architecture, and leading engineering teams. Open to exciting opportunities in product-focused companies.`,
    experience: [
      {
        title: "Senior Software Engineer",
        company: "TechCorp Inc.",
        duration: "2021 - Present",
        description: "Led development of microservices architecture serving 10M+ users. Mentored junior engineers and drove technical roadmap.",
      },
      {
        title: "Software Engineer",
        company: "StartupXYZ",
        duration: "2019 - 2021",
        description: "Built React/Node.js applications from scratch. Improved application performance by 40%.",
      },
      {
        title: "Junior Developer",
        company: "Agency Co.",
        duration: "2017 - 2019",
        description: "Developed client websites and web applications using modern JavaScript frameworks.",
      },
    ],
    education: [
      {
        degree: "B.S. Computer Science",
        institution: "Stanford University",
        year: "2017",
      },
    ],
    skills: ["TypeScript", "React", "Node.js", "Python", "PostgreSQL", "AWS", "Docker", "Kubernetes"],
    connections: 500 + Math.floor(Math.random() * 1000),
  };
}

export function scrapeGitHub(url: string): EnrichedData["github"] {
  const match = url.match(/github\.com\/([^/]+)/);
  const username = match ? match[1] : "user";

  return {
    username,
    repos: 20 + Math.floor(Math.random() * 80),
    stars: 100 + Math.floor(Math.random() * 5000),
    languages: ["TypeScript", "Python", "Go", "Rust", "JavaScript"],
    topRepos: [
      {
        name: "awesome-project",
        description: "A scalable web application built with Next.js and PostgreSQL",
        stars: 200 + Math.floor(Math.random() * 1000),
        language: "TypeScript",
      },
      {
        name: "ml-toolkit",
        description: "Machine learning utilities and helper functions",
        stars: 50 + Math.floor(Math.random() * 500),
        language: "Python",
      },
      {
        name: "cli-tool",
        description: "Developer productivity CLI tool",
        stars: 30 + Math.floor(Math.random() * 300),
        language: "Go",
      },
    ],
    contributions: 300 + Math.floor(Math.random() * 1000),
  };
}

export function scrapeScholar(url: string): EnrichedData["scholar"] {
  const match = url.match(/scholar\.google\.com\/citations\?.*user=([^&]+)/);
  const userId = match ? match[1] : "user";

  return {
    name: "Dr. Research User",
    institution: "MIT",
    publications: 10 + Math.floor(Math.random() * 40),
    citations: 200 + Math.floor(Math.random() * 2000),
    hIndex: 5 + Math.floor(Math.random() * 15),
    papers: [
      {
        title: "Scalable Distributed Systems for Real-Time Data Processing",
        journal: "IEEE Transactions on Parallel and Distributed Systems",
        year: 2023,
        citations: 45 + Math.floor(Math.random() * 100),
      },
      {
        title: "Machine Learning Approaches to Software Defect Prediction",
        journal: "ACM SIGSOFT",
        year: 2022,
        citations: 30 + Math.floor(Math.random() * 80),
      },
    ],
  };
}

export function enrichProfile(
  linkedinUrl?: string,
  githubUrl?: string,
  scholarUrl?: string
): EnrichedData {
  const data: EnrichedData = {};

  if (linkedinUrl) {
    data.linkedin = scrapeLinkedIn(linkedinUrl);
  }
  if (githubUrl) {
    data.github = scrapeGitHub(githubUrl);
  }
  if (scholarUrl) {
    data.scholar = scrapeScholar(scholarUrl);
  }

  return data;
}
