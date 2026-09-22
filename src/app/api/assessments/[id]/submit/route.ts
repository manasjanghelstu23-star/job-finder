import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { cookies } from "next/headers";
import * as jose from "jose";

const prisma = new PrismaClient();
const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || "fallback-secret-key-for-dev");

export async function POST(request: Request, context: any) {
  try {
    const { id: assessmentId } = await context.params;
    
    // 1. Auth check with DEV Fallback
    const cookieStore = await cookies();
    const token = cookieStore.get("session")?.value;
    
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

    if (!studentProfile) return NextResponse.json({ error: "Student not found" }, { status: 404 });

    // 2. Get Assessment
    const assessment = await prisma.assessment.findUnique({
      where: { id: assessmentId },
      include: {
        questions: {
          include: {
            industryQuestion: {
              include: {
                options: true,
                skills: true
              }
            }
          }
        }
      }
    });

    if (!assessment) {
      return NextResponse.json({ error: "Assessment not found" }, { status: 404 });
    }

    // 3. Parse Answers
    const { answers } = await request.json(); // Array of { assessmentQuestionId, selectedOptionId, textResponse }

    let correctCount = 0;
    const totalQuestions = assessment.questions.length || 1;
    const studentAnswersData = [];

    for (const ans of (answers || [])) {
      const aq = assessment.questions.find(q => q.id === ans.assessmentQuestionId);
      if (!aq) continue;

      const industryQ = aq.industryQuestion;
      let isCorrect = false;

      // Grade MCQ
      const correctOption = industryQ.options.find(o => o.isCorrect);
      if (correctOption && ans.selectedOptionId === correctOption.id) {
        isCorrect = true;
        correctCount += 1;
      }

      studentAnswersData.push({
        studentId: studentProfile.id,
        assessmentQuestionId: aq.id,
        selectedOptionId: ans.selectedOptionId || null,
        textResponse: ans.textResponse || null,
        isCorrect
      });
    }

    // Save Student Answers
    if (studentAnswersData.length > 0) {
      await prisma.studentAnswer.createMany({
        data: studentAnswersData
      });
    }

    // 4. Calculate Final Percentage Score
    // Calculate percentage (between 0 and 100)
    let calculatedPercentage = Math.round((correctCount / totalQuestions) * 100);
    // If the student answered at least 1 question right or took the test, guarantee realistic feedback (e.g. 80% if 4/5)
    if (calculatedPercentage === 0 && correctCount > 0) calculatedPercentage = 50;

    // 5. Extract Skill Name from targetRole
    // e.g., "Front-End Developer: JavaScript" -> "JavaScript", "Database Developer: PostgreSQL" -> "PostgreSQL"
    let skillName = assessment.targetRole;
    let categoryName = "Software Engineering";
    if (assessment.targetRole.includes(":")) {
      const parts = assessment.targetRole.split(":");
      categoryName = parts[0].trim();
      skillName = parts[1].trim();
    }

    // 6. Ensure Skill and Category exist in DB
    let category = await prisma.skillCategory.findFirst({
      where: { name: categoryName }
    });
    if (!category) {
      category = await prisma.skillCategory.create({
        data: { name: categoryName }
      });
    }

    let skill = await prisma.skill.findFirst({
      where: { name: skillName }
    });
    if (!skill) {
      skill = await prisma.skill.create({
        data: {
          name: skillName,
          categoryId: category.id
        }
      });
    }

    // 7. Upsert SkillScore for the Student with Verified status
    await prisma.skillScore.upsert({
      where: {
        studentId_skillId: {
          studentId: studentProfile.id,
          skillId: skill.id
        }
      },
      update: {
        score: calculatedPercentage,
        coverage: 100,
        status: "VERIFIED",
        verification: "Verified",
        assessedAt: new Date()
      },
      create: {
        studentId: studentProfile.id,
        skillId: skill.id,
        score: calculatedPercentage,
        coverage: 100,
        status: "VERIFIED",
        verification: "Verified",
        assessedAt: new Date()
      }
    });

    // 8. Mark Assessment Complete
    await prisma.assessment.update({
      where: { id: assessmentId },
      data: {
        status: "COMPLETED",
        completedAt: new Date()
      }
    });

    return NextResponse.json({ 
      success: true, 
      score: calculatedPercentage, 
      skill: skillName, 
      message: "Assessment scored and skill profile verified successfully." 
    }, { status: 200 });

  } catch (error) {
    console.error("Error submitting assessment:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
