import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { cookies } from "next/headers";
import * as jose from "jose";

const prisma = new PrismaClient();
const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || "fallback-secret-key-for-dev");

async function getAuthenticatedStudent() {
  const cookieStore = await cookies();
  const token = cookieStore.get("session")?.value;

  const ensureDevStudent = async () => {
    let firstStudent = await prisma.studentProfile.findFirst({
      include: { user: true }
    });
    if (!firstStudent) {
      const user = await prisma.user.create({
        data: {
          email: "student@demo.com",
          passwordHash: "demo",
          role: "STUDENT",
          studentProfile: { create: { targetRole: "Software Engineer" } }
        },
        include: { studentProfile: true }
      });
      firstStudent = { ...user.studentProfile, user } as any;
    }
    return firstStudent;
  };

  if (!token) {
    return await ensureDevStudent();
  }
  try {
    const { payload } = await jose.jwtVerify(token, JWT_SECRET);
    const student = await prisma.studentProfile.findUnique({
      where: { userId: payload.id as string },
      include: { user: true }
    });
    return student || (await ensureDevStudent());
  } catch (err) {
    return await ensureDevStudent();
  }
}

// Ensure default realistic active internship exists for the student to explore
async function seedDefaultActiveInternship(studentId: string) {
  let active = await prisma.activeInternship.findFirst({
    where: { studentId },
    include: {
      milestones: {
        include: { tasks: true },
        orderBy: { orderIndex: "asc" }
      },
      weeklyUpdates: {
        orderBy: { weekNumber: "desc" }
      },
      mentorFeedbacks: {
        include: { skillEvaluations: true },
        orderBy: { reviewDate: "desc" }
      },
      completionRecord: true
    }
  });

  if (!active) {
    // Find or pick a job
    const job = await prisma.jobPosting.findFirst({
      where: { employmentType: { contains: "Intern" } }
    });

    active = await prisma.activeInternship.create({
      data: {
        studentId,
        jobId: job?.id || null,
        company: job?.company || "XYZ Technologies Inc.",
        roleTitle: job?.title || "Software Development Intern",
        location: job?.location || "Bangalore (Hybrid)",
        stipend: "₹45,000 / month",
        duration: "1 June – 31 July (8 Weeks)",
        overallProgress: 65.0,
        status: "IN_PROGRESS",
        mentorName: "Vikram Rao",
        mentorRole: "Principal Systems Architect",
        mentorEmail: "vikram.rao@xyztech.com",
        milestones: {
          create: [
            {
              title: "Project Setup & Environment",
              description: "Dev environment bootstrap, repo access, CI/CD toolchain",
              percentage: 100.0,
              status: "COMPLETED",
              orderIndex: 0,
              tasks: {
                create: [
                  { title: "Clone monorepo and install Docker dev services", isCompleted: true },
                  { title: "Setup pre-commit hooks and ESLint / Prettier rules", isCompleted: true },
                  { title: "Verify local database migrations and health check", isCompleted: true }
                ]
              }
            },
            {
              title: "Backend API & Services",
              description: "Design REST/tRPC contracts and core data persistence layers",
              percentage: 100.0,
              status: "COMPLETED",
              orderIndex: 1,
              tasks: {
                create: [
                  { title: "Implement CRUD endpoints for candidate profile indexing", isCompleted: true },
                  { title: "Add rate-limiting and JWT request validator middleware", isCompleted: true },
                  { title: "Unit test controller handlers with mock repository fixtures", isCompleted: true }
                ]
              }
            },
            {
              title: "Authentication & Authorization",
              description: "Role-based access controls and token renewal system",
              percentage: 60.0,
              status: "IN_PROGRESS",
              orderIndex: 2,
              tasks: {
                create: [
                  { title: "Implement refresh token rotation in Redis", isCompleted: true },
                  { title: "Multi-tenant permission guards for institution admins", isCompleted: true },
                  { title: "OAuth 2.0 Google / GitHub integration flow", isCompleted: false, dueDate: "End of Week 6" }
                ]
              }
            },
            {
              title: "Testing, Load & Security Audit",
              description: "End-to-end regression suite, vulnerability scan and load testing",
              percentage: 0.0,
              status: "PENDING",
              orderIndex: 3,
              tasks: {
                create: [
                  { title: "K6 load test pipeline to 1,000 req/sec threshold", isCompleted: false, dueDate: "Week 7" },
                  { title: "OWASP Top 10 security audit and dependency remediation", isCompleted: false, dueDate: "Week 8" },
                  { title: "Production readiness documentation & runbook handoff", isCompleted: false, dueDate: "Week 8" }
                ]
              }
            }
          ]
        },
        weeklyUpdates: {
          create: [
            {
              weekNumber: 4,
              weekTitle: "Week 4: Redis Token Rotation & Session Invalidation",
              summary: "Completed redis-backed token blocklist and verified session expiration behavior under network disconnects.",
              submittedWorkUrl: "https://github.com/xyztech/core-platform/pull/189",
              blockers: "Minor latency spikes on Redis cluster failover during local smoke tests."
            },
            {
              weekNumber: 3,
              weekTitle: "Week 3: Backend API Pipeline Optimization",
              summary: "Wrapped up candidate indexing query optimizations. Reduced average response time from 320ms to 42ms.",
              submittedWorkUrl: "https://github.com/xyztech/core-platform/pull/162",
              blockers: "None. All PR reviews approved and merged."
            },
            {
              weekNumber: 2,
              weekTitle: "Week 2: Data Validation & Database Migrations",
              summary: "Authored Zod schema validation layers and applied incremental schema migrations for audit trails.",
              submittedWorkUrl: "https://github.com/xyztech/core-platform/pull/134",
              blockers: "None."
            },
            {
              weekNumber: 1,
              weekTitle: "Week 1: Onboarding & Development Setup",
              summary: "Completed onboarding modules, configured local WSL2 environment, and got first PR merged for linting configs.",
              submittedWorkUrl: "https://github.com/xyztech/core-platform/pull/101",
              blockers: "Initial corporate VPN routing latency resolved by DevOps."
            }
          ]
        },
        mentorFeedbacks: {
          create: [
            {
              mentorName: "Vikram Rao",
              mentorRole: "Principal Systems Architect",
              generalFeedback: "Arjun has demonstrated solid foundational software engineering principles. His code structure in the backend API milestone is clean, idiomatic, and adheres to our internal performance benchmarks.",
              strengths: JSON.stringify([
                "Excellent API architectural clarity and edge-case handling",
                "Proactive communicator in daily standups and sprint planning",
                "Strong grasp of async concurrency patterns and database indexes"
              ]),
              improvementAreas: JSON.stringify([
                "Deepen test coverage around boundary conditions in Redis failovers",
                "Explore automated integration testing fixtures before sending PRs to review"
              ]),
              skillEvaluations: {
                create: [
                  { skillName: "Javascript", proficiencyLevel: "Proficient", scoreImpact: 88.0 },
                  { skillName: "Node.js", proficiencyLevel: "Proficient", scoreImpact: 90.0 },
                  { skillName: "React JS", proficiencyLevel: "Developing", scoreImpact: 76.0 },
                  { skillName: "Database Development", proficiencyLevel: "Proficient", scoreImpact: 86.0 }
                ]
              }
            }
          ]
        }
      },
      include: {
        milestones: {
          include: { tasks: true },
          orderBy: { orderIndex: "asc" }
        },
        weeklyUpdates: {
          orderBy: { weekNumber: "desc" }
        },
        mentorFeedbacks: {
          include: { skillEvaluations: true },
          orderBy: { reviewDate: "desc" }
        },
        completionRecord: true
      }
    });

    // Also ensure skill scores are updated/seeded with mentor verification
    await syncMentorSkillsToProfile(studentId, [
      { skillName: "Javascript", score: 88.0 },
      { skillName: "Node.js", score: 90.0 },
      { skillName: "React JS", score: 76.0 }
    ]);
  }

  return active;
}

// Helper to sync mentor evaluated skills into the student's SkillScore table as Verified
async function syncMentorSkillsToProfile(studentId: string, skills: { skillName: string, score: number }[]) {
  for (const item of skills) {
    try {
      let skill = await prisma.skill.findFirst({
        where: { name: { equals: item.skillName } }
      });
      if (!skill) {
        let category = await prisma.skillCategory.findFirst();
        if (!category) {
          category = await prisma.skillCategory.create({ data: { name: "Technical Skills" } });
        }
        skill = await prisma.skill.create({
          data: { name: item.skillName, categoryId: category.id }
        });
      }

      await prisma.skillScore.upsert({
        where: {
          studentId_skillId: {
            studentId,
            skillId: skill.id
          }
        },
        update: {
          score: item.score,
          status: "Assessed",
          verification: "Internship Mentor Verified",
          assessedAt: new Date()
        },
        create: {
          studentId,
          skillId: skill.id,
          score: item.score,
          coverage: 95.0,
          status: "Assessed",
          verification: "Internship Mentor Verified"
        }
      });
    } catch (err) {
      console.error("Skill sync error:", err);
    }
  }
}

// GET /api/internships/active - Fetch active internship details
export async function GET(request: Request) {
  try {
    const student = await getAuthenticatedStudent();
    if (!student) {
      return NextResponse.json({ error: "Student not found" }, { status: 404 });
    }

    const activeInternship = await seedDefaultActiveInternship(student.id);

    return NextResponse.json({
      success: true,
      internship: activeInternship
    });
  } catch (error: any) {
    console.error("GET active internship error:", error);
    return NextResponse.json({ error: error.message || "Failed to retrieve internship" }, { status: 500 });
  }
}
