import { NextRequest, NextResponse } from "next/server";
import { verifyAuth } from "@/lib/api-guard";
import { findUserById } from "@/lib/mock-db";

export async function GET(req: NextRequest) {
  const auth = await verifyAuth(req);

  if (auth.error || !auth.user) {
    return NextResponse.json({ error: auth.error || "Unauthorized", user: null }, { status: auth.status || 401 });
  }

  const user = await findUserById(auth.user.id);

  if (!user) {
    return NextResponse.json({ error: "User not found", user: null }, { status: 404 });
  }

  return NextResponse.json({
    success: true,
    user: {
      id: user.id,
      email: user.email,
      role: user.role,
      name: user.profile?.fullName || user.email.split("@")[0],
      profile: user.profile,
      student: user.studentProfile,
      institute: user.institutionProfile,
      company: user.companyProfile,
    },
  });
}
