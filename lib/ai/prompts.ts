/**
 * AI Prompt Templates — Adapted from CvMaker helper.py
 * Each function returns the messages array for aiChat/aiJSON.
 */

interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

/**
 * AI-powered job match scoring (replaces heuristic scorer)
 * Adapted from CvMaker generate_xai_score() + enhanced for Skopos
 */
export function matchScoringPrompt(
  cvText: string,
  skills: string[],
  yearsExp: number | null,
  jobTitle: string,
  jobDescription: string,
  jobSkills: string[]
): ChatMessage[] {
  return [
    {
      role: "system",
      content: `You are an expert career advisor and technical recruiter. Evaluate candidate-job fit using evidence-based analysis. Be precise and fair.`,
    },
    {
      role: "user",
      content: `Evaluate this candidate against the job posting.

CANDIDATE PROFILE:
- Skills: ${skills.join(", ")}
- Years of Experience: ${yearsExp ?? "Unknown"}
- CV Summary: ${cvText ? cvText.substring(0, 2000) : "Not provided"}

JOB POSTING:
- Title: ${jobTitle}
- Required Skills: ${jobSkills.join(", ")}
- Description: ${jobDescription.substring(0, 2000)}

Score the candidate from 0-100 using this baseline methodology:
- Start at 50 (baseline)
- Add/subtract points based on max 6 significant features
- Final score = 50 + sum of all impacts (clamped 0-100)

Categories: "open" (score >= 70), "within_reach" (40-69), "stretch" (< 40)

Respond with ONLY a JSON object:
{
  "score": <number 0-100>,
  "category": "<open|within_reach|stretch>",
  "baseline": 50,
  "features": [
    {"name": "<specific evidence>", "impact": <positive or negative number>}
  ],
  "gapAnalysis": {
    "missingSkills": ["<skill1>", "<skill2>"],
    "strengths": ["<strength1>", "<strength2>"],
    "recommendations": ["<actionable recommendation>"],
    "experienceGap": "<description or null>",
    "locationNote": null
  }
}`,
    },
  ];
}

/**
 * AI-powered ATS CV analysis
 * Enhanced version of CvMaker's scoring with deeper analysis
 */
export function atsAnalysisPrompt(
  cvText: string,
  jobDescription: string,
  jobSkills: string[]
): ChatMessage[] {
  return [
    {
      role: "system",
      content: `You are an expert ATS (Applicant Tracking System) specialist and CV optimization advisor. Analyze CVs for keyword matching, formatting, and structure.`,
    },
    {
      role: "user",
      content: `Analyze this CV against the job description for ATS optimization.

CV TEXT:
${cvText.substring(0, 3000)}

JOB DESCRIPTION:
${jobDescription.substring(0, 2000)}

JOB REQUIRED SKILLS:
${jobSkills.join(", ")}

Score the CV from 0-100 based on:
- Keyword match density (35%): How many job keywords appear in the CV
- Section completeness (25%): Does CV have Experience, Education, Skills, Summary, Contact sections?
- Formatting quality (25%): Is it well-structured, appropriate length, no tables/images?
- Skill alignment (15%): Do listed skills match required skills?

Respond with ONLY a JSON object:
{
  "score": <number 0-100>,
  "breakdown": {
    "keywordDensity": <0-100>,
    "sections": <0-100>,
    "formatting": <0-100>,
    "skillAlignment": <0-100>
  },
  "details": {
    "keywordMatches": ["<matched keywords>"],
    "missingKeywords": ["<important missing keywords>"],
    "foundSections": ["<found sections>"],
    "missingSections": ["<missing sections>"],
    "suggestions": ["<specific, actionable improvement suggestion>"]
  }
}`,
    },
  ];
}

/**
 * AI-powered interview question generation
 * Generates role-specific questions based on job details
 */
export function interviewQuestionsPrompt(
  jobTitle: string,
  jobDescription: string,
  jobSkills: string[],
  category: string,
  difficulty: string
): ChatMessage[] {
  return [
    {
      role: "system",
      content: `You are a senior hiring manager who creates insightful, role-specific interview questions. Generate questions that test real competency, not trivia.`,
    },
    {
      role: "user",
      content: `Generate 5 interview questions for this role.

ROLE: ${jobTitle}
REQUIRED SKILLS: ${jobSkills.join(", ")}
DESCRIPTION: ${jobDescription.substring(0, 1500)}
CATEGORY: ${category} (behavioral, technical, company_fit, or coding)
DIFFICULTY: ${difficulty} (easy, medium, or hard)

Respond with ONLY a JSON array:
[
  {
    "question": "<the interview question>",
    "category": "${category}",
    "difficulty": "${difficulty}",
    "tips": "<brief tips on how to answer well>",
    "sampleAnswer": "<a concise model answer outline>"
  }
]`,
    },
  ];
}

/**
 * AI-powered skill extraction from job description
 * Adapted from CvMaker findSkillsNeeded()
 */
export function skillExtractionPrompt(
  jobDescription: string
): ChatMessage[] {
  return [
    {
      role: "system",
      content: `You are an expert technical recruiter. Extract skills from job descriptions concisely.`,
    },
    {
      role: "user",
      content: `Extract all technical and non-technical skills from this job description.

JOB DESCRIPTION:
${jobDescription.substring(0, 3000)}

Respond with ONLY a JSON object:
{
  "technical": ["Python", "React", "AWS"],
  "soft": ["Communication", "Leadership"],
  "certifications": ["AWS Solutions Architect"]
}`,
    },
  ];
}

/**
 * AI-powered career path generation
 */
export function careerPathPrompt(
  currentRole: string,
  skills: string[],
  yearsExp: number | null
): ChatMessage[] {
  return [
    {
      role: "system",
      content: `You are a career development expert with deep knowledge of tech industry career trajectories, salary benchmarks, and skill requirements.`,
    },
    {
      role: "user",
      content: `Generate a personalized career path.

CURRENT ROLE: ${currentRole}
SKILLS: ${skills.join(", ")}
YEARS OF EXPERIENCE: ${yearsExp ?? "Unknown"}

Create 3-4 career progression steps from current role to an ambitious target role.

Respond with ONLY a JSON object:
{
  "currentRole": "${currentRole}",
  "targetRole": "<ambitious but realistic target>",
  "path": [
    {
      "role": "<role title>",
      "timeframe": "<e.g., 2-3 years>",
      "skills": ["<skill1>", "<skill2>", "<skill3>"],
      "salaryRange": "<e.g., $180k-$250k>",
      "description": "<what this role involves>"
    }
  ]
}`,
    },
  ];
}

/**
 * AI-powered cover letter generation
 */
export function coverLetterPrompt(
  cvText: string,
  skills: string[],
  currentRole: string,
  jobTitle: string,
  jobCompany: string,
  jobDescription: string,
  tone: string = "professional"
): ChatMessage[] {
  const toneGuide: Record<string, string> = {
    professional: "Professional and polished. Confident but not arrogant. Clear and concise.",
    enthusiastic: "Energetic and passionate. Show genuine excitement about the opportunity.",
    concise: "Brief and direct. Maximum 200 words. Every sentence must add value.",
  };

  return [
    {
      role: "system",
      content: `You are an expert career writer who crafts compelling, personalized cover letters. Tone: ${toneGuide[tone] || toneGuide.professional}`,
    },
    {
      role: "user",
      content: `Write a cover letter for this job application.

MY PROFILE:
- Current Role: ${currentRole}
- Key Skills: ${skills.join(", ")}
- CV Summary: ${cvText ? cvText.substring(0, 2000) : "Not provided"}

TARGET JOB:
- Title: ${jobTitle}
- Company: ${jobCompany}
- Description: ${jobDescription.substring(0, 2000)}

REQUIREMENTS:
- Address the hiring manager (use "Dear Hiring Team" if name unknown)
- Open with a compelling hook, not "I am writing to apply for..."
- Connect 2-3 specific experiences/skills to job requirements
- Show knowledge of the company
- End with a confident call to action
- Keep it to 3-4 paragraphs
- Do NOT use generic filler phrases

Respond with ONLY the cover letter text, no JSON or markdown formatting.`,
    },
  ];
}

/**
 * AI-powered salary insight estimation
 */
export function salaryInsightPrompt(
  roleTitle: string,
  location: string | null,
  experienceYears: number | null
): ChatMessage[] {
  return [
    {
      role: "system",
      content: `You are a compensation analyst with deep knowledge of tech industry salary benchmarks across roles, locations, and experience levels. Provide realistic estimates based on 2025-2026 market data.`,
    },
    {
      role: "user",
      content: `Estimate the salary range for this role.

ROLE: ${roleTitle}
LOCATION: ${location || "US average"}
EXPERIENCE: ${experienceYears ? `${experienceYears} years` : "Mid-level"}

Respond with ONLY a JSON object:
{
  "salaryMin": <annual USD number>,
  "salaryMedian": <annual USD number>,
  "salaryMax": <annual USD number>,
  "currency": "USD",
  "factors": ["<factor that raises salary>", "<factor that lowers salary>"],
  "notes": "<brief market context>"
}`,
    },
  ];
}
