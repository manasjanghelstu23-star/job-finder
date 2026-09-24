import { NextResponse } from "next/server";
import { generateAssessment } from "@/lib/mock-db";

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const targetRole = body.targetRole || "Full Stack Engineer";

    const assessment = await generateAssessment("sprof-student-1", targetRole);

    return NextResponse.json(assessment, { status: 201 });
  } catch (error) {
    console.error("Error generating assessment:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
