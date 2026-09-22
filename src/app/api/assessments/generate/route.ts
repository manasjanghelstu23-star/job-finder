import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { cookies } from "next/headers";
import * as jose from "jose";

const prisma = new PrismaClient();
const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || "fallback-secret-key-for-dev");

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("session")?.value;

    // DEV Fallback for student
    const ensureDevStudent = async () => {
      let firstStudent = await prisma.studentProfile.findFirst();
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
          where: { userId: payload.id as string }
        });
        if (!studentProfile) studentProfile = await ensureDevStudent();
      } catch (err) {
        studentProfile = await ensureDevStudent();
      }
    }

    if (!studentProfile) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2. Parse request for targetRole
    const { targetRole } = await request.json();
    if (!targetRole) {
      return NextResponse.json({ error: "Target role is required" }, { status: 400 });
    }

    // 3. Fetch published questions or generate tailored questions for this skill
    let availableQuestions = await prisma.industryQuestion.findMany({
      where: { status: "PUBLISHED" },
      include: {
        options: {
          select: { id: true, text: true }
        }
      },
      take: 10
    });

    // If no published questions exist yet, create default tailored questions for this skill
    if (availableQuestions.length === 0) {
      const defaultQuestionsData = [
        {
          text: `Which core principle is most critical when designing high-performance architectures in ${targetRole}?`,
          options: ["Separation of Concerns and Modularity", "Tight Coupling of Modules", "Single-threaded Global State", "Synchronous Blocking I/O"]
        },
        {
          text: `In ${targetRole}, how do you effectively handle asynchronous concurrency and error propagation?`,
          options: ["Using Promises / Async-Await with structured try-catch", "Ignoring unhandled rejections", "Relying on synchronous loops", "Suppressing all runtime exceptions"]
        },
        {
          text: `What is the optimal caching and state management strategy when scaling ${targetRole} systems?`,
          options: ["Distributed in-memory caching (e.g. Redis) with TTL", "Storing all state in local browser memory", "Re-querying cold database on every request", "Hardcoding static variables"]
        },
        {
          text: `Which testing methodology provides the highest reliability before deploying ${targetRole} into production?`,
          options: ["Automated Unit, Integration, and End-to-End Test Suites", "Manual testing only on production", "Relying purely on user bug reports", "Skipping regression testing"]
        },
        {
          text: `When securing APIs and endpoints in ${targetRole}, what is the industry best practice?`,
          options: ["JWT/OAuth2 token verification with HTTPS and CORS limits", "Embedding plain text API keys in client code", "Allowing all HTTP methods without authentication", "Disabling input sanitization"]
        }
      ];

      // Ensure an industry profile exists to associate questions with
      let industryProfile = await prisma.industryProfile.findFirst();
      if (!industryProfile) {
        const indUser = await prisma.user.create({
          data: {
            email: `industry_${Date.now()}@demo.com`,
            passwordHash: "demo",
            role: "INDUSTRY",
            industryProfile: {
              create: {
                companyName: "Tech Industry Standards Group"
              }
            }
          },
          include: { industryProfile: true }
        });
        industryProfile = indUser.industryProfile;
      }

      for (const qData of defaultQuestionsData) {
        await prisma.industryQuestion.create({
          data: {
            industryId: industryProfile!.id,
            text: qData.text,
            type: "MCQ",
            difficulty: "Intermediate",
            status: "PUBLISHED",
            options: {
              create: qData.options.map((optText, index) => ({
                text: optText,
                isCorrect: index === 0,
                weight: 1.0
              }))
            }
          }
        });
      }

      availableQuestions = await prisma.industryQuestion.findMany({
        where: { status: "PUBLISHED" },
        include: {
          options: {
            select: { id: true, text: true }
          }
        },
        take: 10
      });
    }

    // 4. Create the Assessment
    const assessment = await prisma.assessment.create({
      data: {
        studentId: studentProfile.id,
        targetRole,
        questions: {
          create: availableQuestions.map((q, index) => ({
            industryQuestionId: q.id,
            order: index + 1
          }))
        }
      },
      include: {
        questions: {
          include: {
            industryQuestion: {
              include: {
                options: {
                  select: { id: true, text: true } // Return options without answers
                }
              }
            }
          }
        }
      }
    });

    return NextResponse.json(assessment, { status: 201 });

  } catch (error) {
    console.error("Error generating assessment:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
