import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// POST /api/internships/active/tasks/toggle
// Payload: { taskId: string, isCompleted: boolean }
export async function POST(request: Request) {
  try {
    const { taskId, isCompleted } = await request.json();

    if (!taskId) {
      return NextResponse.json({ error: "Task ID is required" }, { status: 400 });
    }

    // 1. Update task
    const updatedTask = await prisma.internshipTask.update({
      where: { id: taskId },
      data: {
        isCompleted,
        completedAt: isCompleted ? new Date() : null
      },
      include: {
        milestone: {
          include: {
            tasks: true,
            internship: {
              include: {
                milestones: {
                  include: { tasks: true }
                }
              }
            }
          }
        }
      }
    });

    const milestone = updatedTask.milestone;
    const allMilestoneTasks = milestone.tasks;
    const completedMilestoneTasks = allMilestoneTasks.filter(t => t.isCompleted).length;
    
    // Calculate milestone percentage
    const milestonePercentage = allMilestoneTasks.length > 0 
      ? Math.round((completedMilestoneTasks / allMilestoneTasks.length) * 100) 
      : 0;

    const milestoneStatus = milestonePercentage === 100 
      ? "COMPLETED" 
      : milestonePercentage > 0 
      ? "IN_PROGRESS" 
      : "PENDING";

    // 2. Update milestone
    await prisma.internshipMilestone.update({
      where: { id: milestone.id },
      data: {
        percentage: milestonePercentage,
        status: milestoneStatus
      }
    });

    // 3. Recalculate Overall Internship Progress
    const allInternshipMilestones = await prisma.internshipMilestone.findMany({
      where: { internshipId: milestone.internshipId }
    });

    const totalPct = allInternshipMilestones.reduce((acc, m) => acc + (m.id === milestone.id ? milestonePercentage : m.percentage), 0);
    const overallProgress = Math.round(totalPct / allInternshipMilestones.length);

    const updatedInternship = await prisma.activeInternship.update({
      where: { id: milestone.internshipId },
      data: {
        overallProgress
      },
      include: {
        milestones: {
          include: { tasks: true },
          orderBy: { orderIndex: "asc" }
        },
        weeklyUpdates: {
          orderBy: { weekNumber: "desc" }
        },
        mentorFeedbacks: {
          include: { skillEvaluations: true },
          orderBy: { reviewDate: "desc" }
        },
        completionRecord: true
      }
    });

    return NextResponse.json({
      success: true,
      internship: updatedInternship
    });
  } catch (error: any) {
    console.error("Task toggle error:", error);
    return NextResponse.json({ error: error.message || "Failed to update task" }, { status: 500 });
  }
}
