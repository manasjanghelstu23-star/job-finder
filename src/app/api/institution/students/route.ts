import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const department = searchParams.get("department") || "ALL";

    // Curated rich cohort representation matching engineering college directory
    const mockCohort = [
      {
        id: "stud-1",
        name: "Aakash Verma",
        rollNumber: "22CS101",
        email: "aakash.v@iite.ac.in",
        department: "Computer Science",
        degree: "B.Tech",
        year: "Final Year (2026)",
        cgpa: 8.92,
        placementStatus: "PLACED",
        companyPlaced: "Google (Cloud Infra)",
        ctcPackage: "32 LPA",
        targetRole: "Cloud Platform Engineer",
        verifiedSkills: ["Kubernetes", "Go", "Docker", "Linux", "Distributed Systems"],
        assessmentScores: { "Kubernetes": 92, "Go": 88, "Data Structures": 95 },
        eligibilityRate: 98
      },
      {
        id: "stud-2",
        name: "Bhavna Patel",
        rollNumber: "22CS142",
        email: "bhavna.p@iite.ac.in",
        department: "Computer Science",
        degree: "B.Tech",
        year: "Final Year (2026)",
        cgpa: 8.74,
        placementStatus: "SHORTLISTED",
        companyPlaced: "Infosys Labs (Interview Round 2)",
        ctcPackage: "18-22 LPA (Expected)",
        targetRole: "Backend Engineer",
        verifiedSkills: ["Java", "Spring Boot", "SQL", "REST APIs", "Redis"],
        assessmentScores: { "Java": 87, "Spring Boot": 84, "SQL": 90 },
        eligibilityRate: 94
      },
      {
        id: "stud-3",
        name: "Chirag Sen",
        rollNumber: "22IT088",
        email: "chirag.s@iite.ac.in",
        department: "Information Technology",
        degree: "B.Tech",
        year: "Final Year (2026)",
        cgpa: 8.15,
        placementStatus: "OFFER_RECEIVED",
        companyPlaced: "Cisco Systems",
        ctcPackage: "19.5 LPA",
        targetRole: "Site Reliability Engineer",
        verifiedSkills: ["Python", "AWS", "Terraform", "Networking", "Prometheus"],
        assessmentScores: { "Python": 85, "AWS": 82, "Networking": 88 },
        eligibilityRate: 91
      },
      {
        id: "stud-4",
        name: "Divya Nambiar",
        rollNumber: "22AI034",
        email: "divya.n@iite.ac.in",
        department: "AI & Data Science",
        degree: "B.Tech",
        year: "Final Year (2026)",
        cgpa: 9.35,
        placementStatus: "PLACED",
        companyPlaced: "NVIDIA (AI Architecture)",
        ctcPackage: "42 LPA",
        targetRole: "Machine Learning Systems Architect",
        verifiedSkills: ["PyTorch", "CUDA", "FastAPI", "Vector DBs", "C++"],
        assessmentScores: { "PyTorch": 96, "Algorithms": 94, "CUDA": 89 },
        eligibilityRate: 99
      },
      {
        id: "stud-5",
        name: "Eshwar Sundaram",
        rollNumber: "22EC056",
        email: "eshwar.s@iite.ac.in",
        department: "Electronics & Communication",
        degree: "B.Tech",
        year: "Final Year (2026)",
        cgpa: 7.82,
        placementStatus: "IN_TRAINING",
        companyPlaced: "Seeking Core VLSI / Firmware",
        ctcPackage: "-",
        targetRole: "Embedded Firmware Engineer",
        verifiedSkills: ["Embedded C", "Microcontrollers", "RTOS", "Verilog"],
        assessmentScores: { "Embedded C": 78, "Digital Electronics": 82 },
        eligibilityRate: 74
      }
    ];

    return NextResponse.json({
      success: true,
      students: mockCohort,
      totalCount: mockCohort.length
    });
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to fetch student directory" }, { status: 500 });
  }
}
