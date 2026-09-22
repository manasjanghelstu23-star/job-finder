import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// POST /api/internships/active/complete
// Payload: { internshipId: string, finalRating?: number, recommendationNote?: string }
export async function POST(request: Request) {
  try {
    const { internshipId, finalRating, recommendationNote } = await request.json();

    if (!internshipId) {
      return NextResponse.json({ error: "Internship ID is required" }, { status: 400 });
    }

    const internship = await prisma.activeInternship.findUnique({
      where: { id: internshipId },
      include: {
        milestones: {
          include: { tasks: true }
        }
      }
    });

    if (!internship) {
      return NextResponse.json({ error: "Active internship not found" }, { status: 404 });
    }

    // Generate verified digital certificate identifier & sha256-like hash
    const randomHex = Math.random().toString(16).substring(2, 10).toUpperCase();
    const certificateNumber = `CERT-2026-${internship.company.replace(/[^a-zA-Z]/g, "").substring(0, 4).toUpperCase()}-${randomHex}`;
    const verificationHash = `0x${Math.random().toString(16).substring(2, 18)}${Math.random().toString(16).substring(2, 18)}`;

    // Create or update completion record
    const completionRecord = await prisma.internshipCompletionRecord.upsert({
      where: { internshipId },
      update: {
        finalRating: Number(finalRating) || 4.3,
        recommendationNote: recommendationNote || "Demonstrated outstanding diligence, production code standards, and seamless team collaboration.",
        verifiedByCompany: true,
        issuedAt: new Date()
      },
      create: {
        internshipId,
        finalRating: Number(finalRating) || 4.3,
        certificateNumber,
        verificationHash,
        verifiedByCompany: true,
        certificateUrl: `/certificates/${certificateNumber}.pdf`,
        recommendationNote: recommendationNote || "Demonstrated outstanding diligence, production code standards, and seamless team collaboration.",
        issuedAt: new Date()
      }
    });

    // Mark internship as completed and 100% progress
    const updatedInternship = await prisma.activeInternship.update({
      where: { id: internshipId },
      data: {
        status: "COMPLETED",
        overallProgress: 100.0,
        endDate: new Date()
      },
      include: {
        milestones: {
          include: { tasks: true },
          orderBy: { orderIndex: "asc" }
        },
        weeklyUpdates: {
          orderBy: { weekNumber: "desc" }
        },
        mentorFeedbacks: {
          include: { skillEvaluations: true },
          orderBy: { reviewDate: "desc" }
        },
        completionRecord: true
      }
    });

    return NextResponse.json({
      success: true,
      completionRecord,
      internship: updatedInternship
    });
  } catch (error: any) {
    console.error("Internship completion error:", error);
    return NextResponse.json({ error: error.message || "Failed to finalize internship" }, { status: 500 });
  }
}
