import type { BrandAnalysis } from "@/types";

interface BrandInput {
  linkedinUrl?: string;
  githubUrl?: string;
  twitterUrl?: string;
  instagramUrl?: string;
  cvFile?: string;
  skills?: string[];
  yearsExp?: number;
}

function scoreProfileCompleteness(input: BrandInput): number {
  let score = 0;
  if (input.linkedinUrl) score += 30;
  if (input.githubUrl) score += 25;
  if (input.cvFile) score += 25;
  if (input.twitterUrl || input.instagramUrl) score += 10;
  if (input.skills && input.skills.length > 5) score += 10;
  return Math.min(score, 100);
}

function scoreContentFrequency(input: BrandInput): number {
  // Simulate frequency score based on what profiles are provided
  let score = 20;
  if (input.linkedinUrl) score += 25;
  if (input.twitterUrl) score += 25;
  if (input.instagramUrl) score += 15;
  if (input.githubUrl) score += 15;
  return Math.min(score, 100);
}

function scoreEngagement(input: BrandInput): number {
  let score = 10;
  if (input.linkedinUrl) score += 30;
  if (input.twitterUrl) score += 30;
  if (input.githubUrl) score += 20;
  if (input.instagramUrl) score += 10;
  return Math.min(score, 100);
}

function scorePortfolioQuality(input: BrandInput): number {
  let score = 10;
  if (input.githubUrl) score += 50;
  if (input.cvFile) score += 20;
  if (input.skills && input.skills.length > 8) score += 20;
  return Math.min(score, 100);
}

export function analyzeBrand(input: BrandInput): BrandAnalysis {
  const profileCompleteness = scoreProfileCompleteness(input);
  const contentFrequency = scoreContentFrequency(input);
  const engagement = scoreEngagement(input);
  const portfolioQuality = scorePortfolioQuality(input);

  const overallScore = Math.round(
    profileCompleteness * 0.3 +
    contentFrequency * 0.25 +
    engagement * 0.25 +
    portfolioQuality * 0.2
  );

  const recommendations: string[] = [];
  const contentStrategy: string[] = [];
  const portfolioSuggestions: string[] = [];

  if (!input.linkedinUrl) {
    recommendations.push("Create a LinkedIn profile — it's the #1 platform for professional networking");
  } else if (profileCompleteness < 70) {
    recommendations.push("Complete your LinkedIn profile with a professional photo, headline, and summary");
  }

  if (!input.githubUrl) {
    recommendations.push("Create a GitHub profile to showcase your technical projects");
  } else {
    recommendations.push("Pin your best repositories on GitHub to create a strong first impression");
  }

  if (!input.twitterUrl) {
    recommendations.push("Consider creating a Twitter/X presence to engage with your professional community");
  }

  if (contentFrequency < 50) {
    contentStrategy.push("Post at least 2-3 times per week on LinkedIn about industry insights");
    contentStrategy.push("Share your learnings from projects you're working on");
    contentStrategy.push("Engage with thought leaders by commenting on their posts");
  } else {
    contentStrategy.push("Maintain your posting consistency and aim for daily engagement");
    contentStrategy.push("Create a content calendar to plan posts in advance");
  }

  contentStrategy.push("Write about technical problems you've solved — these perform well with technical recruiters");
  contentStrategy.push("Share achievements with specific metrics (e.g., 'improved load time by 40%')");

  portfolioSuggestions.push("Build a personal portfolio site using GitHub Pages or Vercel (free)");
  portfolioSuggestions.push("Create an interactive Three.js visualization to showcase a complex project");
  portfolioSuggestions.push("Write case studies for your top 3 projects with problem, solution, and impact");
  portfolioSuggestions.push("Add README files with screenshots and demos to all your GitHub projects");
  portfolioSuggestions.push("Record a short demo video for your best project and share it on LinkedIn");

  return {
    overallScore,
    breakdown: {
      profileCompleteness,
      contentFrequency,
      engagement,
      portfolioQuality,
    },
    recommendations,
    contentStrategy,
    portfolioSuggestions,
  };
}
