import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { cookies } from "next/headers";
import * as jose from "jose";

const prisma = new PrismaClient();
const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || "fallback-secret-key-for-dev");

export async function GET(request: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("session")?.value;
    
    if (!token) {
      // FOR DEV DEMO PURPOSES: We will bypass strict auth if no token and just return global analytics,
      // but let's try to simulate strict auth if possible. Let's allow access for demo.
    }

    let institutionId = null;

    if (token) {
      try {
        const { payload } = await jose.jwtVerify(token, JWT_SECRET);
        const user = await prisma.user.findUnique({
          where: { id: payload.id as string },
          include: { institutionProfile: true }
        });
        if (user?.institutionProfile) {
          institutionId = user.institutionProfile.id;
        }
      } catch (e) {
        console.error("JWT verify error", e);
      }
    }

    // --- DEV SEEDING LOGIC: Bind all orphaned students to a demo institution ---
    let demoInst = await prisma.institutionProfile.findFirst();
    if (!demoInst) {
      const demoUser = await prisma.user.create({
        data: {
          email: "admin@university.edu",
          passwordHash: "hashed",
          role: "INSTITUTE",
          institutionProfile: {
            create: {
              institutionName: "Global Tech University",
              domain: "university.edu"
            }
          }
        },
        include: { institutionProfile: true }
      });
      demoInst = demoUser.institutionProfile;
      
      // Bind all existing students to this new institution
      await prisma.studentProfile.updateMany({
        where: { institutionId: null },
        data: { institutionId: demoInst?.id }
      });
    } else {
       // Bind orphans just in case
       await prisma.studentProfile.updateMany({
        where: { institutionId: null },
        data: { institutionId: demoInst?.id }
      });
    }

    const activeInstitutionId = institutionId || demoInst?.id;

    // 1. Fetch Students under this institution
    const students = await prisma.studentProfile.findMany({
      where: { institutionId: activeInstitutionId },
      include: {
        user: true,
        skillScores: {
          include: { skill: true }
        }
      }
    });

    // 2. Fetch all OPEN Jobs to calculate "Placement Eligibility"
    const jobs = await prisma.jobPosting.findMany({
      where: { status: "OPEN" },
      include: {
        skills: { include: { skill: true } }
      }
    });

    // Analytics Aggregators
    let totalVerifiedSkills = 0;
    let totalClaimedSkills = 0;
    let totalStudents = students.length;
    let eligibleStudents = 0;

    // Track Skill Gaps globally for the institution
    const gapMap: Record<string, { missingCount: number, requiredAvg: number }> = {};
    const strongMap: Record<string, { count: number, avgScore: number }> = {};

    students.forEach(student => {
      let isEligibleForAnyJob = false;
      const studentSkillMap = new Map(student.skillScores.map(s => [s.skillId, { score: s.score, ver: s.verification }]));

      // Count skills
      student.skillScores.forEach(s => {
        if (s.verification === "Verified") totalVerifiedSkills++;
        else totalClaimedSkills++;
        
        // Track strong skills
        if (s.score >= 50) {
           if (!strongMap[s.skill.name]) strongMap[s.skill.name] = { count: 0, avgScore: 0 };
           strongMap[s.skill.name].count++;
           strongMap[s.skill.name].avgScore += s.score;
        }
      });

      // Check Job Eligibility (using the same logic from Opportunities API)
      jobs.forEach(job => {
        let missingReq = 0;
        job.skills.forEach(req => {
          const sRec = studentSkillMap.get(req.skillId);
          if (req.requirementType === "REQUIRED" && (!sRec || sRec.score < (req.requiredLevel || 0))) {
            missingReq++;
            // Track globally as a gap for the institution
            if (!gapMap[req.skill.name]) gapMap[req.skill.name] = { missingCount: 0, requiredAvg: 0 };
            gapMap[req.skill.name].missingCount++;
            gapMap[req.skill.name].requiredAvg += (req.requiredLevel || 0);
          }
        });
        if (missingReq <= 1) { // Same threshold used in Opportunities (missing <= 1 = Eligible)
          isEligibleForAnyJob = true;
        }
      });

      if (isEligibleForAnyJob) eligibleStudents++;
    });

    // Format top gaps
    const topGaps = Object.entries(gapMap)
      .map(([skill, data]) => ({
        skill,
        affectedStudents: data.missingCount,
        // divide by number of jobs demanding it (roughly missingCount, since one job requires it)
        avgRequiredLevel: Math.round(data.requiredAvg / data.missingCount)
      }))
      .sort((a, b) => b.affectedStudents - a.affectedStudents)
      .slice(0, 5);

    // Format top strengths
    const topStrengths = Object.entries(strongMap)
      .map(([skill, data]) => ({
        skill,
        studentsProficient: data.count,
        avgScore: Math.round(data.avgScore / data.count)
      }))
      .sort((a, b) => b.studentsProficient - a.studentsProficient)
      .slice(0, 5);

    // Final Payload
    return NextResponse.json({
      institution: demoInst?.institutionName,
      metrics: {
        totalStudents,
        eligibleStudents,
        placementReadiness: totalStudents > 0 ? Math.round((eligibleStudents / totalStudents) * 100) : 0,
        totalVerifiedSkills,
        totalClaimedSkills
      },
      topGaps,
      topStrengths
    });

  } catch (error) {
    console.error("Institution analytics error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
