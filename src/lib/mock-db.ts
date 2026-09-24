import { initialUsers, MockUser } from "@/data/users";
import { initialSkills, initialSkillCategories, initialSkillScores, MockSkill, MockSkillScore } from "@/data/skills";
import { initialJobs, MockJobPosting } from "@/data/jobs";
import { initialApplications, MockApplication } from "@/data/applications";
import { initialActiveInternships, MockActiveInternship } from "@/data/internships";
import { initialCommunities, initialMessages, MockCommunity, MockMessage } from "@/data/communities";
import { initialIndustryQuestions, initialAssessments, MockIndustryQuestion, MockAssessment } from "@/data/assessments";
import { initialResumes, MockResume } from "@/data/resumes";

// Global In-Memory Singleton Store for Serverless Lifecycles
declare global {
  var __MOCK_DB_STORE__: {
    users: MockUser[];
    skills: MockSkill[];
    skillCategories: typeof initialSkillCategories;
    skillScores: MockSkillScore[];
    jobs: MockJobPosting[];
    applications: MockApplication[];
    activeInternships: MockActiveInternship[];
    communities: MockCommunity[];
    messages: MockMessage[];
    industryQuestions: MockIndustryQuestion[];
    assessments: MockAssessment[];
    resumes: MockResume[];
  } | undefined;
}

if (!global.__MOCK_DB_STORE__) {
  global.__MOCK_DB_STORE__ = {
    users: JSON.parse(JSON.stringify(initialUsers)),
    skills: JSON.parse(JSON.stringify(initialSkills)),
    skillCategories: JSON.parse(JSON.stringify(initialSkillCategories)),
    skillScores: JSON.parse(JSON.stringify(initialSkillScores)),
    jobs: JSON.parse(JSON.stringify(initialJobs)),
    applications: JSON.parse(JSON.stringify(initialApplications)),
    activeInternships: JSON.parse(JSON.stringify(initialActiveInternships)),
    communities: JSON.parse(JSON.stringify(initialCommunities)),
    messages: JSON.parse(JSON.stringify(initialMessages)),
    industryQuestions: JSON.parse(JSON.stringify(initialIndustryQuestions)),
    assessments: JSON.parse(JSON.stringify(initialAssessments)),
    resumes: JSON.parse(JSON.stringify(initialResumes)),
  };
}

const store = global.__MOCK_DB_STORE__;

export const MOCK_USERS = store.users;
export const MOCK_STUDENTS = store.users.map(u => formatUserWithRelations(u)?.studentProfile).filter(Boolean) as any[];
export const MOCK_RESUMES = store.resumes;

// Helper to construct fully populated User object matching Prisma include structures
export function formatUserWithRelations(user: MockUser) {
  if (!user) return null;
  const profile = user.profile || {
    id: `prof-${user.id}`,
    userId: user.id,
    role: user.role,
    fullName: user.email.split("@")[0],
    email: user.email,
  };

  const studentProfile = user.studentProfile || (user.role === "STUDENT" ? {
    id: `sprof-${user.id}`,
    userId: user.id,
    targetRole: "Full Stack Engineer",
    college: profile.college || "University Institute of Technology",
    degree: profile.course || "B.Tech",
    branch: profile.branch || "Computer Science",
    semester: 6,
    cgpa: 8.5,
    resumeUrl: "/resumes/sample.pdf",
    skillScores: store.skillScores.filter(s => s.studentId === `sprof-${user.id}` || s.studentId === "sprof-student-1"),
    internshipApplications: store.applications.filter(a => a.studentId === user.id || a.studentId === `sprof-${user.id}` || a.studentId === "sprof-student-1"),
  } : null);

  const companyProfile = user.companyProfile || (user.role === "COMPANY" ? {
    id: `comp-${user.id}`,
    userId: user.id,
    companyName: profile.fullName || "Corporate Partner",
    industry: "Software & Technology",
    description: "Leading technology enterprise hiring top students.",
    location: "Bangalore, India",
    verificationStatus: "VERIFIED",
  } : null);

  const institutionProfile = user.institutionProfile || (user.role === "INSTITUTE" ? {
    id: `inst-${user.id}`,
    userId: user.id,
    institutionName: profile.fullName || "Academic Partner Institute",
    domain: "edu.in",
  } : null);

  return {
    ...user,
    profile,
    studentProfile,
    companyProfile,
    institutionProfile,
  };
}

// -----------------------------------------------------------------------------
// USER & AUTHENTICATION MOCK DATA ACCESS
// -----------------------------------------------------------------------------

export function findUserByEmail(email: string) {
  const clean = email.trim().toLowerCase();
  const found = store.users.find((u) => u.email.toLowerCase() === clean);
  return found ? formatUserWithRelations(found) : null;
}

export function findUserById(id: string) {
  const found = store.users.find((u) => u.id === id);
  return found ? formatUserWithRelations(found) : null;
}

export function createUser(data: {
  email: string;
  passwordHash: string;
  role: string;
  fullName?: string;
  companyName?: string;
  institutionName?: string;
  targetRole?: string;
}) {
  const userId = `usr-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
  const cleanEmail = data.email.trim().toLowerCase();
  const role = (data.role || "STUDENT").toUpperCase() as MockUser["role"];
  const displayName = data.fullName || data.companyName || data.institutionName || cleanEmail.split("@")[0];

  const newUser: MockUser = {
    id: userId,
    email: cleanEmail,
    passwordHash: data.passwordHash,
    role,
    isVerified: true,
    status: "ACTIVE",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    profile: {
      id: `prof-${userId}`,
      userId,
      role,
      fullName: displayName,
      email: cleanEmail,
    },
    ...(role === "STUDENT"
      ? {
          studentProfile: {
            id: `sprof-${userId}`,
            userId,
            targetRole: data.targetRole || "Software Engineer",
            college: "University Campus",
            degree: "B.Tech",
            branch: "Computer Science",
            cgpa: 8.2,
          },
        }
      : {}),
    ...(role === "COMPANY"
      ? {
          companyProfile: {
            id: `comp-${userId}`,
            userId,
            companyName: data.companyName || displayName,
            industry: "Technology",
            verificationStatus: "VERIFIED",
          },
        }
      : {}),
    ...(role === "INSTITUTE"
      ? {
          institutionProfile: {
            id: `inst-${userId}`,
            userId,
            institutionName: data.institutionName || displayName,
          },
        }
      : {}),
  };

  store.users.push(newUser);
  return formatUserWithRelations(newUser);
}

export function updateUserProfile(userId: string, profileData: any) {
  const user = store.users.find((u) => u.id === userId);
  if (!user) return null;

  user.updatedAt = new Date().toISOString();
  if (user.profile) {
    user.profile = { ...user.profile, ...profileData };
  } else {
    user.profile = {
      id: `prof-${userId}`,
      userId,
      role: user.role,
      fullName: profileData.fullName || user.email.split("@")[0],
      email: user.email,
      ...profileData,
    };
  }

  if (user.role === "STUDENT") {
    user.studentProfile = {
      ...user.studentProfile,
      id: user.studentProfile?.id || `sprof-${userId}`,
      userId,
      college: profileData.college || user.studentProfile?.college,
      degree: profileData.course || profileData.degree || user.studentProfile?.degree,
      branch: profileData.branch || user.studentProfile?.branch,
      targetRole: profileData.targetRole || user.studentProfile?.targetRole,
      githubUrl: profileData.githubUrl || user.studentProfile?.githubUrl,
      linkedinUrl: profileData.linkedinUrl || user.studentProfile?.linkedinUrl,
      portfolioUrl: profileData.portfolioUrl || user.studentProfile?.portfolioUrl,
    };
  }

  return formatUserWithRelations(user);
}

// -----------------------------------------------------------------------------
// JOBS & OPPORTUNITIES MOCK DATA ACCESS
// -----------------------------------------------------------------------------

export function getJobs(params?: {
  status?: string;
  query?: string;
  location?: string;
  type?: string;
  companyId?: string;
}) {
  let list = [...store.jobs];

  if (params?.status) {
    list = list.filter((j) => j.status.toUpperCase() === params.status?.toUpperCase());
  }

  if (params?.companyId) {
    const compId = params.companyId.toLowerCase();
    list = list.filter((j) => j.companyId === params.companyId || j.company.toLowerCase().includes(compId));
  }

  if (params?.query) {
    const q = params.query.toLowerCase();
    list = list.filter(
      (j) =>
        j.title.toLowerCase().includes(q) ||
        j.company.toLowerCase().includes(q) ||
        j.description.toLowerCase().includes(q) ||
        j.skills.some((s) => s.skill.name.toLowerCase().includes(q))
    );
  }

  if (params?.location) {
    const loc = params.location.toLowerCase();
    list = list.filter((j) => j.location?.toLowerCase().includes(loc));
  }

  return list;
}

export function getJobById(id: string) {
  const job = store.jobs.find((j) => j.id === id);
  return job || null;
}

export function createJob(jobData: Partial<MockJobPosting>) {
  const newJobId = `job-${Date.now()}`;
  const skills = (jobData.skills || []).map((s: any, idx: number) => ({
    id: `jsk-${Date.now()}-${idx}`,
    jobId: newJobId,
    skillId: s.skillId || `sk-${idx + 1}`,
    requirementType: s.requirementType || "REQUIRED",
    weight: s.weight || 1.0,
    skill: {
      id: s.skillId || `sk-${idx + 1}`,
      name: typeof s.skill === "string" ? s.skill : s.skill?.name || s.name || "Software Engineering",
    },
  }));

  const newJob: MockJobPosting = {
    id: newJobId,
    title: jobData.title || "Software Engineering Intern",
    company: jobData.company || "Corporate Partner",
    companyId: jobData.companyId || "comp-1",
    description: jobData.description || "Exciting internship opportunity for engineering students.",
    location: jobData.location || "Remote",
    experience: jobData.experience || "0-1 Years",
    employmentType: jobData.employmentType || "Internship",
    salary: jobData.salary || "₹45,000 / month",
    postedAt: new Date().toISOString(),
    source: jobData.source || "INTERNAL",
    status: jobData.status || "OPEN",
    department: jobData.department || "Engineering",
    workMode: jobData.workMode || "Hybrid",
    responsibilities: jobData.responsibilities || "Build scalable web components and API integrations.",
    projectTitle: jobData.projectTitle || "Platform Core Engineering",
    deliverables: jobData.deliverables || "Tested feature pull requests and design documents.",
    learningOutcomes: jobData.learningOutcomes || "Master modern web stack and system architecture.",
    eligibleDegrees: jobData.eligibleDegrees || "B.Tech, M.Tech, MCA",
    eligibleBranches: jobData.eligibleBranches || "Computer Science, IT",
    graduationYears: jobData.graduationYears || "2025, 2026",
    minCgpa: jobData.minCgpa || 7.0,
    startDate: jobData.startDate || "2026-06-01",
    endDate: jobData.endDate || "2026-08-31",
    durationWeeks: jobData.durationWeeks || 8,
    mentorName: jobData.mentorName || "Tech Team Lead",
    skills,
  };

  store.jobs.unshift(newJob);
  return newJob;
}

export function updateJob(id: string, updates: Partial<MockJobPosting>) {
  const idx = store.jobs.findIndex((j) => j.id === id);
  if (idx === -1) return null;
  store.jobs[idx] = { ...store.jobs[idx], ...updates };
  return store.jobs[idx];
}

export function deleteJob(id: string) {
  const idx = store.jobs.findIndex((j) => j.id === id);
  if (idx === -1) return false;
  store.jobs.splice(idx, 1);
  return true;
}

// -----------------------------------------------------------------------------
// APPLICATIONS MOCK DATA ACCESS
// -----------------------------------------------------------------------------

export function getApplications(filters?: { studentId?: string; jobId?: string; companyId?: string }) {
  let list = [...store.applications];

  if (filters?.studentId) {
    list = list.filter((a) => a.studentId === filters.studentId || a.studentId === "sprof-student-1" || a.email === filters.studentId);
  }

  if (filters?.jobId) {
    list = list.filter((a) => a.jobId === filters.jobId);
  }

  // Populate related job and student info
  return list.map((app) => ({
    ...app,
    job: store.jobs.find((j) => j.id === app.jobId) || {
      id: app.jobId,
      title: "Software Engineering Intern",
      company: "TechCorp Global",
      location: "Bangalore",
    },
    student: {
      id: app.studentId,
      user: {
        profile: { fullName: app.fullName || "Alex Morgan" },
      },
    },
  }));
}

export function getApplicationById(id: string) {
  const app = store.applications.find((a) => a.id === id);
  if (!app) return null;
  return {
    ...app,
    job: store.jobs.find((j) => j.id === app.jobId),
  };
}

export function createApplication(data: Partial<MockApplication>) {
  const appId = `app-${Date.now()}`;
  const now = new Date().toISOString();

  const newApp: MockApplication = {
    id: appId,
    studentId: data.studentId || "sprof-student-1",
    jobId: data.jobId || "job-1",
    resumeId: data.resumeId || "res-1",
    fullName: data.fullName || "Alex Morgan",
    email: data.email || "student@demo.com",
    phone: data.phone || "+91 9876543210",
    institution: data.institution || "Indian Institute of Technology",
    degree: data.degree || "B.Tech Computer Science",
    graduationYear: data.graduationYear || "2026",
    coverLetter: data.coverLetter || "Excited to apply for this internship role.",
    portfolioUrl: data.portfolioUrl || "https://alexmorgan.dev",
    availability: data.availability || "Immediate",
    currentStatus: "Applied",
    appliedAt: now,
    updatedAt: now,
    statusHistory: [
      {
        id: `hist-${Date.now()}`,
        applicationId: appId,
        status: "Applied",
        changedBy: "Student",
        changedAt: now,
        remarks: "Application submitted via platform.",
      },
    ],
  };

  store.applications.unshift(newApp);
  return newApp;
}

export function updateApplicationStatus(id: string, status: string, remarks?: string, changedBy = "Recruiter") {
  const app = store.applications.find((a) => a.id === id);
  if (!app) return null;

  app.currentStatus = status;
  app.updatedAt = new Date().toISOString();
  if (!app.statusHistory) app.statusHistory = [];
  app.statusHistory.push({
    id: `hist-${Date.now()}`,
    applicationId: id,
    status,
    changedBy,
    changedAt: new Date().toISOString(),
    remarks: remarks || `Status updated to ${status}`,
  });

  return app;
}

// -----------------------------------------------------------------------------
// ACTIVE INTERNSHIPS MOCK DATA ACCESS
// -----------------------------------------------------------------------------

export function getActiveInternships(studentId?: string) {
  let list = [...store.activeInternships];
  if (studentId) {
    list = list.filter((i) => i.studentId === studentId || i.studentId === "sprof-student-1");
  }
  return list;
}

export function getActiveInternshipById(id: string) {
  return store.activeInternships.find((i) => i.id === id) || null;
}

export function toggleInternshipTask(taskId: string, isCompleted?: boolean) {
  for (const internship of store.activeInternships) {
    for (const milestone of internship.milestones) {
      const task = milestone.tasks.find((t) => t.id === taskId);
      if (task) {
        task.isCompleted = isCompleted !== undefined ? isCompleted : !task.isCompleted;
        task.completedAt = task.isCompleted ? new Date().toISOString() : undefined;

        // Recalculate milestone progress
        const total = milestone.tasks.length;
        const done = milestone.tasks.filter((t) => t.isCompleted).length;
        milestone.percentage = Math.round((done / total) * 100);
        milestone.status = milestone.percentage === 100 ? "COMPLETED" : milestone.percentage > 0 ? "IN_PROGRESS" : "PENDING";

        // Recalculate overall internship progress
        const totalMs = internship.milestones.length;
        const sumPct = internship.milestones.reduce((acc, m) => acc + m.percentage, 0);
        internship.overallProgress = Math.round(sumPct / totalMs);

        return internship;
      }
    }
  }
  return null;
}

export function addWeeklyUpdate(internshipId: string, updateData: any) {
  const internship = store.activeInternships.find((i) => i.id === internshipId);
  if (!internship) return null;

  const newUpdate = {
    id: `upd-${Date.now()}`,
    internshipId,
    weekNumber: updateData.weekNumber || internship.weeklyUpdates.length + 1,
    weekTitle: updateData.weekTitle || `Week ${internship.weeklyUpdates.length + 1} Progress`,
    summary: updateData.summary || "Weekly development updates submitted.",
    submittedWorkUrl: updateData.submittedWorkUrl,
    blockers: updateData.blockers || "None",
    submittedAt: new Date().toISOString(),
  };

  internship.weeklyUpdates.unshift(newUpdate);
  return internship;
}

export function addMentorFeedback(internshipId: string, feedbackData: any) {
  const internship = store.activeInternships.find((i) => i.id === internshipId);
  if (!internship) return null;

  const feedbackId = `mfb-${Date.now()}`;
  const newFeedback = {
    id: feedbackId,
    internshipId,
    mentorName: feedbackData.mentorName || internship.mentorName,
    mentorRole: feedbackData.mentorRole || internship.mentorRole,
    reviewDate: new Date().toISOString(),
    generalFeedback: feedbackData.generalFeedback || "Great technical progress.",
    strengths: typeof feedbackData.strengths === "string" ? feedbackData.strengths : JSON.stringify(feedbackData.strengths || ["Clean code"]),
    improvementAreas: typeof feedbackData.improvementAreas === "string" ? feedbackData.improvementAreas : JSON.stringify(feedbackData.improvementAreas || ["Unit testing"]),
    skillEvaluations: (feedbackData.skillEvaluations || []).map((se: any, idx: number) => ({
      id: `se-${Date.now()}-${idx}`,
      feedbackId,
      skillName: se.skillName || "React",
      proficiencyLevel: se.proficiencyLevel || "Proficient",
      scoreImpact: se.scoreImpact || 88,
    })),
  };

  internship.mentorFeedbacks.unshift(newFeedback);
  return internship;
}

export function completeInternship(internshipId: string, completionRating?: number, recommendationNote?: string) {
  const internship = store.activeInternships.find((i) => i.id === internshipId);
  if (!internship) return null;

  internship.status = "COMPLETED";
  internship.overallProgress = 100;

  const certNo = `CERT-2026-${Math.floor(1000 + Math.random() * 9000)}`;
  internship.completionRecord = {
    id: `comp-rec-${Date.now()}`,
    internshipId,
    finalRating: completionRating || 4.8,
    certificateNumber: certNo,
    verificationHash: `0x${Math.random().toString(16).substring(2, 18)}`,
    issuedAt: new Date().toISOString(),
    verifiedByCompany: true,
    certificateUrl: `/certificates/${certNo}.pdf`,
    recommendationNote: recommendationNote || "Outstanding student intern performance.",
  };

  return internship;
}

// -----------------------------------------------------------------------------
// COMMUNITIES MOCK DATA ACCESS
// -----------------------------------------------------------------------------

export function getCommunities(category?: string) {
  let list = [...store.communities];
  if (category) {
    list = list.filter((c) => c.category?.toLowerCase() === category.toLowerCase());
  }
  return list;
}

export function getCommunityById(id: string) {
  return store.communities.find((c) => c.id === id) || null;
}

export function createCommunity(communityData: any) {
  const id = `comm-${Date.now()}`;
  const newCommunity: MockCommunity = {
    id,
    name: communityData.name || "New Student Community",
    description: communityData.description || "Community for student developers and tech lovers.",
    icon: communityData.icon || "🚀",
    ownerId: communityData.ownerId || "usr-student-1",
    visibility: communityData.visibility || "PUBLIC",
    category: communityData.category || "General",
    targetSkills: typeof communityData.targetSkills === "string" ? communityData.targetSkills : JSON.stringify(communityData.targetSkills || []),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    members: [
      {
        id: `cm-${Date.now()}`,
        communityId: id,
        userId: communityData.ownerId || "usr-student-1",
        joinedAt: new Date().toISOString(),
        user: {
          id: communityData.ownerId || "usr-student-1",
          email: "student@demo.com",
          profile: { fullName: "Alex Morgan" },
        },
      },
    ],
    channels: [
      { id: `chan-${Date.now()}-1`, communityId: id, name: "general", type: "TEXT", position: 1 },
      { id: `chan-${Date.now()}-2`, communityId: id, name: "projects", type: "TEXT", position: 2 },
    ],
  };

  store.communities.unshift(newCommunity);
  return newCommunity;
}

export function joinCommunity(communityId: string, userId: string) {
  const community = store.communities.find((c) => c.id === communityId);
  if (!community) return null;

  const exists = community.members.some((m) => m.userId === userId);
  if (!exists) {
    const user = store.users.find((u) => u.id === userId);
    community.members.push({
      id: `cm-${Date.now()}`,
      communityId,
      userId,
      joinedAt: new Date().toISOString(),
      user: {
        id: userId,
        email: user?.email || "student@demo.com",
        profile: { fullName: user?.profile?.fullName || "Student Member" },
      },
    });
  }

  return community;
}

export function getChannelMessages(channelId: string) {
  return store.messages.filter((m) => m.channelId === channelId);
}

export function sendMessage(channelId: string, senderId: string, content: string, senderName?: string) {
  const user = store.users.find((u) => u.id === senderId);
  const msg: MockMessage = {
    id: `msg-${Date.now()}`,
    channelId,
    senderId,
    content,
    createdAt: new Date().toISOString(),
    senderName: senderName || user?.profile?.fullName || user?.email.split("@")[0] || "User",
  };

  store.messages.push(msg);
  return msg;
}

// -----------------------------------------------------------------------------
// ASSESSMENTS & QUESTIONS MOCK DATA ACCESS
// -----------------------------------------------------------------------------

export function getIndustryQuestions(filters?: { difficulty?: string }) {
  let list = [...store.industryQuestions];
  if (filters?.difficulty) {
    list = list.filter((q) => q.difficulty.toLowerCase() === filters.difficulty?.toLowerCase());
  }
  return list;
}

export function createIndustryQuestion(qData: any) {
  const id = `q-${Date.now()}`;
  const newQ: MockIndustryQuestion = {
    id,
    industryId: qData.industryId || "comp-1",
    text: qData.text || "Sample assessment question",
    type: qData.type || "MCQ",
    difficulty: qData.difficulty || "Intermediate",
    evaluationMethod: qData.evaluationMethod || "AUTOMATED_EXACT",
    status: "PUBLISHED",
    options: (qData.options || []).map((opt: any, idx: number) => ({
      id: `opt-${Date.now()}-${idx}`,
      questionId: id,
      text: typeof opt === "string" ? opt : opt.text,
      isCorrect: typeof opt === "object" ? Boolean(opt.isCorrect) : idx === 0,
      weight: typeof opt === "object" && opt.weight ? opt.weight : 1.0,
    })),
    skills: (qData.skills || []).map((s: any, idx: number) => ({
      id: `qs-${Date.now()}-${idx}`,
      questionId: id,
      skillId: s.skillId || "sk-1",
      weight: 1.0,
      skill: { id: s.skillId || "sk-1", name: s.name || "JavaScript" },
    })),
  };

  store.industryQuestions.unshift(newQ);
  return newQ;
}

export function generateAssessment(studentId: string, targetRole: string) {
  const id = `ass-${Date.now()}`;
  const assessment: MockAssessment = {
    id,
    studentId,
    targetRole: targetRole || "Full Stack Engineer",
    status: "PENDING",
    startedAt: new Date().toISOString(),
    questions: store.industryQuestions.map((q, idx) => ({
      id: `aq-${Date.now()}-${idx}`,
      assessmentId: id,
      industryQuestionId: q.id,
      order: idx + 1,
      industryQuestion: q,
    })),
  };

  store.assessments.unshift(assessment);
  return assessment;
}

export function getAssessmentById(id: string) {
  return store.assessments.find((a) => a.id === id) || null;
}

// -----------------------------------------------------------------------------
// SKILLS & RESUMES MOCK DATA ACCESS
// -----------------------------------------------------------------------------

export function getSkillCategories() {
  return store.skillCategories;
}

export function getSkills() {
  return store.skills;
}

export function getSkillScores(studentId: string) {
  return store.skillScores.filter((s) => s.studentId === studentId || s.studentId === "sprof-student-1");
}

export function upsertSkillScore(studentId: string, skillId: string, score: number) {
  let scoreItem = store.skillScores.find((s) => s.studentId === studentId && s.skillId === skillId);
  const skill = store.skills.find((sk) => sk.id === skillId) || { id: skillId, name: "Technology Skill" };

  if (scoreItem) {
    scoreItem.score = score;
    scoreItem.assessedAt = new Date().toISOString();
  } else {
    scoreItem = {
      id: `ss-${Date.now()}`,
      studentId,
      skillId,
      skillName: skill.name,
      score,
      coverage: 85,
      assessedAt: new Date().toISOString(),
      status: "Assessed",
      verification: "Verified",
    };
    store.skillScores.push(scoreItem);
  }

  return scoreItem;
}

export function getResumes(studentId: string) {
  return store.resumes.filter((r) => r.studentId === studentId || r.studentId === "sprof-student-1");
}

export function getResumeById(id: string) {
  return store.resumes.find((r) => r.id === id) || null;
}

export function createResume(data: Partial<MockResume>) {
  const newRes: MockResume = {
    id: `res-${Date.now()}`,
    studentId: data.studentId || "sprof-student-1",
    originalFilename: data.originalFilename || "Resume.pdf",
    storageReference: `/uploads/${data.originalFilename || "Resume.pdf"}`,
    fileType: data.fileType || "application/pdf",
    fileSize: data.fileSize || 150000,
    uploadStatus: "COMPLETED",
    uploadedAt: new Date().toISOString(),
    analysisStatus: "COMPLETED",
    analysisVersion: "v2.4",
    extractedText: data.extractedText || "Sample parsed student resume text.",
    structuredData: data.structuredData || JSON.stringify({ skills: ["JavaScript", "React", "Node.js"] }),
  };

  store.resumes.unshift(newRes);
  return newRes;
}

export function deleteResume(id: string) {
  const idx = store.resumes.findIndex((r) => r.id === id);
  if (idx === -1) return false;
  store.resumes.splice(idx, 1);
  return true;
}
