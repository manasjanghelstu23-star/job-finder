import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { cookies } from "next/headers";
import * as jose from "jose";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

const prisma = new PrismaClient();
const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || "fallback-secret-key-for-dev");
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB limit
const ALLOWED_MIME_TYPES = ["application/pdf"]; // Ready for DOCX later

// Auth Helper
async function getStudentId() {
  const cookieStore = await cookies();
  const token = cookieStore.get("session")?.value;
  
  // DEV FALLBACK: Helper to ensure at least one student exists
  const ensureDevStudent = async () => {
    let firstStudent = await prisma.studentProfile.findFirst();
    if (!firstStudent) {
      const user = await prisma.user.create({
        data: {
          email: "student@demo.com",
          passwordHash: "demo",
          role: "STUDENT",
          studentProfile: {
            create: { targetRole: "Software Engineer" }
          }
        },
        include: { studentProfile: true }
      });
      firstStudent = user.studentProfile;
    }
    return firstStudent?.id || null;
  };

  if (!token) {
    return await ensureDevStudent();
  }
  
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

// GET all resumes for the authenticated student
export async function GET(request: Request) {
  try {
    const studentId = await getStudentId();
    if (!studentId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const resumes = await prisma.resume.findMany({
      where: { studentId },
      orderBy: { uploadedAt: 'desc' },
      include: {
        skillEvidences: {
          include: { skill: true }
        }
      }
    });

    return NextResponse.json(resumes);
  } catch (error) {
    console.error("Fetch Resumes Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// POST upload a new resume
export async function POST(request: Request) {
  try {
    const studentId = await getStudentId();
    if (!studentId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const formData = await request.formData();
    const file = formData.get("file") as File;
    
    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    // 1. Validate File Type
    if (!ALLOWED_MIME_TYPES.includes(file.type) && !file.name.toLowerCase().endsWith('.pdf')) {
      return NextResponse.json({ 
        error: `Invalid file type: ${file.type}. Only PDF is supported in Phase 1.` 
      }, { status: 400 });
    }

    // 2. Validate File Size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ 
        error: `File size exceeds the 5MB limit.` 
      }, { status: 400 });
    }

    // 3. Store the file securely (simulate existing storage architecture via local filesystem)
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    // We don't expose the direct path. We store it in a secure backend folder.
    const uploadDir = path.join(process.cwd(), "storage", "resumes");
    await mkdir(uploadDir, { recursive: true });
    
    const safeFilename = `${studentId}_${Date.now()}_${file.name.replace(/[^a-zA-Z0-9.\-_]/g, '')}`;
    const storageReference = path.join(uploadDir, safeFilename);

    await writeFile(storageReference, buffer);

    // 4. Save metadata in DB (Associate with authenticated student)
    const resume = await prisma.resume.create({
      data: {
        studentId,
        originalFilename: file.name,
        storageReference,
        fileType: file.type,
        fileSize: file.size,
        uploadStatus: "COMPLETED",
        analysisStatus: "PENDING"
      }
    });

    return NextResponse.json({
      message: "Resume uploaded successfully",
      resume
    }, { status: 201 });

  } catch (error) {
    console.error("Resume Upload Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
