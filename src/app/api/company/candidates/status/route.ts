import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const session = await getSession();
    const body = await request.json();
    const { applicationId, newStatus, remarks } = body;

    if (!applicationId || !newStatus) {
      return NextResponse.json({ error: "applicationId and newStatus are required" }, { status: 400 });
    }

    const updatedApp = await prisma.internshipApplication.update({
      where: { id: applicationId },
      data: {
        currentStatus: newStatus,
        statusHistory: {
          create: {
            status: newStatus,
            changedBy: "Recruiter (Company Portal)",
            remarks: remarks || `Candidate status moved to ${newStatus}`
          }
        }
      },
      include: {
        statusHistory: { orderBy: { changedAt: "desc" } }
      }
    });

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
