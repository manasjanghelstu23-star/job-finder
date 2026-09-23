import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { cookies } from "next/headers";
import * as jose from "jose";
import { ResumeParser } from "@/lib/resumeParser/sectionExtractor";
import { ResumeAlignmentEngine } from "@/lib/resumeParser/alignmentEngine";
import { TARGET_ROLES } from "@/lib/resumeParser/normalizationDictionary";
import { SAMPLE_RESUMES } from "@/lib/resumeParser/sampleResumes";

const prisma = new PrismaClient();
const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || "fallback-secret-key-for-dev");

async function getStudentId() {
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
    return firstStudent?.id || null;
  };

  if (!token) return await ensureDevStudent();
  
  try {
    const { payload } = await jose.jwtVerify(token, JWT_SECRET);
    const student = await prisma.studentProfile.findUnique({
      where: { userId: payload.id as string }
    });
    return student?.id || await ensureDevStudent();
  } catch (err) {
    return await ensureDevStudent();
  }
}

// GET: Return available Target Roles & Sample Resumes for frontend dropdowns
export async function GET() {
  try {
    return NextResponse.json({
      targetRoles: TARGET_ROLES.map(r => ({
        id: r.id,
        title: r.title,
        department: r.department,
        experienceLevel: r.experienceLevel,
        description: r.description
      })),
      sampleResumes: Object.values(SAMPLE_RESUMES).map(s => ({
        id: s.id,
        name: s.name,
        roleTarget: s.roleTarget,
        filename: s.filename
      }))
    });
  } catch (error) {
    console.error("GET Resume Analyze Error:", error);
    return NextResponse.json({ error: "Failed to load analyzer metadata" }, { status: 500 });
  }
}

// POST: Analyze resume against a target role
export async function POST(request: Request) {
  try {
    const studentId = await getStudentId();
    if (!studentId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { resumeId, targetRoleId = "backend-dev", sampleKey, customText } = body;

    let rawText = "";
    let resumeRecord: any = null;

    if (sampleKey && SAMPLE_RESUMES[sampleKey]) {
      // 1. Use pre-packaged sample resume
      rawText = SAMPLE_RESUMES[sampleKey].rawText;
    } else if (customText && customText.trim().length > 40) {
      // 2. Use user-provided raw text
      rawText = customText.trim();
    } else if (resumeId) {
      // 3. Fetch from DB
      resumeRecord = await prisma.resume.findUnique({
        where: { id: resumeId },
        include: { skillEvidences: { include: { skill: true } } }
      });

      if (!resumeRecord) {
        return NextResponse.json({ error: "Resume record not found" }, { status: 404 });
      }

      if (resumeRecord.extractedText) {
        rawText = resumeRecord.extractedText;
      } else {
        return NextResponse.json({ 
          error: "Resume text has not been extracted yet. Please run extraction first." 
        }, { status: 400 });
      }
    } else {
      // Default to sample backend java resume if none provided
      rawText = SAMPLE_RESUMES["backend-java"].rawText;
    }

    // Parse structured data from raw text
    const structuredData = ResumeParser.extractStructuredData(rawText);

    // Fetch existing student verified skill scores for context
    const studentScores = await prisma.skillScore.findMany({
      where: { studentId },
      include: { skill: true }
    });

    const formattedScores = studentScores.map(s => ({
      skillName: s.skill.name,
      score: s.score,
      verification: s.verification
    }));

    // Run the ATS Alignment Engine
    const analysisReport = ResumeAlignmentEngine.analyze(
      structuredData,
      targetRoleId,
      formattedScores
    );

    // If attached to a real database resume, persist the latest analysis inside structuredData
    if (resumeRecord) {
      await prisma.resume.update({
        where: { id: resumeRecord.id },
        data: {
          structuredData: JSON.stringify({
            ...structuredData,
            latestAnalysis: analysisReport
          }),
          analysisStatus: "COMPLETED"
        }
      });
    }

    return NextResponse.json({
      success: true,
      analysis: analysisReport,
      structuredData,
      targetRoles: TARGET_ROLES.map(r => ({
        id: r.id,
        title: r.title,
        department: r.department,
        experienceLevel: r.experienceLevel
      }))
    });

  } catch (error: any) {
    console.error("Resume Analysis Error:", error);
    return NextResponse.json({
      error: "Failed to analyze resume",
      details: error.message
    }, { status: 500 });
  }
}
