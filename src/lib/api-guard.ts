import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { prisma } from "@/lib/prisma";

const secretKey = process.env.JWT_SECRET || "super-secret-key-change-me-in-production";
const key = new TextEncoder().encode(secretKey);

export interface AuthenticatedUser {
  id: string;
  email: string;
  role: string;
  name?: string;
  profileId?: string;
}

export async function verifyAuth(req: NextRequest, allowedRoles?: string[]): Promise<
  | { user: AuthenticatedUser; error?: never; status?: never }
  | { user?: never; error: string; status: number }
> {
  try {
    let token: string | undefined;

    // 1. Check Bearer Authorization Header
    const authHeader = req.headers.get("authorization");
    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.substring(7);
    }

    // 2. Fallback to HttpOnly cookie
    if (!token) {
      token = req.cookies.get("session")?.value;
    }

    if (!token) {
      return { error: "Unauthorized: No authentication token provided", status: 401 };
    }

    const { payload } = await jwtVerify(token, key);
    const userId = payload.id as string;
    const email = payload.email as string;
    const role = (payload.role as string || "STUDENT").toUpperCase();

    // Verify user still exists in database
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        profile: true,
        studentProfile: true,
        institutionProfile: true,
        companyProfile: true,
      },
    });

    if (!user) {
      return { error: "Unauthorized: User not found", status: 401 };
    }

    // Check Role if specified
    if (allowedRoles && allowedRoles.length > 0) {
      const normalizedAllowed = allowedRoles.map((r) => r.toUpperCase());
      if (!normalizedAllowed.includes(role)) {
        return {
          error: `Forbidden: Access restricted to roles [${allowedRoles.join(", ")}]`,
          status: 403,
        };
      }
    }

    return {
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        name: user.profile?.fullName || user.email.split("@")[0],
        profileId: user.profile?.id,
      },
    };
  } catch (err: any) {
    return { error: "Unauthorized: Invalid or expired token", status: 401 };
  }
}
