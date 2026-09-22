import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export class ProfileMerger {
  /**
   * Phase 5: Unified Skill Profile Merging
   * Integrates freshly extracted resume skills into the student's canonical SkillScore profile
   * without destroying or overriding verified assessment data.
   */
  static async mergeResumeSkills(studentId: string, resumeId: string) {
    // 1. Fetch all unique skills detected in this resume
    const evidences = await prisma.resumeSkillEvidence.findMany({
      where: { resumeId }
    });

    if (evidences.length === 0) return;

    // Group by skillId to get the highest confidence per skill in this resume
    const skillConfidenceMap = new Map<string, number>();
    for (const ev of evidences) {
      const existing = skillConfidenceMap.get(ev.skillId) || 0;
      if (ev.confidence > existing) {
        skillConfidenceMap.set(ev.skillId, ev.confidence);
      }
    }

    // 2. Fetch the student's existing canonical SkillProfile
    const existingScores = await prisma.skillScore.findMany({
      where: { studentId }
    });
    
    const existingScoreMap = new Map(existingScores.map(s => [s.skillId, s]));

    // 3. Merge Strategy
    for (const [skillId, maxConfidence] of skillConfidenceMap.entries()) {
      const existing = existingScoreMap.get(skillId);

      if (existing) {
        // If an assessment has already verified this skill, DO NOT OVERWRITE the score.
        // It holds higher weight/validity than a resume mention.
        if (existing.verification === "Verified") {
          // We could potentially update the coverage lightly to indicate multiple sources of proof,
          // but for now, we leave the verified score completely untouched.
          continue;
        }

        // If it's already 'Claimed' (perhaps from a previous resume), we can update it if this
        // new resume gives us higher confidence.
        const claimedScore = Math.min(80, Math.round(maxConfidence * 60)); // Baseline claimed maxes around 50-60
        if (claimedScore > existing.score) {
          await prisma.skillScore.update({
            where: { id: existing.id },
            data: {
              score: claimedScore,
              status: "Extracted",
              verification: "Claimed",
              assessedAt: new Date()
            }
          });
        }
      } else {
        // If the skill is ONLY in the resume, it is recorded with an "unverified" or "claimed" status.
        // We assign a baseline score based on the extraction confidence.
        const claimedScore = Math.round(maxConfidence * 60); // 0.9 confidence -> 54 score
        
        await prisma.skillScore.create({
          data: {
            studentId,
            skillId,
            score: claimedScore,
            coverage: 0.2, // Low coverage because it hasn't been strictly tested
            status: "Extracted",
            verification: "Claimed"
          }
        });
      }
    }
  }
}
