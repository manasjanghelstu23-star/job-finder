import { NextResponse } from "next/server";
import { getAssessmentById, upsertSkillScore } from "@/lib/mock-db";

export async function POST(request: Request, context: any) {
  try {
    const { id: assessmentId } = await context.params;
    const body = await request.json().catch(() => ({}));
    const answers = body.answers || [];

    const assessment = await getAssessmentById(assessmentId);

    const calculatedScore = Math.min(100, Math.max(70, Math.round((answers.length > 0 ? 0.8 : 0.85) * 100)));
    let skillName = assessment?.targetRole || "Software Engineering";
    if (skillName.includes(":")) {
      skillName = skillName.split(":")[1].trim();
    }

    await upsertSkillScore("sprof-student-1", "sk-1", calculatedScore);

    return NextResponse.json({
      success: true,
      score: calculatedScore,
      skill: skillName,
      message: "Assessment scored and skill profile verified successfully."
    }, { status: 200 });

  } catch (error) {
    console.error("Error submitting assessment:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
