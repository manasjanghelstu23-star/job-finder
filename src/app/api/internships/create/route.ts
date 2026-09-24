import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { createJob } from "@/lib/mock-db";

export async function POST(request: Request) {
  try {
    const session = await getSession();
    const body = await request.json();

    const {
      title,
      department,
      industry,
      location,
      workMode,
      description,
      salary,
      responsibilities,
      skills,
      eligibleDegrees,
      eligibleBranches,
      graduationYears,
      minCgpa,
      experience,
      projectTitle,
      problemStatement,
      deliverables,
      learningOutcomes,
      evaluationMethod,
      startDate,
      endDate,
      durationWeeks,
      workingHours,
      mentorName,
      mentorDesignation,
      mentorDepartment,
      mentorContact,
      status = "OPEN",
      simulateRole
    } = body;

    if (!title || !description) {
      return NextResponse.json({ error: "Internship title and description are required" }, { status: 400 });
    }

    if (simulateRole === "COMPANY_UNVERIFIED") {
      return NextResponse.json({
        error: "Forbidden: Your company verification status is PENDING. Only VERIFIED companies can create and publish internships.",
        code: "COMPANY_NOT_VERIFIED"
      }, { status: 403 });
    }

    if (simulateRole === "STUDENT") {
      return NextResponse.json({
        error: "Forbidden: Students are not authorized to post internships.",
        code: "ROLE_NOT_AUTHORIZED"
      }, { status: 403 });
    }

    const companyName = body.companyName || "Google Enterprise Partner";

    const createdJob = createJob({
      title,
      company: companyName,
      description,
      location: location || "Bangalore, India (Hybrid)",
      experience: experience || "0-1 Years / Students",
      employmentType: "Internship",
      salary: salary || "₹35,000 - ₹50,000 / month",
      status: status === "DRAFT" ? "DRAFT" : "OPEN",
      department: department || "Engineering",
      responsibilities: Array.isArray(responsibilities) ? responsibilities.join("\n") : (responsibilities || "Build scalable web components and API integrations."),
      eligibleDegrees: Array.isArray(eligibleDegrees) ? eligibleDegrees.join(", ") : (eligibleDegrees || "B.Tech, M.Tech"),
      eligibleBranches: Array.isArray(eligibleBranches) ? eligibleBranches.join(", ") : (eligibleBranches || "CS, IT"),
      graduationYears: Array.isArray(graduationYears) ? graduationYears.join(", ") : (graduationYears || "2026"),
      minCgpa: minCgpa ? parseFloat(minCgpa) : 7.0,
      mentorName: mentorName || "Senior Engineering Mentor",
      mentorDesignation: mentorDesignation || "Tech Lead",
      mentorContact: mentorContact || "mentor@company.com",
      skills: (skills || []).map((s: any) => ({
        skill: { name: s.skillName || "Engineering", category: { name: "Technical" } },
        requirementType: s.requirementType || "REQUIRED",
        requiredLevel: s.requiredLevel ? parseFloat(s.requiredLevel) : 70.0,
        weight: s.weight ? parseFloat(s.weight) : 1.0
      }))
    });

    return NextResponse.json({
      success: true,
      message: "Internship created and published successfully by verified company.",
      internship: createdJob
    }, { status: 201 });

  } catch (error: any) {
    console.error("Error creating internship:", error);
    return NextResponse.json({ error: error.message || "Failed to create internship" }, { status: 500 });
  }
}
