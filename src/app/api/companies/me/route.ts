import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const session = await getSession();
    
    // Check if simulation override requested via query param (for testing UI switches)
    const url = new URL(request.url);
    const simRole = url.searchParams.get("simulateRole");

    if (simRole) {
      if (simRole === "COMPANY_VERIFIED") {
        return NextResponse.json({
          company: {
            id: "comp-sim-1",
            companyName: "Infosys Labs",
            industry: "Enterprise Software & Cloud",
            website: "https://infosys.com",
            verificationStatus: "VERIFIED",
            verifiedAt: new Date().toISOString(),
            isVerified: true
          }
        });
      } else if (simRole === "COMPANY_UNVERIFIED") {
        return NextResponse.json({
          company: {
            id: "comp-sim-2",
            companyName: "Acme Tech Startups",
            industry: "Fintech",
            website: "https://acme.example.com",
            verificationStatus: "PENDING",
            verifiedAt: null,
            isVerified: false
          }
        });
      }
    }

    if (!session) {
      // In dev fallback, check if any company exists
      const firstCompany = await prisma.company.findFirst();
      if (firstCompany) {
        return NextResponse.json({ company: firstCompany });
      }
      return NextResponse.json({ company: null, message: "No active company session" });
    }

    const company = await prisma.company.findUnique({
      where: { userId: session.id }
    });

    if (!company) {
      return NextResponse.json({ company: null, message: "User does not have a company profile" });
    }

    return NextResponse.json({ company });
  } catch (error: any) {
    console.error("Error fetching company profile:", error);
    return NextResponse.json({ error: "Failed to fetch company status" }, { status: 500 });
  }
}
