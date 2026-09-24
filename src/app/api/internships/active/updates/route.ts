import { NextResponse } from "next/server";
import { addWeeklyUpdate } from "@/lib/mock-db";

export async function POST(request: Request) {
  try {
    const { internshipId, weekNumber, weekTitle, summary, submittedWorkUrl, blockers } = await request.json();

    if (!internshipId || !summary) {
      return NextResponse.json({ error: "Internship ID and summary are required" }, { status: 400 });
    }

    const updatedInternship = addWeeklyUpdate(internshipId, {
      weekNumber: Number(weekNumber) || 1,
      weekTitle: weekTitle || `Week ${weekNumber}: Progress Update`,
      summary,
      submittedWorkUrl,
      blockers
    });

    if (!updatedInternship) {
      return NextResponse.json({ error: "Active internship not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      update: updatedInternship.weeklyUpdates[0],
      internship: updatedInternship
    });
  } catch (error: any) {
    console.error("Weekly update submission error:", error);
    return NextResponse.json({ error: error.message || "Failed to submit progress update" }, { status: 500 });
  }
}
