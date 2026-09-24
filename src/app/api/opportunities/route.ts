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
    
    // DEV FALLBACK: Helper to ensure at least one student exists
    const ensureDevStudent = async () => {
      let firstStudent = await prisma.studentProfile.findFirst({
        include: { skillScores: { include: { skill: true } } }
      });
      if (!firstStudent) {
        const user = await prisma.user.create({
          data: {
            email: "student@demo.com",
            passwordHash: "demo",
            role: "STUDENT",
            studentProfile: { create: { targetRole: "Software Engineer" } }
          },
          include: { studentProfile: { include: { skillScores: { include: { skill: true } } } } }
        });
        firstStudent = user.studentProfile;
      }
      return firstStudent;
    };

    let studentProfile = null;

    if (!token) {
      studentProfile = await ensureDevStudent();
    } else {
      try {
        const { payload } = await jose.jwtVerify(token, JWT_SECRET);
        studentProfile = await prisma.studentProfile.findUnique({
          where: { userId: payload.id as string },
          include: { skillScores: { include: { skill: true } } }
        });
        if (!studentProfile) studentProfile = await ensureDevStudent();
      } catch (err) {
        studentProfile = await ensureDevStudent();
      }
    }

    if (!studentProfile) {
      return NextResponse.json({ error: "Student profile not found" }, { status: 404 });
    }

    // 2. Fetch Jobs and Requirements (Phase 1 Database)
    let jobs = await prisma.jobPosting.findMany({
      where: { status: "OPEN" },
      include: {
        skills: {
          include: { skill: true }
        }
      }
    });

    // Ensure rich catalog of Full-Time and Internships
    const ensureSkill = async (name: string, categoryName: string = "Engineering") => {
      let cat = await prisma.skillCategory.findFirst({ where: { name: categoryName } });
      if (!cat) {
        cat = await prisma.skillCategory.create({ data: { name: categoryName } });
      }
      let sk = await prisma.skill.findFirst({ where: { name } });
      if (!sk) {
        sk = await prisma.skill.create({ data: { name, categoryId: cat.id } });
      }
      return sk;
    };

    const jsSkill = await ensureSkill("JavaScript", "Front-End");
    const reactSkill = await ensureSkill("React", "Front-End");
    const tsSkill = await ensureSkill("TypeScript", "Front-End");
    const pySkill = await ensureSkill("Python", "Back-End");
    const javaSkill = await ensureSkill("Java", "Back-End");
    const sqlSkill = await ensureSkill("SQL", "Database");
    const pgSkill = await ensureSkill("PostgreSQL", "Database");
    const dockerSkill = await ensureSkill("Docker", "DevOps");
    const awsSkill = await ensureSkill("AWS", "DevOps");
    const qaSkill = await ensureSkill("Selenium", "Quality Assurance");

    const seedJobsData = [
      // Full-Time Opportunities
      {
        title: "Front-End UI Engineer",
        company: "Flipkart Tech",
        description: "Building ultra-responsive web interfaces and micro-frontends with high test coverage.",
        location: "Bangalore",
        experience: "1-3 Years",
        employmentType: "Full-Time",
        salary: "14-18 LPA",
        source: "INTERNAL",
        skills: [
          { skillId: jsSkill.id, requirementType: "REQUIRED", requiredLevel: 75, weight: 1.0 },
          { skillId: reactSkill.id, requirementType: "REQUIRED", requiredLevel: 70, weight: 1.0 },
          { skillId: tsSkill.id, requirementType: "PREFERRED", requiredLevel: 60, weight: 0.5 },
        ]
      },
      {
        title: "Full-Stack Web Developer",
        company: "Razorpay",
        description: "Develop seamless checkout payment experiences with React, Node, and PostgreSQL.",
        location: "Bangalore",
        experience: "2-4 Years",
        employmentType: "Full-Time",
        salary: "18-24 LPA",
        source: "INTERNAL",
        skills: [
          { skillId: jsSkill.id, requirementType: "REQUIRED", requiredLevel: 70, weight: 1.0 },
          { skillId: reactSkill.id, requirementType: "REQUIRED", requiredLevel: 70, weight: 1.0 },
          { skillId: pgSkill.id, requirementType: "PREFERRED", requiredLevel: 60, weight: 0.5 },
        ]
      },
      {
        title: "Python Data Engineer",
        company: "Swiggy Labs",
        description: "Process gigabytes of delivery logistics data with Python and SQL.",
        location: "Hyderabad",
        experience: "1-2 Years",
        employmentType: "Full-Time",
        salary: "12-16 LPA",
        source: "LINKEDIN",
        skills: [
          { skillId: pySkill.id, requirementType: "REQUIRED", requiredLevel: 75, weight: 1.0 },
          { skillId: sqlSkill.id, requirementType: "REQUIRED", requiredLevel: 70, weight: 1.0 },
          { skillId: pgSkill.id, requirementType: "PREFERRED", requiredLevel: 65, weight: 0.5 },
        ]
      },
      {
        title: "DevOps & Cloud Engineer",
        company: "Zomato",
        description: "Scale Kubernetes clusters, Dockerized services, and AWS infrastructure.",
        location: "Gurgaon (Delhi-NCR)",
        experience: "2-4 Years",
        employmentType: "Full-Time",
        salary: "16-22 LPA",
        source: "INTERNAL",
        skills: [
          { skillId: dockerSkill.id, requirementType: "REQUIRED", requiredLevel: 75, weight: 1.0 },
          { skillId: awsSkill.id, requirementType: "REQUIRED", requiredLevel: 70, weight: 1.0 },
          { skillId: pySkill.id, requirementType: "PREFERRED", requiredLevel: 60, weight: 0.5 },
        ]
      },
      {
        title: "Backend Java Software Engineer",
        company: "Infosys Digital",
        description: "Build distributed enterprise microservices with Java & Spring.",
        location: "Pune",
        experience: "1-3 Years",
        employmentType: "Full-Time",
        salary: "10-14 LPA",
        source: "INTERNAL",
        skills: [
          { skillId: javaSkill.id, requirementType: "REQUIRED", requiredLevel: 75, weight: 1.0 },
          { skillId: sqlSkill.id, requirementType: "REQUIRED", requiredLevel: 70, weight: 1.0 },
        ]
      },
      {
        title: "QA Automation Test Engineer",
        company: "TCS Innovation Labs",
        description: "Automate web and API regression test suites using Selenium.",
        location: "Chennai",
        experience: "0-2 Years",
        employmentType: "Full-Time",
        salary: "8-11 LPA",
        source: "INDEED",
        skills: [
          { skillId: qaSkill.id, requirementType: "REQUIRED", requiredLevel: 70, weight: 1.0 },
          { skillId: javaSkill.id, requirementType: "PREFERRED", requiredLevel: 60, weight: 0.5 },
        ]
      },

      // Internship Opportunities
      {
        title: "Front-End Developer Intern",
        company: "Cred",
        description: "Build responsive UI components and micro-interactions in React and JavaScript.",
        location: "Bangalore",
        experience: "0-1 Years",
        employmentType: "Internship",
        salary: "45k - 60k/month",
        source: "LINKEDIN",
        skills: [
          { skillId: jsSkill.id, requirementType: "REQUIRED", requiredLevel: 60, weight: 1.0 },
          { skillId: reactSkill.id, requirementType: "REQUIRED", requiredLevel: 60, weight: 1.0 },
          { skillId: tsSkill.id, requirementType: "PREFERRED", requiredLevel: 50, weight: 0.5 },
        ]
      },
      {
        title: "Software Engineering Intern (Python & Data)",
        company: "PhonePe",
        description: "Work with engineering teams on analytics pipelines, API integrations, and Python services.",
        location: "Remote",
        experience: "0-1 Years",
        employmentType: "Internship",
        salary: "35k - 50k/month",
        source: "INTERNAL",
        skills: [
          { skillId: pySkill.id, requirementType: "REQUIRED", requiredLevel: 60, weight: 1.0 },
          { skillId: sqlSkill.id, requirementType: "REQUIRED", requiredLevel: 55, weight: 1.0 },
        ]
      },
      {
        title: "Cloud & DevOps Graduate Intern",
        company: "Jio Platforms",
        description: "Hands-on containerization with Docker, CI/CD pipeline automation, and AWS cloud basics.",
        location: "Mumbai",
        experience: "0-1 Years",
        employmentType: "Internship",
        salary: "30k - 40k/month",
        source: "INTERNAL",
        skills: [
          { skillId: dockerSkill.id, requirementType: "REQUIRED", requiredLevel: 55, weight: 1.0 },
          { skillId: awsSkill.id, requirementType: "PREFERRED", requiredLevel: 50, weight: 0.5 },
        ]
      },
      {
        title: "Database Engineering Intern",
        company: "Postman",
        description: "Assist with PostgreSQL query performance profiling, data modeling, and schema migrations.",
        location: "Bangalore",
        experience: "0-1 Years",
        employmentType: "Internship",
        salary: "40k - 50k/month",
        source: "LINKEDIN",
        skills: [
          { skillId: sqlSkill.id, requirementType: "REQUIRED", requiredLevel: 60, weight: 1.0 },
          { skillId: pgSkill.id, requirementType: "PREFERRED", requiredLevel: 55, weight: 0.5 },
        ]
      }
    ];

    for (const jData of seedJobsData) {
      const existing = await prisma.jobPosting.findFirst({ where: { title: jData.title, company: jData.company } });
      if (!existing) {
        await prisma.jobPosting.create({
          data: {
            title: jData.title,
            company: jData.company,
            description: jData.description,
            location: jData.location,
            experience: jData.experience,
            employmentType: jData.employmentType,
            salary: jData.salary,
            source: jData.source,
            skills: {
              create: jData.skills
            }
          }
        });
      }
    }

    jobs = await prisma.jobPosting.findMany({
      where: { status: "OPEN" },
      orderBy: { postedAt: "desc" },
      include: {
        skills: {
          include: { skill: true }
        }
      }
    });

    // 3. Matching Engine
    const studentSkillMap = new Map(
      studentProfile.skillScores.map(score => [
        score.skillId, 
        { 
          skillName: score.skill.name.toLowerCase().trim(),
          score: score.score, 
          verification: score.verification 
        }
      ])
    );

    const matchedOpportunities = jobs.map(job => {
      let totalRequiredWeight = 0;
      let earnedRequiredWeight = 0;
      
      const matchedSkills: any[] = [];
      const partialMatches: any[] = [];
      const missingRequired: any[] = [];
      const missingPreferred: any[] = [];

      job.skills.forEach(req => {
        let studentRecord = studentSkillMap.get(req.skillId);
        if (!studentRecord) {
          const reqName = req.skill.name.toLowerCase().trim();
          for (const [_, val] of studentSkillMap.entries()) {
            if (val.skillName === reqName || reqName.includes(val.skillName) || val.skillName.includes(reqName)) {
              studentRecord = val;
              break;
            }
          }
        }

        const studentScore = studentRecord?.score || 0;
        const verificationSource = studentRecord?.verification || "None";
        const requiredLvl = req.requiredLevel || 0;
        
        if (studentScore >= requiredLvl) {
          matchedSkills.push({ 
            skill: req.skill.name, 
            type: req.requirementType, 
            studentScore: Math.round(studentScore), 
            requiredLvl,
            source: verificationSource 
          });
          if (req.requirementType === "REQUIRED") {
            earnedRequiredWeight += req.weight;
            totalRequiredWeight += req.weight;
          }
        } else if (studentScore > 0) {
          partialMatches.push({ 
            skill: req.skill.name, 
            type: req.requirementType, 
            studentScore: Math.round(studentScore), 
            requiredLvl,
            source: verificationSource
          });
          if (req.requirementType === "REQUIRED") {
            earnedRequiredWeight += (studentScore / requiredLvl) * req.weight;
            totalRequiredWeight += req.weight;
          } else {
            missingPreferred.push({ skill: req.skill.name, requiredLvl });
          }
        } else {
          if (req.requirementType === "REQUIRED") {
            missingRequired.push({ skill: req.skill.name, requiredLvl });
            totalRequiredWeight += req.weight;
          } else {
            missingPreferred.push({ skill: req.skill.name, requiredLvl });
          }
        }
      });

      const baseScore = totalRequiredWeight > 0 ? (earnedRequiredWeight / totalRequiredWeight) * 100 : 100;
      
      let finalScore = baseScore;
      let preferredBonus = 0;
      
      job.skills.filter(r => r.requirementType === "PREFERRED").forEach(pref => {
        let studentRecord = studentSkillMap.get(pref.skillId);
        if (!studentRecord) {
          const prefName = pref.skill.name.toLowerCase().trim();
          for (const [_, val] of studentSkillMap.entries()) {
            if (val.skillName === prefName || prefName.includes(val.skillName)) {
              studentRecord = val;
              break;
            }
          }
        }
        if (studentRecord && studentRecord.score > 0) {
          preferredBonus += 5;
        }
      });
      
      finalScore += preferredBonus;
      if (finalScore > 100) finalScore = 100;

      const matchScore = Math.round(finalScore);

      const scoreBreakdown = {
        baseScore: Math.round(baseScore),
        earnedWeight: earnedRequiredWeight.toFixed(1),
        totalRequiredWeight: totalRequiredWeight.toFixed(1),
        preferredBonus,
        deductions: missingRequired.length * 10
      };

      const actionPlan: { type: string, message: string }[] = [];

      partialMatches.forEach(pm => {
        if (pm.source === "Claimed") {
          actionPlan.push({ type: "VERIFY", message: `Take the ${pm.skill} assessment to prove your proficiency reaches the required level of ${pm.requiredLvl}. (Currently unverified)` });
        } else {
          actionPlan.push({ type: "UPSKILL", message: `Practice advanced ${pm.skill} topics and retake the assessment to raise your score from ${Math.round(pm.studentScore)}% to ${pm.requiredLvl}%.` });
        }
      });

      missingRequired.forEach(mr => {
        actionPlan.push({ type: "LEARN_REQUIRED", message: `Learn ${mr.skill} to meet a core requirement for this role.` });
      });

      missingPreferred.forEach(mp => {
        actionPlan.push({ type: "LEARN_PREFERRED", message: `Optional: Learn ${mp.skill} to earn a +5% bonus to your match score.` });
      });

      const eligibilityStatus = missingRequired.length > 1 ? "Ineligible - Missing Core Requirements" : "Eligible";

      const requiredSkillsList = job.skills.map(s => ({
        name: s.skill.name,
        requiredLevel: s.requiredLevel || 70,
        requirementType: s.requirementType
      }));

      return {
        job: {
          id: job.id,
          title: job.title,
          company: job.company,
          description: job.description,
          location: job.location,
          experience: job.experience,
          employmentType: job.employmentType,
          salary: job.salary,
          source: job.source,
          postedAt: job.postedAt,
          department: job.department,
          workMode: job.workMode,
          responsibilities: job.responsibilities,
          projectTitle: job.projectTitle,
          problemStatement: job.problemStatement,
          deliverables: job.deliverables,
          learningOutcomes: job.learningOutcomes,
          evaluationMethod: job.evaluationMethod,
          eligibleDegrees: job.eligibleDegrees,
          eligibleBranches: job.eligibleBranches,
          graduationYears: job.graduationYears,
          minCgpa: job.minCgpa,
          startDate: job.startDate,
          endDate: job.endDate,
          durationWeeks: job.durationWeeks,
          workingHours: job.workingHours,
          mentorName: job.mentorName,
          mentorDesignation: job.mentorDesignation,
          mentorDepartment: job.mentorDepartment,
          mentorContact: job.mentorContact,
          companyId: job.companyId,
          requiredSkills: requiredSkillsList.map(s => s.name),
          detailedSkillRequirements: requiredSkillsList
        },
        matchResult: {
          matchScore,
          scoreBreakdown,
          eligibilityStatus,
          matchedSkills,
          partialMatches,
          missingRequired,
          missingPreferred,
          actionPlan
        }
      };
    });

    matchedOpportunities.sort((a, b) => {
      // Prioritize high matchScore, then newly posted jobs
      if (b.matchResult.matchScore !== a.matchResult.matchScore) {
        return b.matchResult.matchScore - a.matchResult.matchScore;
      }
      return new Date(b.job.postedAt).getTime() - new Date(a.job.postedAt).getTime();
    });

    return NextResponse.json(matchedOpportunities);

  } catch (error) {
    console.error("Error generating opportunities:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
