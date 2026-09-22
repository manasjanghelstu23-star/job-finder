import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const skills = await prisma.skill.findMany({
      include: {
        category: true
      },
      orderBy: {
        name: 'asc'
      }
    });
    return NextResponse.json(skills);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch skills" }, { status: 500 });
  }
}
