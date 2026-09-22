import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { extractSkillsFromText } from "@/lib/skillExtractor";

const prisma = new PrismaClient();

// Mock External API Response (Phase 2 - External Sources)
const mockExternalJobsAPI = [
  {
    external_id: "EXT-001",
    job_title: "Frontend React Developer",
    company_name: "WebSphere Inc",
    full_description: "We are looking for a strong frontend developer. Must have 2+ years of experience with React.js, JavaScript, and Tailwind CSS. Preferred skills: TypeScript and Node.js.",
    city: "Remote",
    salary_band: "10-14 LPA",
    type: "Full-Time",
    url: "https://websphere.example.com/jobs/1"
  },
  {
    external_id: "EXT-002",
    job_title: "Machine Learning Engineer",
    company_name: "AI Innovators",
    full_description: "Join our AI team! Required: Python, Machine Learning, and SQL. Bonus: Experience with Docker and AWS.",
    city: "Bangalore",
    salary_band: "15-20 LPA",
    type: "Full-Time",
    url: "https://ai-innovators.example.com/careers/ml"
  }
];

export async function POST(request: Request) {
  try {
    // 1. Fetch Master Skills Taxonomy (Phase 6)
    const masterSkills = await prisma.skill.findMany();

    const ingestedJobs = [];

    // 2. Process Job Feed
    for (const extJob of mockExternalJobsAPI) {
      
      // Phase 4: Job Normalization
      // Convert external schema to our canonical JobPosting schema
      const normalizedJob = {
        title: extJob.job_title,
        company: extJob.company_name,
        description: extJob.full_description,
        location: extJob.city,
        experience: "Not Specified", // fallback
        employmentType: extJob.type,
        salary: extJob.salary_band,
        source: "EXTERNAL_API",
        externalUrl: extJob.url,
      };

      // Deduplication check: Do we already have this external job?
      const existingJob = await prisma.jobPosting.findFirst({
        where: { externalUrl: normalizedJob.externalUrl }
      });

      if (existingJob) {
        continue; // Skip if already ingested
      }

      // Phase 5: Skill Extraction
      const extractedSkills = extractSkillsFromText(normalizedJob.description, masterSkills);

      // Phase 3 & 7: Store the Job and Map exactly to Skill IDs
      const newJob = await prisma.jobPosting.create({
        data: {
          ...normalizedJob,
          skills: {
            create: extractedSkills.map(s => ({
              skillId: s.skillId,
              requirementType: s.requirementType,
              requiredLevel: s.requirementType === "REQUIRED" ? 70 : 50, // default baselines
              weight: s.requirementType === "REQUIRED" ? 1.0 : 0.5
            }))
          }
        },
        include: {
          skills: {
            include: { skill: true }
          }
        }
      });

      ingestedJobs.push(newJob);
    }

    return NextResponse.json({
      message: `Successfully ingested ${ingestedJobs.length} new jobs.`,
      ingestedJobs
    });
  } catch (error) {
    console.error("Job Ingestion Error:", error);
    return NextResponse.json({ error: "Internal server error during ingestion" }, { status: 500 });
  }
}
