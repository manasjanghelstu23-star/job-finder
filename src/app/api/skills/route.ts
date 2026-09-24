import { NextResponse } from "next/server";
import { MOCK_SKILLS } from "@/data/skills";

export async function GET() {
  try {
    return NextResponse.json(MOCK_SKILLS);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch skills" }, { status: 500 });
  }
}
