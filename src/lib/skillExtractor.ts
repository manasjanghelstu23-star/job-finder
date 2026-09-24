export interface SkillItem {
  id: string;
  name: string;
  categoryId?: string;
}

/**
 * Phase 5: Skill Extraction Layer
 * Uses deterministic keyword matching against the Master Skill Taxonomy.
 */
export function extractSkillsFromText(text: string, masterSkills: SkillItem[]) {
  const extractedSkills: Array<{ skillId: string; skillName: string; requirementType: "REQUIRED" | "PREFERRED" }> = [];
  const normalizedText = text.toLowerCase();

  const preferredIndex = Math.max(
    normalizedText.indexOf("preferred"),
    normalizedText.indexOf("bonus"),
    normalizedText.indexOf("nice to have")
  );

  masterSkills.forEach(skill => {
    const escapedName = skill.name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    let regexStr = `\\b${escapedName}\\b`;
    if (skill.name === "C++" || skill.name === "C#") {
      regexStr = `\\b${escapedName}`;
    }

    const regex = new RegExp(regexStr, "i");
    const match = text.match(regex);

    if (match) {
      const matchIndex = match.index || 0;
      let requirementType: "REQUIRED" | "PREFERRED" = "REQUIRED";

      if (preferredIndex !== -1 && matchIndex > preferredIndex) {
        requirementType = "PREFERRED";
      }

      extractedSkills.push({
        skillId: skill.id,
        skillName: skill.name,
        requirementType
      });
    }
  });

  return extractedSkills;
}
