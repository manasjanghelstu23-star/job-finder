import { Skill } from "@prisma/client";

/**
 * Phase 5: Skill Extraction Layer
 * Uses deterministic keyword matching against the Master Skill Taxonomy.
 */
export function extractSkillsFromText(text: string, masterSkills: Skill[]) {
  const extractedSkills: Array<{ skillId: string; requirementType: "REQUIRED" | "PREFERRED" }> = [];
  const normalizedText = text.toLowerCase();
  
  // Very basic heuristic to detect "Preferred" section
  // Real world: NLP/LLM or advanced regex would handle this
  const preferredIndex = Math.max(
    normalizedText.indexOf("preferred"),
    normalizedText.indexOf("bonus"),
    normalizedText.indexOf("nice to have")
  );

  masterSkills.forEach(skill => {
    // Escape regex characters in skill name
    const escapedName = skill.name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    // Word boundary regex to avoid partial matches (e.g. 'C' matching 'React')
    // Note: C++, C#, .NET require careful boundary handling
    let regexStr = `\\b${escapedName}\\b`;
    if (skill.name === "C++" || skill.name === "C#") {
      regexStr = `\\b${escapedName}`; // boundary after symbols is tricky
    }

    const regex = new RegExp(regexStr, "i");
    const match = text.match(regex);

    if (match) {
      const matchIndex = match.index || 0;
      let requirementType: "REQUIRED" | "PREFERRED" = "REQUIRED";

      // If the skill is found after the "Preferred" keywords, mark as preferred
      if (preferredIndex !== -1 && matchIndex > preferredIndex) {
        requirementType = "PREFERRED";
      }

      extractedSkills.push({
        skillId: skill.id,
        requirementType
      });
    }
  });

  return extractedSkills;
}
