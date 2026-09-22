import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { cookies } from "next/headers";
import * as jose from "jose";

const prisma = new PrismaClient();
const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || "fallback-secret-key-for-dev");

export async function POST(request: Request) {
  try {
    // 1. Authenticate the Industry User
    const cookieStore = await cookies();
    const token = cookieStore.get("session")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let payload;
    try {
      const verified = await jose.jwtVerify(token, JWT_SECRET);
      payload = verified.payload;
    } catch (err) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    if (payload.role !== "COMPANY" && payload.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden: Only industry accounts can create questions" }, { status: 403 });
    }

    // Find the associated IndustryProfile for this user
    let industryProfile = await prisma.industryProfile.findUnique({
      where: { userId: payload.id as string }
    });

    // For development/testing: automatically create an IndustryProfile if it doesn't exist
    if (!industryProfile) {
      industryProfile = await prisma.industryProfile.create({
        data: {
          userId: payload.id as string,
          companyName: "Demo Company"
        }
      });
    }

    // 2. Parse the request body
    const data = await request.json();
    const { text, type, difficulty, evaluationMethod, status, options, skills } = data;

    if (!text || !type || !difficulty || !skills || skills.length === 0) {
      return NextResponse.json({ error: "Missing required fields or skills" }, { status: 400 });
    }

    // 3. Save to database using a transaction to ensure all parts save correctly
    const newQuestion = await prisma.industryQuestion.create({
      data: {
        industryId: industryProfile.id,
        text,
        type,
        difficulty,
        evaluationMethod,
        status,
        // Create the options inline
        options: {
          create: options.map((opt: any) => ({
            text: opt.text,
            isCorrect: opt.isCorrect,
            weight: opt.isCorrect ? 1.0 : 0.0 // Default correct options to 1.0 weight
          }))
        },
        // Create the skill mappings inline
        skills: {
          create: skills.map((skill: any) => ({
            skillId: skill.skillId,
            weight: skill.weight // E.g., 40 for 40%
          }))
        }
      },
      include: {
        options: true,
        skills: true
      }
    });

    return NextResponse.json({ message: "Question created successfully", question: newQuestion }, { status: 201 });
  } catch (error) {
    console.error("Error creating question:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("session")?.value;

    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { payload } = await jose.jwtVerify(token, JWT_SECRET);
    
    const industryProfile = await prisma.industryProfile.findUnique({
      where: { userId: payload.id as string }
    });

    if (!industryProfile) return NextResponse.json({ error: "Industry profile not found" }, { status: 404 });

    const questions = await prisma.industryQuestion.findMany({
      where: { industryId: industryProfile.id },
      include: {
        options: true,
        skills: {
          include: {
            skill: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json(questions);
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
