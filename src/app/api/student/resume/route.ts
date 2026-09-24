import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import * as jose from "jose";
import { MOCK_RESUMES, createResume, findUserById, MOCK_STUDENTS } from "@/lib/mock-db";

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || "fallback-secret-key-for-dev");
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB limit
const ALLOWED_MIME_TYPES = ["application/pdf"];

// Auth Helper
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

// GET all resumes for the authenticated student
export async function GET(request: Request) {
  try {
    const studentId = await getStudentId();
    if (!studentId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const studentResumes = MOCK_RESUMES.filter(r => r.studentId === studentId);
    return NextResponse.json(studentResumes.length > 0 ? studentResumes : MOCK_RESUMES);
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

    if (!ALLOWED_MIME_TYPES.includes(file.type) && !file.name.toLowerCase().endsWith('.pdf')) {
      return NextResponse.json({ 
        error: `Invalid file type: ${file.type}. Only PDF is supported in Phase 1.` 
      }, { status: 400 });
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ 
        error: `File size exceeds the 5MB limit.` 
      }, { status: 400 });
    }

    const safeFilename = `${studentId}_${Date.now()}_${file.name.replace(/[^a-zA-Z0-9.\-_]/g, '')}`;

    const resume = createResume({
      studentId,
      originalFilename: file.name,
      storageReference: `/storage/resumes/${safeFilename}`,
      fileType: file.type || "application/pdf",
      fileSize: file.size,
      uploadStatus: "COMPLETED",
      analysisStatus: "COMPLETED"
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
