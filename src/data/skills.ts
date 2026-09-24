export interface MockSkill {
  id: string;
  name: string;
  categoryId: string;
  categoryName: string;
}

export interface MockSkillScore {
  id: string;
  studentId: string;
  skillId: string;
  score: number;
  coverage: number;
  assessedAt: string;
  status: string;
  verification: string;
  skillName: string;
}

export const initialSkillCategories = [
  { id: "cat-1", name: "Software Development & Architecture" },
  { id: "cat-2", name: "Frontend Engineering" },
  { id: "cat-3", name: "Backend & Databases" },
  { id: "cat-4", name: "DevOps & Cloud Systems" },
  { id: "cat-5", name: "Artificial Intelligence & Data Science" },
  { id: "cat-6", name: "Soft Skills & Professional Aptitude" },
];

export const MOCK_SKILL_CATEGORIES = initialSkillCategories;

export const initialSkills: MockSkill[] = [
  { id: "sk-1", name: "JavaScript", categoryId: "cat-2", categoryName: "Frontend Engineering" },
  { id: "sk-2", name: "TypeScript", categoryId: "cat-2", categoryName: "Frontend Engineering" },
  { id: "sk-3", name: "React", categoryId: "cat-2", categoryName: "Frontend Engineering" },
  { id: "sk-4", name: "Next.js", categoryId: "cat-2", categoryName: "Frontend Engineering" },
  { id: "sk-5", name: "Node.js", categoryId: "cat-3", categoryName: "Backend & Databases" },
  { id: "sk-6", name: "Express.js", categoryId: "cat-3", categoryName: "Backend & Databases" },
  { id: "sk-7", name: "Python", categoryId: "cat-5", categoryName: "Artificial Intelligence & Data Science" },
  { id: "sk-8", name: "PostgreSQL", categoryId: "cat-3", categoryName: "Backend & Databases" },
  { id: "sk-9", name: "MongoDB", categoryId: "cat-3", categoryName: "Backend & Databases" },
  { id: "sk-10", name: "Docker", categoryId: "cat-4", categoryName: "DevOps & Cloud Systems" },
  { id: "sk-11", name: "Kubernetes", categoryId: "cat-4", categoryName: "DevOps & Cloud Systems" },
  { id: "sk-12", name: "Git & Version Control", categoryId: "cat-1", categoryName: "Software Development & Architecture" },
  { id: "sk-13", name: "REST APIs", categoryId: "cat-1", categoryName: "Software Development & Architecture" },
  { id: "sk-14", name: "GraphQL", categoryId: "cat-1", categoryName: "Software Development & Architecture" },
  { id: "sk-15", name: "Tailwind CSS", categoryId: "cat-2", categoryName: "Frontend Engineering" },
  { id: "sk-16", name: "Communication", categoryId: "cat-6", categoryName: "Soft Skills & Professional Aptitude" },
  { id: "sk-17", name: "Problem Solving", categoryId: "cat-6", categoryName: "Soft Skills & Professional Aptitude" },
  { id: "sk-18", name: "System Architecture", categoryId: "cat-1", categoryName: "Software Development & Architecture" },
];

export const MOCK_SKILLS = initialSkills;

export const initialSkillScores: MockSkillScore[] = [
  {
    id: "ss-1",
    studentId: "sprof-student-1",
    skillId: "sk-1",
    skillName: "JavaScript",
    score: 88,
    coverage: 90,
    assessedAt: "2026-02-01T12:00:00.000Z",
    status: "Assessed",
    verification: "Verified",
  },
  {
    id: "ss-2",
    studentId: "sprof-student-1",
    skillId: "sk-3",
    skillName: "React",
    score: 85,
    coverage: 85,
    assessedAt: "2026-02-05T12:00:00.000Z",
    status: "Assessed",
    verification: "Verified",
  },
  {
    id: "ss-3",
    studentId: "sprof-student-1",
    skillId: "sk-5",
    skillName: "Node.js",
    score: 78,
    coverage: 80,
    assessedAt: "2026-02-10T12:00:00.000Z",
    status: "Assessed",
    verification: "Verified",
  },
  {
    id: "ss-4",
    studentId: "sprof-student-1",
    skillId: "sk-2",
    skillName: "TypeScript",
    score: 80,
    coverage: 82,
    assessedAt: "2026-02-15T12:00:00.000Z",
    status: "Assessed",
    verification: "Verified",
  },
  {
    id: "ss-5",
    studentId: "sprof-student-1",
    skillId: "sk-4",
    skillName: "Next.js",
    score: 82,
    coverage: 85,
    assessedAt: "2026-02-20T12:00:00.000Z",
    status: "Assessed",
    verification: "Verified",
  },
];
