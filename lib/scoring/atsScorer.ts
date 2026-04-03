interface ATSScoreResult {
  score: number;
  breakdown: {
    keywordDensity: number;
    sections: number;
    formatting: number;
    length: number;
  };
  details: {
    keywordMatches: string[];
    missingKeywords: string[];
    foundSections: string[];
    missingCategories: string[];
    suggestions: string[];
  };
}

// Extract keywords from job description
function extractKeywords(text: string): string[] {
  // Remove common words and extract meaningful keywords
  const stopwords = new Set([
    "the", "a", "an", "and", "or", "but", "in", "on", "at", "to", "for", "of", "with", "by", "from",
    "is", "are", "was", "were", "be", "been", "being", "have", "has", "had", "do", "does", "did",
    "will", "would", "could", "should", "may", "might", "must", "can", "we", "you", "he", "she", "it",
    "that", "this", "these", "those", "which", "who", "what", "when", "where", "why", "how", "all",
    "each", "every", "both", "either", "neither", "some", "any", "no", "not", "no", "more", "less",
  ]);

  const words = text
    .toLowerCase()
    .match(/\b\w+\b/g) || [];

  return words
    .filter(w => w.length > 3 && !stopwords.has(w))
    .slice(0, 50); // Top keywords
}

// Normalize text for comparison
function normalizeText(text: string): string {
  return text.toLowerCase().trim();
}

// Check for important CV sections
function checkSections(cvText: string): { found: string[]; missing: string[] } {
  const sectionPatterns = {
    'EXPERIENCE': /experience|work.*history|employment|professional.*experience/i,
    'EDUCATION': /education|degree|university|college|school|certification|qualification/i,
    'SKILLS': /skills|technical.*skills|competencies|expertise|proficiencies/i,
    'SUMMARY': /summary|objective|professional.*summary|profile|about/i,
    'CONTACT': /contact|phone|email|linkedin|github|website/i,
  };

  const found: string[] = [];
  const missing: string[] = [];

  Object.entries(sectionPatterns).forEach(([section, pattern]) => {
    if (pattern.test(cvText)) {
      found.push(section);
    } else {
      missing.push(section);
    }
  });

  return { found, missing };
}

// Check formatting best practices
function checkFormatting(cvText: string): number {
  let score = 100;

  // Check for tables (negative indicator for ATS)
  if (/\|[\s\w]+\|/g.test(cvText)) {
    score -= 20;
  }

  // Check for excessive special characters
  if ((cvText.match(/[★✓●○◆▪]/g) || []).length > 20) {
    score -= 15;
  }

  // Check length (too short or too long is bad for ATS)
  const length = cvText.length;
  if (length < 1000) {
    score -= 20;
  } else if (length > 15000) {
    score -= 15;
  }

  // Check for proper line spacing/structure
  const lines = cvText.split('\n');
  if (lines.length < 5) {
    score -= 15;
  }

  return Math.max(0, score);
}

// Calculate keyword density
function calculateKeywordDensity(cvText: string, jobKeywords: string[]): {
  matches: string[];
  density: number;
} {
  const normalizedCV = normalizeText(cvText);
  const matches: string[] = [];

  jobKeywords.forEach(keyword => {
    const normalizedKeyword = normalizeText(keyword);
    // Count occurrences of keyword
    const regex = new RegExp(`\\b${normalizedKeyword}\\b`, 'g');
    if (regex.test(normalizedCV)) {
      matches.push(keyword);
    }
  });

  const density = jobKeywords.length > 0 ? (matches.length / jobKeywords.length) * 100 : 0;

  return { matches, density };
}

export function scoreATS(cvRaw: string, jobDescription: string): ATSScoreResult {
  const cvText = cvRaw || "";

  // Extract keywords from job description
  const jobKeywords = extractKeywords(jobDescription);

  // Check sections
  const { found: foundSections, missing: missingCategories } = checkSections(cvText);

  // Check keyword density
  const { matches: keywordMatches, density: keywordDensity } = calculateKeywordDensity(cvText, jobKeywords);

  // Check formatting
  const formattingScore = checkFormatting(cvText);

  // Check length
  const length = cvText.length;
  let lengthScore = 100;
  if (length < 1000) {
    lengthScore = 50;
  } else if (length > 15000) {
    lengthScore = 80;
  }

  // Calculate section score based on important sections found
  const importantSections = ['EXPERIENCE', 'EDUCATION', 'SKILLS'];
  const sectionScore = (foundSections.filter(s => importantSections.includes(s)).length / importantSections.length) * 100;

  // Calculate overall ATS score (weighted average)
  const atsScore = Math.round(
    keywordDensity * 0.35 +
    sectionScore * 0.25 +
    formattingScore * 0.25 +
    lengthScore * 0.15
  );

  // Generate suggestions
  const suggestions: string[] = [];

  if (keywordDensity < 40) {
    suggestions.push(`Include more job-specific keywords. Found ${Math.round(keywordDensity)}% of key terms from the job description.`);
  }

  missingCategories.forEach(category => {
    suggestions.push(`Add a "${category}" section to your CV.`);
  });

  if (formattingScore < 80) {
    suggestions.push("Remove special characters and tables to improve ATS compatibility.");
  }

  if (length < 1000) {
    suggestions.push("Your CV is quite short. Expand it with more details about your experience and achievements.");
  } else if (length > 15000) {
    suggestions.push("Your CV is quite long. Consider condensing less relevant information.");
  }

  if (keywordMatches.length > 0 && keywordMatches.length === jobKeywords.length) {
    suggestions.push("Excellent! Your CV contains all key terms from the job description.");
  }

  const missingKeywords = jobKeywords.filter(k => !keywordMatches.includes(k));

  return {
    score: atsScore,
    breakdown: {
      keywordDensity: Math.round(keywordDensity),
      sections: Math.round(sectionScore),
      formatting: formattingScore,
      length: lengthScore,
    },
    details: {
      keywordMatches,
      missingKeywords: missingKeywords.slice(0, 10),
      foundSections,
      missingCategories,
      suggestions,
    },
  };
}
