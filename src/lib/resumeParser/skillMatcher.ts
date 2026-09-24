import { getSkills } from "@/lib/mock-db";
import { StructuredResume } from "./sectionExtractor";

export class SkillMatcher {
  static async processResumeSkills(resumeId: string, structuredData: StructuredResume) {
    const masterSkills = await getSkills();
    const evidenceMap: Record<string, any> = {};

    const mapSection = (text: string, source: string) => {
      const lowerText = text.toLowerCase();
      
      for (const skill of masterSkills) {
        const skillNameLower = skill.name.toLowerCase();
        let regexStr = `\\b${this.escapeRegex(skillNameLower)}\\b`;
        if (skillNameLower === "c++") regexStr = `\\bc\\+\\+(?!\\w)`;
        if (skillNameLower === "c#") regexStr = `\\bc#(?!\\w)`;
        
        const regex = new RegExp(regexStr, 'gi');
        
        if (regex.test(lowerText)) {
          const key = `${skill.id}-${source}`;
          if (!evidenceMap[key]) {
            evidenceMap[key] = {
              skillId: skill.id,
              detectedName: skill.name,
              normalizedName: skill.name,
              evidenceSource: source,
              evidenceText: text.substring(0, 500),
              confidence: source === 'skills' ? 0.9 : 0.7,
              extractionMethod: "DETERMINISTIC_REGEX"
            };
          }
        }
      }
    };

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

    return Object.values(evidenceMap);
  }

  private static escapeRegex(string: string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); 
  }
}
