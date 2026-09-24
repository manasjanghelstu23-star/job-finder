import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { findUserById } from "@/lib/mock-db";

export async function GET(request: Request) {
  try {
    const session = await getSession();
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

    const userId = session?.id || "usr-company-1";
    const user = await findUserById(userId);

    const company = user?.companyProfile || {
      id: "comp-1",
      userId,
      companyName: "TechCorp Global",
      industry: "Software & Cloud Systems",
      verificationStatus: "VERIFIED",
    };

    return NextResponse.json({ company });
  } catch (error: any) {
    console.error("Error fetching company profile:", error);
    return NextResponse.json({ error: "Failed to fetch company status" }, { status: 500 });
  }
}
