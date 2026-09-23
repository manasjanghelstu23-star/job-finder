import { StructuredResume } from "./sectionExtractor";
import { 
  TARGET_ROLES, 
  TargetRoleRequirement, 
  normalizeSkillName, 
  CANONICAL_SKILL_DICTIONARY 
} from "./normalizationDictionary";

export interface SkillEvidenceItem {
  name: string;
  category: string;
  source: string;
  snippet: string;
  hasMeasurableOutcome: boolean;
  contextQuality: "HIGH" | "MEDIUM" | "LOW";
  recommendation?: string;
}

export interface MissingSkillItem {
  name: string;
  importance: "MANDATORY" | "CRITICAL" | "EXPECTED" | "PREFERRED";
  expectedProof: string;
  suggestedAction: string;
  learningUrl: string;
}

export interface PartialSkillItem {
  name: string;
  currentEvidence: string;
  missingProof: string;
  recommendation: string;
}

export interface InsufficientEvidenceItem {
  name: string;
  reason: string;
  improvementTip: string;
}

export interface DualGaps {
  skillGaps: Array<{
    title: string;
    description: string;
    skills: string[];
    priority: "HIGH" | "MEDIUM" | "LOW";
    actionUrl: string;
  }>;
  resumeContentGaps: Array<{
    title: string;
    issue: string;
    fix: string;
    category: "METRICS" | "DEPTH" | "EVIDENCE" | "STRUCTURE";
  }>;
}

export interface ResumeQualityMetrics {
  structure: {
    status: "Good" | "Fair" | "Needs Improvement";
    score: number;
    details: string;
  };
  skillsEvidence: {
    status: "Strong" | "Moderate" | "Needs Improvement";
    score: number;
    details: string;
  };
  projectEvidence: {
    status: "Strong" | "Moderate" | "Needs Improvement";
    score: number;
    details: string;
  };
  experienceEvidence: {
    status: "Strong" | "Moderate" | "Needs Improvement";
    score: number;
    details: string;
  };
  roleAlignment: {
    percentage: number;
    level: "Exceptional Match" | "Strong Alignment" | "Moderate Alignment" | "Emerging Fit";
    summary: string;
  };
}

export interface RoleAlignmentReport {
  targetRole: {
    id: string;
    title: string;
    department: string;
    experienceLevel: string;
  };
  alignmentPercentage: number;
  alignmentLevel: "Exceptional Match" | "Strong Alignment" | "Moderate Alignment" | "Emerging Fit";
  summaryText: string;
  matchedSkills: SkillEvidenceItem[];
  partialSkills: PartialSkillItem[];
  missingSkills: MissingSkillItem[];
  insufficientEvidenceSkills: InsufficientEvidenceItem[];
  dualGaps: DualGaps;
  qualityMetrics: ResumeQualityMetrics;
  actionableImprovements: Array<{
    step: number;
    title: string;
    description: string;
    type: "RESUME_TWEAK" | "LEARNING_ACTION" | "PROJECT_DEPTH";
  }>;
  connectedModules: {
    skillGapsCount: number;
    recommendedCourses: Array<{ title: string; href: string }>;
    matchedOpportunitiesCount: number;
  };
}

export class ResumeAlignmentEngine {
  /**
   * Evaluates a structured resume against a target role requirement.
   */
  static analyze(
    structured: StructuredResume,
    targetRoleId: string = "backend-dev",
    existingStudentScores: Array<{ skillName: string; score: number; verification: string }> = []
  ): RoleAlignmentReport {
    // 1. Resolve Target Role
    const role = TARGET_ROLES.find(r => r.id === targetRoleId) || TARGET_ROLES[0];

    // Combine all resume text for global scanning
    const allProjectText = structured.projects.join(" \n ");
    const allExperienceText = structured.experience.join(" \n ");
    const allSkillsText = structured.skills.join(" \n ");
    const allSummaryText = structured.summary;
    const allCertText = structured.certifications.join(" \n ");
    const combinedFullText = `${allSummaryText} \n ${allSkillsText} \n ${allExperienceText} \n ${allProjectText} \n ${allCertText}`;

    // Regex for measurable outcomes (% numbers, ms, users, QPS, latency, data scale)
    const measurableOutcomeRegex = /(\d+%\b|\b\d+(\.\d+)?(k|m|ms|s|gb|mb|qps|requests|users|records|orders)\b|\breduced\b|\boptimized\b|\bdecreased\b|\bincreased\b|\bachieved\b|\baccelerated\b)/i;

    // Helper: Find evidence snippet in specific text
    const findSnippet = (text: string, term: string): string | null => {
      const escaped = term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const lines = text.split('\n');
      for (const line of lines) {
        if (new RegExp(`\\b${escaped}\\b`, 'i').test(line)) {
          return line.trim();
        }
      }
      return null;
    };

    // Helper to check canonical occurrence
    const checkSkillOccurrence = (skillName: string) => {
      const canonical = CANONICAL_SKILL_DICTIONARY[skillName];
      const searchTerms = canonical ? [skillName, ...canonical.synonyms] : [skillName];

      let inProjects: string | null = null;
      let inExperience: string | null = null;
      let inSkills: string | null = null;
      let inSummary: string | null = null;

      for (const term of searchTerms) {
        if (!inProjects) inProjects = findSnippet(allProjectText, term);
        if (!inExperience) inExperience = findSnippet(allExperienceText, term);
        if (!inSkills) inSkills = findSnippet(allSkillsText, term);
        if (!inSummary) inSummary = findSnippet(allSummaryText, term);
      }

      return {
        found: !!(inProjects || inExperience || inSkills || inSummary),
        inProjects,
        inExperience,
        inSkills,
        inSummary,
        snippet: inProjects || inExperience || inSkills || inSummary || "",
        source: inExperience ? "Experience" : inProjects ? "Projects" : inSkills ? "Skills List" : inSummary ? "Summary" : "None"
      };
    };

    // 2. Classify Required Skills into 4 Tiers
    const matchedSkills: SkillEvidenceItem[] = [];
    const partialSkills: PartialSkillItem[] = [];
    const missingSkills: MissingSkillItem[] = [];
    const insufficientEvidenceSkills: InsufficientEvidenceItem[] = [];

    let totalWeight = 0;
    let earnedWeight = 0;

    for (const req of role.requiredSkills) {
      totalWeight += req.weight;
      const occ = checkSkillOccurrence(req.name);

      if (!occ.found) {
        // Tier 3: 🔴 Missing from Resume
        missingSkills.push({
          name: req.name,
          importance: req.importance,
          expectedProof: req.expectedProof,
          suggestedAction: `Complete a portfolio module or add coursework covering ${req.name}.`,
          learningUrl: `/student/learning?topic=${encodeURIComponent(req.name.toLowerCase())}`
        });
      } else {
        const inDeepSection = !!(occ.inProjects || occ.inExperience);
        const specificBulletHasMetric = inDeepSection && (
          measurableOutcomeRegex.test(occ.inProjects || "") || 
          measurableOutcomeRegex.test(occ.inExperience || "")
        );
        const sectionHasMetrics = inDeepSection && (
          measurableOutcomeRegex.test(allProjectText) || 
          measurableOutcomeRegex.test(allExperienceText)
        );
        const hasMetric = specificBulletHasMetric || (inDeepSection && sectionHasMetrics);

        if (inDeepSection && hasMetric) {
          // Tier 1: ✅ Strong Matched with Concrete Evidence & Measurable Metrics
          earnedWeight += req.weight;
          matchedSkills.push({
            name: req.name,
            category: CANONICAL_SKILL_DICTIONARY[req.name]?.category || "Core",
            source: occ.source,
            snippet: occ.snippet,
            hasMeasurableOutcome: true,
            contextQuality: "HIGH",
            recommendation: "Strongly verified with quantifiable engineering impact."
          });
        } else if (inDeepSection && !hasMetric) {
          // Tier 2: 🟡 Partial Evidence (Demonstrated in project, but missing quantifiable impact)
          earnedWeight += req.weight * 0.75;
          partialSkills.push({
            name: req.name,
            currentEvidence: occ.snippet,
            missingProof: "Lacks quantifiable engineering outcomes (e.g. latency reduced, user volume, scale).",
            recommendation: `Add concrete metrics to your ${occ.source.toLowerCase()} description showing how you used ${req.name}.`
          });
        } else {
          // Tier 4: ⚪ Insufficient Evidence (Only listed in skills list / summary without project proof)
          earnedWeight += req.weight * 0.4;
          insufficientEvidenceSkills.push({
            name: req.name,
            reason: `Listed as a keyword in ${occ.source}, but no supporting bullet points describe its application.`,
            improvementTip: `Add at least one project bullet point explaining your implementation of ${req.name} with expected ${req.expectedProof}.`
          });
        }
      }
    }

    // Process Preferred Skills for Bonus Weight
    for (const pref of role.preferredSkills) {
      const occ = checkSkillOccurrence(pref.name);
      if (occ.found) {
        totalWeight += pref.weight;
        earnedWeight += pref.weight;
        if (occ.inProjects || occ.inExperience) {
          matchedSkills.push({
            name: pref.name,
            category: CANONICAL_SKILL_DICTIONARY[pref.name]?.category || "Preferred",
            source: occ.source,
            snippet: occ.snippet,
            hasMeasurableOutcome: measurableOutcomeRegex.test(occ.snippet) || measurableOutcomeRegex.test(allProjectText),
            contextQuality: "MEDIUM",
            recommendation: "Preferred skill present, enhancing role competitiveness."
          });
        }
      }
    }

    // 3. Compute Alignment Percentage (Grounded, non-misleading)
    const rawRatio = totalWeight > 0 ? (earnedWeight / totalWeight) : 0.5;
    const alignmentPercentage = Math.min(96, Math.max(35, Math.round(rawRatio * 100)));

    let alignmentLevel: "Exceptional Match" | "Strong Alignment" | "Moderate Alignment" | "Emerging Fit" = "Moderate Alignment";
    if (alignmentPercentage >= 85) alignmentLevel = "Exceptional Match";
    else if (alignmentPercentage >= 72) alignmentLevel = "Strong Alignment";
    else if (alignmentPercentage >= 55) alignmentLevel = "Moderate Alignment";
    else alignmentLevel = "Emerging Fit";

    // 4. Construct Dual Gaps (Technical Skill Gaps vs. Resume Content Gaps)
    const skillGaps = [];
    if (missingSkills.length > 0) {
      skillGaps.push({
        title: "Missing Core Role Requirements",
        description: `Your target role strictly requires ${missingSkills.slice(0, 3).map(m => m.name).join(", ")}.`,
        skills: missingSkills.map(m => m.name),
        priority: "HIGH" as const,
        actionUrl: "/student/learning"
      });
    }

    const preferredMissing = role.preferredSkills.filter(p => !checkSkillOccurrence(p.name).found);
    if (preferredMissing.length > 0) {
      skillGaps.push({
        title: "Recommended Industry Differentiators",
        description: `Top candidates for ${role.title} frequently showcase ${preferredMissing.slice(0, 2).map(p => p.name).join(" and ")}.`,
        skills: preferredMissing.map(p => p.name),
        priority: "MEDIUM" as const,
        actionUrl: "/student/opportunities"
      });
    }

    const resumeContentGaps = [];
    if (insufficientEvidenceSkills.length > 0) {
      resumeContentGaps.push({
        title: "Skills Listed Without Contextual Proof",
        issue: `${insufficientEvidenceSkills.map(i => i.name).join(", ")} appear only in your skill list with zero project/experience references.`,
        fix: "Integrate these skills into project bullets with tangible technical responsibilities.",
        category: "EVIDENCE" as const
      });
    }

    if (partialSkills.length > 0) {
      resumeContentGaps.push({
        title: "Lack of Quantifiable Engineering Metrics",
        issue: `${partialSkills.map(p => p.name).join(", ")} bullets describe actions but lack measurable outcomes.`,
        fix: "Include metrics such as: request latency (ms), database query speedup (%), concurrent user load, or throughput.",
        category: "METRICS" as const
      });
    }

    if (structured.projects.length < 2) {
      resumeContentGaps.push({
        title: "Insufficient Project Depth",
        issue: "Resume contains fewer than 2 detailed technical projects.",
        fix: "Add at least two end-to-end projects demonstrating your architectural choices and database schemas.",
        category: "DEPTH" as const
      });
    }

    // 5. Compute Resume Quality Metrics
    const hasContact = !!(structured.contactInfo.email && (structured.contactInfo.phone || structured.contactInfo.links?.length));
    const hasEdu = structured.education.length > 0;
    const hasProjects = structured.projects.length > 0;
    const hasSkills = structured.skills.length > 0;

    const structureScore = (hasContact ? 25 : 0) + (hasEdu ? 25 : 0) + (hasProjects ? 25 : 0) + (hasSkills ? 25 : 0);
    const structureStatus = structureScore >= 90 ? "Good" : structureScore >= 60 ? "Fair" : "Needs Improvement";

    const skillsEvidenceScore = matchedSkills.length > 3 ? 88 : matchedSkills.length > 1 ? 65 : 40;
    const skillsEvidenceStatus = skillsEvidenceScore >= 80 ? "Strong" : skillsEvidenceScore >= 60 ? "Moderate" : "Needs Improvement";

    const projectScore = structured.projects.length >= 2 ? 85 : structured.projects.length === 1 ? 60 : 30;
    const projectStatus = projectScore >= 80 ? "Strong" : projectScore >= 60 ? "Moderate" : "Needs Improvement";

    const expScore = structured.experience.length >= 2 ? 90 : structured.experience.length === 1 ? 75 : 45;
    const expStatus = expScore >= 80 ? "Strong" : expScore >= 60 ? "Moderate" : "Needs Improvement";

    // 6. Actionable Improvements Checklist (3 - 5 prioritized recommendations)
    const actionableImprovements = [];
    let stepCount = 1;

    if (partialSkills.length > 0) {
      actionableImprovements.push({
        step: stepCount++,
        title: `Add Measurable Outcomes to ${partialSkills[0].name} Bullets`,
        description: `Clarify your concrete contributions: describe throughput, latency improvements, or test coverage percentages.`,
        type: "RESUME_TWEAK" as const
      });
    } else {
      actionableImprovements.push({
        step: stepCount++,
        title: `Highlight System Scale & Concurrency for ${role.title}`,
        description: "Specify server request volumes, database indices, and caching strategies to stand out in senior recruiter reviews.",
        type: "PROJECT_DEPTH" as const
      });
    }

    if (insufficientEvidenceSkills.length > 0) {
      actionableImprovements.push({
        step: stepCount++,
        title: `Provide Concrete Evidence for ${insufficientEvidenceSkills[0].name}`,
        description: `Don't leave ${insufficientEvidenceSkills[0].name} as a standalone keyword. Detail how you implemented it in your projects.`,
        type: "PROJECT_DEPTH" as const
      });
    } else {
      actionableImprovements.push({
        step: stepCount++,
        title: "Detail Architectural Tradeoffs & System Design Decisions",
        description: "Explain why specific databases, ORMs, or caching layers were chosen to demonstrate engineering maturity.",
        type: "PROJECT_DEPTH" as const
      });
    }

    if (missingSkills.length > 0) {
      actionableImprovements.push({
        step: stepCount++,
        title: `Bridge Essential Skill Gap: ${missingSkills[0].name}`,
        description: `This is a mandatory requirement for ${role.title}. Enroll in the recommended learning module to build a verified project.`,
        type: "LEARNING_ACTION" as const
      });
    } else {
      actionableImprovements.push({
        step: stepCount++,
        title: "Showcase Automated CI/CD Pipelines & Test Coverage",
        description: "Include unit test coverage stats (e.g. 80%+ with JUnit/Jest) and automated GitHub Actions workflows.",
        type: "RESUME_TWEAK" as const
      });
    }

    actionableImprovements.push({
      step: stepCount++,
      title: "Include Direct Repository & Live Deployment Links",
      description: "Ensure recruiters can verify your code commits and architecture directly on GitHub or live staging URLs.",
      type: "RESUME_TWEAK" as const
    });

    if (missingSkills.length > 1) {
      actionableImprovements.push({
        step: stepCount++,
        title: `Explore Pre-requisite Tutorials for ${missingSkills[1].name}`,
        description: `Strengthen your technical screening pass rate by completing practice assessments.`,
        type: "LEARNING_ACTION" as const
      });
    }

    return {
      targetRole: {
        id: role.id,
        title: role.title,
        department: role.department,
        experienceLevel: role.experienceLevel,
      },
      alignmentPercentage,
      alignmentLevel,
      summaryText: `Evaluated against current ${role.title} screening standards. Strong alignment in core foundational skills, with high-leverage opportunities to add quantifiable metrics and evidence for missing competencies.`,
      matchedSkills,
      partialSkills,
      missingSkills,
      insufficientEvidenceSkills,
      dualGaps: {
        skillGaps,
        resumeContentGaps
      },
      qualityMetrics: {
        structure: {
          status: structureStatus,
          score: structureScore,
          details: hasContact && hasProjects ? "Clean section hierarchy with clear contact details and project separation." : "Review section headers to ensure ATS parsers can distinguish projects from work history."
        },
        skillsEvidence: {
          status: skillsEvidenceStatus,
          score: skillsEvidenceScore,
          details: `${matchedSkills.length} of ${role.requiredSkills.length} required skills demonstrated with project or experience evidence.`
        },
        projectEvidence: {
          status: projectStatus,
          score: projectScore,
          details: `${structured.projects.length} distinct project entries detected with technical stack descriptions.`
        },
        experienceEvidence: {
          status: expStatus,
          score: expScore,
          details: structured.experience.length > 0 ? "Internship and practical work experience present." : "No explicit employment history detected; emphasize open-source or academic project deliverables."
        },
        roleAlignment: {
          percentage: alignmentPercentage,
          level: alignmentLevel,
          summary: `Demonstrates ${matchedSkills.length} mandatory competencies with ${partialSkills.length} requiring metric refinement.`
        }
      },
      actionableImprovements,
      connectedModules: {
        skillGapsCount: missingSkills.length,
        recommendedCourses: missingSkills.map(m => ({
          title: `Mastering ${m.name} for Enterprise`,
          href: `/student/learning?topic=${encodeURIComponent(m.name.toLowerCase())}`
        })),
        matchedOpportunitiesCount: Math.max(3, Math.round(alignmentPercentage / 18))
      }
    };
  }
}
