/**
 * AI-Enhanced Scoring — Uses AI for deep analysis when available,
 * falls back to heuristic scorer (matchScorer.ts) when AI is unavailable.
 *
 * Adapted from CvMaker generate_xai_score() pattern.
 */

import { aiJSON } from "@/lib/ai/client";
import { matchScoringPrompt, atsAnalysisPrompt } from "@/lib/ai/prompts";
import { scoreJob } from "./matchScorer";
import type { GapAnalysis } from "@/types";

interface AIMatchResult {
  score: number;
  category: "open" | "within_reach" | "stretch";
  gapAnalysis: GapAnalysis;
  aiPowered: boolean;
  features?: { name: string; impact: number }[];
}

interface AIATSResult {
  score: number;
  breakdown: {
    keywordDensity: number;
    sections: number;
    formatting: number;
    skillAlignment: number;
  };
  details: {
    keywordMatches: string[];
    missingKeywords: string[];
    foundSections: string[];
    missingSections: string[];
    suggestions: string[];
  };
  aiPowered: boolean;
}

/**
 * AI-powered match scoring with heuristic fallback
 */
export async function scoreJobWithAI(input: {
  userSkills: string[];
  userYearsExp: number;
  userCurrentRole?: string;
  cvText?: string;
  jobSkills: string[];
  jobTitle: string;
  jobDescription: string;
  jobSalaryMin?: number;
  jobSalaryMax?: number;
  jobRemote: boolean;
  jobLocation?: string;
}): Promise<AIMatchResult> {
  // Try AI scoring first
  try {
    const result = await aiJSON<{
      score: number;
      category: string;
      baseline: number;
      features: { name: string; impact: number }[];
      gapAnalysis: {
        missingSkills: string[];
        strengths: string[];
        recommendations: string[];
        experienceGap?: string;
        locationNote?: string;
      };
    }>({
      messages: matchScoringPrompt(
        input.cvText || "",
        input.userSkills,
        input.userYearsExp,
        input.jobTitle,
        input.jobDescription,
        input.jobSkills
      ),
      temperature: 0,
    });

    // Recompute final score deterministically (CvMaker pattern)
    const baseline = result.baseline || 50;
    const impacts = (result.features || []).reduce(
      (sum, f) => sum + (f.impact || 0),
      0
    );
    const score = Math.max(0, Math.min(100, baseline + impacts));

    let category: "open" | "within_reach" | "stretch";
    if (score >= 70) category = "open";
    else if (score >= 40) category = "within_reach";
    else category = "stretch";

    return {
      score,
      category,
      gapAnalysis: {
        missingSkills: result.gapAnalysis?.missingSkills || [],
        strengths: result.gapAnalysis?.strengths || [],
        recommendations: result.gapAnalysis?.recommendations || [],
        experienceGap: result.gapAnalysis?.experienceGap || undefined,
        locationNote: result.gapAnalysis?.locationNote || undefined,
      },
      aiPowered: true,
      features: result.features,
    };
  } catch (err) {
    console.warn("AI scoring failed, falling back to heuristic:", err);
  }

  // Fallback to heuristic
  const heuristic = scoreJob({
    userSkills: input.userSkills,
    userYearsExp: input.userYearsExp,
    userCurrentRole: input.userCurrentRole,
    jobSkills: input.jobSkills,
    jobTitle: input.jobTitle,
    jobSalaryMin: input.jobSalaryMin,
    jobSalaryMax: input.jobSalaryMax,
    jobRemote: input.jobRemote,
    jobLocation: input.jobLocation,
  });

  return { ...heuristic, aiPowered: false };
}

/**
 * AI-powered ATS CV analysis with heuristic fallback
 */
export async function scoreATSWithAI(
  cvText: string,
  jobDescription: string,
  jobSkills: string[]
): Promise<AIATSResult> {
  try {
    const result = await aiJSON<AIATSResult>({
      messages: atsAnalysisPrompt(cvText, jobDescription, jobSkills),
      temperature: 0,
    });

    return { ...result, aiPowered: true };
  } catch (err) {
    console.warn("AI ATS scoring failed, falling back to heuristic:", err);
  }

  // Fallback to existing heuristic
  const { scoreATS } = await import("./atsScorer");
  const heuristic = scoreATS(cvText, jobDescription);

  return {
    score: heuristic.score,
    breakdown: {
      keywordDensity: heuristic.breakdown.keywordDensity,
      sections: heuristic.breakdown.sections,
      formatting: heuristic.breakdown.formatting,
      skillAlignment: heuristic.breakdown.length, // map length -> skillAlignment
    },
    details: {
      keywordMatches: heuristic.details.keywordMatches || [],
      missingKeywords: heuristic.details.missingKeywords || [],
      foundSections: heuristic.details.foundSections || [],
      missingSections: heuristic.details.missingCategories || [],
      suggestions: heuristic.details.suggestions || [],
    },
    aiPowered: false,
  };
}
