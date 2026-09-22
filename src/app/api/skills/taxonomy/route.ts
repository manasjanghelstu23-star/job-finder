import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const categories = await prisma.skillCategory.findMany({
      include: {
        skills: {
          select: {
            id: true,
            name: true,
            categoryId: true,
          },
          orderBy: { name: "asc" }
        }
      },
      orderBy: { name: "asc" }
    });

    // If categories are empty, return fallback canonical taxonomy
    if (!categories || categories.length === 0) {
      return NextResponse.json({
        categories: [
          {
            id: "cat-eng",
            name: "Software & Core Engineering",
            skills: [
              { id: "sk-js", name: "JavaScript" },
              { id: "sk-ts", name: "TypeScript" },
              { id: "sk-react", name: "React" },
              { id: "sk-node", name: "Node.js" },
              { id: "sk-py", name: "Python" },
              { id: "sk-java", name: "Java" },
              { id: "sk-cpp", name: "C++" },
              { id: "sk-next", name: "Next.js" }
            ]
          },
          {
            id: "cat-db-cloud",
            name: "Database, Cloud & DevOps",
            skills: [
              { id: "sk-sql", name: "SQL" },
              { id: "sk-pg", name: "PostgreSQL" },
              { id: "sk-mongo", name: "MongoDB" },
              { id: "sk-docker", name: "Docker" },
              { id: "sk-k8s", name: "Kubernetes" },
              { id: "sk-aws", name: "AWS" },
              { id: "sk-git", name: "Git & GitHub" }
            ]
          },
          {
            id: "cat-ai-data",
            name: "AI, Machine Learning & Data",
            skills: [
              { id: "sk-ml", name: "Machine Learning" },
              { id: "sk-dl", name: "Deep Learning" },
              { id: "sk-pandas", name: "Pandas & NumPy" },
              { id: "sk-nlp", name: "Natural Language Processing" },
              { id: "sk-cv", name: "Computer Vision" }
            ]
          },
          {
            id: "cat-soft",
            name: "Core Professional & Soft Skills",
            skills: [
              { id: "sk-comm", name: "Technical Communication" },
              { id: "sk-collab", name: "Team Collaboration" },
              { id: "sk-agile", name: "Agile & Scrum" },
              { id: "sk-prob", name: "Problem Solving" }
            ]
          }
        ]
      });
    }

    return NextResponse.json({ categories });
  } catch (error: any) {
    console.error("Failed to fetch skills taxonomy:", error);
    return NextResponse.json({ error: "Failed to fetch canonical skills" }, { status: 500 });
  }
}
