import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { cookies } from "next/headers";
import * as jose from "jose";

const prisma = new PrismaClient();
const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || "fallback-secret-key-for-dev");

export async function GET(request: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("session")?.value;
    
    // DEV FALLBACK
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

    let studentId = null;
    if (!token) {
      studentId = await ensureDevStudent();
    } else {
      try {
        const { payload } = await jose.jwtVerify(token, JWT_SECRET);
        const student = await prisma.studentProfile.findUnique({
          where: { userId: payload.id as string }
        });
        studentId = student?.id || await ensureDevStudent();
      } catch (err) {
        studentId = await ensureDevStudent();
      }
    }

    if (!studentId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const skills = await prisma.skillScore.findMany({
      where: { studentId },
      include: {
        skill: {
          include: { category: true }
        }
      }
    });

    return NextResponse.json(skills);
  } catch (error) {
    console.error("Fetch Skills Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("session")?.value;
    
    // DEV FALLBACK
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

    let studentId = null;
    if (!token) {
      studentId = await ensureDevStudent();
    } else {
      try {
        const { payload } = await jose.jwtVerify(token, JWT_SECRET);
        const student = await prisma.studentProfile.findUnique({
          where: { userId: payload.id as string }
        });
        studentId = student?.id || await ensureDevStudent();
      } catch (err) {
        studentId = await ensureDevStudent();
      }
    }

    if (!studentId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    // Delete all skill scores and resumes to completely wipe the profile
    await prisma.skillScore.deleteMany({
      where: { studentId }
    });
    
    await prisma.resume.deleteMany({
      where: { studentId }
    });

    return NextResponse.json({ success: true, message: "Profile cleared" });
  } catch (error) {
    console.error("Clear Profile Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
