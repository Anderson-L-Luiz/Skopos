/**
 * 6-Block Evaluation with 10 weighted dimensions and A-F grade.
 * Adapted from career-ops (santifer/career-ops) — pure heuristic so it
 * always works without an external AI dependency.
 */

export interface EvalDimension {
  name: string;
  weight: number; // 0..1, all weights sum to 1
  score: number;  // 0..100
  rationale: string;
}

export interface EvaluationReport {
  grade: "A" | "B" | "C" | "D" | "F";
  overallScore: number;
  dimensions: EvalDimension[];
  roleSummary: string;
  cvMatch: string;
  levelStrategy: string;
  compResearch: string;
  personalization: string;
  interviewPrep: string;
}

interface EvalInput {
  userSkills: string[];
  userYearsExp: number;
  userCurrentRole?: string;
  userHeadline?: string;
  cvText?: string;
  jobTitle: string;
  jobCompany: string;
  jobDescription: string;
  jobSkills: string[];
  jobLocation?: string;
  jobRemote: boolean;
  jobSalaryMin?: number;
  jobSalaryMax?: number;
}

const norm = (s: string) => s.toLowerCase().trim();

function gradeFor(score: number): EvaluationReport["grade"] {
  if (score >= 85) return "A";
  if (score >= 70) return "B";
  if (score >= 55) return "C";
  if (score >= 40) return "D";
  return "F";
}

export function buildEvaluation(input: EvalInput): EvaluationReport {
  const userSkillsN = input.userSkills.map(norm);
  const jobSkillsN = input.jobSkills.map(norm);
  const overlap = jobSkillsN.length
    ? jobSkillsN.filter((s) => userSkillsN.includes(s)).length / jobSkillsN.length
    : 0.5;
  const missing = input.jobSkills.filter((s) => !userSkillsN.includes(norm(s)));
  const matched = input.jobSkills.filter((s) => userSkillsN.includes(norm(s)));

  const titleLower = input.jobTitle.toLowerCase();
  const required =
    titleLower.includes("principal") || titleLower.includes("staff") ? 8 :
    titleLower.includes("senior") || titleLower.includes("lead") ? 5 :
    titleLower.includes("junior") || titleLower.includes("entry") ? 1 : 3;

  const expRatio = Math.min(1, (input.userYearsExp || 0) / required);
  const compMid = input.jobSalaryMax && input.jobSalaryMin
    ? (input.jobSalaryMin + input.jobSalaryMax) / 2 : 0;
  const compScore = compMid >= 200000 ? 95 : compMid >= 150000 ? 85 : compMid >= 100000 ? 70 : compMid > 0 ? 55 : 60;

  const remoteScore = input.jobRemote ? 95 : 60;
  const cvLen = (input.cvText || "").length;
  const cvDepth = cvLen > 1500 ? 90 : cvLen > 500 ? 70 : 40;

  const descLower = input.jobDescription.toLowerCase();
  const cultureSignals = ["mission", "impact", "team", "growth", "learn"].filter((k) => descLower.includes(k)).length;
  const cultureScore = 50 + cultureSignals * 10;

  const titleAlignment = input.userCurrentRole && titleLower.includes(input.userCurrentRole.toLowerCase().split(" ").pop() || "")
    ? 90 : 65;

  const dimensions: EvalDimension[] = [
    { name: "Skills Match",        weight: 0.20, score: Math.round(overlap * 100), rationale: `${matched.length}/${input.jobSkills.length} required skills present.` },
    { name: "Experience Level",    weight: 0.15, score: Math.round(expRatio * 100), rationale: `${input.userYearsExp || 0}y vs ~${required}y required.` },
    { name: "Title Alignment",     weight: 0.10, score: titleAlignment, rationale: `Current role: ${input.userCurrentRole || "n/a"}.` },
    { name: "Compensation",        weight: 0.10, score: compScore, rationale: compMid ? `Mid ~$${Math.round(compMid).toLocaleString()}.` : "Salary not disclosed." },
    { name: "Location / Remote",   weight: 0.08, score: remoteScore, rationale: input.jobRemote ? "Remote-friendly." : `On-site: ${input.jobLocation || "?"}.` },
    { name: "CV Depth",            weight: 0.10, score: cvDepth, rationale: `CV body ~${cvLen} chars.` },
    { name: "Culture Signals",     weight: 0.07, score: Math.min(100, cultureScore), rationale: `${cultureSignals} cultural keywords detected.` },
    { name: "Growth Potential",    weight: 0.08, score: required > input.userYearsExp ? 85 : 65, rationale: required > input.userYearsExp ? "Stretch role." : "Lateral move." },
    { name: "Domain Familiarity",  weight: 0.07, score: matched.length >= 2 ? 80 : 55, rationale: matched.length >= 2 ? "Familiar stack." : "New domain elements." },
    { name: "Application Strategy",weight: 0.05, score: overlap >= 0.5 ? 80 : 55, rationale: overlap >= 0.5 ? "Direct apply viable." : "Referral recommended." },
  ];

  const overallScore = Math.round(
    dimensions.reduce((sum, d) => sum + d.score * d.weight, 0)
  );
  const grade = gradeFor(overallScore);

  return {
    grade,
    overallScore,
    dimensions,
    roleSummary: `${input.jobTitle} at ${input.jobCompany}. ${input.jobRemote ? "Remote." : input.jobLocation || ""} Required stack: ${input.jobSkills.join(", ") || "general"}.`,
    cvMatch: `Matched: ${matched.join(", ") || "none"}. Missing: ${missing.join(", ") || "none"}. Skill overlap ${Math.round(overlap * 100)}%.`,
    levelStrategy: required > (input.userYearsExp || 0)
      ? `Position as a stretch with ${input.userYearsExp || 0}y track record; highlight scope and ownership.`
      : `Pitch as immediately productive — ${input.userYearsExp || 0}y meets/exceeds the ~${required}y bar.`,
    compResearch: compMid
      ? `Posted band $${input.jobSalaryMin?.toLocaleString()}–$${input.jobSalaryMax?.toLocaleString()}. Anchor at the top of band given matched skills.`
      : `Compensation undisclosed. Use levels.fyi/Glassdoor as anchor; ask early for range.`,
    personalization: `Open with a concrete result tied to ${matched[0] || input.jobSkills[0] || "the stack"}; reference ${input.jobCompany}'s mission in one sentence.`,
    interviewPrep: `Prepare 3 STAR stories covering: ${(matched[0] || "core skill")}, cross-team impact, and a tradeoff/failure. Likely topics: ${input.jobSkills.slice(0, 3).join(", ") || "fundamentals"}.`,
  };
}
