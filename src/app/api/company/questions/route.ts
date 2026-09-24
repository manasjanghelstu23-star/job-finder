import { NextResponse } from "next/server";
import { getIndustryQuestions, createIndustryQuestion } from "@/lib/mock-db";

export async function GET() {
  try {
    const questions = await getIndustryQuestions();
    return NextResponse.json({ questions });
  } catch (error: any) {
    console.error("Error fetching company skill questions:", error);
    return NextResponse.json({ error: "Failed to fetch questions" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const question = await createIndustryQuestion(body);

    return NextResponse.json({
      success: true,
      message: "Skill question published into canonical taxonomy",
      question
    }, { status: 201 });

  } catch (error: any) {
    console.error("Error creating company skill question:", error);
    return NextResponse.json({ error: "Failed to create question" }, { status: 500 });
  }
}
