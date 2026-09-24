import { NextResponse } from "next/server";
import { getJobs, getApplications } from "@/lib/mock-db";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const selectedJobId = url.searchParams.get("jobId");

    const companyJobs = await getJobs();
    const targetJob = selectedJobId 
      ? companyJobs.find((j) => j.id === selectedJobId) 
      : companyJobs[0];

    const rawApps = await getApplications({ jobId: targetJob?.id });

    const candidates = rawApps.map((app, index) => ({
      id: app.id,
      fullName: app.fullName || "Alex Morgan",
      email: app.email || "student@demo.com",
      phone: app.phone || "+91 98765 43210",
      institution: app.institution || "Indian Institute of Technology",
      degree: app.degree || "B.Tech Computer Science",
      graduationYear: app.graduationYear || "2026",
      cgpa: 8.9,
      appliedAt: app.appliedAt,
      currentStatus: app.currentStatus,
      availability: app.availability || "Immediate",
      portfolioUrl: app.portfolioUrl,
      coverLetter: app.coverLetter,
      skillMatchPercentage: 92 - index * 5,
      matchedSkillDetails: [
        { skillName: "React", requirementType: "REQUIRED", requiredMinScore: 60, studentScore: 85, proficiencyLevel: "Proficient", isMet: true },
        { skillName: "TypeScript", requirementType: "REQUIRED", requiredMinScore: 60, studentScore: 80, proficiencyLevel: "Proficient", isMet: true },
        { skillName: "Node.js", requirementType: "REQUIRED", requiredMinScore: 60, studentScore: 78, proficiencyLevel: "Proficient", isMet: true },
      ],
      missingSkillDetails: [],
      totalRequiredSkills: 3,
      metRequiredSkills: 3,
      eligibility: {
        isOverallEligible: true,
        degreeEligible: true,
        yearEligible: true,
        cgpaEligible: true,
        minCgpaReq: 7.5,
        studentCgpa: 8.9
      },
      evidence: {
        verifiedSkillsCount: 5,
        projectsCount: 4,
        certificationsCount: 2,
        resumeAvailable: true
      },
      rank: index + 1
    }));

    return NextResponse.json({
      job: targetJob,
      companyJobs,
      candidates,
      stats: {
        totalApplicants: candidates.length,
        eligibleCount: candidates.length,
        shortlistedCount: candidates.filter(c => c.currentStatus === "Shortlisted").length,
        avgSkillMatch: 89
      }
    });

  } catch (error: any) {
    console.error("Error evaluating candidate ranking:", error);
    return NextResponse.json({ error: "Failed to evaluate candidates" }, { status: 500 });
  }
}
