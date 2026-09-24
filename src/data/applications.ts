export interface MockApplication {
  id: string;
  studentId: string;
  jobId: string;
  resumeId?: string;
  fullName?: string;
  email?: string;
  phone?: string;
  institution?: string;
  degree?: string;
  graduationYear?: string;
  coverLetter?: string;
  portfolioUrl?: string;
  availability?: string;
  additionalAnswers?: string;
  relevantSkills?: string;
  currentStatus: string;
  appliedAt: string;
  updatedAt: string;
  job?: any;
  student?: any;
  statusHistory?: {
    id: string;
    applicationId: string;
    status: string;
    changedBy: string;
    changedAt: string;
    remarks?: string;
  }[];
}

export const initialApplications: MockApplication[] = [
  {
    id: "app-1",
    studentId: "sprof-student-1",
    jobId: "job-1",
    resumeId: "res-1",
    fullName: "Alex Morgan",
    email: "student@demo.com",
    phone: "+91 9876543210",
    institution: "Indian Institute of Technology",
    degree: "B.Tech Computer Science",
    graduationYear: "2026",
    coverLetter: "Excited to contribute to Google Enterprise Partner's full stack cloud infrastructure team.",
    portfolioUrl: "https://alexmorgan.dev",
    availability: "Immediate (Full-Time 40 hrs/wk)",
    currentStatus: "Interview Scheduled",
    appliedAt: "2026-03-02T11:00:00.000Z",
    updatedAt: "2026-03-04T15:30:00.000Z",
    statusHistory: [
      {
        id: "hist-1",
        applicationId: "app-1",
        status: "Applied",
        changedBy: "Student",
        changedAt: "2026-03-02T11:00:00.000Z",
        remarks: "Application submitted successfully.",
      },
      {
        id: "hist-2",
        applicationId: "app-1",
        status: "Under Review",
        changedBy: "Recruiter",
        changedAt: "2026-03-03T09:15:00.000Z",
        remarks: "Profile matched skill requirements threshold.",
      },
      {
        id: "hist-3",
        applicationId: "app-1",
        status: "Interview Scheduled",
        changedBy: "Recruiter",
        changedAt: "2026-03-04T15:30:00.000Z",
        remarks: "Technical interview scheduled on Zoom.",
      },
    ],
  },
  {
    id: "app-2",
    studentId: "sprof-student-1",
    jobId: "job-2",
    resumeId: "res-1",
    fullName: "Alex Morgan",
    email: "student@demo.com",
    phone: "+91 9876543210",
    institution: "Indian Institute of Technology",
    degree: "B.Tech Computer Science",
    graduationYear: "2026",
    coverLetter: "Strong background in React, TypeScript, and design systems.",
    portfolioUrl: "https://alexmorgan.dev",
    availability: "Immediate (35 hrs/wk)",
    currentStatus: "Under Review",
    appliedAt: "2026-03-06T14:20:00.000Z",
    updatedAt: "2026-03-07T10:00:00.000Z",
    statusHistory: [
      {
        id: "hist-4",
        applicationId: "app-2",
        status: "Applied",
        changedBy: "Student",
        changedAt: "2026-03-06T14:20:00.000Z",
        remarks: "Application submitted successfully.",
      },
      {
        id: "hist-5",
        applicationId: "app-2",
        status: "Under Review",
        changedBy: "Recruiter",
        changedAt: "2026-03-07T10:00:00.000Z",
        remarks: "Resume under evaluation by hiring manager.",
      },
    ],
  },
];
