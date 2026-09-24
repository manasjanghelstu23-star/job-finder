import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { cookies } from "next/headers";
import * as jose from "jose";
import { unlink } from "fs/promises";

const prisma = new PrismaClient();
const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || "fallback-secret-key-for-dev");

async function getStudentId() {
  const cookieStore = await cookies();
  const token = cookieStore.get("session")?.value;
  if (!token) return null;
  try {
    const { payload } = await jose.jwtVerify(token, JWT_SECRET);
    const student = await prisma.studentProfile.findUnique({
      where: { userId: payload.id as string }
    });
    return student?.id;
  } catch (err) {
    return null;
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

    // Verify ownership
    const resume = await prisma.resume.findUnique({
      where: { id: resumeId }
    });

    if (!resume) {
      return NextResponse.json({ error: "Resume not found" }, { status: 404 });
    }

    if (resume.studentId !== studentId) {
      return NextResponse.json({ error: "Unauthorized access to this resume" }, { status: 403 });
    }

    // Delete file from storage (safe error handling if file is already missing)
    try {
      await unlink(resume.storageReference);
    } catch (e) {
      console.warn("File already deleted from storage:", resume.storageReference);
    }

    // Delete from DB
    await prisma.resume.delete({
      where: { id: resumeId }
    });

    return NextResponse.json({ message: "Resume deleted successfully" });
  } catch (error) {
    console.error("Resume Deletion Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
