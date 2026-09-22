import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await getSession();

    // Fetch demo or authenticated institution profile
    let institution = await prisma.institutionProfile.findFirst({
      include: {
        user: { select: { email: true } },
        students: {
          include: {
            user: true,
            skillScores: { include: { skill: true } }
          }
        }
      }
    });

    if (!institution) {
      const demoUser = await prisma.user.create({
        data: {
          email: "director@iite.ac.in",
          passwordHash: "hashed",
          role: "INSTITUTE",
          isVerified: true,
          institutionProfile: {
            create: {
              institutionName: "Indian Institute of Technology & Engineering (IITE)",
              domain: "iite.ac.in"
            }
          }
        },
        include: { institutionProfile: true }
      });
      institution = await prisma.institutionProfile.findUnique({
        where: { id: demoUser.institutionProfile!.id },
        include: {
          user: { select: { email: true } },
          students: {
            include: {
              user: true,
              skillScores: { include: { skill: true } }
            }
          }
        }
      });
    }

    // High-level Institutional Metrics
    const metrics = {
      totalStudents: 1420,
      totalFaculty: 88,
      placementReadinessRate: 84.5,
      activeCorporateMoUs: 24,
      internshipParticipationRate: 78.2,
      averagePlacementCtc: "14.8 LPA",
      highestPackage: "48.5 LPA",
      totalVerifiedSkills: 6420,
      pendingFdpApplications: 6,
      naacAccreditation: "A++ (Score: 3.78/4.00)",
      nbaAccreditedBranches: 6
    };

    // Department Breakdown
    const departments = [
      {
        id: "dept-cs",
        name: "Computer Science & Engineering",
        code: "CSE",
        studentsCount: 480,
        facultyCount: 28,
        hod: "Dr. Arvind Ramanathan",
        placementRate: 92.4,
        avgCtc: "18.2 LPA",
        topRecruiters: ["Google", "Microsoft", "Infosys Labs", "Amazon"],
        skillReadiness: 88
      },
      {
        id: "dept-it",
        name: "Information Technology & Cloud",
        code: "IT",
        studentsCount: 360,
        facultyCount: 22,
        hod: "Dr. Sunita Kulkarni",
        placementRate: 89.1,
        avgCtc: "15.4 LPA",
        topRecruiters: ["Cisco", "Accenture", "TCS Digital", "Oracle"],
        skillReadiness: 85
      },
      {
        id: "dept-ai",
        name: "Artificial Intelligence & Data Science",
        code: "AI-DS",
        studentsCount: 240,
        facultyCount: 16,
        hod: "Dr. Rajeshwar Sharma",
        placementRate: 94.0,
        avgCtc: "21.6 LPA",
        topRecruiters: ["NVIDIA", "Meta", "Infosys Labs AI", "Fractal"],
        skillReadiness: 91
      },
      {
        id: "dept-ece",
        name: "Electronics & Communication Engineering",
        code: "ECE",
        studentsCount: 340,
        facultyCount: 22,
        hod: "Dr. Meenakshi Sundaram",
        placementRate: 79.5,
        avgCtc: "11.8 LPA",
        topRecruiters: ["Qualcomm", "Texas Instruments", "Intel", "Bosch"],
        skillReadiness: 76
      }
    ];

    // Recent Critical Alerts & Action Items
    const alerts = [
      {
        id: "alt-1",
        title: "Infosys Labs Campus Drive Confirmation",
        type: "URGENT",
        timestamp: "2 hours ago",
        description: "Scheduled for Oct 12, 2026. 45 students pre-screened with verified Java & Spring Boot competencies.",
        action: "View Eligible Batch"
      },
      {
        id: "alt-2",
        title: "Faculty Industry Sabbatical Nominations Due",
        type: "ACTION_REQUIRED",
        timestamp: "5 hours ago",
        description: "Google Cloud & Tata Digital 2026 sabbatical fellowship nominations require Dean endorsement.",
        action: "Review Applications"
      },
      {
        id: "alt-3",
        title: "NAAC SSR Accreditation Data Synchronized",
        type: "INFO",
        timestamp: "Yesterday",
        description: "Criterion 2 (Teaching-Learning) and Criterion 5 (Student Support & Progression) reports updated.",
        action: "Download Summary"
      }
    ];

    return NextResponse.json({
      success: true,
      institution: {
        id: institution?.id,
        name: institution?.institutionName || "Indian Institute of Technology & Engineering (IITE)",
        code: "IITE-BLR",
        domain: institution?.domain || "iite.ac.in",
        location: "Bangalore, Karnataka, India",
        affiliatingBody: "AICTE / Autonomous University",
        naacGrade: "A++ Grade",
        nbaStatus: "Accredited (Tier-1)",
        nirfRank: "Rank 18 (Engineering, 2026)"
      },
      metrics,
      departments,
      alerts
    });
  } catch (error: any) {
    console.error("Error fetching institute overview:", error);
    return NextResponse.json({ error: "Failed to load institution overview" }, { status: 500 });
  }
}
