import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import * as jose from "jose";
import { getApplications, createApplication, findUserById, MOCK_STUDENTS } from "@/lib/mock-db";

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || "fallback-secret-key-for-dev");

async function getAuthenticatedStudent() {
  const cookieStore = await cookies();
  const token = cookieStore.get("session")?.value;

  if (!token) return MOCK_STUDENTS[0];
  try {
    const { payload } = await jose.jwtVerify(token, JWT_SECRET);
    const user = findUserById(payload.id as string);
    if (user && user.studentProfile) return user.studentProfile;
    return MOCK_STUDENTS[0];
  } catch (err) {
    return MOCK_STUDENTS[0];
  }
}

// GET /api/internships/applications - List student's applications with history
export async function GET(request: Request) {
  try {
    const studentProfile = await getAuthenticatedStudent();
    if (!studentProfile) {
      return NextResponse.json({ error: "Student not found" }, { status: 404 });
    }

    const apps = getApplications(studentProfile.id);
    return NextResponse.json(apps);
  } catch (error) {
    console.error("Fetch Applications Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// POST /api/internships/applications - Apply for an internship
export async function POST(request: Request) {
  try {
    const studentProfile = await getAuthenticatedStudent();
    if (!studentProfile) {
      return NextResponse.json({ error: "Student not found" }, { status: 404 });
    }

    const body = await request.json();
    const {
      jobId,
      fullName,
      email,
      phone,
      institution,
      degree,
      graduationYear,
      coverLetter,
      portfolioUrl,
      availability,
      relevantSkills,
      additionalAnswers
    } = body;

    if (!jobId) {
      return NextResponse.json({ error: "Job ID is required" }, { status: 400 });
    }

    const application = createApplication({
      studentId: studentProfile.id,
      jobId,
      fullName: fullName || "Student Candidate",
      email: email || "student@demo.com",
      phone: phone || "+91 98765 43210",
      institution: institution || "Engineering Institute",
      degree: degree || "B.Tech Computer Science",
      graduationYear: graduationYear || "2026",
      coverLetter: coverLetter || "I am enthusiastic about applying for this role to contribute to core engineering delivery.",
      portfolioUrl: portfolioUrl || "https://github.com/student-demo",
      availability: availability || "Immediate (Full-time)",
      relevantSkills: relevantSkills || "JavaScript, React, SQL",
      additionalAnswers
    });

    return NextResponse.json({
      success: true,
      applicationId: application.id,
      message: "Application submitted successfully",
      application
    }, { status: 201 });

  } catch (error: any) {
    console.error("Submit Application Error:", error);
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}
