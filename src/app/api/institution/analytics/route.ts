import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    return NextResponse.json({
      institution: "Indian Institute of Technology",
      metrics: {
        totalStudents: 1240,
        eligibleStudents: 980,
        placementReadiness: 79,
        totalVerifiedSkills: 3450,
        totalClaimedSkills: 1200
      },
      topGaps: [
        { skill: "Docker & Kubernetes", affectedStudents: 320, avgRequiredLevel: 75 },
        { skill: "System Architecture", affectedStudents: 240, avgRequiredLevel: 80 },
        { skill: "PostgreSQL Optimization", affectedStudents: 180, avgRequiredLevel: 70 },
      ],
      topStrengths: [
        { skill: "React", studentsProficient: 890, avgScore: 88 },
        { skill: "JavaScript", studentsProficient: 940, avgScore: 90 },
        { skill: "Node.js", studentsProficient: 780, avgScore: 82 },
      ]
    });
  } catch (error) {
    console.error("Institution analytics error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
