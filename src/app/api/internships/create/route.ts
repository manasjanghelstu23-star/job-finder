import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const session = await getSession();
    const body = await request.json();

    const {
      // Step 1: Basic Info
      title,
      department,
      industry,
      location,
      workMode,
      description,
      salary,
      
      // Step 2: Role
      responsibilities,

      // Step 3: Canonical Skills
      // skills: Array<{ skillId: string, skillName: string, requirementType: "REQUIRED" | "PREFERRED", requiredLevel: number, weight: number }>
      skills,

      // Step 4: Non-Skill Eligibility
      eligibleDegrees,
      eligibleBranches,
      graduationYears,
      minCgpa,
      experience,

      // Step 5: Project / Work
      projectTitle,
      problemStatement,
      deliverables,
      learningOutcomes,
      evaluationMethod,

      // Step 6: Duration & Mentor
      startDate,
      endDate,
      durationWeeks,
      workingHours,
      mentorName,
      mentorDesignation,
      mentorDepartment,
      mentorContact,

      // Step 7: Publishing status
      status = "OPEN",

      // Simulation bypass flag for frontend test role switcher
      simulateRole
    } = body;

    if (!title || !description) {
      return NextResponse.json({ error: "Internship title and description are required" }, { status: 400 });
    }

    // =========================================================================
    // PHASE 1 — COMPANY VERIFICATION ENFORCEMENT
    // "if company.verification_status != VERIFIED -> reject internship creation"
    // "Students cannot bypass this."
    // =========================================================================
    let verifiedCompany = null;

    if (simulateRole === "COMPANY_UNVERIFIED") {
      return NextResponse.json({
        error: "Forbidden: Your company verification status is PENDING. Only VERIFIED companies can create and publish internships. Please await admin review or verify company documents.",
        code: "COMPANY_NOT_VERIFIED"
      }, { status: 403 });
    }

    if (simulateRole === "STUDENT") {
      return NextResponse.json({
        error: "Forbidden: Students are not authorized to post internships. You must be registered as a VERIFIED Company or Institute.",
        code: "ROLE_NOT_AUTHORIZED"
      }, { status: 403 });
    }

    if (session) {
      // Check user role
      if (session.role !== "COMPANY" && session.role !== "INSTITUTE" && session.role !== "ADMIN") {
        return NextResponse.json({
          error: "Forbidden: Only users registered as COMPANY or INSTITUTE can post internships.",
          code: "ROLE_NOT_AUTHORIZED"
        }, { status: 403 });
      }

      // Check verificationStatus in Company table
      const company = await prisma.company.findUnique({
        where: { userId: session.id }
      });

      if (!company) {
        // If logged in as admin or company without company profile, check industry profile or auto-create verified company
        if (session.role === "ADMIN") {
          verifiedCompany = await prisma.company.create({
            data: {
              userId: session.id,
              companyName: "Admin Verified Organization",
              verificationStatus: "VERIFIED",
              verifiedAt: new Date()
            }
          });
        } else {
          return NextResponse.json({
            error: "Company profile not found. Please complete your company registration and verification first.",
            code: "NO_COMPANY_PROFILE"
          }, { status: 403 });
        }
      } else {
        if (company.verificationStatus !== "VERIFIED") {
          return NextResponse.json({
            error: `Company status is ${company.verificationStatus}. Only VERIFIED organizations can publish internships. Students and unverified entities cannot bypass this.`,
            code: "COMPANY_NOT_VERIFIED"
          }, { status: 403 });
        }
        verifiedCompany = company;
      }
    } else {
      // Simulation / dev environment fallback if no cookie is set
      if (simulateRole === "COMPANY_VERIFIED") {
        // Find or create test verified company
        let demoCompany = await prisma.company.findFirst({
          where: { verificationStatus: "VERIFIED" }
        });
        if (!demoCompany) {
          // Find or create a demo company user
          let compUser = await prisma.user.findFirst({ where: { role: "COMPANY" } });
          if (!compUser) {
            compUser = await prisma.user.create({
              data: {
                email: "recruiter@infosys.demo",
                passwordHash: "demo",
                role: "COMPANY",
                isVerified: true
              }
            });
          }
          demoCompany = await prisma.company.create({
            data: {
              userId: compUser.id,
              companyName: "Infosys Labs",
              industry: "Enterprise AI & Cloud",
              verificationStatus: "VERIFIED",
              verifiedAt: new Date()
            }
          });
        }
        verifiedCompany = demoCompany;
      } else {
        return NextResponse.json({
          error: "Unauthorized: Please log in as a VERIFIED company or institute to post internships.",
          code: "UNAUTHENTICATED"
        }, { status: 401 });
      }
    }

    // =========================================================================
    // CREATING THE STRUCTURED INTERNSHIP POSTING
    // =========================================================================
    const newJob = await prisma.jobPosting.create({
      data: {
        title,
        company: verifiedCompany?.companyName || body.companyName || "Verified Organization",
        description,
        location: location || "Bangalore, India (Hybrid)",
        experience: experience || "0-1 Years / Students",
        employmentType: "Internship",
        salary: salary || "₹35,000 - ₹50,000 / month",
        source: "INTERNAL",
        status: status === "DRAFT" ? "DRAFT" : "OPEN",
        companyId: verifiedCompany?.id,
        
        // Structured metadata
        department: department || "Engineering",
        workMode: workMode || "In-Office",
        responsibilities: typeof responsibilities === "string" ? responsibilities : JSON.stringify(responsibilities || []),
        projectTitle: projectTitle || title,
        problemStatement: problemStatement || "",
        deliverables: typeof deliverables === "string" ? deliverables : JSON.stringify(deliverables || []),
        learningOutcomes: typeof learningOutcomes === "string" ? learningOutcomes : JSON.stringify(learningOutcomes || []),
        evaluationMethod: evaluationMethod || "Bi-weekly milestone evaluations and final architecture presentation.",
        
        // Non-skill eligibility
        eligibleDegrees: Array.isArray(eligibleDegrees) ? eligibleDegrees.join(", ") : (eligibleDegrees || "B.Tech, B.E., M.Tech, MCA"),
        eligibleBranches: Array.isArray(eligibleBranches) ? eligibleBranches.join(", ") : (eligibleBranches || "Computer Science, IT, ECE"),
        graduationYears: Array.isArray(graduationYears) ? graduationYears.join(", ") : (graduationYears || "2025, 2026, 2027"),
        minCgpa: minCgpa ? parseFloat(minCgpa) : 7.0,

        // Duration & Mentor
        startDate: startDate || "2026-06-01",
        endDate: endDate || "2026-07-31",
        durationWeeks: durationWeeks ? parseInt(durationWeeks) : 8,
        workingHours: workingHours || "40 hrs/week",
        mentorName: mentorName || "Senior Engineering Mentor",
        mentorDesignation: mentorDesignation || "Tech Lead",
        mentorDepartment: mentorDepartment || (department || "Engineering"),
        mentorContact: mentorContact || "mentor@company.com"
      }
    });

    // Save Canonical Skill Requirements
    if (Array.isArray(skills) && skills.length > 0) {
      for (const sk of skills) {
        // If skillId exists in db, link it. If not, resolve or create
        let targetSkillId: string | null = null;
        if (sk.skillId) {
          const existingById = await prisma.skill.findUnique({ where: { id: sk.skillId } });
          if (existingById) {
            targetSkillId = existingById.id;
          }
        }
        if (!targetSkillId && sk.skillName) {
          let foundSkill = await prisma.skill.findFirst({ where: { name: sk.skillName } });
          if (!foundSkill) {
            let defCat = await prisma.skillCategory.findFirst();
            if (!defCat) defCat = await prisma.skillCategory.create({ data: { name: "Engineering" } });
            foundSkill = await prisma.skill.create({
              data: { name: sk.skillName, categoryId: defCat.id }
            });
          }
          targetSkillId = foundSkill.id;
        }

        if (targetSkillId) {
          await prisma.jobSkillRequirement.upsert({
            where: {
              jobId_skillId: {
                jobId: newJob.id,
                skillId: targetSkillId
              }
            },
            update: {
              requirementType: sk.requirementType || "REQUIRED",
              requiredLevel: sk.requiredLevel ? parseFloat(sk.requiredLevel) : 70.0,
              weight: sk.weight ? parseFloat(sk.weight) : 1.0
            },
            create: {
              jobId: newJob.id,
              skillId: targetSkillId,
              requirementType: sk.requirementType || "REQUIRED",
              requiredLevel: sk.requiredLevel ? parseFloat(sk.requiredLevel) : 70.0,
              weight: sk.weight ? parseFloat(sk.weight) : 1.0
            }
          });
        }
      }
    }

    // Retrieve full created job with skills
    const createdJobWithSkills = await prisma.jobPosting.findUnique({
      where: { id: newJob.id },
      include: {
        skills: {
          include: { skill: true }
        },
        companyProfile: true
      }
    });

    return NextResponse.json({
      success: true,
      message: "Internship created and published successfully by verified company.",
      internship: createdJobWithSkills
    }, { status: 201 });

  } catch (error: any) {
    console.error("Error creating internship:", error);
    return NextResponse.json({ error: error.message || "Failed to create internship" }, { status: 500 });
  }
}
