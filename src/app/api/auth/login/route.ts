import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { encrypt } from "@/lib/auth";
import { cookies } from "next/headers";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Please provide both email and password" }, { status: 400 });
    }

    const cleanEmail = email.trim().toLowerCase();

    const user = await prisma.user.findUnique({
      where: { email: cleanEmail },
      include: {
        profile: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "Invalid username or password" }, { status: 401 });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);

    if (!isMatch) {
      return NextResponse.json({ error: "Invalid username or password" }, { status: 401 });
    }

    // Ensure Profile exists
    let fullName = user.profile?.fullName;
    if (!user.profile) {
      const fallbackName = cleanEmail.split("@")[0].replace(/[^a-zA-Z0-9]/g, " ");
      const profile = await prisma.profile.create({
        data: {
          userId: user.id,
          email: user.email,
          fullName: fallbackName.charAt(0).toUpperCase() + fallbackName.slice(1),
          role: user.role,
        },
      });
      fullName = profile.fullName;
    }

    const token = await encrypt({
      id: user.id,
      email: user.email,
      role: user.role,
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
        id: user.id,
        email: user.email,
        name: fullName,
        role: user.role,
      },
      role: user.role.toLowerCase(),
      token,
    });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
