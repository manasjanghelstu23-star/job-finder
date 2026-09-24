import { NextResponse } from "next/server";
import { updateApplicationStatus } from "@/lib/mock-db";

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const { applicationId, newStatus, remarks } = body;

    if (!applicationId || !newStatus) {
      return NextResponse.json({ error: "applicationId and newStatus are required" }, { status: 400 });
    }

    const updatedApp = await updateApplicationStatus(applicationId, newStatus, remarks, "Recruiter (Company Portal)");

    return NextResponse.json({
      success: true,
      message: `Candidate application updated to ${newStatus}`,
      application: updatedApp
    });

  } catch (error: any) {
    console.error("Error updating candidate application status:", error);
    return NextResponse.json({ error: "Failed to update application status" }, { status: 500 });
  }
}
