import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { cookies } from "next/headers";
import * as jose from "jose";

const prisma = new PrismaClient();
const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || "fallback-secret-key-for-dev");

export async function GET(request: Request, context: any) {
  try {
    const { id: assessmentId } = await context.params;
    
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
      return firstStudent;
    };

    let studentProfile = null;
    if (!token) {
      studentProfile = await ensureDevStudent();
    } else {
      try {
        const { payload } = await jose.jwtVerify(token, JWT_SECRET);
        studentProfile = await prisma.studentProfile.findUnique({
          where: { userId: payload.id as string }
        });
        if (!studentProfile) studentProfile = await ensureDevStudent();
      } catch (err) {
        studentProfile = await ensureDevStudent();
      }
    }

    const assessment = await prisma.assessment.findUnique({
      where: { id: assessmentId },
      include: {
        questions: {
          include: {
            industryQuestion: {
              include: {
                options: {
                  select: { id: true, text: true } // Exclude isCorrect
                }
              }
            }
          },
          orderBy: {
            order: 'asc'
          }
        }
      }
    });

    if (!assessment || !studentProfile || assessment.studentId !== studentProfile.id) {
      return NextResponse.json({ error: "Assessment not found or unauthorized" }, { status: 404 });
    }

    return NextResponse.json(assessment);
  } catch (error) {
    console.error("Error fetching assessment:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
