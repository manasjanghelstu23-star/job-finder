import { NextResponse } from "next/server";
import { getIndustryQuestions, createIndustryQuestion } from "@/lib/mock-db";

export async function POST(request: Request) {
  try {
    const data = await request.json().catch(() => ({}));
    const question = await createIndustryQuestion(data);
    return NextResponse.json({ message: "Question created successfully", question }, { status: 201 });
  } catch (error) {
    console.error("Error creating question:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    const questions = await getIndustryQuestions();
    return NextResponse.json(questions);
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
