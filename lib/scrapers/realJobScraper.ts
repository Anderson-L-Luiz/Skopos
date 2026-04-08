/**
 * Real Job Scraper — Fetches jobs from free public APIs
 *
 * Sources:
 * 1. Adzuna API (free tier: 200 req/day) — Real jobs from 13 countries
 * 2. RemoteOK API (free, no key) — Remote tech jobs
 * 3. Arbeitnow API (free, no key) — European tech jobs
 *
 * Falls back to mock data if all APIs fail.
 */

import { generateMockJobs, type MockJob } from "./jobScraper";

// Adzuna credentials (free at https://developer.adzuna.com)
const ADZUNA_APP_ID = process.env.ADZUNA_APP_ID || "";
const ADZUNA_APP_KEY = process.env.ADZUNA_APP_KEY || "";
const ADZUNA_COUNTRY = process.env.ADZUNA_COUNTRY || "us";

// JSearch via RapidAPI (free tier: 200 req/month)
const JSEARCH_API_KEY = process.env.JSEARCH_API_KEY || "";

interface ScrapedJob {
  externalId: string;
  title: string;
  company: string;
  location: string;
  remote: boolean;
  salaryMin: number | null;
  salaryMax: number | null;
  description: string;
  skills: string[];
  source: string;
  sourceUrl: string;
  trustScore: number;
  postedAt: Date;
}

/**
 * Detect skills from job title and description
 */
function extractSkills(title: string, description: string): string[] {
  const allText = `${title} ${description}`.toLowerCase();
  const skillKeywords: Record<string, string> = {
    python: "Python",
    javascript: "JavaScript",
    typescript: "TypeScript",
    react: "React",
    "node.js": "Node.js",
    nodejs: "Node.js",
    "next.js": "Next.js",
    nextjs: "Next.js",
    vue: "Vue.js",
    angular: "Angular",
    java: "Java",
    "c++": "C++",
    "c#": "C#",
    go: "Go",
    golang: "Go",
    rust: "Rust",
    swift: "Swift",
    kotlin: "Kotlin",
    ruby: "Ruby",
    php: "PHP",
    sql: "SQL",
    postgresql: "PostgreSQL",
    mysql: "MySQL",
    mongodb: "MongoDB",
    redis: "Redis",
    aws: "AWS",
    azure: "Azure",
    gcp: "GCP",
    docker: "Docker",
    kubernetes: "Kubernetes",
    terraform: "Terraform",
    "ci/cd": "CI/CD",
    "machine learning": "Machine Learning",
    tensorflow: "TensorFlow",
    pytorch: "PyTorch",
    pandas: "Pandas",
    django: "Django",
    flask: "Flask",
    "spring boot": "Spring Boot",
    graphql: "GraphQL",
    "rest api": "REST APIs",
    git: "Git",
    linux: "Linux",
    agile: "Agile",
    scrum: "Scrum",
    figma: "Figma",
    tailwind: "Tailwind CSS",
    sass: "SASS",
    webpack: "Webpack",
    vite: "Vite",
  };

  const found = new Set<string>();
  for (const [keyword, skill] of Object.entries(skillKeywords)) {
    if (allText.includes(keyword)) found.add(skill);
  }
  return Array.from(found).slice(0, 10);
}

/**
 * Adzuna API — Free tier: 200 requests/day
 * Docs: https://developer.adzuna.com/docs
 */
async function fetchAdzunaJobs(
  query: string = "software engineer",
  page: number = 1
): Promise<ScrapedJob[]> {
  if (!ADZUNA_APP_ID || !ADZUNA_APP_KEY) return [];

  try {
    const url = `https://api.adzuna.com/v1/api/jobs/${ADZUNA_COUNTRY}/search/${page}?app_id=${ADZUNA_APP_ID}&app_key=${ADZUNA_APP_KEY}&results_per_page=50&what=${encodeURIComponent(query)}&content-type=application/json`;

    const res = await fetch(url, { signal: AbortSignal.timeout(15000) });
    if (!res.ok) {
      console.warn(`Adzuna API error: ${res.status}`);
      return [];
    }

    const data = await res.json();
    const results: ScrapedJob[] = (data.results || []).map(
      (job: Record<string, unknown>) => {
        const location = (job.location as Record<string, unknown>)?.display_name as string || "";
        const title = (job.title as string) || "";
        const desc = (job.description as string) || "";
        return {
          externalId: `adzuna-${job.id}`,
          title: title.replace(/<[^>]*>/g, ""),
          company: (job.company as Record<string, unknown>)?.display_name as string || "Unknown",
          location,
          remote: location.toLowerCase().includes("remote") || desc.toLowerCase().includes("remote"),
          salaryMin: (job.salary_min as number) || null,
          salaryMax: (job.salary_max as number) || null,
          description: desc.replace(/<[^>]*>/g, ""),
          skills: extractSkills(title, desc),
          source: "adzuna",
          sourceUrl: (job.redirect_url as string) || "",
          trustScore: 0.85,
          postedAt: new Date((job.created as string) || Date.now()),
        };
      }
    );

    return results;
  } catch (err) {
    console.warn("Adzuna fetch failed:", err);
    return [];
  }
}

/**
 * RemoteOK API — Completely free, no API key needed
 * Docs: https://remoteok.com/api
 */
async function fetchRemoteOKJobs(): Promise<ScrapedJob[]> {
  try {
    const res = await fetch("https://remoteok.com/api", {
      headers: { "User-Agent": "Skopos/1.0" },
      signal: AbortSignal.timeout(15000),
    });
    if (!res.ok) {
      console.warn(`RemoteOK API error: ${res.status}`);
      return [];
    }

    const data = await res.json();
    // First item is metadata, skip it
    const jobs = Array.isArray(data) ? data.slice(1) : [];

    return jobs.slice(0, 50).map(
      (job: Record<string, unknown>) => {
        const tags = (job.tags as string[]) || [];
        const desc = (job.description as string) || "";
        return {
          externalId: `remoteok-${job.id}`,
          title: (job.position as string) || "",
          company: (job.company as string) || "Unknown",
          location: (job.location as string) || "Remote",
          remote: true,
          salaryMin: (job.salary_min as number) || null,
          salaryMax: (job.salary_max as number) || null,
          description: desc.replace(/<[^>]*>/g, "").substring(0, 5000),
          skills: tags.length > 0 ? tags.slice(0, 10) : extractSkills((job.position as string) || "", desc),
          source: "remoteok",
          sourceUrl: (job.url as string) || "",
          trustScore: 0.8,
          postedAt: new Date(((job.date as string) || Date.now())),
        };
      }
    );
  } catch (err) {
    console.warn("RemoteOK fetch failed:", err);
    return [];
  }
}

/**
 * Arbeitnow API — Free, no key needed
 * Docs: https://www.arbeitnow.com/api
 */
async function fetchArbeitnowJobs(page: number = 1): Promise<ScrapedJob[]> {
  try {
    const res = await fetch(`https://www.arbeitnow.com/api/job-board-api?page=${page}`, {
      signal: AbortSignal.timeout(15000),
    });
    if (!res.ok) {
      console.warn(`Arbeitnow API error: ${res.status}`);
      return [];
    }

    const data = await res.json();
    return (data.data || []).slice(0, 50).map(
      (job: Record<string, unknown>) => {
        const tags = (job.tags as string[]) || [];
        const desc = (job.description as string) || "";
        const title = (job.title as string) || "";
        return {
          externalId: `arbeitnow-${job.slug}`,
          title,
          company: (job.company_name as string) || "Unknown",
          location: (job.location as string) || "",
          remote: (job.remote as boolean) || false,
          salaryMin: null,
          salaryMax: null,
          description: desc.replace(/<[^>]*>/g, "").substring(0, 5000),
          skills: tags.length > 0 ? tags.slice(0, 10) : extractSkills(title, desc),
          source: "arbeitnow",
          sourceUrl: (job.url as string) || "",
          trustScore: 0.75,
          postedAt: new Date((job.created_at as number) * 1000 || Date.now()),
        };
      }
    );
  } catch (err) {
    console.warn("Arbeitnow fetch failed:", err);
    return [];
  }
}

/**
 * JSearch API via RapidAPI — Free tier: 200 req/month
 * Docs: https://rapidapi.com/letscrape-6bRBa3QguO5/api/jsearch
 */
async function fetchJSearchJobs(
  query: string = "software engineer"
): Promise<ScrapedJob[]> {
  if (!JSEARCH_API_KEY) return [];

  try {
    const url = `https://jsearch.p.rapidapi.com/search?query=${encodeURIComponent(query)}&page=1&num_pages=2`;
    const res = await fetch(url, {
      headers: {
        "X-RapidAPI-Key": JSEARCH_API_KEY,
        "X-RapidAPI-Host": "jsearch.p.rapidapi.com",
      },
      signal: AbortSignal.timeout(15000),
    });

    if (!res.ok) {
      console.warn(`JSearch API error: ${res.status}`);
      return [];
    }

    const data = await res.json();
    return (data.data || []).map(
      (job: Record<string, unknown>) => {
        const desc = (job.job_description as string) || "";
        const title = (job.job_title as string) || "";
        return {
          externalId: `jsearch-${job.job_id}`,
          title,
          company: (job.employer_name as string) || "Unknown",
          location: `${job.job_city || ""}, ${job.job_state || ""}, ${job.job_country || ""}`.replace(/^[, ]+|[, ]+$/g, ""),
          remote: (job.job_is_remote as boolean) || false,
          salaryMin: (job.job_min_salary as number) || null,
          salaryMax: (job.job_max_salary as number) || null,
          description: desc.substring(0, 5000),
          skills: extractSkills(title, desc),
          source: "jsearch",
          sourceUrl: (job.job_apply_link as string) || "",
          trustScore: 0.85,
          postedAt: new Date((job.job_posted_at_datetime_utc as string) || Date.now()),
        };
      }
    );
  } catch (err) {
    console.warn("JSearch fetch failed:", err);
    return [];
  }
}

/**
 * Main scraper — fetches from all available sources in parallel,
 * falls back to mock data if all real APIs fail.
 */
export async function scrapeRealJobs(
  query: string = "software engineer"
): Promise<ScrapedJob[]> {
  console.log("Scraping real jobs from multiple sources...");

  const results = await Promise.allSettled([
    fetchAdzunaJobs(query),
    fetchRemoteOKJobs(),
    fetchArbeitnowJobs(),
    fetchJSearchJobs(query),
  ]);

  const allJobs: ScrapedJob[] = [];
  const sourceStats: Record<string, number> = {};

  for (const result of results) {
    if (result.status === "fulfilled" && result.value.length > 0) {
      for (const job of result.value) {
        sourceStats[job.source] = (sourceStats[job.source] || 0) + 1;
      }
      allJobs.push(...result.value);
    }
  }

  console.log(`Real jobs fetched: ${allJobs.length} total`, sourceStats);

  // Fall back to mock data if no real jobs found
  if (allJobs.length === 0) {
    console.log("No real jobs found, falling back to mock data");
    const mockJobs = generateMockJobs();
    return mockJobs.map((j) => ({
      ...j,
      salaryMin: j.salaryMin,
      salaryMax: j.salaryMax,
    }));
  }

  // Deduplicate by title+company
  const seen = new Set<string>();
  const deduped = allJobs.filter((job) => {
    const key = `${job.title.toLowerCase()}-${job.company.toLowerCase()}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  return deduped;
}
