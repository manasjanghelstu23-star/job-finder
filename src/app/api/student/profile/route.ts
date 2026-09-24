import { NextRequest, NextResponse } from "next/server";
import { verifyAuth } from "@/lib/api-guard";
import { findUserById } from "@/lib/mock-db";

export async function GET(req: NextRequest) {
  const auth = await verifyAuth(req, ["STUDENT"]);

  if (auth.error || !auth.user) {
    return NextResponse.json({ error: auth.error || "Unauthorized" }, { status: auth.status || 401 });
  }

  const authUser = auth.user;

  try {
    const user = findUserById(authUser.id);

    if (!user) {
      return NextResponse.json({ error: "Student profile not found" }, { status: 404 });
    }

    const studentProf = user.studentProfile as any;

    return NextResponse.json({
      success: true,
      profile: {
        id: user.profile?.id || "prof-1",
        auth_user_id: user.id,
        role: "student",
        full_name: user.profile?.fullName || user.email.split("@")[0],
        email: user.email,
        phone: user.profile?.phone || "+91 98765 43210",
        profile_photo: user.profile?.profilePhoto || null,
        bio: user.profile?.bio || "Computer Science student passionate about full stack development, cloud computing, and building software solutions.",
        college: user.profile?.college || studentProf?.college || "Global Institute of Technology",
        course: user.profile?.course || studentProf?.degree || "B.Tech Computer Science",
        branch: user.profile?.branch || studentProf?.branch || "Computer Science & Engineering",
        graduation_year: user.profile?.graduationYear || 2026,
        created_at: new Date(),
        updated_at: new Date(),
      },
      student: {
        id: studentProf?.id || "stu-1",
        profile_id: user.profile?.id || "prof-1",
        student_id: studentProf?.studentId || "STU-2024-0891",
        college: studentProf?.college || "Global Institute of Technology",
        degree: studentProf?.degree || "B.Tech",
        branch: studentProf?.branch || "Computer Science",
        semester: studentProf?.semester || 6,
        cgpa: studentProf?.cgpa || 8.85,
        resume_url: studentProf?.resumeUrl || null,
        github_url: studentProf?.githubUrl || "https://github.com/student-demo",
        linkedin_url: studentProf?.linkedinUrl || "https://linkedin.com/in/student-demo",
        portfolio_url: studentProf?.portfolioUrl || "https://student-portfolio.dev",
      },
      skills: studentProf?.skillScores?.map((ss: any) => ({
        id: ss.skillId || ss.skill?.id,
        name: ss.skill?.name || "Skill",
        proficiency: ss.score,
        source: "assessment",
        verified: ss.verification === "Verified" || ss.verification === "Internship Mentor Verified",
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
