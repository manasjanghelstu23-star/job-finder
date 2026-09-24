export interface MockUser {
  id: string;
  email: string;
  passwordHash: string;
  role: "STUDENT" | "COMPANY" | "INSTITUTE" | "ADMIN";
  isVerified: boolean;
  status: string;
  createdAt: string;
  updatedAt: string;
  profile?: {
    id: string;
    userId: string;
    role: string;
    fullName: string;
    email: string;
    phone?: string;
    profilePhoto?: string;
    bio?: string;
    college?: string;
    course?: string;
    branch?: string;
    graduationYear?: number;
  };
  studentProfile?: {
    id: string;
    userId: string;
    targetRole?: string;
    studentId?: string;
    college?: string;
    degree?: string;
    branch?: string;
    semester?: number;
    cgpa?: number;
    resumeUrl?: string;
    githubUrl?: string;
    linkedinUrl?: string;
    portfolioUrl?: string;
    institutionId?: string;
  };
  companyProfile?: {
    id: string;
    userId: string;
    companyName: string;
    industry?: string;
    website?: string;
    description?: string;
    location?: string;
    verificationStatus: string;
  };
  institutionProfile?: {
    id: string;
    userId: string;
    institutionName: string;
    domain?: string;
  };
}

export const initialUsers: MockUser[] = [
  {
    id: "usr-student-1",
    email: "student@demo.com",
    // bcrypt hash of 'password123'
    passwordHash: "$2a$10$wN1d5j9V3H8G1eR.gJ5fGe7oZ.N4a.3eWq0R.1e2r3t4y5u6i7o8p",
    role: "STUDENT",
    isVerified: true,
    status: "ACTIVE",
    createdAt: "2026-01-15T10:00:00.000Z",
    updatedAt: "2026-01-15T10:00:00.000Z",
    profile: {
      id: "prof-student-1",
      userId: "usr-student-1",
      role: "STUDENT",
      fullName: "Alex Morgan",
      email: "student@demo.com",
      phone: "+91 9876543210",
      bio: "Passionate Full Stack Engineering Student building cloud-native web applications and AI-driven platforms.",
      college: "Indian Institute of Technology",
      course: "B.Tech",
      branch: "Computer Science & Engineering",
      graduationYear: 2026,
    },
    studentProfile: {
      id: "sprof-student-1",
      userId: "usr-student-1",
      targetRole: "Full Stack Engineer",
      studentId: "STU2026-8942",
      college: "Indian Institute of Technology",
      degree: "B.Tech",
      branch: "Computer Science",
      semester: 7,
      cgpa: 8.9,
      resumeUrl: "/resumes/sample-alex-morgan.pdf",
      githubUrl: "https://github.com/alex-morgan",
      linkedinUrl: "https://linkedin.com/in/alex-morgan",
      portfolioUrl: "https://alexmorgan.dev",
      institutionId: "inst-1",
    },
  },
  {
    id: "usr-company-1",
    email: "company@demo.com",
    passwordHash: "$2a$10$wN1d5j9V3H8G1eR.gJ5fGe7oZ.N4a.3eWq0R.1e2r3t4y5u6i7o8p",
    role: "COMPANY",
    isVerified: true,
    status: "ACTIVE",
    createdAt: "2026-01-10T10:00:00.000Z",
    updatedAt: "2026-01-10T10:00:00.000Z",
    profile: {
      id: "prof-company-1",
      userId: "usr-company-1",
      role: "COMPANY",
      fullName: "TechCorp Global Recruiting Team",
      email: "company@demo.com",
      phone: "+1 800-555-0199",
      bio: "Leading enterprise technology provider accelerating AI, cloud software development, and campus hiring.",
    },
    companyProfile: {
      id: "comp-1",
      userId: "usr-company-1",
      companyName: "TechCorp Global",
      industry: "Software & Cloud Systems",
      website: "https://techcorpglobal.example.com",
      description: "Global enterprise engineering company hiring top campus talent for software development.",
      location: "Bangalore, India",
      verificationStatus: "VERIFIED",
    },
  },
  {
    id: "usr-institute-1",
    email: "institute@demo.com",
    passwordHash: "$2a$10$wN1d5j9V3H8G1eR.gJ5fGe7oZ.N4a.3eWq0R.1e2r3t4y5u6i7o8p",
    role: "INSTITUTE",
    isVerified: true,
    status: "ACTIVE",
    createdAt: "2026-01-05T10:00:00.000Z",
    updatedAt: "2026-01-05T10:00:00.000Z",
    profile: {
      id: "prof-institute-1",
      userId: "usr-institute-1",
      role: "INSTITUTE",
      fullName: "IIT Placement & Internship Cell",
      email: "institute@demo.com",
      phone: "+91 80-2345-6789",
      bio: "Official Campus Placement Office facilitating student career readiness, skill benchmarks, and hiring drives.",
    },
    institutionProfile: {
      id: "inst-1",
      userId: "usr-institute-1",
      institutionName: "Indian Institute of Technology",
      domain: "iit.ac.in",
    },
  },
  {
    id: "usr-admin-1",
    email: "admin@demo.com",
    passwordHash: "$2a$10$wN1d5j9V3H8G1eR.gJ5fGe7oZ.N4a.3eWq0R.1e2r3t4y5u6i7o8p",
    role: "ADMIN",
    isVerified: true,
    status: "ACTIVE",
    createdAt: "2026-01-01T10:00:00.000Z",
    updatedAt: "2026-01-01T10:00:00.000Z",
    profile: {
      id: "prof-admin-1",
      userId: "usr-admin-1",
      role: "ADMIN",
      fullName: "System Administrator",
      email: "admin@demo.com",
    },
  },
];
