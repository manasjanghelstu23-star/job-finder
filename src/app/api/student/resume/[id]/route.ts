import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import * as jose from "jose";
import { MOCK_RESUMES, findUserById, MOCK_STUDENTS } from "@/lib/mock-db";

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

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const studentId = await getStudentId();
    if (!studentId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id: resumeId } = await params;

    const idx = MOCK_RESUMES.findIndex(r => r.id === resumeId);
    if (idx !== -1) {
      MOCK_RESUMES.splice(idx, 1);
    }

    return NextResponse.json({ message: "Resume deleted successfully" });
  } catch (error) {
    console.error("Resume Deletion Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
