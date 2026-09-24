import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { getJobs, getApplications, findUserById } from "@/lib/mock-db";

export async function GET(request: Request) {
  try {
    const session = await getSession();
    const url = new URL(request.url);
    const simRole = url.searchParams.get("simulateRole");

    const userId = session?.id || "usr-company-1";
    const user = await findUserById(userId);

    const company = user?.companyProfile || {
      id: "comp-1",
      userId,
      companyName: "TechCorp Global",
      industry: "Software & Cloud Systems",
      verificationStatus: simRole === "COMPANY_UNVERIFIED" ? "PENDING" : "VERIFIED",
    };

    const jobs = await getJobs({ companyId: company.id });
    const allApplications = await getApplications();

    const stats = {
      totalPostings: jobs.length,
      activeInternships: jobs.filter((j) => j.status === "OPEN").length,
      totalApplications: allApplications.length,
      shortlistedCandidates: allApplications.filter((a) => ["Shortlisted", "Interview", "Selected"].includes(a.currentStatus)).length
    };

    return NextResponse.json({
      company: { ...company, jobs },
      stats,
      recentApplications: allApplications.slice(0, 15)
    });

  } catch (error: any) {
    console.error("Error fetching company dashboard data:", error);
    return NextResponse.json({ error: "Failed to load company dashboard" }, { status: 500 });
  }
}
