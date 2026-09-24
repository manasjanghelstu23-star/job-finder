import { NextRequest, NextResponse } from "next/server";
import { findUserByEmail, createUser } from "@/lib/mock-db";
import bcrypt from "bcryptjs";
import { encrypt } from "@/lib/auth";
import { cookies } from "next/headers";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, password, role: requestedRole } = body;

    // 1. Validation
    if (!name || typeof name !== "string" || name.trim().length < 2) {
      return NextResponse.json(
        { error: "Please provide a valid full name (minimum 2 characters)" },
        { status: 400 }
      );
    }

    if (!email || typeof email !== "string" || !email.includes("@")) {
      return NextResponse.json(
        { error: "Please provide a valid email address" },
        { status: 400 }
      );
    }

    if (!password || typeof password !== "string" || password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters long" },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanName = name.trim();
    const role = (requestedRole || "STUDENT").toUpperCase();

    // 2. Check duplicate email
    const existing = await findUserByEmail(cleanEmail);

    if (existing) {
      return NextResponse.json(
        { error: "An account with this email address already exists. Please log in." },
        { status: 409 }
      );
    }

    // 3. Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // 4. Create User in Mock DB
    const newUser = await createUser({
      email: cleanEmail,
      passwordHash,
      role,
      fullName: cleanName,
      companyName: role === "COMPANY" ? cleanName : undefined,
      institutionName: role === "INSTITUTE" ? cleanName : undefined,
    });

    if (!newUser) {
      return NextResponse.json({ error: "Failed to create account" }, { status: 500 });
    }

    // 5. Generate secure session JWT
    const token = await encrypt({
      id: newUser.id,
      email: newUser.email,
      role: newUser.role,
      name: cleanName,
    });

    // 6. Set HTTP-only session cookie
    const expires = new Date(Date.now() + 24 * 60 * 60 * 1000);
    const cookieStore = await cookies();
    cookieStore.set("session", token, {
      expires,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      sameSite: "lax",
    });

    return NextResponse.json(
      {
        success: true,
        user: {
          id: newUser.id,
          email: newUser.email,
          name: cleanName,
          role: newUser.role,
        },
        role: newUser.role.toLowerCase(),
        token,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Signup error:", error);
    return NextResponse.json(
      { error: "Failed to create account. Please try again." },
      { status: 500 }
    );
  }
}
