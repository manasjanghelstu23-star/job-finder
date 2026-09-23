import { NextRequest, NextResponse } from "next/server";
import { verifyAuth } from "@/lib/api-guard";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const auth = await verifyAuth(req, ["STUDENT"]);

  if (auth.error) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: auth.user.id },
      include: {
        profile: true,
        studentProfile: {
          include: {
            skillScores: {
              include: { skill: true },
            },
            resumes: true,
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json({ error: "Student profile not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      profile: {
        id: user.profile?.id,
        auth_user_id: user.id,
        role: "student",
        full_name: user.profile?.fullName || user.email.split("@")[0],
        email: user.email,
        phone: user.profile?.phone || "+91 98765 43210",
        profile_photo: user.profile?.profilePhoto || null,
        bio: user.profile?.bio || "Computer Science student passionate about full stack development, cloud computing, and building software solutions.",
        college: user.profile?.college || user.studentProfile?.college || "Global Institute of Technology",
        course: user.profile?.course || user.studentProfile?.degree || "B.Tech Computer Science",
        branch: user.profile?.branch || user.studentProfile?.branch || "Computer Science & Engineering",
        graduation_year: user.profile?.graduationYear || 2026,
        created_at: user.createdAt,
        updated_at: user.updatedAt,
      },
      student: {
        id: user.studentProfile?.id,
        profile_id: user.profile?.id,
        student_id: user.studentProfile?.studentId || "STU-2024-0891",
        college: user.studentProfile?.college || "Global Institute of Technology",
        degree: user.studentProfile?.degree || "B.Tech",
        branch: user.studentProfile?.branch || "Computer Science",
        semester: user.studentProfile?.semester || 6,
        cgpa: user.studentProfile?.cgpa || 8.85,
        resume_url: user.studentProfile?.resumeUrl || null,
        github_url: user.studentProfile?.githubUrl || "https://github.com/student-demo",
        linkedin_url: user.studentProfile?.linkedinUrl || "https://linkedin.com/in/student-demo",
        portfolio_url: user.studentProfile?.portfolioUrl || "https://student-portfolio.dev",
      },
      skills: user.studentProfile?.skillScores?.map((ss) => ({
        id: ss.skillId,
        name: ss.skill.name,
        proficiency: ss.score,
        source: "assessment",
        verified: ss.verification === "Verified",
      })) || [
        { id: "s1", name: "JavaScript", proficiency: 88, source: "assessment", verified: true },
        { id: "s2", name: "React", proficiency: 85, source: "assessment", verified: true },
        { id: "s3", name: "TypeScript", proficiency: 80, source: "assessment", verified: true },
      ],
    });
  } catch (error: any) {
    console.error("Profile fetch error:", error);
    return NextResponse.json(
      { error: "Internal server error fetching profile" },
      { status: 500 }
    );
  }
}
