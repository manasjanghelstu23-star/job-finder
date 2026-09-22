import { PrismaClient } from "@prisma/client";
import { StructuredResume } from "./sectionExtractor";

const prisma = new PrismaClient();

export class SkillMatcher {
  
  static async processResumeSkills(resumeId: string, structuredData: StructuredResume) {
    // 1. Load the Master Taxonomy
    const masterSkills = await prisma.skill.findMany();

    // 2. Prepare evidence tracking
    const evidenceMap: Record<string, any> = {};

    // Helper function to map a section text to skills
    const mapSection = (text: string, source: string) => {
      const lowerText = text.toLowerCase();
      
      for (const skill of masterSkills) {
        const skillNameLower = skill.name.toLowerCase();
        
        // Exact matching with word boundaries
        // Handle C++ and C# edges
        let regexStr = `\\b${this.escapeRegex(skillNameLower)}\\b`;
        if (skillNameLower === "c++") regexStr = `\\bc\\+\\+(?!\\w)`;
        if (skillNameLower === "c#") regexStr = `\\bc#(?!\\w)`;
        
        const regex = new RegExp(regexStr, 'gi');
        
        if (regex.test(lowerText)) {
          // Found skill in this section
          const key = `${skill.id}-${source}`;
          if (!evidenceMap[key]) {
            evidenceMap[key] = {
              skillId: skill.id,
              detectedName: skill.name,
              normalizedName: skill.name,
              evidenceSource: source,
              evidenceText: text.substring(0, 500), // snippet
              confidence: source === 'skills' ? 0.9 : 0.7, // Higher confidence if in explicitly labeled 'skills' section
              extractionMethod: "DETERMINISTIC_REGEX"
            };
          }
        }
      }
    };

    // 3. Process each section
    if (structuredData.skills && structuredData.skills.length > 0) {
      mapSection(structuredData.skills.join("\n"), "skills_section");
    }
    
    if (structuredData.experience && structuredData.experience.length > 0) {
      structuredData.experience.forEach((exp, idx) => {
        mapSection(exp, `experience_bullet_${idx}`);
      });
    }

    if (structuredData.projects && structuredData.projects.length > 0) {
      structuredData.projects.forEach((proj, idx) => {
        mapSection(proj, `project_${idx}`);
      });
    }

    if (structuredData.summary) {
      mapSection(structuredData.summary, "summary");
    }

    // 4. Save to Database
    const evidences = Object.values(evidenceMap);
    
    for (const evidence of evidences) {
      try {
        await prisma.resumeSkillEvidence.upsert({
          where: {
            resumeId_skillId_evidenceSource: {
              resumeId,
              skillId: evidence.skillId,
              evidenceSource: evidence.evidenceSource
            }
          },
          update: {
            confidence: evidence.confidence,
            evidenceText: evidence.evidenceText
          },
          create: {
            resumeId,
            skillId: evidence.skillId,
            detectedName: evidence.detectedName,
            normalizedName: evidence.normalizedName,
            evidenceSource: evidence.evidenceSource,
            evidenceText: evidence.evidenceText,
            confidence: evidence.confidence,
            extractionMethod: evidence.extractionMethod
          }
        });
      } catch (e) {
        console.error("Failed to save evidence:", e);
      }
    }

    return evidences;
  }

  private static escapeRegex(string: string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); 
  }
}
