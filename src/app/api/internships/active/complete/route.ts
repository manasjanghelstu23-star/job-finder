import { NextResponse } from "next/server";
import { completeInternship } from "@/lib/mock-db";

export async function POST(request: Request) {
  try {
    const { internshipId, finalRating, recommendationNote } = await request.json();

    if (!internshipId) {
      return NextResponse.json({ error: "Internship ID is required" }, { status: 400 });
    }

    const updatedInternship = completeInternship(internshipId, Number(finalRating) || 4.3, recommendationNote);

    if (!updatedInternship) {
      return NextResponse.json({ error: "Active internship not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      completionRecord: updatedInternship.completionRecord,
      internship: updatedInternship
    });
  } catch (error: any) {
    console.error("Internship completion error:", error);
    return NextResponse.json({ error: error.message || "Failed to finalize internship" }, { status: 500 });
  }
}
