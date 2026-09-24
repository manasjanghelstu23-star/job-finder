import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { cookies } from "next/headers";
import * as jose from "jose";
import { readFile } from "fs/promises";
if (typeof (globalThis as any).DOMMatrix === "undefined") {
  (globalThis as any).DOMMatrix = class DOMMatrix {};
}
if (typeof (globalThis as any).ImageData === "undefined") {
  (globalThis as any).ImageData = class ImageData {};
}
if (typeof (globalThis as any).Path2D === "undefined") {
  (globalThis as any).Path2D = class Path2D {};
}

export const dynamic = "force-dynamic";

let pdfParserFn: any = null;
async function parsePdf(buffer: Buffer) {
  if (!pdfParserFn) {
    pdfParserFn = require("pdf-parse");
  }
  return await pdfParserFn(buffer);
}

import { ResumeParser } from "@/lib/resumeParser/sectionExtractor";
import { SkillMatcher } from "@/lib/resumeParser/skillMatcher";
import { ProfileMerger } from "@/lib/resumeParser/profileMerger";

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

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const studentId = await getStudentId();
    if (!studentId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id: resumeId } = await params;

    // 1. Verify ownership and check status
    const resume = await prisma.resume.findUnique({
      where: { id: resumeId }
    });

    if (!resume) {
      return NextResponse.json({ error: "Resume not found" }, { status: 404 });
    }

    if (resume.studentId !== studentId) {
      return NextResponse.json({ error: "Unauthorized access to this resume" }, { status: 403 });
    }

    // 2. Idempotency Check: Don't process if already processing or completed
    if (resume.analysisStatus === "PROCESSING" || resume.analysisStatus === "COMPLETED") {
      return NextResponse.json({ 
        message: "Extraction is already completed or currently processing.", 
        status: resume.analysisStatus 
      });
    }

    // 3. Update status to PROCESSING
    await prisma.resume.update({
      where: { id: resumeId },
      data: { analysisStatus: "PROCESSING" }
    });

    try {
      // 4. Read file and extract text (Phase 2)
      const dataBuffer = await readFile(resume.storageReference);
      const data = await parsePdf(dataBuffer);
      
      const cleanText = data.text
        .replace(/\u0000/g, '')      
        .replace(/\r\n/g, '\n')      
        .replace(/\n{3,}/g, '\n\n')  
        .replace(/[^\x20-\x7E\n]/g, ' ') 
        .trim();

      if (!cleanText || cleanText.length < 50) {
        throw new Error("Extracted text is too short or empty. The PDF might be image-based/scanned.");
      }

      // 5. Structure the Resume (Phase 3)
      const structuredData = ResumeParser.extractStructuredData(cleanText);

      // 6. Map to Taxonomy (Phase 4)
      await SkillMatcher.processResumeSkills(resumeId, structuredData);

      // 7. Merge into Unified Profile (Phase 5)
      await ProfileMerger.mergeResumeSkills(studentId, resumeId);

      // 8. Save extracted text and structured data
      await prisma.resume.update({
        where: { id: resumeId },
        data: {
          extractedText: cleanText,
          structuredData: JSON.stringify(structuredData),
          analysisStatus: "COMPLETED",
          errorMessage: null
        }
      });

      return NextResponse.json({ message: "Extraction, Structuring, and Taxonomy Mapping complete", status: "COMPLETED" });

    } catch (extractError: any) {
      // 7. Handle extraction failure
      console.error("PDF Extraction failed:", extractError);
      await prisma.resume.update({
        where: { id: resumeId },
        data: {
          analysisStatus: "FAILED",
          errorMessage: extractError.message || "Unknown extraction error"
        }
      });
      return NextResponse.json({ error: "Extraction failed", details: extractError.message }, { status: 500 });
    }

  } catch (error) {
    console.error("Resume Extraction API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
