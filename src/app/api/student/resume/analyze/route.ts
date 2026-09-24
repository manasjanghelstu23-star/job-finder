import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import * as jose from "jose";
import { ResumeParser } from "@/lib/resumeParser/sectionExtractor";
import { ResumeAlignmentEngine } from "@/lib/resumeParser/alignmentEngine";
import { TARGET_ROLES } from "@/lib/resumeParser/normalizationDictionary";
import { SAMPLE_RESUMES } from "@/lib/resumeParser/sampleResumes";
import { findUserById, MOCK_RESUMES, MOCK_STUDENTS } from "@/lib/mock-db";

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || "fallback-secret-key-for-dev");

async function getStudentId() {
  const cookieStore = await cookies();
  const token = cookieStore.get("session")?.value;

  if (!token) return MOCK_STUDENTS[0].id;
  
  try {
    const { payload } = await jose.jwtVerify(token, JWT_SECRET);
    const user = findUserById(payload.id as string);
    return user?.studentProfile?.id || MOCK_STUDENTS[0].id;
  } catch (err) {
    return MOCK_STUDENTS[0].id;
  }
}

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
      rawText = SAMPLE_RESUMES[sampleKey].rawText;
    } else if (customText && customText.trim().length > 40) {
      rawText = customText.trim();
    } else if (resumeId) {
      resumeRecord = MOCK_RESUMES.find(r => r.id === resumeId);
      if (!resumeRecord) {
        return NextResponse.json({ error: "Resume record not found" }, { status: 404 });
      }
      rawText = resumeRecord.extractedText || SAMPLE_RESUMES["backend-java"].rawText;
    } else {
      rawText = SAMPLE_RESUMES["backend-java"].rawText;
    }

    const structuredData = ResumeParser.extractStructuredData(rawText);

    const student = MOCK_STUDENTS.find(s => s.id === studentId) || MOCK_STUDENTS[0];
    const studentScores = student.skillScores || [];

    const formattedScores = studentScores.map((s: any) => ({
      skillName: s.skill?.name || "Skill",
      score: s.score,
      verification: s.verification
    }));

    const analysisReport = ResumeAlignmentEngine.analyze(
      structuredData,
      targetRoleId,
      formattedScores
    );

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
