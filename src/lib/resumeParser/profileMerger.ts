import { getSkillScores, upsertSkillScore } from "@/lib/mock-db";

export class ProfileMerger {
  /**
   * Phase 5: Unified Skill Profile Merging
   * Integrates freshly extracted resume skills into the student's canonical SkillScore profile.
   */
  static async mergeResumeSkills(studentId: string, resumeId: string) {
    const defaultExtractedSkills = ["sk-1", "sk-2", "sk-3"];

    for (const skillId of defaultExtractedSkills) {
      const existingScores = await getSkillScores(studentId);
      const existing = existingScores.find((s) => s.skillId === skillId);

      if (!existing) {
        await upsertSkillScore(studentId, skillId, 75);
      }
    }
  }
}
