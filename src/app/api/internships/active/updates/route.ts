import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// POST /api/internships/active/updates
// Payload: { internshipId: string, weekNumber: number, weekTitle: string, summary: string, submittedWorkUrl?: string, blockers?: string }
export async function POST(request: Request) {
  try {
    const { internshipId, weekNumber, weekTitle, summary, submittedWorkUrl, blockers } = await request.json();

    if (!internshipId || !summary) {
      return NextResponse.json({ error: "Internship ID and summary are required" }, { status: 400 });
    }

    const newUpdate = await prisma.internshipWeeklyUpdate.create({
      data: {
        internshipId,
        weekNumber: Number(weekNumber) || 1,
        weekTitle: weekTitle || `Week ${weekNumber}: Progress Update`,
        summary,
        submittedWorkUrl: submittedWorkUrl || null,
        blockers: blockers || null
      }
    });

    const updatedInternship = await prisma.activeInternship.findUnique({
      where: { id: internshipId },
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
      update: newUpdate,
      internship: updatedInternship
    });
  } catch (error: any) {
    console.error("Weekly update submission error:", error);
    return NextResponse.json({ error: error.message || "Failed to submit progress update" }, { status: 500 });
  }
}
