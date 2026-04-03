import type { GapAnalysis } from "@/types";

interface ScoringInput {
  userSkills: string[];
  userYearsExp: number;
  userCurrentRole?: string;
  preferRemote?: boolean;
  desiredSalaryMin?: number;
  jobSkills: string[];
  jobTitle: string;
  jobSalaryMin?: number;
  jobSalaryMax?: number;
  jobRemote: boolean;
  jobLocation?: string;
}

function normalizeSkill(skill: string): string {
  return skill.toLowerCase().trim();
}

function skillsOverlap(userSkills: string[], jobSkills: string[]): number {
  if (jobSkills.length === 0) return 0.5;
  const normalized = userSkills.map(normalizeSkill);
  const matches = jobSkills.filter((s) =>
    normalized.includes(normalizeSkill(s))
  );
  return matches.length / jobSkills.length;
}

function getSeniorityFromTitle(title: string): number {
  const lower = title.toLowerCase();
  if (lower.includes("principal") || lower.includes("staff") || lower.includes("distinguished")) return 8;
  if (lower.includes("senior") || lower.includes("lead")) return 5;
  if (lower.includes("mid") || lower.includes("ii") || lower.includes("2")) return 3;
  if (lower.includes("junior") || lower.includes("associate") || lower.includes("entry")) return 1;
  if (lower.includes("manager") || lower.includes("director")) return 7;
  return 3; // default mid-level
}

function experienceScore(userYears: number, jobTitle: string): number {
  const required = getSeniorityFromTitle(jobTitle);
  if (userYears >= required) return 1.0;
  if (userYears >= required - 1) return 0.8;
  if (userYears >= required - 2) return 0.6;
  return Math.max(0.2, userYears / required);
}

function locationScore(
  preferRemote: boolean | undefined,
  jobRemote: boolean
): number {
  if (jobRemote) return 1.0;
  if (preferRemote && !jobRemote) return 0.6;
  return 0.8;
}

function salaryScore(
  desiredMin: number | undefined,
  jobMin?: number,
  jobMax?: number
): number {
  if (!desiredMin || (!jobMin && !jobMax)) return 0.8;
  const mid = jobMax ? (jobMin || 0 + jobMax) / 2 : jobMin || 0;
  if (mid >= desiredMin) return 1.0;
  if (mid >= desiredMin * 0.9) return 0.8;
  if (mid >= desiredMin * 0.75) return 0.6;
  return 0.4;
}

export function scoreJob(input: ScoringInput): {
  score: number;
  category: "open" | "within_reach" | "stretch";
  gapAnalysis: GapAnalysis;
} {
  const skillOverlap = skillsOverlap(input.userSkills, input.jobSkills);
  const expScore = experienceScore(input.userYearsExp || 0, input.jobTitle);
  const locScore = locationScore(input.preferRemote, input.jobRemote);
  const salScore = salaryScore(
    input.desiredSalaryMin,
    input.jobSalaryMin,
    input.jobSalaryMax
  );

  const rawScore =
    skillOverlap * 0.4 +
    expScore * 0.3 +
    locScore * 0.2 +
    salScore * 0.1;

  const score = Math.round(rawScore * 100);

  let category: "open" | "within_reach" | "stretch";
  if (score >= 70) category = "open";
  else if (score >= 40) category = "within_reach";
  else category = "stretch";

  // Gap analysis
  const normalizedUser = input.userSkills.map(normalizeSkill);
  const missingSkills = input.jobSkills.filter(
    (s) => !normalizedUser.includes(normalizeSkill(s))
  );

  const requiredYears = getSeniorityFromTitle(input.jobTitle);
  const userYears = input.userYearsExp || 0;
  let experienceGap: string | undefined;
  if (userYears < requiredYears) {
    experienceGap = `You have ${userYears} years of experience. This role typically requires ${requiredYears}+ years.`;
  }

  let salaryGap: string | undefined;
  if (input.jobSalaryMax && input.desiredSalaryMin && input.jobSalaryMax < input.desiredSalaryMin) {
    salaryGap = `Job max salary ($${input.jobSalaryMax.toLocaleString()}) is below your target ($${input.desiredSalaryMin.toLocaleString()}).`;
  }

  let locationNote: string | undefined;
  if (input.preferRemote && !input.jobRemote) {
    locationNote = `This is an on-site role in ${input.jobLocation}. Remote not available.`;
  }

  const strengths: string[] = [];
  if (skillOverlap >= 0.7) strengths.push("Strong skill alignment with job requirements");
  if (expScore >= 0.8) strengths.push("Your experience level matches well");
  if (input.jobRemote) strengths.push("Remote-friendly position");

  const recommendations: string[] = [];
  if (missingSkills.length > 0) {
    recommendations.push(`Learn these skills to increase your fit: ${missingSkills.slice(0, 3).join(", ")}`);
  }
  if (experienceGap) {
    recommendations.push("Consider roles that match your current experience level, or highlight relevant project experience");
  }
  if (score < 60) {
    recommendations.push("Tailor your CV to emphasize relevant experience for this specific role");
  }

  return {
    score,
    category,
    gapAnalysis: {
      missingSkills,
      experienceGap,
      salaryGap,
      locationNote,
      strengths,
      recommendations,
    },
  };
}
