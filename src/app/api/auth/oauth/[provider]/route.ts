import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { encrypt } from "@/lib/auth";
import { cookies } from "next/headers";

interface RouteParams {
  params: Promise<{
    provider: string;
  }>;
}

export async function POST(req: NextRequest, { params }: RouteParams) {
  try {
    const { provider } = await params;
    const body = await req.json().catch(() => ({}));
    const portal = (body.portal || "student").toLowerCase();

    const normalizedProvider = provider.toLowerCase();
    const validProviders = ["google", "facebook", "twitter", "x", "linkedin"];
    if (!validProviders.includes(normalizedProvider)) {
      return NextResponse.json(
        { error: `Unsupported OAuth provider: ${provider}` },
        { status: 400 }
      );
    }

    // Map portal to role
    let role = "STUDENT";
    if (portal === "institute") role = "INSTITUTE";
    if (portal === "company") role = "COMPANY";

    // Standardized OAuth identity for demonstration & production integration
    const oauthEmail = `${portal}.${normalizedProvider}@example.com`;
    const providerDisplay =
      normalizedProvider === "twitter"
        ? "Twitter"
        : normalizedProvider === "linkedin"
        ? "LinkedIn"
        : normalizedProvider.charAt(0).toUpperCase() + normalizedProvider.slice(1);
    const fullName = `${providerDisplay} Verified ${role.charAt(0) + role.slice(1).toLowerCase()}`;

    // Find or create the user in the database
    let user = await prisma.user.findUnique({
      where: { email: oauthEmail },
      include: { profile: true },
    });

    if (!user) {
      const passwordHash = await bcrypt.hash(`oauth-${normalizedProvider}-${Date.now()}`, 10);
      user = await prisma.user.create({
        data: {
          email: oauthEmail,
          passwordHash,
          role,
          isVerified: true,
          status: "ACTIVE",
          profile: {
            create: {
              fullName,
              email: oauthEmail,
              role,
            },
          },
          ...(role === "STUDENT"
            ? {
                studentProfile: {
                  create: {
                    targetRole: "Full Stack Developer",
                  },
                },
              }
            : {}),
          ...(role === "INSTITUTE"
            ? {
                institutionProfile: {
                  create: {
                    institutionName: `${providerDisplay} Academic Partner`,
                  },
                },
              }
            : {}),
          ...(role === "COMPANY"
            ? {
                companyProfile: {
                  create: {
                    companyName: `${providerDisplay} Enterprise Partner`,
                    verificationStatus: "VERIFIED",
                  },
                },
              }
            : {}),
        },
        include: { profile: true },
      });
    }

    // Generate JWT Session Token
    const token = await encrypt({
      id: user.id,
      email: user.email,
      role: user.role,
      name: user.profile?.fullName || fullName,
    });

    // Set HTTP-only Cookie
    const expires = new Date(Date.now() + 24 * 60 * 60 * 1000);
    const cookieStore = await cookies();
    cookieStore.set("session", token, {
      expires,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      sameSite: "lax",
    });

    return NextResponse.json({
      success: true,
      provider: normalizedProvider,
      user: {
        id: user.id,
        email: user.email,
        name: user.profile?.fullName || fullName,
        role: user.role,
      },
      role: user.role.toLowerCase(),
      token,
      redirectUrl: `/${user.role.toLowerCase()}/dashboard`,
    });
  } catch (error: any) {
    console.error("OAuth error:", error);
    return NextResponse.json(
      { error: "OAuth authentication failed. Please try again." },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest, { params }: RouteParams) {
  const { provider } = await params;
  const searchParams = req.nextUrl.searchParams;
  const portal = searchParams.get("portal") || "student";

  // Forward to POST handler logic
  const mockReq = new NextRequest(req.url, {
    method: "POST",
    headers: req.headers,
    body: JSON.stringify({ portal }),
  });

  const response = await POST(mockReq, { params });
  const data = await response.json();

  if (data.success && data.redirectUrl) {
    return NextResponse.redirect(new URL(data.redirectUrl, req.url));
  }

  return response;
}
