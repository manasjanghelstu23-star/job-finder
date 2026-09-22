import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// POST /api/internships/active/mentor-feedback
// Allows recording/simulating official mentor feedback and updates student verified SkillScore records
export async function POST(request: Request) {
  try {
    const { 
      internshipId, 
      mentorName, 
      mentorRole, 
      generalFeedback, 
      strengths, 
      improvementAreas, 
      skillEvaluations 
    } = await request.json();

    if (!internshipId || !generalFeedback) {
      return NextResponse.json({ error: "Internship ID and general feedback are required" }, { status: 400 });
    }

    const internship = await prisma.activeInternship.findUnique({
      where: { id: internshipId }
    });

    if (!internship) {
      return NextResponse.json({ error: "Active internship not found" }, { status: 404 });
    }

    // 1. Create Mentor Feedback entry
    const createdFeedback = await prisma.internshipMentorFeedback.create({
      data: {
        internshipId,
        mentorName: mentorName || internship.mentorName,
        mentorRole: mentorRole || internship.mentorRole,
        generalFeedback,
        strengths: typeof strengths === "string" ? strengths : JSON.stringify(strengths || []),
        improvementAreas: typeof improvementAreas === "string" ? improvementAreas : JSON.stringify(improvementAreas || []),
        skillEvaluations: {
          create: (skillEvaluations || []).map((se: any) => ({
            skillName: se.skillName,
            proficiencyLevel: se.proficiencyLevel || "Proficient",
            scoreImpact: Number(se.scoreImpact) || 85.0
          }))
        }
      },
      include: {
        skillEvaluations: true
      }
    });

    // 2. Feed directly into Student Verified Skill Profile (SkillScore)
    if (Array.isArray(skillEvaluations) && skillEvaluations.length > 0) {
      let defaultCategory = await prisma.skillCategory.findFirst();
      if (!defaultCategory) {
        defaultCategory = await prisma.skillCategory.create({ data: { name: "Technical Skills" } });
      }

      for (const se of skillEvaluations) {
        try {
          let skill = await prisma.skill.findFirst({
            where: { name: { equals: se.skillName } }
          });

          if (!skill) {
            skill = await prisma.skill.create({
              data: {
                name: se.skillName,
                categoryId: defaultCategory.id
              }
            });
          }

          const scoreVal = Number(se.scoreImpact) || 85.0;

          await prisma.skillScore.upsert({
            where: {
              studentId_skillId: {
                studentId: internship.studentId,
                skillId: skill.id
              }
            },
            update: {
              score: scoreVal,
              status: "Assessed",
              verification: "Internship Mentor Verified",
              assessedAt: new Date()
            },
            create: {
              studentId: internship.studentId,
              skillId: skill.id,
              score: scoreVal,
              coverage: 95.0,
              status: "Assessed",
              verification: "Internship Mentor Verified"
            }
          });
        } catch (err) {
          console.error("Error updating skill score from mentor eval:", err);
        }
      }
    }

    // 3. Return refreshed internship
    const updatedInternship = await prisma.activeInternship.findUnique({
      where: { id: internshipId },
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
      feedback: createdFeedback,
      internship: updatedInternship
    });
  } catch (error: any) {
    console.error("Mentor feedback submission error:", error);
    return NextResponse.json({ error: error.message || "Failed to record mentor feedback" }, { status: 500 });
  }
}
