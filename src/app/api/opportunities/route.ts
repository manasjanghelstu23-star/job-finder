import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import * as jose from "jose";
import { getJobs, findUserById, MOCK_STUDENTS } from "@/lib/mock-db";

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || "fallback-secret-key-for-dev");

export async function GET(request: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("session")?.value;

    let studentProfile = MOCK_STUDENTS[0];

    if (token) {
      try {
        const { payload } = await jose.jwtVerify(token, JWT_SECRET);
        const user = findUserById(payload.id as string);
        if (user && user.studentProfile) {
          studentProfile = user.studentProfile;
        }
      } catch (err) {
        // Fallback to demo student
      }
    }

    const jobs = getJobs();

    const studentSkillScores = studentProfile.skillScores || [];
    const studentSkillMap = new Map<string, { skillName: string; score: number; verification: string }>();
    studentSkillScores.forEach((score: any) => {
      studentSkillMap.set(score.skillId || score.skill?.id || score.id, {
        skillName: (score.skill?.name || score.skillName || "").toLowerCase().trim(),
        score: score.score,
        verification: score.verification,
      });
    });

    const matchedOpportunities = jobs.map(job => {
      let totalRequiredWeight = 0;
      let earnedRequiredWeight = 0;
      
      const matchedSkills: any[] = [];
      const partialMatches: any[] = [];
      const missingRequired: any[] = [];
      const missingPreferred: any[] = [];

      (job.skills || []).forEach((req: any) => {
        let studentRecord = studentSkillMap.get(req.skillId || req.skill?.id);
        if (!studentRecord) {
          const reqName = (req.skill?.name || "").toLowerCase().trim();
          for (const [_, val] of Array.from(studentSkillMap.entries())) {
            if (val.skillName === reqName || reqName.includes(val.skillName) || val.skillName.includes(reqName)) {
              studentRecord = val;
              break;
            }
          }
        }

        const studentScore = studentRecord?.score || 0;
        const verificationSource = studentRecord?.verification || "None";
        const requiredLvl = req.requiredLevel || 70;
        const skillName = req.skill?.name || "Skill";
        
        if (studentScore >= requiredLvl) {
          matchedSkills.push({ 
            skill: skillName, 
            type: req.requirementType, 
            studentScore: Math.round(studentScore), 
            requiredLvl,
            source: verificationSource 
          });
          if (req.requirementType === "REQUIRED") {
            earnedRequiredWeight += req.weight || 1.0;
            totalRequiredWeight += req.weight || 1.0;
          }
        } else if (studentScore > 0) {
          partialMatches.push({ 
            skill: skillName, 
            type: req.requirementType, 
            studentScore: Math.round(studentScore), 
            requiredLvl,
            source: verificationSource
          });
          if (req.requirementType === "REQUIRED") {
            earnedRequiredWeight += (studentScore / requiredLvl) * (req.weight || 1.0);
            totalRequiredWeight += req.weight || 1.0;
          } else {
            missingPreferred.push({ skill: skillName, requiredLvl });
          }
        } else {
          if (req.requirementType === "REQUIRED") {
            missingRequired.push({ skill: skillName, requiredLvl });
            totalRequiredWeight += req.weight || 1.0;
          } else {
            missingPreferred.push({ skill: skillName, requiredLvl });
          }
        }
      });

      const baseScore = totalRequiredWeight > 0 ? (earnedRequiredWeight / totalRequiredWeight) * 100 : 85;
      const matchScore = Math.min(100, Math.round(baseScore));

      const requiredSkillsList = (job.skills || []).map((s: any) => ({
        name: s.skill?.name || "Skill",
        requiredLevel: s.requiredLevel || 70,
        requirementType: s.requirementType
      }));

      return {
        job: {
          ...job,
          requiredSkills: requiredSkillsList.map((s: any) => s.name),
          detailedSkillRequirements: requiredSkillsList
        },
        matchResult: {
          matchScore,
          scoreBreakdown: {
            baseScore: Math.round(baseScore),
            earnedWeight: earnedRequiredWeight.toFixed(1),
            totalRequiredWeight: totalRequiredWeight.toFixed(1),
            preferredBonus: 5,
            deductions: missingRequired.length * 10
          },
          eligibilityStatus: missingRequired.length > 1 ? "Ineligible - Missing Core Requirements" : "Eligible",
          matchedSkills,
          partialMatches,
          missingRequired,
          missingPreferred,
          actionPlan: missingRequired.map((mr: any) => ({
            type: "LEARN_REQUIRED",
            message: `Learn ${mr.skill} to meet a core requirement for this role.`
          }))
        }
      };
    });

    matchedOpportunities.sort((a, b) => b.matchResult.matchScore - a.matchResult.matchScore);

    return NextResponse.json(matchedOpportunities);

  } catch (error) {
    console.error("Error generating opportunities:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
