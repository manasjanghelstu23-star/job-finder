export interface MockJobPosting {
  id: string;
  title: string;
  company: string;
  companyId?: string;
  industryId?: string;
  description: string;
  location?: string;
  experience?: string;
  employmentType?: string;
  salary?: string;
  postedAt: string;
  source: string;
  externalUrl?: string;
  status: string;
  department?: string;
  workMode?: string;
  responsibilities?: string;
  projectTitle?: string;
  problemStatement?: string;
  deliverables?: string;
  learningOutcomes?: string;
  evaluationMethod?: string;
  eligibleDegrees?: string;
  eligibleBranches?: string;
  graduationYears?: string;
  minCgpa?: number;
  startDate?: string;
  endDate?: string;
  durationWeeks?: number;
  workingHours?: string;
  mentorName?: string;
  mentorDesignation?: string;
  mentorDepartment?: string;
  mentorContact?: string;
  skills: {
    id: string;
    jobId: string;
    skillId: string;
    requirementType: string;
    requiredLevel?: number;
    weight: number;
    skill: {
      id: string;
      name: string;
    };
  }[];
}

export const initialJobs: MockJobPosting[] = [
  {
    id: "job-1",
    title: "Software Engineer Intern - Full Stack",
    company: "Google Enterprise Partner",
    companyId: "comp-1",
    description: "Join our core Cloud Systems engineering team to build scalable microservices, high-throughput React frontends, and AI-driven data pipelines for global enterprise customers.",
    location: "Bangalore (Hybrid)",
    experience: "0-1 Years / Student",
    employmentType: "Full-Time Internship",
    salary: "₹50,000 / month",
    postedAt: "2026-03-01T09:00:00.000Z",
    source: "INTERNAL",
    status: "OPEN",
    department: "Enterprise AI & Cloud Platform",
    workMode: "Hybrid",
    responsibilities: "1. Architect responsive React + Next.js web applications.\n2. Implement RESTful and GraphQL backend endpoints in Node.js.\n3. Collaborate with senior cloud architects on microservice orchestration.",
    projectTitle: "Automated Developer Workspace Provisioning Engine",
    problemStatement: "Optimizing cloud developer environment startup latency from minutes to milliseconds.",
    deliverables: "Working dashboard, sub-second API endpoint responses, production deployment guide.",
    learningOutcomes: "Master React server components, distributed caching, and CI/CD deployment pipelines.",
    evaluationMethod: "Weekly sprint review, pull request quality, and mentor technical demonstration.",
    eligibleDegrees: "B.Tech, B.E., M.Tech, MCA",
    eligibleBranches: "Computer Science, Information Technology, Software Engineering",
    graduationYears: "2025, 2026",
    minCgpa: 7.5,
    startDate: "2026-06-01",
    endDate: "2026-07-31",
    durationWeeks: 8,
    workingHours: "40 hrs/week (Mon-Fri)",
    mentorName: "Vikram Rao",
    mentorDesignation: "Senior Engineering Lead",
    mentorDepartment: "Core Platform Engineering",
    mentorContact: "vikram.rao@google-partner.example.com",
    skills: [
      { id: "jsk-1", jobId: "job-1", skillId: "sk-1", requirementType: "REQUIRED", weight: 1.0, skill: { id: "sk-1", name: "JavaScript" } },
      { id: "jsk-2", jobId: "job-1", skillId: "sk-2", requirementType: "REQUIRED", weight: 1.0, skill: { id: "sk-2", name: "TypeScript" } },
      { id: "jsk-3", jobId: "job-1", skillId: "sk-3", requirementType: "REQUIRED", weight: 1.0, skill: { id: "sk-3", name: "React" } },
      { id: "jsk-4", jobId: "job-1", skillId: "sk-4", requirementType: "PREFERRED", weight: 0.8, skill: { id: "sk-4", name: "Next.js" } },
      { id: "jsk-5", jobId: "job-1", skillId: "sk-5", requirementType: "REQUIRED", weight: 0.9, skill: { id: "sk-5", name: "Node.js" } },
    ],
  },
  {
    id: "job-2",
    title: "Frontend Developer Intern",
    company: "MetaBuilds Labs",
    companyId: "comp-1",
    description: "Craft modern, accessible, high-performance UI components for our next-generation web design platform using React, Tailwind CSS, and WebSockets.",
    location: "Remote",
    experience: "0-1 Years",
    employmentType: "Internship",
    salary: "₹45,000 / month",
    postedAt: "2026-03-05T10:30:00.000Z",
    source: "INTERNAL",
    status: "OPEN",
    department: "User Interface & Design Engineering",
    workMode: "Remote",
    responsibilities: "Build responsive UI components, maintain design tokens, write end-to-end tests.",
    projectTitle: "Real-Time Collaborative UI Studio",
    problemStatement: "Enabling multi-user synchronous canvas editing with zero layout shift.",
    deliverables: "Interactive component library with unit and integration tests.",
    learningOutcomes: "Deep expertise in state management, real-time sync, and accessibility standards.",
    evaluationMethod: "Code review and bi-weekly milestone demos.",
    eligibleDegrees: "B.Tech, B.S., MCA",
    eligibleBranches: "Computer Science, IT, Media Technology",
    graduationYears: "2025, 2026, 2027",
    minCgpa: 7.0,
    startDate: "2026-05-15",
    endDate: "2026-08-15",
    durationWeeks: 12,
    workingHours: "35 hrs/week",
    mentorName: "Ananya Sharma",
    mentorDesignation: "Principal UI Architect",
    mentorDepartment: "Design System Group",
    mentorContact: "ananya@metabuilds.example.com",
    skills: [
      { id: "jsk-6", jobId: "job-2", skillId: "sk-3", requirementType: "REQUIRED", weight: 1.0, skill: { id: "sk-3", name: "React" } },
      { id: "jsk-7", jobId: "job-2", skillId: "sk-2", requirementType: "REQUIRED", weight: 1.0, skill: { id: "sk-2", name: "TypeScript" } },
      { id: "jsk-8", jobId: "job-2", skillId: "sk-15", requirementType: "REQUIRED", weight: 0.9, skill: { id: "sk-15", name: "Tailwind CSS" } },
    ],
  },
  {
    id: "job-3",
    title: "Backend Engineering & Systems Intern",
    company: "FinTech Cloud",
    companyId: "comp-1",
    description: "Design secure, resilient payment gateway endpoints, transactional PostgreSQL schemas, and Redis caching layers for high-throughput financial transactions.",
    location: "Mumbai (In-Office)",
    experience: "Student / Fresh Graduate",
    employmentType: "Internship to PPO",
    salary: "₹48,000 / month",
    postedAt: "2026-03-08T14:15:00.000Z",
    source: "INTERNAL",
    status: "OPEN",
    department: "Payments & Banking Architecture",
    workMode: "In-Office",
    responsibilities: "Develop idempotent transaction processing pipelines, write stress tests, optimize SQL queries.",
    projectTitle: "High-Frequency Ledger Verification Service",
    problemStatement: "Scaling transaction auditing to 10,000 requests per second with strict ACID compliance.",
    deliverables: "Production ready microservice module with benchmarks.",
    learningOutcomes: "Hands-on experience with database indexing, lock contention, and microservice resilience.",
    evaluationMethod: "Technical review, load test results, and peer feedback.",
    eligibleDegrees: "B.Tech, M.Tech, MCA",
    eligibleBranches: "Computer Science, Information Technology",
    graduationYears: "2025, 2026",
    minCgpa: 8.0,
    startDate: "2026-06-01",
    endDate: "2026-09-01",
    durationWeeks: 12,
    workingHours: "40 hrs/week",
    mentorName: "Rohan Varma",
    mentorDesignation: "Lead Systems Architect",
    mentorDepartment: "Backend Infrastructure",
    mentorContact: "rohan.varma@fintechcloud.example.com",
    skills: [
      { id: "jsk-9", jobId: "job-3", skillId: "sk-5", requirementType: "REQUIRED", weight: 1.0, skill: { id: "sk-5", name: "Node.js" } },
      { id: "jsk-10", jobId: "job-3", skillId: "sk-8", requirementType: "REQUIRED", weight: 1.0, skill: { id: "sk-8", name: "PostgreSQL" } },
      { id: "jsk-11", jobId: "job-3", skillId: "sk-10", requirementType: "PREFERRED", weight: 0.7, skill: { id: "sk-10", name: "Docker" } },
    ],
  },
  {
    id: "job-4",
    title: "AI Research & Machine Learning Intern",
    company: "DeepNeural AI Labs",
    companyId: "comp-1",
    description: "Work on Generative AI models, Retrieval-Augmented Generation (RAG) pipelines, and LLM fine-tuning for domain-specific NLP applications.",
    location: "Bangalore (Hybrid)",
    experience: "Student",
    employmentType: "Research Internship",
    salary: "₹60,000 / month",
    postedAt: "2026-03-10T11:00:00.000Z",
    source: "INTERNAL",
    status: "OPEN",
    department: "AI Research & Innovation",
    workMode: "Hybrid",
    responsibilities: "Train domain embeddings, build vector database indexing pipelines, benchmark LLM outputs.",
    projectTitle: "Domain-Specific Knowledge Graph Retrieval",
    problemStatement: "Reducing hallucination in industrial compliance querying.",
    deliverables: "Benchmarked RAG pipeline and technical whitepaper.",
    learningOutcomes: "State-of-the-art vector search, PyTorch/Transformers training, and AI evaluation frameworks.",
    evaluationMethod: "Weekly research presentation and model benchmark scores.",
    eligibleDegrees: "B.Tech, M.Tech, Ph.D.",
    eligibleBranches: "Computer Science, AI & ML, Mathematics",
    graduationYears: "2025, 2026, 2027",
    minCgpa: 8.5,
    startDate: "2026-06-01",
    endDate: "2026-08-31",
    durationWeeks: 12,
    workingHours: "40 hrs/week",
    mentorName: "Dr. Rajesh K.",
    mentorDesignation: "Chief AI Scientist",
    mentorDepartment: "Deep Learning Research",
    mentorContact: "rajesh.k@deepneural.example.com",
    skills: [
      { id: "jsk-12", jobId: "job-4", skillId: "sk-7", requirementType: "REQUIRED", weight: 1.0, skill: { id: "sk-7", name: "Python" } },
      { id: "jsk-13", jobId: "job-4", skillId: "sk-18", requirementType: "REQUIRED", weight: 0.9, skill: { id: "sk-18", name: "System Architecture" } },
    ],
  },
];
