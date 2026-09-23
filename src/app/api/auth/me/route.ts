import { NextRequest, NextResponse } from "next/server";
import { verifyAuth } from "@/lib/api-guard";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const auth = await verifyAuth(req);

  if (auth.error) {
    return NextResponse.json({ error: auth.error, user: null }, { status: auth.status });
  }

  const user = await prisma.user.findUnique({
    where: { id: auth.user.id },
    include: {
      profile: true,
      studentProfile: {
        include: {
          skillScores: {
            include: { skill: true },
          },
        },
      },
      institutionProfile: true,
      companyProfile: true,
    },
  });

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
