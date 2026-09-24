import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import * as jose from "jose";
import { findUserById, MOCK_STUDENTS } from "@/lib/mock-db";

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

export async function GET(request: Request) {
  try {
    const studentId = await getStudentId();
    if (!studentId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const student = MOCK_STUDENTS.find(s => s.id === studentId) || MOCK_STUDENTS[0];
    return NextResponse.json(student.skillScores || []);
  } catch (error) {
    console.error("Fetch Skills Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const studentId = await getStudentId();
    if (!studentId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const student = MOCK_STUDENTS.find(s => s.id === studentId);
    if (student) {
      student.skillScores = [];
    }

    return NextResponse.json({ success: true, message: "Profile cleared" });
  } catch (error) {
    console.error("Clear Profile Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
