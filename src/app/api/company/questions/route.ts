import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const questions = await prisma.industryQuestion.findMany({
      include: {
        skills: {
          include: { skill: true }
        },
        options: true,
        industry: {
          select: { companyName: true }
        }
      },
      orderBy: { createdAt: "desc" }
    });

    return NextResponse.json({ questions });
  } catch (error: any) {
    console.error("Error fetching company skill questions:", error);
    return NextResponse.json({ error: "Failed to fetch questions" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { text, type, difficulty, evaluationMethod, status = "PUBLISHED", options = [], skills = [] } = body;

    if (!text) {
      return NextResponse.json({ error: "Question text is required" }, { status: 400 });
    }

    // Ensure at least one industry profile exists to anchor the question
    let industry = await prisma.industryProfile.findFirst();
    if (!industry) {
      let user = await prisma.user.findFirst({ where: { role: "COMPANY" } });
      if (!user) {
        user = await prisma.user.create({
          data: {
            email: "recruiter@infosys.labs",
            passwordHash: "demo",
            role: "COMPANY"
          }
        });
      }
      industry = await prisma.industryProfile.create({
        data: {
          userId: user.id,
          companyName: "Infosys Labs",
          verificationStatus: "VERIFIED"
        }
      });
    }

    // Create the question with options and canonical skills
    const createdQuestion = await prisma.industryQuestion.create({
      data: {
        industryId: industry.id,
        text,
        type: type || "MCQ",
        difficulty: difficulty || "Intermediate",
        evaluationMethod: evaluationMethod || "Automated test grading and skill score computation",
        status,
        options: {
          create: options.map((opt: any) => ({
            text: opt.text,
            isCorrect: Boolean(opt.isCorrect),
            weight: opt.weight ? parseFloat(opt.weight) : 1.0
          }))
        }
      }
    });

    // Map to canonical skills taxonomy
    if (Array.isArray(skills) && skills.length > 0) {
      for (const sk of skills) {
        let skillId = sk.skillId;
        if (!skillId && sk.skillName) {
          const found = await prisma.skill.findFirst({ where: { name: sk.skillName } });
          if (found) skillId = found.id;
        }

        if (skillId) {
          await prisma.questionSkill.create({
            data: {
              questionId: createdQuestion.id,
              skillId,
              weight: sk.weight ? parseFloat(sk.weight) : 1.0
            }
          });
        }
      }
    }

    const fullQuestion = await prisma.industryQuestion.findUnique({
      where: { id: createdQuestion.id },
      include: {
        skills: { include: { skill: true } },
        options: true
      }
    });

    return NextResponse.json({
      success: true,
      message: "Skill question published into canonical taxonomy",
      question: fullQuestion
    }, { status: 201 });

  } catch (error: any) {
    console.error("Error creating company skill question:", error);
    return NextResponse.json({ error: "Failed to create question" }, { status: 500 });
  }
}
