import { NextResponse } from "next/server";
import { createJob, getSkills } from "@/lib/mock-db";
import { extractSkillsFromText } from "@/lib/skillExtractor";

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
    const masterSkills = await getSkills();
    const ingestedJobs = [];

    for (const extJob of mockExternalJobsAPI) {
      const normalizedJob = {
        title: extJob.job_title,
        company: extJob.company_name,
        description: extJob.full_description,
        location: extJob.city,
        experience: "0-1 Years",
        employmentType: extJob.type,
        salary: extJob.salary_band,
        source: "EXTERNAL_API",
        externalUrl: extJob.url,
      };

      const extractedSkills = extractSkillsFromText(normalizedJob.description, masterSkills as any[]);

      const newJob = await createJob({
        ...normalizedJob,
        skills: extractedSkills.map(s => ({
          skillId: s.skillId,
          requirementType: s.requirementType,
          weight: s.requirementType === "REQUIRED" ? 1.0 : 0.5,
          skill: { id: s.skillId, name: s.skillName }
        })) as any
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
