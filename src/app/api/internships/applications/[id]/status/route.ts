import { NextResponse } from "next/server";
import { updateApplicationStatus } from "@/lib/mock-db";

export async function PATCH(request: Request, context: any) {
  try {
    const { id: applicationId } = await context.params;
    const { status, remarks, changedBy } = await request.json();

    const validStatuses = ["Applied", "Under Review", "Shortlisted", "Interview", "Selected", "Rejected"];
    if (!validStatuses.includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    const application = updateApplicationStatus(applicationId, status, remarks, changedBy || "Recruiter");

    if (!application) {
      return NextResponse.json({ error: "Application not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: `Status updated to ${status}`,
      application
    });

  } catch (error) {
    console.error("Update Status Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
