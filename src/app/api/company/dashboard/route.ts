import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const session = await getSession();

    // Check if simulation role override is provided via query
    const url = new URL(request.url);
    const simRole = url.searchParams.get("simulateRole");

    let company = null;

    if (session) {
      company = await prisma.company.findUnique({
        where: { userId: session.id },
        include: {
          jobs: {
            include: {
              skills: { include: { skill: true } },
              internshipApplications: {
                include: {
                  student: {
                    include: {
                      user: { select: { email: true } },
                      skillScores: { include: { skill: true } }
                    }
                  }
                },
                orderBy: { appliedAt: "desc" }
              }
            },
            orderBy: { postedAt: "desc" }
          }
        }
      });
    }

    // Fallback if no logged in session or simulation active
    if (!company) {
      // Find first company in db or fallback
      company = await prisma.company.findFirst({
        include: {
          jobs: {
            include: {
              skills: { include: { skill: true } },
              internshipApplications: {
                include: {
                  student: {
                    include: {
                      user: { select: { email: true } },
                      skillScores: { include: { skill: true } }
                    }
                  }
                },
                orderBy: { appliedAt: "desc" }
              }
            },
            orderBy: { postedAt: "desc" }
          }
        }
      });
    }

    if (!company) {
      return NextResponse.json({
        company: {
          id: "comp-sim-1",
          companyName: "Infosys Labs",
          industry: "Enterprise AI & Cloud",
          website: "https://infosys.com",
          location: "Bangalore, India",
          verificationStatus: simRole === "COMPANY_UNVERIFIED" ? "PENDING" : "VERIFIED",
          verifiedAt: simRole === "COMPANY_UNVERIFIED" ? null : new Date().toISOString(),
          jobs: []
        },
        stats: {
          totalPostings: 0,
          activeInternships: 0,
          totalApplications: 0,
          shortlistedCandidates: 0
        },
        recentApplications: []
      });
    }

    // Override verification status if explicitly simulated
    if (simRole === "COMPANY_UNVERIFIED") {
      company = { ...company, verificationStatus: "PENDING", verifiedAt: null };
    }

    // Aggregate statistics
    const jobs = company.jobs || [];
    const allApplications = jobs.flatMap((j: any) => 
      (j.internshipApplications || []).map((app: any) => ({
        ...app,
        jobTitle: j.title,
        jobDepartment: j.department,
        jobWorkMode: j.workMode,
        jobStipend: j.salary
      }))
    );

    const stats = {
      totalPostings: jobs.length,
      activeInternships: jobs.filter((j: any) => j.status === "OPEN").length,
      totalApplications: allApplications.length,
      shortlistedCandidates: allApplications.filter((a: any) => ["Shortlisted", "Interview", "Selected"].includes(a.currentStatus)).length
    };

    return NextResponse.json({
      company,
      stats,
      recentApplications: allApplications.slice(0, 15)
    });

  } catch (error: any) {
    console.error("Error fetching company dashboard data:", error);
    return NextResponse.json({ error: "Failed to load company dashboard" }, { status: 500 });
  }
}
