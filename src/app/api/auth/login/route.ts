import { NextRequest, NextResponse } from "next/server";
import { findUserByEmail, createUser } from "@/lib/mock-db";
import bcrypt from "bcryptjs";
import { encrypt } from "@/lib/auth";
import { cookies } from "next/headers";

export async function POST(req: NextRequest) {
  try {
    const { email, password, role: requestedRole } = await req.json();

    const cleanEmail = email ? email.trim().toLowerCase() : "";
    let role = (requestedRole || "STUDENT").toUpperCase();

    if (cleanEmail.includes("company")) role = "COMPANY";
    else if (cleanEmail.includes("institute") || cleanEmail.includes("academician")) role = "INSTITUTE";

    let user = await findUserByEmail(cleanEmail);

    // If demo user doesn't exist yet, auto-create one for demo purposes
    if (!user) {
      const passwordHash = await bcrypt.hash(password || "password123", 10);
      user = await createUser({
        email: cleanEmail || `${role.toLowerCase()}@demo.com`,
        passwordHash,
        role,
        fullName: cleanEmail ? cleanEmail.split("@")[0].replace(/[^a-zA-Z0-9]/g, " ") : `${role} User`,
      });
    } else if (requestedRole && user.role !== role) {
      user.role = role;
    }

    if (!user) {
      return NextResponse.json({ error: "Failed to authenticate user" }, { status: 400 });
    }

    const fullName = user.profile?.fullName || (user.email ? user.email.split("@")[0] : `${role} User`);
    const userId = user.id || `user-${Date.now()}`;
    const userEmail = user.email || `${role.toLowerCase()}@demo.com`;

    const token = await encrypt({
      id: userId,
      email: userEmail,
      role: role,
      name: fullName,
    });

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
      user: {
        id: userId,
        email: userEmail,
        name: fullName,
        role: role,
      },
      role: role.toLowerCase(),
      token,
    });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
