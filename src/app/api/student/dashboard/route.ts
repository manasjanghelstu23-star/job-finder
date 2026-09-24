import { NextRequest, NextResponse } from "next/server";
import { verifyAuth } from "@/lib/api-guard";
import { findUserById, getJobs, getApplications } from "@/lib/mock-db";

export async function GET(req: NextRequest) {
  const auth = await verifyAuth(req, ["STUDENT"]);

  if (auth.error || !auth.user) {
    return NextResponse.json({ error: auth.error || "Unauthorized" }, { status: auth.status || 401 });
  }

  const authUser = auth.user;

  try {
    const userObj = findUserById(authUser.id);
    const student = userObj?.studentProfile;

    const skillsList = (student as any)?.skillScores?.map((ss: any) => ({
      id: ss.skillId || ss.skill?.id,
      name: ss.skill?.name || "Skill",
      proficiency: Math.round(ss.score),
      source: "assessment",
      verified: ss.verification === "Verified" || ss.verification === "Internship Mentor Verified",
    })) || [
      { id: "1", name: "JavaScript", proficiency: 88, source: "assessment", verified: true },
      { id: "2", name: "React", proficiency: 85, source: "assessment", verified: true },
      { id: "3", name: "Node.js", proficiency: 78, source: "assessment", verified: true },
      { id: "4", name: "TypeScript", proficiency: 80, source: "assessment", verified: true },
      { id: "5", name: "Next.js", proficiency: 82, source: "assessment", verified: true },
    ];

    const profileCompletion = 95;
    const skillsAssessed = Math.max(skillsList.length, 18);
    const studentApps = student ? getApplications({ studentId: (student as any).id }) : [];
    const activeApplications = Math.max(studentApps.length, 4);
    const skillMatch = 88;

    const skillGaps = [
      { skill: "Docker & Containerization", current: 40, required: 75, gap: 35 },
      { skill: "PostgreSQL Indexing & Optimization", current: 55, required: 80, gap: 25 },
      { skill: "System Architecture & Microservices", current: 50, required: 70, gap: 20 },
    ];

    const recommendedLearning = [
      {
        id: "l1",
        title: "Docker Fundamentals for Cloud Engineers",
        provider: "EduLearn Academy",
        hours: 6,
        level: "Intermediate",
      },
      {
        id: "l2",
        title: "Advanced SQL & Relational Schema Design",
        provider: "EduLearn Tech",
        hours: 8,
        level: "Intermediate",
      },
      {
        id: "l3",
        title: "Microservices Architecture in Node.js",
        provider: "EduLearn Academy",
        hours: 10,
        level: "Advanced",
      },
    ];

    const liveJobs = getJobs().slice(0, 6);

    const recommendedOpportunities = liveJobs.map((j: any, idx: number) => ({
      id: j.id,
      title: j.title,
      company: j.company,
      location: j.location || "Bangalore (Hybrid)",
      stipend: j.salary || "₹45,000/mo",
      matchPercentage: Math.max(75, 96 - idx * 3),
      workMode: j.workMode || "Hybrid",
      department: j.department || "Engineering",
      skills: (j.skills || []).map((s: any) => s.skill?.name || "Tech"),
      isNew: true,
      postedAt: j.postedAt || new Date()
    }));

    const recentApplications = studentApps.map((app: any) => ({
      id: app.id,
      role: app.job?.title || "Software Engineering Intern",
      company: app.job?.company || "TechCorp",
      status: app.currentStatus || app.status || "Under Review",
      appliedAt: app.appliedAt || new Date(),
    }));

    const notifications = [
      { id: "n1", text: "New skill benchmark assessment in TypeScript is now open.", time: "2 hours ago" },
      { id: "n2", text: "MetaBuilds reviewed your verified portfolio.", time: "1 day ago" },
      { id: "n3", text: "Your peer Maya sent you a study connect request.", time: "2 days ago" },
    ];

    return NextResponse.json({
      success: true,
      profileCompletion,
      skillsAssessed,
      skillMatch,
      activeApplications,
      skills: skillsList,
      skillGaps,
      recommendedLearning,
      recommendedOpportunities,
      recentApplications,
      notifications,
      user: {
        id: authUser.id,
        email: authUser.email,
        name: authUser.name,
        role: authUser.role,
        college: userObj?.profile?.college || "Institute of Technology",
        targetRole: student?.targetRole || "Software Engineer",
      },
    });
  } catch (error: any) {
    console.error("Dashboard error:", error);
    return NextResponse.json(
      { error: "Failed to load student dashboard" },
      { status: 500 }
    );
  }
}
