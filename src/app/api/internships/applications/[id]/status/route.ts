import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// PATCH /api/internships/applications/[id]/status - Recruiter/Admin updates status
export async function PATCH(request: Request, context: any) {
  try {
    const { id: applicationId } = await context.params;
    const { status, remarks, changedBy } = await request.json();

    const validStatuses = ["Applied", "Under Review", "Shortlisted", "Interview", "Selected", "Rejected"];
    if (!validStatuses.includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    const application = await prisma.internshipApplication.update({
      where: { id: applicationId },
      data: {
        currentStatus: status,
        updatedAt: new Date(),
        statusHistory: {
          create: {
            status,
            changedBy: changedBy || "Recruiter",
            remarks: remarks || `Application moved to ${status}.`
          }
        }
      },
      include: {
        statusHistory: {
          orderBy: { changedAt: "desc" }
        }
      }
    });

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
