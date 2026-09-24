import { NextResponse } from "next/server";
import { toggleInternshipTask } from "@/lib/mock-db";

export async function POST(request: Request) {
  try {
    const { taskId, isCompleted } = await request.json();

    if (!taskId) {
      return NextResponse.json({ error: "Task ID is required" }, { status: 400 });
    }

    const updatedInternship = toggleInternshipTask(taskId, Boolean(isCompleted));

    if (!updatedInternship) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      internship: updatedInternship
    });
  } catch (error: any) {
    console.error("Task toggle error:", error);
    return NextResponse.json({ error: error.message || "Failed to update task" }, { status: 500 });
  }
}
