import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import * as jose from "jose";
import { getActiveInternships, findUserById, MOCK_STUDENTS } from "@/lib/mock-db";

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || "fallback-secret-key-for-dev");

async function getAuthenticatedStudent() {
  const cookieStore = await cookies();
  const token = cookieStore.get("session")?.value;

  if (!token) {
    return MOCK_STUDENTS[0];
  }
  try {
    const { payload } = await jose.jwtVerify(token, JWT_SECRET);
    const user = findUserById(payload.id as string);
    if (user && user.studentProfile) {
      return user.studentProfile;
    }
    return MOCK_STUDENTS[0];
  } catch (err) {
    return MOCK_STUDENTS[0];
  }
}

// GET /api/internships/active - Fetch active internship details
export async function GET(request: Request) {
  try {
    const student = await getAuthenticatedStudent();
    if (!student) {
      return NextResponse.json({ error: "Student not found" }, { status: 404 });
    }

    const activeInternships = getActiveInternships(student.id);
    const activeInternship = activeInternships[0] || null;

    return NextResponse.json({
      success: true,
      internship: activeInternship
    });
  } catch (error: any) {
    console.error("GET active internship error:", error);
    return NextResponse.json({ error: error.message || "Failed to retrieve internship" }, { status: 500 });
  }
}

