export interface MockResume {
  id: string;
  studentId: string;
  originalFilename: string;
  storageReference: string;
  fileType: string;
  fileSize: number;
  uploadStatus: string;
  uploadedAt: string;
  analysisStatus: string;
  analysisVersion?: string;
  extractedText?: string;
  errorMessage?: string;
  structuredData?: string;
}

export const initialResumes: MockResume[] = [
  {
    id: "res-1",
    studentId: "sprof-student-1",
    originalFilename: "Alex_Morgan_FullStack_Resume_2026.pdf",
    storageReference: "/uploads/resumes/res-1.pdf",
    fileType: "application/pdf",
    fileSize: 245890,
    uploadStatus: "COMPLETED",
    uploadedAt: "2026-02-10T10:00:00.000Z",
    analysisStatus: "COMPLETED",
    analysisVersion: "v2.4",
    extractedText: "Alex Morgan. Computer Science Student at IIT. Experienced with React, TypeScript, Node.js, Express, PostgreSQL, Docker, Git. Built collaborative cloud platforms and REST microservices.",
    structuredData: JSON.stringify({
      skills: ["React", "TypeScript", "Node.js", "Express.js", "PostgreSQL", "Docker", "Git"],
      education: "B.Tech Computer Science & Engineering, IIT",
      experienceYears: 1,
    }),
  },
];
