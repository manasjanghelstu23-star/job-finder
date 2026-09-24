import { NextResponse } from "next/server";
import { addMentorFeedback } from "@/lib/mock-db";

export async function POST(request: Request) {
  try {
    const { 
      internshipId, 
      mentorName, 
      mentorRole, 
      generalFeedback, 
      strengths, 
      improvementAreas, 
      skillEvaluations 
    } = await request.json();

    if (!internshipId || !generalFeedback) {
      return NextResponse.json({ error: "Internship ID and general feedback are required" }, { status: 400 });
    }

    const updatedInternship = addMentorFeedback(internshipId, {
      mentorName,
      mentorRole,
      generalFeedback,
      strengths: Array.isArray(strengths) ? strengths : [strengths],
      improvementAreas: Array.isArray(improvementAreas) ? improvementAreas : [improvementAreas],
      skillEvaluations
    });

    if (!updatedInternship) {
      return NextResponse.json({ error: "Active internship not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      feedback: updatedInternship.mentorFeedbacks[0],
      internship: updatedInternship
    });
  } catch (error: any) {
    console.error("Mentor feedback submission error:", error);
    return NextResponse.json({ error: error.message || "Failed to record mentor feedback" }, { status: 500 });
  }
}
