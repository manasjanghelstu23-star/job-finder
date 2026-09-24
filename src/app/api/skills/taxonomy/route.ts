import { NextResponse } from "next/server";
import { MOCK_SKILL_CATEGORIES } from "@/data/skills";

export async function GET() {
  try {
    return NextResponse.json({ categories: MOCK_SKILL_CATEGORIES });
  } catch (error: any) {
    console.error("Failed to fetch skills taxonomy:", error);
    return NextResponse.json({ error: "Failed to fetch canonical skills" }, { status: 500 });
  }
}
