export interface MockActiveInternship {
  id: string;
  studentId: string;
  jobId?: string;
  company: string;
  roleTitle: string;
  location?: string;
  stipend?: string;
  startDate: string;
  endDate?: string;
  duration?: string;
  overallProgress: number;
  status: string;
  mentorName: string;
  mentorRole?: string;
  mentorEmail?: string;
  createdAt: string;
  updatedAt: string;
  milestones: {
    id: string;
    internshipId: string;
    title: string;
    description?: string;
    percentage: number;
    status: string;
    orderIndex: number;
    tasks: {
      id: string;
      milestoneId: string;
      title: string;
      isCompleted: boolean;
      dueDate?: string;
      completedAt?: string;
    }[];
  }[];
  weeklyUpdates: {
    id: string;
    internshipId: string;
    weekNumber: number;
    weekTitle: string;
    summary: string;
    submittedWorkUrl?: string;
    blockers?: string;
    submittedAt: string;
  }[];
  mentorFeedbacks: {
    id: string;
    internshipId: string;
    mentorName: string;
    mentorRole?: string;
    reviewDate: string;
    generalFeedback: string;
    strengths: string;
    improvementAreas: string;
    skillEvaluations: {
      id: string;
      feedbackId: string;
      skillName: string;
      proficiencyLevel: string;
      scoreImpact: number;
    }[];
  }[];
  completionRecord?: {
    id: string;
    internshipId: string;
    finalRating: number;
    certificateNumber: string;
    verificationHash: string;
    issuedAt: string;
    verifiedByCompany: boolean;
    certificateUrl?: string;
    recommendationNote?: string;
  };
}

export const initialActiveInternships: MockActiveInternship[] = [
  {
    id: "act-1",
    studentId: "sprof-student-1",
    jobId: "job-1",
    company: "Google Enterprise Partner",
    roleTitle: "Software Engineer Intern - Full Stack",
    location: "Bangalore, India (Hybrid)",
    stipend: "₹50,000 / month",
    startDate: "2026-06-01T00:00:00.000Z",
    endDate: "2026-07-31T00:00:00.000Z",
    duration: "1 June - 31 July (8 Weeks)",
    overallProgress: 65.0,
    status: "IN_PROGRESS",
    mentorName: "Vikram Rao",
    mentorRole: "Senior Engineering Lead",
    mentorEmail: "vikram.rao@google-partner.example.com",
    createdAt: "2026-06-01T09:00:00.000Z",
    updatedAt: "2026-06-25T17:00:00.000Z",
    milestones: [
      {
        id: "ms-1",
        internshipId: "act-1",
        title: "Environment Setup & Onboarding",
        description: "Set up local development stack, access cloud clusters, and complete onboarding security checks.",
        percentage: 100.0,
        status: "COMPLETED",
        orderIndex: 1,
        tasks: [
          { id: "tsk-1", milestoneId: "ms-1", title: "Setup Docker container workspace", isCompleted: true, dueDate: "Week 1", completedAt: "2026-06-03T10:00:00.000Z" },
          { id: "tsk-2", milestoneId: "ms-1", title: "Complete API security & OAuth authorization training", isCompleted: true, dueDate: "Week 1", completedAt: "2026-06-05T14:00:00.000Z" },
        ],
      },
      {
        id: "ms-2",
        internshipId: "act-1",
        title: "API Gateway & Frontend Component Engineering",
        description: "Build microservice REST endpoints and React server components.",
        percentage: 75.0,
        status: "IN_PROGRESS",
        orderIndex: 2,
        tasks: [
          { id: "tsk-3", milestoneId: "ms-2", title: "Build JWT session authentication handler", isCompleted: true, dueDate: "Week 3", completedAt: "2026-06-15T16:00:00.000Z" },
          { id: "tsk-4", milestoneId: "ms-2", title: "Implement real-time WebSocket dashboard sync", isCompleted: false, dueDate: "Week 4" },
        ],
      },
      {
        id: "ms-3",
        internshipId: "act-1",
        title: "Performance Optimization & Final Deployment",
        description: "Benchmark API latency and release production build.",
        percentage: 20.0,
        status: "PENDING",
        orderIndex: 3,
        tasks: [
          { id: "tsk-5", milestoneId: "ms-3", title: "Run Redis caching stress tests", isCompleted: false, dueDate: "Week 7" },
          { id: "tsk-6", milestoneId: "ms-3", title: "Present final capstone demonstration to engineering team", isCompleted: false, dueDate: "Week 8" },
        ],
      },
    ],
    weeklyUpdates: [
      {
        id: "upd-1",
        internshipId: "act-1",
        weekNumber: 1,
        weekTitle: "Week 1: Architecture & Workspace Initialization",
        summary: "Configured monorepo dependencies, verified JWT authentication flow, and passed security compliance review.",
        submittedWorkUrl: "https://github.com/techcorp/cloud-engine/pull/12",
        blockers: "None",
        submittedAt: "2026-06-07T18:00:00.000Z",
      },
      {
        id: "upd-2",
        internshipId: "act-1",
        weekNumber: 2,
        weekTitle: "Week 2: Full Stack Component Construction",
        summary: "Implemented dashboard analytics API and connected frontend React queries with optimistic UI updates.",
        submittedWorkUrl: "https://github.com/techcorp/cloud-engine/pull/24",
        blockers: "Minor latency issue during concurrent socket connections resolved.",
        submittedAt: "2026-06-14T18:00:00.000Z",
      },
    ],
    mentorFeedbacks: [
      {
        id: "mfb-1",
        internshipId: "act-1",
        mentorName: "Vikram Rao",
        mentorRole: "Senior Engineering Lead",
        reviewDate: "2026-06-15T12:00:00.000Z",
        generalFeedback: "Alex has demonstrated exceptional technical autonomy, clean TypeScript design, and proactive problem solving during the initial sprint.",
        strengths: JSON.stringify(["Clean architecture & modular code", "Proactive communication", "Fast adoption of Next.js server components"]),
        improvementAreas: JSON.stringify(["Add more unit test coverage for edge case errors", "Optimize bundle size for low bandwidth connections"]),
        skillEvaluations: [
          { id: "se-1", feedbackId: "mfb-1", skillName: "React", proficiencyLevel: "Mastery", scoreImpact: 92.0 },
          { id: "se-2", feedbackId: "mfb-1", skillName: "TypeScript", proficiencyLevel: "Proficient", scoreImpact: 88.0 },
          { id: "se-3", feedbackId: "mfb-1", skillName: "Node.js", proficiencyLevel: "Proficient", scoreImpact: 85.0 },
        ],
      },
    ],
  },
];
