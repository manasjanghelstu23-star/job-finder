import { NextResponse } from "next/server";
import { getAssessmentById, generateAssessment } from "@/lib/mock-db";

export async function GET(request: Request, context: any) {
  try {
    const { id: assessmentId } = await context.params;

    let assessment = await getAssessmentById(assessmentId);

    if (!assessment) {
      assessment = await generateAssessment("sprof-student-1", "Software Engineer");
    }

    return NextResponse.json(assessment);
  } catch (error) {
    console.error("Error fetching assessment:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
