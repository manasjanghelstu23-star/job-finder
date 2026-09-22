"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Building2, 
  Briefcase, 
  Users, 
  ShieldCheck, 
  Plus, 
  MapPin, 
  CheckCircle2, 
  Clock, 
  ExternalLink, 
  Calendar, 
  ChevronRight, 
  Search, 
  Filter, 
  UserCheck, 
  AlertCircle, 
  TrendingUp, 
  Award,
  Sparkles,
  ArrowUpRight,
  Database,
  Check,
  X,
  SlidersHorizontal,
  Flame,
  FileCheck,
  Zap,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  BrainCircuit,
  BarChart3,
  Layers,
  FileText,
  BadgeAlert,
  Percent,
  CheckSquare,
  GraduationCap,
  BookOpen,
  Target,
  Compass,
  Lightbulb,
  UserX,
  UserPlus,
  FolderKanban,
  CheckCheck,
  PlayCircle,
  Star,
  GitPullRequest,
  Workflow,
  HelpCircle,
  Cpu
} from "lucide-react";
import { useSearchParams, useRouter } from "next/navigation";

export default function CompanyDashboardPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tabParam = searchParams.get("tab");

  // The 4 Primary Sections requested:
  // "home" -> Home / Company Overview & Telemetry
  // "employees" -> Employees / Workforce Intelligence & Database Employers
  // "job_postings" -> Job Posting / Published Internships & Shortage to Job
  // "applications" -> Applications / 2-Tier Candidate Ranking & Explainable Inspector
  const [activeSection, setActiveSection] = useState<"home" | "employees" | "job_postings" | "applications">(
    (tabParam as any) || "home"
  );

  // Sync state if URL query param changes
  useEffect(() => {
    if (tabParam && ["home", "employees", "job_postings", "applications"].includes(tabParam)) {
      setActiveSection(tabParam as any);
    }
  }, [tabParam]);

  const handleTabChange = (section: "home" | "employees" | "job_postings" | "applications") => {
    setActiveSection(section);
    router.push(`/company/dashboard?tab=${section}`);
  };

  // Overview Data
  const [overviewData, setOverviewData] = useState<any | null>(null);
  const [loadingOverview, setLoadingOverview] = useState(true);

  // Application Manager State
  const [candidatesData, setCandidatesData] = useState<any | null>(null);
  const [loadingCandidates, setLoadingCandidates] = useState(false);
  const [selectedJobFilter, setSelectedJobFilter] = useState<string>("");
  const [selectedCandidate, setSelectedCandidate] = useState<any | null>(null); // For "Why this Candidate?" Inspector
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  // Workforce Intelligence State
  const [workforceData, setWorkforceData] = useState<any | null>(null);
  const [loadingWorkforce, setLoadingWorkforce] = useState(false);

  // Employee Skill & Productivity Intelligence State
  const [employeeIntelligence, setEmployeeIntelligence] = useState<any | null>(null);
  const [loadingEmployees, setLoadingEmployees] = useState(false);
  const [employeeSubTab, setEmployeeSubTab] = useState<
    "directory" | "profile" | "projects" | "skills" | "gaps" | "learning" | "productivity" | "future_planning" | "capacity"
  >("directory");
  const [employeeSearchQuery, setEmployeeSearchQuery] = useState("");
  const [employeeDeptFilter, setEmployeeDeptFilter] = useState("ALL");
  const [selectedEmployee, setSelectedEmployee] = useState<any | null>(null);
  const [selectedProject, setSelectedProject] = useState<any | null>(null);
  const [assignedLearningNotice, setAssignedLearningNotice] = useState<string | null>(null);

  // Decision-Support Workforce Analysis & Job Generator State
  const [selectedAnalysisDept, setSelectedAnalysisDept] = useState<string>("Engineering");
  const [selectedAnalysisRole, setSelectedAnalysisRole] = useState<string>("Backend Engineer");
  const [selectedHiringReason, setSelectedHiringReason] = useState<string>("Project expansion");
  const [showJobDraftModal, setShowJobDraftModal] = useState<boolean>(false);
  const [isPublishingDraft, setIsPublishingDraft] = useState<boolean>(false);
  const [jobDraftForm, setJobDraftForm] = useState<any>({
    title: "Backend Engineer",
    department: "Engineering",
    openings: 5,
    hiringReason: "Project expansion",
    projectConnected: "Project A: Real-Time Telemetry & Observability Pipeline",
    description: "Architect, build, and optimize resilient distributed telemetry pipelines capable of sub-second event ingestion.",
    responsibilities: [
      "Architect resilient message streaming pipelines with Kafka & Redis",
      "Optimize PostgreSQL query execution plans and distributed indexes",
      "Ensure 99.99% system availability and automated microservices failover"
    ],
    requiredSkills: [
      { name: "Java", requirement: "Proficient (75%)", importance: "Critical" },
      { name: "Spring Boot", requirement: "Proficient (75%)", importance: "Critical" },
      { name: "SQL", requirement: "Proficient (75%)", importance: "High" },
      { name: "REST APIs", requirement: "Proficient (75%)", importance: "High" },
      { name: "Data Structures", requirement: "Proficient (75%)", importance: "High" }
    ],
    preferredSkills: [
      { name: "Docker", requirement: "Developing (60%)", importance: "Medium" },
      { name: "Kubernetes", requirement: "Developing (60%)", importance: "Medium" },
      { name: "AWS", requirement: "Developing (60%)", importance: "Preferred" }
    ],
    education: "B.Tech / B.E. / M.Tech in CS or IT",
    experience: "1-3 Years / New Grads / Campus Final Years",
    location: "Bangalore, India",
    workMode: "Hybrid (2 days remote / 3 days office)",
    salary: "₹45,000 / month (Intern) or 16-22 LPA",
    deadline: "2026-08-31",
    attachedAssessments: [
      { topic: "Java Concurrency & Multi-threading", questionCount: 10, source: "Question Bank (Java)" },
      { topic: "Spring Boot REST Microservices", questionCount: 8, source: "Question Bank (Spring Boot)" },
      { topic: "PostgreSQL Query Optimization & Indexing", questionCount: 7, source: "Question Bank (SQL)" }
    ]
  });

  // Add Employee Form State
  const [showAddEmployeeModal, setShowAddEmployeeModal] = useState(false);
  const [isAddingEmployee, setIsAddingEmployee] = useState(false);
  const [addEmployeeForm, setAddEmployeeForm] = useState({
    name: "",
    email: "",
    department: "Engineering",
    role: "Backend Engineer",
    experience: "2 years",
    currentProject: "Project X",
    technicalSkills: [
      { name: "Java", level: "Proficient", score: 80, category: "Languages", evidenceType: "Assessment", evidenceDetail: "Internal Benchmark Exam" },
      { name: "SQL", level: "Proficient", score: 78, category: "Databases", evidenceType: "Project", evidenceDetail: "Production database queries" }
    ],
    newSkillName: "",
    newSkillLevel: "Proficient",
    newSkillScore: 80,
    newSkillCategory: "Engineering",
    newSkillEvidenceType: "Assessment",
    newSkillEvidenceDetail: "",
    developmentAreas: [
      "Cloud Infrastructure & Distributed Systems",
      "CI/CD Pipeline Automation"
    ],
    newDevArea: ""
  });

  const handleAddSkillToNewEmployee = () => {
    if (!addEmployeeForm.newSkillName.trim()) return;
    setAddEmployeeForm(prev => ({
      ...prev,
      technicalSkills: [
        ...prev.technicalSkills,
        {
          name: prev.newSkillName.trim(),
          level: prev.newSkillLevel,
          score: Number(prev.newSkillScore) || 75,
          category: prev.newSkillCategory,
          evidenceType: prev.newSkillEvidenceType,
          evidenceDetail: prev.newSkillEvidenceDetail.trim() || `${prev.newSkillEvidenceType} recorded upon onboarding`
        }
      ],
      newSkillName: "",
      newSkillEvidenceDetail: ""
    }));
  };

  const handleRemoveSkillFromNewEmployee = (idx: number) => {
    setAddEmployeeForm(prev => ({
      ...prev,
      technicalSkills: prev.technicalSkills.filter((_, i) => i !== idx)
    }));
  };

  const handleAddDevAreaToNewEmployee = () => {
    if (!addEmployeeForm.newDevArea.trim()) return;
    setAddEmployeeForm(prev => ({
      ...prev,
      developmentAreas: [...prev.developmentAreas, prev.newDevArea.trim()],
      newDevArea: ""
    }));
  };

  const handleRemoveDevAreaFromNewEmployee = (idx: number) => {
    setAddEmployeeForm(prev => ({
      ...prev,
      developmentAreas: prev.developmentAreas.filter((_, i) => i !== idx)
    }));
  };

  const handleCreateEmployee = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!addEmployeeForm.name.trim() || !addEmployeeForm.email.trim()) {
      alert("Please provide the employee name and corporate email.");
      return;
    }

    setIsAddingEmployee(true);
    try {
      const res = await fetch("/api/company/employees", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: addEmployeeForm.name.trim(),
          email: addEmployeeForm.email.trim(),
          department: addEmployeeForm.department,
          role: addEmployeeForm.role,
          experience: addEmployeeForm.experience,
          currentProject: addEmployeeForm.currentProject,
          technicalSkills: addEmployeeForm.technicalSkills,
          developmentAreas: addEmployeeForm.developmentAreas
        })
      });

      const data = await res.json();
      if (!res.ok) {
        alert(data.error || "Failed to add employee");
        return;
      }

      setAssignedLearningNotice(data.message || `Employee "${addEmployeeForm.name}" successfully added to the Directory!`);
      setShowAddEmployeeModal(false);
      setAddEmployeeForm({
        name: "",
        email: "",
        department: "Engineering",
        role: "Backend Engineer",
        experience: "2 years",
        currentProject: "Project X",
        technicalSkills: [
          { name: "Java", level: "Proficient", score: 80, category: "Languages", evidenceType: "Assessment", evidenceDetail: "Internal Benchmark Exam" }
        ],
        newSkillName: "",
        newSkillLevel: "Proficient",
        newSkillScore: 80,
        newSkillCategory: "Engineering",
        newSkillEvidenceType: "Assessment",
        newSkillEvidenceDetail: "",
        developmentAreas: ["Cloud Infrastructure & Distributed Systems"],
        newDevArea: ""
      });

      fetchEmployees();
      if (data.employee) {
        setSelectedEmployee(data.employee);
        setEmployeeSubTab("profile");
      }
    } catch (err: any) {
      alert("Error adding employee: " + err.message);
    } finally {
      setIsAddingEmployee(false);
    }
  };

  // Skill Assessments State
  const [questionsData, setQuestionsData] = useState<any[]>([]);
  const [loadingQuestions, setLoadingQuestions] = useState(false);
  const [showCreateQuestionModal, setShowCreateQuestionModal] = useState(false);
  const [skillTaxonomy, setSkillTaxonomy] = useState<any[]>([]);
  const [skillSearchQuery, setSkillSearchQuery] = useState("");
  const [questionForm, setQuestionForm] = useState({
    text: "",
    skillName: "Java",
    topic: "Collections & Concurrent Data Structures",
    difficulty: "Intermediate",
    type: "MCQ",
    options: [
      { text: "ConcurrentHashMap uses bucket-level locking (segments/CAS) rather than entire table synchronization", isCorrect: true },
      { text: "HashMap is inherently thread-safe across asynchronous sprint workers", isCorrect: false },
      { text: "Hashtable is completely non-blocking for read-heavy operations", isCorrect: false },
      { text: "ConcurrentSkipListMap does not preserve natural sorting order", isCorrect: false }
    ],
    evaluationMethod: "Correct selection verifies understanding of thread safety in high-throughput enterprise systems."
  });
  const [isSubmittingQuestion, setIsSubmittingQuestion] = useState(false);

  // 7-Step Post Internship Wizard State
  const [showPostInternshipModal, setShowPostInternshipModal] = useState(false);
  const [internshipStep, setInternshipStep] = useState<1 | 2 | 3 | 4 | 5 | 6 | 7>(1);
  const [isPublishingInternship, setIsPublishingInternship] = useState(false);
  const [publishSuccessMessage, setPublishSuccessMessage] = useState<string | null>(null);

  const [internshipPostForm, setInternshipPostForm] = useState({
    title: "Full-Stack Software Engineering Intern",
    department: "Core Platform Engineering",
    industry: "Enterprise AI & Cloud",
    location: "Bangalore, India",
    workMode: "Hybrid",
    description: "Join our core engineering sprint team to architect, build, and optimize scalable enterprise web services, responsive UI dashboards, and automated CI/CD microservices.",
    salary: "₹45,000 / month",
    roleCategory: "Full-Stack Development",
    responsibilities: [
      "Collaborate with senior architects to implement RESTful and GraphQL APIs",
      "Build reusable, accessible front-end components using React and TypeScript",
      "Write comprehensive unit and integration tests with >80% code coverage",
      "Participate in daily Agile standups, code reviews, and sprint planning"
    ],
    newResponsibilityInput: "",
    selectedSkills: [
      { skillId: "sk-ts", skillName: "TypeScript", requirementType: "REQUIRED", requiredLevel: "Proficient", weight: 1.0 },
      { skillId: "sk-react", skillName: "React", requirementType: "REQUIRED", requiredLevel: "Proficient", weight: 1.0 },
      { skillId: "sk-node", skillName: "Node.js", requirementType: "PREFERRED", requiredLevel: "Developing", weight: 0.8 },
      { skillId: "sk-sql", skillName: "SQL", requirementType: "PREFERRED", requiredLevel: "Foundational", weight: 0.6 }
    ],
    eligibleDegrees: "B.Tech, B.E., M.Tech, MCA",
    eligibleBranches: "Computer Science, Information Technology, Electronics & Communication",
    graduationYears: "2025, 2026",
    minCgpa: 7.5,
    experienceLevel: "Current Students & Pre-Final / Final Year Candidates",
    projectTitle: "Real-Time Observability & Micro-Frontend Platform",
    problemStatement: "Enterprise clients require sub-second dashboard telemetry and seamless modular micro-frontend loading without cold-start latency.",
    deliverables: [
      "Modular client dashboard interface with accessible widget library",
      "WebSocket streaming bridge for real-time telemetry events",
      "Automated Playwright end-to-end test suite and GitHub Actions workflow"
    ],
    newDeliverableInput: "",
    learningOutcomes: "Production-grade TypeScript patterns, state management architecture, distributed caching, and micro-frontend isolation.",
    evaluationMethod: "Bi-weekly milestone code reviews and final architecture walkthrough with Engineering Directors.",
    startDate: "2026-06-01",
    endDate: "2026-07-31",
    durationWeeks: 8,
    workingHours: "40 hrs/week (Mon - Fri, 9:30 AM - 5:30 PM)",
    mentorName: "Vikram Rao",
    mentorDesignation: "Principal Systems Architect",
    mentorDepartment: "Core Platform Engineering",
    mentorContact: "vikram.rao@infosys.com",
    publishStatus: "OPEN"
  });

  // Open 7-step wizard (optionally pre-filled from workforce gap)
  const handleOpenPostInternship = (prefill?: { role?: string; department?: string; skills?: string[]; salary?: string }) => {
    if (prefill) {
      const skillsArray = (prefill.skills || ["TypeScript", "React"]).map(s => ({
        skillId: `sk-${s.toLowerCase().replace(/[^a-z0-9]/g, "")}`,
        skillName: s,
        requirementType: "REQUIRED",
        requiredLevel: "Proficient",
        weight: 1.0
      }));

      setInternshipPostForm(prev => ({
        ...prev,
        title: prefill.role ? `${prefill.role} Intern` : prev.title,
        department: prefill.department || prev.department,
        salary: prefill.salary || prev.salary,
        selectedSkills: skillsArray
      }));
    }
    setInternshipStep(1);
    setPublishSuccessMessage(null);
    setShowPostInternshipModal(true);
  };

  // Canonical skill toggle in wizard
  const handleToggleCanonicalSkill = (skill: { id: string, name: string }) => {
    const exists = internshipPostForm.selectedSkills.some(s => s.skillId === skill.id || s.skillName === skill.name);
    if (exists) {
      setInternshipPostForm(prev => ({
        ...prev,
        selectedSkills: prev.selectedSkills.filter(s => s.skillId !== skill.id && s.skillName !== skill.name)
      }));
    } else {
      setInternshipPostForm(prev => ({
        ...prev,
        selectedSkills: [
          ...prev.selectedSkills,
          {
            skillId: skill.id,
            skillName: skill.name,
            requirementType: "REQUIRED",
            requiredLevel: "Proficient",
            weight: 1.0
          }
        ]
      }));
    }
  };

  const handleUpdateSkillRequirement = (skillName: string, field: "requirementType" | "requiredLevel" | "weight", value: any) => {
    setInternshipPostForm(prev => ({
      ...prev,
      selectedSkills: prev.selectedSkills.map(s => s.skillName === skillName ? { ...s, [field]: value } : s)
    }));
  };

  const handleAddResponsibility = () => {
    if (!internshipPostForm.newResponsibilityInput.trim()) return;
    setInternshipPostForm(prev => ({
      ...prev,
      responsibilities: [...prev.responsibilities, prev.newResponsibilityInput.trim()],
      newResponsibilityInput: ""
    }));
  };

  const handleAddDeliverable = () => {
    if (!internshipPostForm.newDeliverableInput.trim()) return;
    setInternshipPostForm(prev => ({
      ...prev,
      deliverables: [...prev.deliverables, prev.newDeliverableInput.trim()],
      newDeliverableInput: ""
    }));
  };

  // Submit and Publish Internship (Step 7)
  const handlePublishInternship = async () => {
    setIsPublishingInternship(true);
    setPublishSuccessMessage(null);

    try {
      const payload = {
        title: internshipPostForm.title,
        department: internshipPostForm.department,
        industry: internshipPostForm.industry,
        location: internshipPostForm.location,
        workMode: internshipPostForm.workMode,
        description: internshipPostForm.description,
        salary: internshipPostForm.salary,
        responsibilities: internshipPostForm.responsibilities,
        skills: internshipPostForm.selectedSkills,
        eligibleDegrees: internshipPostForm.eligibleDegrees,
        eligibleBranches: internshipPostForm.eligibleBranches,
        graduationYears: internshipPostForm.graduationYears,
        minCgpa: internshipPostForm.minCgpa,
        experience: internshipPostForm.experienceLevel,
        projectTitle: internshipPostForm.projectTitle,
        problemStatement: internshipPostForm.problemStatement,
        deliverables: internshipPostForm.deliverables,
        learningOutcomes: internshipPostForm.learningOutcomes,
        evaluationMethod: internshipPostForm.evaluationMethod,
        startDate: internshipPostForm.startDate,
        endDate: internshipPostForm.endDate,
        durationWeeks: internshipPostForm.durationWeeks,
        workingHours: internshipPostForm.workingHours,
        mentorName: internshipPostForm.mentorName,
        mentorDesignation: internshipPostForm.mentorDesignation,
        mentorDepartment: internshipPostForm.mentorDepartment,
        mentorContact: internshipPostForm.mentorContact,
        status: internshipPostForm.publishStatus,
        simulateRole: "COMPANY_VERIFIED"
      };

      const res = await fetch("/api/internships/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "Failed to publish internship");
        return;
      }

      setPublishSuccessMessage("Internship published successfully! It is now live in the student feed.");
      fetchOverview();

      setTimeout(() => {
        setShowPostInternshipModal(false);
        handleTabChange("job_postings");
      }, 1500);

    } catch (err: any) {
      alert("Error publishing internship: " + err.message);
    } finally {
      setIsPublishingInternship(false);
    }
  };

  // Fetch Dashboard Overview
  const fetchOverview = () => {
    setLoadingOverview(true);
    fetch("/api/company/dashboard")
      .then(res => res.json())
      .then(d => {
        setOverviewData(d);
        setLoadingOverview(false);
      })
      .catch(() => setLoadingOverview(false));
  };

  // Fetch Candidates (2-Tier Ranking)
  const fetchCandidates = (jobId?: string) => {
    setLoadingCandidates(true);
    const url = jobId ? `/api/company/candidates?jobId=${jobId}` : "/api/company/candidates";
    fetch(url)
      .then(res => res.json())
      .then(d => {
        setCandidatesData(d);
        if (d.candidates?.length > 0 && !selectedCandidate) {
          setSelectedCandidate(d.candidates[0]);
        }
        setLoadingCandidates(false);
      })
      .catch(() => setLoadingCandidates(false));
  };

  // Fetch Workforce Intelligence
  const fetchWorkforce = () => {
    setLoadingWorkforce(true);
    fetch("/api/company/workforce")
      .then(res => res.json())
      .then(d => {
        setWorkforceData(d);
        setLoadingWorkforce(false);
      })
      .catch(() => setLoadingWorkforce(false));
  };

  // Fetch Employee Skill & Productivity Intelligence
  const fetchEmployees = () => {
    setLoadingEmployees(true);
    fetch("/api/company/employees")
      .then(res => res.json())
      .then(d => {
        if (d.success) {
          setEmployeeIntelligence(d);
          if (d.employees?.length > 0) {
            setSelectedEmployee((prev: any) => prev || d.employees[0]);
          }
          if (d.projects?.length > 0) {
            setSelectedProject((prev: any) => prev || d.projects[0]);
          }
        }
        setLoadingEmployees(false);
      })
      .catch(() => setLoadingEmployees(false));
  };

  // Fetch Questions
  const fetchQuestions = () => {
    setLoadingQuestions(true);
    fetch("/api/company/questions")
      .then(res => res.json())
      .then(d => {
        if (d.questions) setQuestionsData(d.questions);
        setLoadingQuestions(false);
      })
      .catch(() => setLoadingQuestions(false));
  };

  useEffect(() => {
    fetchOverview();
    fetchCandidates();
    fetchWorkforce();
    fetchEmployees();
    fetchQuestions();

    // Fetch skills taxonomy for question creator
    fetch("/api/skills/taxonomy")
      .then(r => r.json())
      .then(t => {
        if (t.categories) setSkillTaxonomy(t.categories);
      })
      .catch(() => {});
  }, []);

  // Update Candidate Status Handler (1-Click transitions)
  const handleUpdateCandidateStatus = async (applicationId: string, newStatus: string) => {
    setIsUpdatingStatus(true);
    try {
      const res = await fetch("/api/company/candidates/status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          applicationId,
          newStatus,
          remarks: `Updated to ${newStatus} by recruitment team`
        })
      });
      if (res.ok) {
        // Update local state
        setCandidatesData((prev: any) => {
          if (!prev) return prev;
          const updated = prev.candidates.map((c: any) => 
            c.id === applicationId ? { ...c, currentStatus: newStatus } : c
          );
          return { ...prev, candidates: updated };
        });
        if (selectedCandidate && selectedCandidate.id === applicationId) {
          setSelectedCandidate({ ...selectedCandidate, currentStatus: newStatus });
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  // Publish Question Handler
  const handleCreateQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!questionForm.text.trim()) return;

    setIsSubmittingQuestion(true);
    try {
      const res = await fetch("/api/company/questions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: `[${questionForm.skillName} - ${questionForm.topic}] ${questionForm.text}`,
          type: questionForm.type,
          difficulty: questionForm.difficulty,
          evaluationMethod: questionForm.evaluationMethod,
          options: questionForm.options,
          skills: [{ skillName: questionForm.skillName, weight: 1.0 }]
        })
      });

      if (res.ok) {
        setShowCreateQuestionModal(false);
        setQuestionForm({
          text: "",
          skillName: "Java",
          topic: "Collections & Concurrent Data Structures",
          difficulty: "Intermediate",
          type: "MCQ",
          options: [
            { text: "", isCorrect: true },
            { text: "", isCorrect: false },
            { text: "", isCorrect: false },
            { text: "", isCorrect: false }
          ],
          evaluationMethod: ""
        });
        fetchQuestions();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsSubmittingQuestion(false);
    }
  };

  // Generate Structured Job Draft Handler (Decision-Support: Step into review & publish)
  const handleGenerateJobDraft = (roleName?: string, deptName?: string) => {
    const targetDept = deptName || selectedAnalysisDept || "Engineering";
    const targetRole = roleName || selectedAnalysisRole || "Backend Engineer";

    const roleDef = workforceData?.rolesByDepartment?.[targetDept]?.find((r: any) => r.role === targetRole);
    const skillProfile = workforceData?.roleSkillProfiles?.[targetRole] || {
      required: [
        { name: "Java", requirement: "Proficient (75%)", importance: "Critical" },
        { name: "Spring Boot", requirement: "Proficient (75%)", importance: "Critical" },
        { name: "SQL", requirement: "Proficient (75%)", importance: "High" }
      ],
      preferred: [
        { name: "Docker", requirement: "Developing (60%)", importance: "Medium" },
        { name: "AWS", requirement: "Developing (60%)", importance: "Preferred" }
      ]
    };

    const connectedProject = workforceData?.projectStaffing?.find((p: any) =>
      p.roles.some((r: any) => r.role === targetRole && r.gap < 0)
    )?.projectName || "Project A: Real-Time Telemetry & Observability Pipeline";

    const assessmentTopics = workforceData?.questionBankAssessmentMappings?.[targetRole] || [
      { topic: `${targetRole} Core Competencies`, questionCount: 10, source: "Question Bank" }
    ];

    setJobDraftForm({
      title: targetRole,
      department: targetDept,
      openings: roleDef ? Math.abs(roleDef.gap) || 3 : 3,
      hiringReason: selectedHiringReason || "Workforce shortage",
      projectConnected: connectedProject,
      description: `Join our ${targetDept} organization to address critical sprint deliverables on ${connectedProject}. As a ${targetRole}, you will architect resilient distributed solutions, maintain sub-second response times, and collaborate with cross-functional engineering leads.`,
      responsibilities: [
        `Design, build, and maintain production-grade scalable systems for ${connectedProject}`,
        "Collaborate with internal engineering guild to uphold architecture standards and test coverage",
        "Participate in daily Agile sprints, design reviews, and automated CI/CD pipeline deployments"
      ],
      requiredSkills: skillProfile.required || [],
      preferredSkills: skillProfile.preferred || [],
      education: "B.Tech / B.E. / M.Tech / MCA in Computer Science, IT, or allied fields",
      experience: "Pre-Final / Final Year Students, Fresh Grads, or 1-3 Years Experience",
      location: "Bangalore, India",
      workMode: "Hybrid (2 Days Remote / 3 Days Office)",
      salary: roleDef?.salaryRange || "₹45,000 / month (Intern) or 16-22 LPA",
      deadline: "2026-08-31",
      attachedAssessments: assessmentTopics
    });

    setShowJobDraftModal(true);
  };

  // Publish Draft Job to Platform
  const handlePublishDraftJob = async () => {
    setIsPublishingDraft(true);
    try {
      const skillsArray = [
        ...jobDraftForm.requiredSkills.map((s: any) => ({
          skillId: `sk-${s.name.toLowerCase().replace(/[^a-z0-9]/g, "")}`,
          skillName: s.name,
          requirementType: "REQUIRED",
          requiredLevel: s.requirement || "Proficient",
          weight: 1.0
        })),
        ...jobDraftForm.preferredSkills.map((s: any) => ({
          skillId: `sk-${s.name.toLowerCase().replace(/[^a-z0-9]/g, "")}`,
          skillName: s.name,
          requirementType: "PREFERRED",
          requiredLevel: s.requirement || "Developing",
          weight: 0.7
        }))
      ];

      const payload = {
        title: `${jobDraftForm.title} (${jobDraftForm.hiringReason})`,
        department: jobDraftForm.department,
        industry: "Enterprise AI & Cloud Engineering",
        location: jobDraftForm.location,
        workMode: jobDraftForm.workMode,
        description: `${jobDraftForm.description}\n\nConnected Project: ${jobDraftForm.projectConnected}\nReason for Hiring: ${jobDraftForm.hiringReason}`,
        salary: jobDraftForm.salary,
        roleCategory: jobDraftForm.title,
        responsibilities: jobDraftForm.responsibilities,
        skills: skillsArray,
        eligibleDegrees: jobDraftForm.education,
        eligibleBranches: "Computer Science, Information Technology, Allied Branches",
        graduationYears: "2025, 2026, 2027",
        minCgpa: 7.0,
        experience: jobDraftForm.experience,
        projectTitle: jobDraftForm.projectConnected,
        problemStatement: `Direct workforce deficit identified in ${jobDraftForm.department} (${jobDraftForm.openings} open positions). Candidate will resolve sprint bottleneck for ${jobDraftForm.projectConnected}.`,
        deliverables: [
          `Deliver verified modules for ${jobDraftForm.projectConnected}`,
          "Complete pre-screening benchmark assessment via Question Bank",
          "Pass code review milestones with senior staff architects"
        ],
        learningOutcomes: `Hands-on expertise in ${jobDraftForm.requiredSkills.map((s: any) => s.name).join(", ")}.`,
        evaluationMethod: `Standard automated scoring against attached Question Bank assessments: ${jobDraftForm.attachedAssessments.map((a: any) => a.topic).join(", ")}.`,
        startDate: "2026-06-01",
        endDate: "2026-08-31",
        durationWeeks: 12,
        workingHours: "40 hours / week (Full-time)",
        mentorName: "Director of Engineering",
        mentorDesignation: "Principal Engineering Lead",
        mentorDepartment: jobDraftForm.department,
        mentorContact: "talent@company.internal",
        status: "ACTIVE",
        simulateRole: "COMPANY_VERIFIED"
      };

      const res = await fetch("/api/internships/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (!res.ok) {
        alert(data.error || "Failed to publish job from workforce analysis");
        return;
      }

      setShowJobDraftModal(false);
      fetchOverview();
      fetchWorkforce();
      alert(`🎉 Successfully Published!\n\n"${jobDraftForm.title}" has been created from workforce shortage intelligence and is now LIVE in the platform feed with attached assessments.`);
      handleTabChange("job_postings");
    } catch (err: any) {
      alert("Error publishing job draft: " + err.message);
    } finally {
      setIsPublishingDraft(false);
    }
  };

  const company = overviewData?.company;
  const stats = overviewData?.stats || { totalPostings: 0, activeInternships: 0, totalApplications: 0, shortlistedCandidates: 0 };
  const jobs: any[] = company?.jobs || [];

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-16">
      
      {/* ======================================================================= */}
      {/* 1. TOP HEADER & VERIFICATION BADGE                                      */}
      {/* ======================================================================= */}
      <div className="bg-white rounded-3xl border border-gray-200 p-7 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-start space-x-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 text-emerald-400 flex items-center justify-center font-black text-2xl shadow-md shrink-0">
            {company?.companyName?.slice(0, 2).toUpperCase() || "IL"}
          </div>
          <div>
            <div className="flex items-center space-x-2.5 flex-wrap gap-y-1">
              <h1 className="text-2xl font-black text-slate-900">
                {company?.companyName || "Infosys Labs"}
              </h1>
              <span className="bg-emerald-100 text-emerald-800 border border-emerald-300 text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full flex items-center gap-1 shadow-2xs">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Verified Enterprise Employer</span>
              </span>
            </div>
            
            <p className="text-xs text-gray-500 mt-1 flex items-center gap-2">
              <span>{company?.industry || "Enterprise AI & Cloud"}</span>
              <span>•</span>
              <span className="flex items-center"><MapPin className="w-3.5 h-3.5 mr-0.5 text-gray-400" /> {company?.location || "Bangalore, India"}</span>
              <span>•</span>
              <span className="text-blue-600 font-semibold">{company?.website ? new URL(company.website).hostname : "infosys.com"}</span>
            </p>
          </div>
        </div>

        {/* Global Post Action: Opens 7-Step Verified Internship Wizard */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => handleOpenPostInternship()}
            className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-5 py-3 rounded-xl flex items-center gap-2 shadow-sm transition-all hover:shadow cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Post New Internship</span>
          </button>
        </div>
      </div>

      {/* ======================================================================= */}
      {/* 2. NAVIGATION BAR (The 4 Requested Sections)                            */}
      {/* ======================================================================= */}
      <div className="flex bg-gray-100 p-1.5 rounded-2xl border border-gray-200 overflow-x-auto gap-1">
        
        {/* Section 1: Home */}
        <button
          onClick={() => handleTabChange("home")}
          className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
            activeSection === "home" ? "bg-white text-slate-900 shadow-xs font-black" : "text-gray-600 hover:text-gray-900"
          }`}
        >
          <Building2 className="w-4 h-4 text-blue-600" />
          <span>Home</span>
        </button>

        {/* Section 2: Employees (Skill & Productivity Intelligence System) */}
        <button
          onClick={() => { handleTabChange("employees"); fetchWorkforce(); fetchEmployees(); }}
          className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
            activeSection === "employees" ? "bg-white text-slate-900 shadow-xs font-black" : "text-gray-600 hover:text-gray-900"
          }`}
        >
          <Users className="w-4 h-4 text-emerald-600" />
          <span>Employees</span>
          <span className="ml-1 bg-rose-100 text-rose-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
            -33 Gaps
          </span>
        </button>

        {/* Section 3: Job Postings (Active Internships & Roles) */}
        <button
          onClick={() => handleTabChange("job_postings")}
          className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
            activeSection === "job_postings" ? "bg-white text-slate-900 shadow-xs font-black" : "text-gray-600 hover:text-gray-900"
          }`}
        >
          <Briefcase className="w-4 h-4 text-teal-600" />
          <span>Job Postings</span>
          <span className="ml-1 bg-teal-100 text-teal-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
            {jobs.length} Active
          </span>
        </button>

        {/* Section 4: Applications (2-Tier Ranking & Explainable Inspector) */}
        <button
          onClick={() => { handleTabChange("applications"); fetchCandidates(); }}
          className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
            activeSection === "applications" ? "bg-white text-slate-900 shadow-xs font-black" : "text-gray-600 hover:text-gray-900"
          }`}
        >
          <FileText className="w-4 h-4 text-purple-600" />
          <span>Applications</span>
          <span className="ml-1 bg-purple-100 text-purple-800 text-[10px] font-mono font-bold px-2 py-0.5 rounded-full">
            {candidatesData?.candidates?.length || stats.totalApplications}
          </span>
        </button>

      </div>

      {/* ======================================================================= */}
      {/* SECTION 1: HOME (Company Overview, KPIs, Verification & Quick Actions) */}
      {/* ======================================================================= */}
      {activeSection === "home" && (
        <div className="space-y-8 animate-in fade-in duration-200">
          
          {/* Executive KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <div 
              onClick={() => handleTabChange("job_postings")}
              className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs space-y-2 cursor-pointer hover:border-blue-300 transition-all"
            >
              <div className="flex justify-between items-center text-gray-400">
                <span className="text-xs font-bold uppercase tracking-wider text-gray-500">Live Postings</span>
                <Briefcase className="w-5 h-5 text-blue-600" />
              </div>
              <div className="text-3xl font-black text-slate-900">{stats.activeInternships}</div>
              <div className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                <span>Active in student opportunities feed</span>
              </div>
            </div>

            <div 
              onClick={() => { handleTabChange("applications"); fetchCandidates(); }}
              className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs space-y-2 cursor-pointer hover:border-purple-300 transition-all"
            >
              <div className="flex justify-between items-center text-gray-400">
                <span className="text-xs font-bold uppercase tracking-wider text-gray-500">Candidate Pool</span>
                <Users className="w-5 h-5 text-purple-600" />
              </div>
              <div className="text-3xl font-black text-slate-900">{stats.totalApplications}</div>
              <div className="text-[11px] text-purple-700 font-semibold flex items-center gap-1">
                <Percent className="w-3 h-3" />
                <span>Ranked via 2-tier skill & eligibility scoring</span>
              </div>
            </div>

            <div 
              onClick={() => { handleTabChange("employees"); fetchWorkforce(); }}
              className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs space-y-2 cursor-pointer hover:border-rose-300 transition-all"
            >
              <div className="flex justify-between items-center text-gray-400">
                <span className="text-xs font-bold uppercase tracking-wider text-gray-500">Workforce Shortage</span>
                <BadgeAlert className="w-5 h-5 text-rose-600" />
              </div>
              <div className="text-3xl font-black text-slate-900">-33 Gaps</div>
              <div className="text-[11px] text-rose-700 font-semibold flex items-center gap-1">
                <Flame className="w-3 h-3" />
                <span>Critical shortages in Backend & Data roles</span>
              </div>
            </div>

            <div 
              onClick={() => { handleTabChange("employees"); fetchWorkforce(); }}
              className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs space-y-2 cursor-pointer hover:border-amber-300 transition-all"
            >
              <div className="flex justify-between items-center text-gray-400">
                <span className="text-xs font-bold uppercase tracking-wider text-gray-500">Skill Intelligence</span>
                <BrainCircuit className="w-5 h-5 text-amber-600" />
              </div>
              <div className="text-3xl font-black text-slate-900">100%</div>
              <div className="text-[11px] text-amber-700 font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
                <span>Mapped to Canonical Skill Taxonomy</span>
              </div>
            </div>
          </div>

          {/* Quick Shortcuts to Primary Modules */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div 
              onClick={() => { handleTabChange("applications"); fetchCandidates(); }}
              className="bg-white rounded-3xl border border-gray-200 p-6 shadow-xs hover:border-purple-300 hover:shadow-md transition-all cursor-pointer space-y-3"
            >
              <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
                <FileText className="w-5 h-5" />
              </div>
              <h3 className="text-base font-black text-slate-900">Application Manager</h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                Review candidate rankings calculated strictly from <strong>Student Skill Portfolios vs Company Requirements</strong>, filtered by Degree & CGPA with explainable inspector.
              </p>
              <div className="text-xs font-bold text-purple-700 flex items-center gap-1 pt-1">
                <span>Open Application Manager</span>
                <ChevronRight className="w-4 h-4" />
              </div>
            </div>

            <div 
              onClick={() => { handleTabChange("employees"); fetchWorkforce(); }}
              className="bg-white rounded-3xl border border-gray-200 p-6 shadow-xs hover:border-emerald-300 hover:shadow-md transition-all cursor-pointer space-y-3"
            >
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                <Users className="w-5 h-5" />
              </div>
              <h3 className="text-base font-black text-slate-900">Employees & Database Employers</h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                Analyze company workforce capacity, detect talent deficits (e.g. Backend: -13), and convert shortages directly into structured 7-step internship postings.
              </p>
              <div className="text-xs font-bold text-emerald-700 flex items-center gap-1 pt-1">
                <span>View Employees & Workforce</span>
                <ChevronRight className="w-4 h-4" />
              </div>
            </div>

            <div 
              onClick={() => handleTabChange("job_postings")}
              className="bg-white rounded-3xl border border-gray-200 p-6 shadow-xs hover:border-teal-300 hover:shadow-md transition-all cursor-pointer space-y-3"
            >
              <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center font-bold">
                <Briefcase className="w-5 h-5" />
              </div>
              <h3 className="text-base font-black text-slate-900">Job Postings Section</h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                Browse, monitor, and manage your published internships and openings with stipend breakdown, mentor assignments, and live student applicants.
              </p>
              <div className="text-xs font-bold text-teal-700 flex items-center gap-1 pt-1">
                <span>Manage Job Postings</span>
                <ChevronRight className="w-4 h-4" />
              </div>
            </div>
          </div>

        </div>
      )}

      {/* ======================================================================= */}
      {/* SECTION 2: 👥 APPLICATION MANAGER WITH 2-TIER EXPLAINABLE RANKING       */}
      {/* ======================================================================= */}
      {activeSection === "applications" && (
        <div className="space-y-6 animate-in fade-in duration-200">
          
          {/* Header & Job Filter Switcher */}
          <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-purple-700 mb-1">
                <Percent className="w-4 h-4" />
                <span>2-Tier Precision Evaluation Engine</span>
              </div>
              <h2 className="text-xl font-black text-slate-900">Candidate Ranking & Skill Compatibility</h2>
              <p className="text-xs text-gray-500 mt-0.5">
                Ranks candidates first by <strong>Student Skill Portfolio vs Requirement Portfolio</strong>, then classifies by <strong>Degree, Graduation Year & Min CGPA</strong>.
              </p>
            </div>

            {/* Filter by Job Posting */}
            <div className="flex items-center space-x-2 text-xs">
              <span className="font-bold text-gray-500">Posting:</span>
              <select
                value={selectedJobFilter}
                onChange={(e) => {
                  setSelectedJobFilter(e.target.value);
                  fetchCandidates(e.target.value);
                }}
                className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold text-slate-800 focus:ring-2 focus:ring-purple-500"
              >
                <option value="">All Company Postings</option>
                {jobs.map((j: any) => (
                  <option key={j.id} value={j.id}>{j.title}</option>
                ))}
              </select>
            </div>
          </div>

          {loadingCandidates ? (
            <div className="bg-white p-16 rounded-3xl border border-gray-200 text-center">
              <div className="w-10 h-10 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
              <p className="text-xs text-gray-500 font-medium">Calculating candidate skill compatibility & eligibility ranks...</p>
            </div>
          ) : candidatesData?.candidates?.length === 0 ? (
            <div className="bg-white p-16 rounded-3xl border border-gray-200 text-center space-y-3">
              <Users className="w-12 h-12 text-gray-300 mx-auto" />
              <h3 className="text-base font-bold text-gray-800">No student applicants for this posting yet</h3>
              <p className="text-xs text-gray-500 max-w-sm mx-auto">
                Applications submitted by students from the discovery feed will appear here with automatic skill compatibility scoring.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Left Column (7 cols): Ranked Candidates Table */}
              <div className="lg:col-span-7 bg-white rounded-3xl border border-gray-200 p-6 shadow-xs space-y-4">
                <div className="flex justify-between items-center pb-3 border-b border-gray-100">
                  <div className="text-xs font-black uppercase text-gray-400 tracking-wider">
                    Ranked Candidates ({candidatesData?.candidates?.length})
                  </div>
                  <div className="text-xs font-semibold text-gray-500">
                    Average Skill Match: <strong className="text-purple-700">{candidatesData?.stats?.avgSkillMatch}%</strong>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-gray-200 text-gray-400 font-bold uppercase text-[10px] tracking-wider">
                        <th className="pb-3 text-center w-12">Rank</th>
                        <th className="pb-3">Candidate</th>
                        <th className="pb-3">Skill Match (Tier 1)</th>
                        <th className="pb-3">Eligibility (Tier 2)</th>
                        <th className="pb-3">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {candidatesData?.candidates?.map((c: any) => {
                        const isSelected = selectedCandidate?.id === c.id;

                        return (
                          <tr 
                            key={c.id} 
                            onClick={() => setSelectedCandidate(c)}
                            className={`transition-all cursor-pointer ${
                              isSelected 
                                ? "bg-purple-50/80 font-medium" 
                                : "hover:bg-gray-50/80"
                            }`}
                          >
                            {/* Rank Badge */}
                            <td className="py-3 text-center">
                              <span className={`w-6 h-6 rounded-full inline-flex items-center justify-center text-xs font-black ${
                                c.rank === 1 ? "bg-amber-100 text-amber-800 border border-amber-300" :
                                c.rank === 2 ? "bg-slate-200 text-slate-800" :
                                c.rank === 3 ? "bg-orange-100 text-orange-800" :
                                "bg-gray-100 text-gray-600"
                              }`}>
                                {c.rank}
                              </span>
                            </td>

                            {/* Candidate Info */}
                            <td className="py-3 pr-2">
                              <div className="font-extrabold text-slate-900">{c.fullName}</div>
                              <div className="text-[11px] text-gray-500">{c.institution}</div>
                            </td>

                            {/* Skill Match % (Tier 1) */}
                            <td className="py-3 pr-2">
                              <div className="flex items-center space-x-2">
                                <div className="w-16 bg-gray-200 rounded-full h-2 overflow-hidden">
                                  <div 
                                    className={`h-2 rounded-full ${
                                      c.skillMatchPercentage >= 85 ? "bg-emerald-500" :
                                      c.skillMatchPercentage >= 70 ? "bg-purple-600" : "bg-amber-500"
                                    }`}
                                    style={{ width: `${c.skillMatchPercentage}%` }}
                                  />
                                </div>
                                <span className="font-black text-xs text-slate-900">{c.skillMatchPercentage}%</span>
                              </div>
                              <div className="text-[10px] text-gray-400 mt-0.5">
                                {c.metRequiredSkills}/{c.totalRequiredSkills} Skills Met
                              </div>
                            </td>

                            {/* Eligibility (Tier 2: Degree, Year, CGPA) */}
                            <td className="py-3 pr-2">
                              {c.eligibility.isOverallEligible ? (
                                <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                                  <Check className="w-3 h-3 text-emerald-600" />
                                  <span>Eligible ({c.cgpa} CGPA)</span>
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                                  <AlertCircle className="w-3 h-3 text-amber-600" />
                                  <span>Check Criteria</span>
                                </span>
                              )}
                              <div className="text-[10px] text-gray-400 mt-0.5">
                                {c.degree.split(" ")[0]} • {c.graduationYear}
                              </div>
                            </td>

                            {/* Current Hiring Status */}
                            <td className="py-3">
                              <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${
                                c.currentStatus === "Selected" ? "bg-emerald-100 text-emerald-800" :
                                c.currentStatus === "Shortlisted" ? "bg-purple-100 text-purple-800" :
                                c.currentStatus === "Interview" ? "bg-blue-100 text-blue-800" :
                                c.currentStatus === "Rejected" ? "bg-rose-100 text-rose-800" :
                                "bg-gray-100 text-gray-700"
                              }`}>
                                {c.currentStatus}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Right Column (5 cols): "Why this Candidate?" Explainable Inspector */}
              <div className="lg:col-span-5 space-y-6">
                {selectedCandidate ? (
                  <div className="bg-white rounded-3xl border-2 border-purple-300 p-6 shadow-md space-y-6 animate-in fade-in duration-150">
                    
                    {/* Header */}
                    <div className="flex justify-between items-start pb-4 border-b border-gray-100">
                      <div>
                        <span className="text-[10px] font-black uppercase tracking-wider text-purple-700 bg-purple-100 px-2 py-0.5 rounded-full">
                          Candidate Rank #{selectedCandidate.rank}
                        </span>
                        <h3 className="text-lg font-black text-slate-900 mt-1">{selectedCandidate.fullName}</h3>
                        <p className="text-xs text-gray-500">{selectedCandidate.institution} • {selectedCandidate.degree}</p>
                      </div>

                      <div className="text-right">
                        <div className="text-2xl font-black text-purple-700">{selectedCandidate.skillMatchPercentage}%</div>
                        <div className="text-[10px] text-gray-400">Skill Compatibility</div>
                      </div>
                    </div>

                    {/* "Why this Candidate?" Explainable Deep-Dive */}
                    <div className="space-y-3">
                      <div className="text-xs font-black uppercase text-slate-800 flex items-center gap-1.5">
                        <Sparkles className="w-4 h-4 text-purple-600" />
                        <span>Why this Candidate? (Explainable Match)</span>
                      </div>

                      {/* Required Skills Matrix */}
                      <div className="bg-gray-50 rounded-2xl p-4 border border-gray-200 space-y-2.5">
                        <div className="text-[11px] font-bold text-gray-500 uppercase">Required Skills Assessed:</div>
                        <div className="space-y-2">
                          {selectedCandidate.matchedSkillDetails?.map((sk: any, i: number) => (
                            <div key={i} className="flex justify-between items-center text-xs">
                              <span className="font-bold text-slate-800 flex items-center gap-1.5">
                                <Check className="w-3.5 h-3.5 text-emerald-600" />
                                <span>{sk.skillName}</span>
                              </span>
                              <span className="text-[11px] font-extrabold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                                {sk.studentScore}% • {sk.proficiencyLevel}
                              </span>
                            </div>
                          ))}
                        </div>

                        {selectedCandidate.missingSkillDetails?.length > 0 && (
                          <div className="pt-2 border-t border-gray-200/80 space-y-1.5">
                            <div className="text-[10px] font-bold text-amber-700 uppercase">Developing / Missing Evidence:</div>
                            {selectedCandidate.missingSkillDetails.map((sk: any, i: number) => (
                              <div key={i} className="flex justify-between items-center text-xs text-amber-800">
                                <span className="flex items-center gap-1.5">
                                  <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                                  <span>{sk.skillName}</span>
                                </span>
                                <span className="text-[10px] text-amber-600 font-semibold">Not Assessed Yet</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Eligibility Breakdown */}
                      <div className="bg-gray-50 rounded-2xl p-4 border border-gray-200 space-y-2 text-xs">
                        <div className="text-[11px] font-bold text-gray-500 uppercase">Academic & Cohort Eligibility:</div>
                        <div className="grid grid-cols-2 gap-2 text-[11px]">
                          <div>Degree Match: <strong className="text-emerald-700">✓ Eligible</strong></div>
                          <div>Grad Year: <strong className="text-emerald-700">✓ {selectedCandidate.graduationYear}</strong></div>
                          <div>CGPA: <strong className="text-emerald-700">✓ {selectedCandidate.cgpa} / 10.0</strong></div>
                          <div>Availability: <strong className="text-slate-800">{selectedCandidate.availability}</strong></div>
                        </div>
                      </div>

                      {/* Portfolio & Evidence Highlights */}
                      <div className="bg-gray-50 rounded-2xl p-4 border border-gray-200 space-y-2 text-xs">
                        <div className="text-[11px] font-bold text-gray-500 uppercase">Portfolio Evidence:</div>
                        <div className="text-[11px] text-gray-700 space-y-1">
                          <div>• <strong>{selectedCandidate.evidence?.projectsCount} Verified Projects</strong> in Skill Portfolio</div>
                          <div>• <strong>{selectedCandidate.evidence?.certificationsCount} Industry Certifications</strong> cryptographically stamped</div>
                          {selectedCandidate.portfolioUrl && (
                            <div>
                              • Public Portfolio: <a href={selectedCandidate.portfolioUrl} target="_blank" rel="noreferrer" className="text-blue-600 underline font-mono">{selectedCandidate.portfolioUrl}</a>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* 1-Click Status Transitions */}
                    <div className="pt-2 border-t border-gray-100 space-y-2">
                      <div className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                        1-Click Candidate Pipeline Action:
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <button
                          onClick={() => handleUpdateCandidateStatus(selectedCandidate.id, "Shortlisted")}
                          disabled={isUpdatingStatus}
                          className="bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs py-2 rounded-xl flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
                        >
                          <UserCheck className="w-3.5 h-3.5" />
                          <span>Shortlist</span>
                        </button>

                        <button
                          onClick={() => handleUpdateCandidateStatus(selectedCandidate.id, "Interview")}
                          disabled={isUpdatingStatus}
                          className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs py-2 rounded-xl flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
                        >
                          <Calendar className="w-3.5 h-3.5" />
                          <span>Interview</span>
                        </button>

                        <button
                          onClick={() => handleUpdateCandidateStatus(selectedCandidate.id, "Selected")}
                          disabled={isUpdatingStatus}
                          className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-2 rounded-xl flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Select / Offer</span>
                        </button>

                        <button
                          onClick={() => handleUpdateCandidateStatus(selectedCandidate.id, "Rejected")}
                          disabled={isUpdatingStatus}
                          className="bg-gray-100 hover:bg-rose-50 hover:text-rose-700 text-gray-600 font-bold text-xs py-2 rounded-xl flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <X className="w-3.5 h-3.5" />
                          <span>Reject</span>
                        </button>
                      </div>
                    </div>

                  </div>
                ) : (
                  <div className="bg-white rounded-3xl border border-gray-200 p-8 text-center text-xs text-gray-400">
                    Select a candidate from the ranking table to view the explainable match details.
                  </div>
                )}
              </div>

            </div>
          )}

        </div>
      )}

      {/* ======================================================================= */}
      {/* SECTION 2: 👥 EMPLOYEE SKILL & PRODUCTIVITY INTELLIGENCE SYSTEM         */}
      {/* ======================================================================= */}
      {activeSection === "employees" && (
        <div className="space-y-8 animate-in fade-in duration-200">
          
          {/* Sub-header */}
          <div className="bg-white p-7 rounded-3xl border border-gray-200 shadow-xs flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <div className="flex items-center space-x-2 text-xs font-black uppercase tracking-wider text-emerald-700 mb-1.5">
                <BrainCircuit className="w-4 h-4 text-emerald-600" />
                <span>Enterprise Workforce Intelligence</span>
              </div>
              <h2 className="text-2xl font-black text-slate-900">Employee Skill & Productivity Intelligence</h2>
              <p className="text-xs text-gray-500 mt-1 max-w-3xl leading-relaxed">
                Connects what employees are working on, verified abilities, identified skill gaps, and personalized development resources. Directs upcoming project needs into internal upskilling or external hiring.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold text-slate-700 bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200 flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-slate-500" />
                <span><strong>{employeeIntelligence?.stats?.totalEmployees || 4}</strong> Employees</span>
              </span>
              <span className="text-xs font-bold text-amber-800 bg-amber-50 px-3 py-1.5 rounded-xl border border-amber-200 flex items-center gap-1.5">
                <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                <span><strong>{employeeIntelligence?.stats?.identifiedGapsCount || 8}</strong> Skill Gaps</span>
              </span>
              <span className="text-xs font-bold text-rose-800 bg-rose-50 px-3 py-1.5 rounded-xl border border-rose-200 flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5 text-rose-600" />
                <span><strong>-33</strong> Headcount Deficit</span>
              </span>
            </div>
          </div>

          {/* Flash Feedback Notice when HR assigns learning */}
          {assignedLearningNotice && (
            <div className="bg-emerald-50 border border-emerald-300 text-emerald-800 px-5 py-3 rounded-2xl text-xs font-bold flex items-center justify-between shadow-xs">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>{assignedLearningNotice}</span>
              </div>
              <button onClick={() => setAssignedLearningNotice(null)} className="text-emerald-700 hover:text-emerald-900 cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Sub-Navigation Bar for the 8 Intelligence Dimensions */}
          <div className="bg-gray-100 p-1.5 rounded-2xl border border-gray-200 flex flex-wrap gap-1">
            <button
              onClick={() => setEmployeeSubTab("directory")}
              className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                employeeSubTab === "directory" ? "bg-white text-slate-900 shadow-xs font-black" : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <Users className="w-3.5 h-3.5 text-blue-600" />
              <span>1. Employee Directory</span>
            </button>

            <button
              onClick={() => setEmployeeSubTab("profile")}
              className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                employeeSubTab === "profile" ? "bg-white text-slate-900 shadow-xs font-black" : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <FileText className="w-3.5 h-3.5 text-indigo-600" />
              <span>2. Employee Profile</span>
              {selectedEmployee && (
                <span className="ml-1 text-[10px] text-indigo-700 font-mono bg-indigo-50 px-1.5 py-0.2 rounded border border-indigo-200">
                  {selectedEmployee.avatar}
                </span>
              )}
            </button>

            <button
              onClick={() => setEmployeeSubTab("projects")}
              className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                employeeSubTab === "projects" ? "bg-white text-slate-900 shadow-xs font-black" : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <FolderKanban className="w-3.5 h-3.5 text-amber-600" />
              <span>3. Projects & Work</span>
            </button>

            <button
              onClick={() => setEmployeeSubTab("skills")}
              className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                employeeSubTab === "skills" ? "bg-white text-slate-900 shadow-xs font-black" : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <Award className="w-3.5 h-3.5 text-emerald-600" />
              <span>4. Evidence-Based Skills</span>
            </button>

            <button
              onClick={() => setEmployeeSubTab("gaps")}
              className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                employeeSubTab === "gaps" ? "bg-white text-slate-900 shadow-xs font-black" : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <Target className="w-3.5 h-3.5 text-rose-600" />
              <span>5. Skill Gap Engine</span>
            </button>

            <button
              onClick={() => setEmployeeSubTab("learning")}
              className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                employeeSubTab === "learning" ? "bg-white text-slate-900 shadow-xs font-black" : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <BookOpen className="w-3.5 h-3.5 text-purple-600" />
              <span>6. Learning & Resources</span>
            </button>

            <button
              onClick={() => setEmployeeSubTab("productivity")}
              className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                employeeSubTab === "productivity" ? "bg-white text-slate-900 shadow-xs font-black" : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
              <span>7. Productivity Insights</span>
            </button>

            <button
              onClick={() => setEmployeeSubTab("future_planning")}
              className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                employeeSubTab === "future_planning" ? "bg-white text-slate-900 shadow-xs font-black" : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <Workflow className="w-3.5 h-3.5 text-teal-600" />
              <span>8. Future Workforce Loop</span>
            </button>

            <button
              onClick={() => setEmployeeSubTab("capacity")}
              className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                employeeSubTab === "capacity" ? "bg-white text-slate-900 shadow-xs font-black" : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <Database className="w-3.5 h-3.5 text-cyan-600" />
              <span>9. Workforce Analysis & Job Generator</span>
            </button>
          </div>

          {/* =================================================================== */}
          {/* VIEW 1: EMPLOYEE DIRECTORY                                          */}
          {/* =================================================================== */}
          {employeeSubTab === "directory" && (
            <div className="bg-white rounded-3xl border border-gray-200 p-6 shadow-xs space-y-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-gray-100">
                <div>
                  <h3 className="text-base font-black text-slate-900">Employee Directory</h3>
                  <p className="text-xs text-gray-500">Click any employee to inspect their evidence-based profile, current project, and skill gaps.</p>
                </div>

                {/* Search & Filter & Add Action */}
                <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
                  <div className="relative flex-1 sm:w-60">
                    <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Search employee, role, skill..."
                      value={employeeSearchQuery}
                      onChange={(e) => setEmployeeSearchQuery(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 text-xs border border-gray-200 rounded-xl focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <select
                    value={employeeDeptFilter}
                    onChange={(e) => setEmployeeDeptFilter(e.target.value)}
                    className="text-xs border border-gray-200 rounded-xl px-3 py-2 bg-white text-gray-700 font-semibold focus:outline-none focus:border-emerald-500"
                  >
                    <option value="ALL">All Departments</option>
                    <option value="Engineering">Engineering</option>
                    <option value="Data & Analytics">Data & Analytics</option>
                    <option value="Product">Product</option>
                  </select>

                  <button
                    onClick={() => setShowAddEmployeeModal(true)}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs px-4 py-2 rounded-xl flex items-center gap-1.5 shadow-sm transition-all cursor-pointer shrink-0"
                  >
                    <UserPlus className="w-4 h-4" />
                    <span>Add Employee</span>
                  </button>
                </div>
              </div>

              {/* Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-gray-200 text-gray-400 font-bold uppercase text-[10px] tracking-wider bg-gray-50/50">
                      <th className="py-3 px-4 rounded-l-xl">Employee</th>
                      <th className="py-3 px-3">Department</th>
                      <th className="py-3 px-3">Role</th>
                      <th className="py-3 px-3">Current Project</th>
                      <th className="py-3 px-3">Proficiency</th>
                      <th className="py-3 px-3">Identified Gaps</th>
                      <th className="py-3 px-4 text-right rounded-r-xl">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {employeeIntelligence?.employees
                      ?.filter((emp: any) => {
                        const matchQuery = 
                          emp.name.toLowerCase().includes(employeeSearchQuery.toLowerCase()) ||
                          emp.role.toLowerCase().includes(employeeSearchQuery.toLowerCase()) ||
                          emp.department.toLowerCase().includes(employeeSearchQuery.toLowerCase()) ||
                          emp.currentProject.toLowerCase().includes(employeeSearchQuery.toLowerCase()) ||
                          emp.skills.technical.some((s: any) => s.name.toLowerCase().includes(employeeSearchQuery.toLowerCase()));
                        const matchDept = employeeDeptFilter === "ALL" || emp.department === employeeDeptFilter;
                        return matchQuery && matchDept;
                      })
                      .map((emp: any) => {
                        const isSelected = selectedEmployee?.id === emp.id;

                        return (
                          <tr 
                            key={emp.id}
                            onClick={() => setSelectedEmployee(emp)}
                            className={`hover:bg-slate-50/80 cursor-pointer transition-colors ${isSelected ? "bg-emerald-50/50 font-semibold" : ""}`}
                          >
                            <td className="py-3.5 px-4">
                              <div className="flex items-center space-x-3">
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-slate-900 to-slate-800 text-emerald-400 flex items-center justify-center font-black text-xs shrink-0">
                                  {emp.avatar}
                                </div>
                                <div>
                                  <div className="font-black text-slate-900">{emp.name}</div>
                                  <div className="text-[11px] text-gray-400 font-mono">{emp.email}</div>
                                </div>
                              </div>
                            </td>

                            <td className="py-3.5 px-3 text-gray-600 font-medium">
                              {emp.department}
                            </td>

                            <td className="py-3.5 px-3">
                              <span className="bg-slate-100 text-slate-800 font-bold px-2 py-0.5 rounded-md border border-slate-200 text-[11px]">
                                {emp.role}
                              </span>
                            </td>

                            <td className="py-3.5 px-3">
                              <span className="bg-blue-50 text-blue-700 font-bold px-2 py-0.5 rounded-md border border-blue-200 text-[11px] flex items-center gap-1 w-max">
                                <FolderKanban className="w-3 h-3 text-blue-500" />
                                <span>{emp.currentProject}</span>
                              </span>
                            </td>

                            <td className="py-3.5 px-3">
                              <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${
                                emp.overallProficiency === "Advanced"
                                  ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                                  : "bg-blue-100 text-blue-800 border border-blue-300"
                              }`}>
                                {emp.overallProficiency}
                              </span>
                            </td>

                            <td className="py-3.5 px-3">
                              <span className="text-amber-700 bg-amber-50 font-bold px-2 py-0.5 rounded-md border border-amber-200 text-[11px]">
                                {emp.skillGaps.length} Gaps Flagged
                              </span>
                            </td>

                            <td className="py-3.5 px-4 text-right">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedEmployee(emp);
                                  setEmployeeSubTab("profile");
                                }}
                                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] px-3 py-1.5 rounded-lg shadow-2xs cursor-pointer inline-flex items-center gap-1"
                              >
                                <span>View Profile</span>
                                <ChevronRight className="w-3.5 h-3.5" />
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* =================================================================== */}
          {/* VIEW 2: EMPLOYEE PROFILE                                            */}
          {/* =================================================================== */}
          {employeeSubTab === "profile" && selectedEmployee && (
            <div className="space-y-6">
              {/* Profile Header Card */}
              <div className="bg-white rounded-3xl border border-gray-200 p-7 shadow-xs">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 text-emerald-400 flex items-center justify-center font-black text-2xl shadow-md shrink-0">
                      {selectedEmployee.avatar}
                    </div>
                    <div>
                      <div className="flex items-center space-x-2 flex-wrap gap-y-1">
                        <h3 className="text-2xl font-black text-slate-900">{selectedEmployee.name}</h3>
                        <span className="bg-emerald-100 text-emerald-800 border border-emerald-300 text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          <span>{selectedEmployee.status}</span>
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1 flex items-center gap-2">
                        <strong className="text-slate-800">{selectedEmployee.role}</strong>
                        <span>•</span>
                        <span>{selectedEmployee.department}</span>
                        <span>•</span>
                        <span>{selectedEmployee.experience} experience</span>
                        <span>•</span>
                        <span className="font-mono text-blue-600">{selectedEmployee.email}</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setEmployeeSubTab("gaps")}
                      className="bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 text-xs font-bold px-4 py-2 rounded-xl flex items-center gap-1.5 cursor-pointer"
                    >
                      <Target className="w-4 h-4 text-amber-600" />
                      <span>Analyze Skill Gaps</span>
                    </button>

                    <button
                      onClick={() => setEmployeeSubTab("learning")}
                      className="bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold px-4 py-2 rounded-xl flex items-center gap-1.5 shadow-xs cursor-pointer"
                    >
                      <BookOpen className="w-4 h-4" />
                      <span>Assigned Learning</span>
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-gray-100">
                  <div className="bg-gray-50 p-3.5 rounded-2xl border border-gray-200">
                    <div className="text-[10px] uppercase font-bold text-gray-400">Current Project</div>
                    <div className="text-sm font-black text-slate-900 mt-0.5 flex items-center gap-1.5">
                      <FolderKanban className="w-4 h-4 text-blue-600" />
                      <span>{selectedEmployee.currentProject}</span>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-3.5 rounded-2xl border border-gray-200">
                    <div className="text-[10px] uppercase font-bold text-gray-400">Technical Skills</div>
                    <div className="text-sm font-black text-slate-900 mt-0.5 flex items-center gap-1.5">
                      <Award className="w-4 h-4 text-emerald-600" />
                      <span>{selectedEmployee.skills.technical.length} Verified</span>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-3.5 rounded-2xl border border-gray-200">
                    <div className="text-[10px] uppercase font-bold text-gray-400">Skill Gaps</div>
                    <div className="text-sm font-black text-amber-700 mt-0.5 flex items-center gap-1.5">
                      <AlertCircle className="w-4 h-4 text-amber-600" />
                      <span>{selectedEmployee.skillGaps.length} Flagged</span>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-3.5 rounded-2xl border border-gray-200">
                    <div className="text-[10px] uppercase font-bold text-gray-400">Enrolled Learning</div>
                    <div className="text-sm font-black text-purple-700 mt-0.5 flex items-center gap-1.5">
                      <BookOpen className="w-4 h-4 text-purple-600" />
                      <span>{selectedEmployee.learningRecommendations.filter((r: any) => r.status === "ASSIGNED").length} Active Courses</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Grid of Profile Details: Skills & Gaps */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Technical Skills Column */}
                <div className="lg:col-span-2 bg-white rounded-3xl border border-gray-200 p-6 shadow-xs space-y-4">
                  <div className="flex justify-between items-center pb-3 border-b border-gray-100">
                    <div>
                      <h4 className="text-sm font-black text-slate-900 flex items-center gap-2">
                        <Award className="w-4 h-4 text-emerald-600" />
                        <span>Evidence-Based Technical Skills</span>
                      </h4>
                      <p className="text-[11px] text-gray-500">Supported by internal code assessments, production repos, and peer reviews.</p>
                    </div>
                    <span className="text-[11px] font-bold text-gray-400">Score / Level</span>
                  </div>

                  <div className="space-y-3">
                    {selectedEmployee.skills.technical.map((sk: any, i: number) => (
                      <div key={i} className="p-3.5 rounded-2xl bg-gray-50 border border-gray-200 space-y-2">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center space-x-2">
                            <span className="font-extrabold text-slate-900 text-xs">{sk.name}</span>
                            <span className="text-[10px] text-gray-400 font-mono">({sk.category})</span>
                          </div>

                          <div className="flex items-center space-x-2">
                            {sk.score > 0 && (
                              <span className="font-mono text-xs font-black text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                                {sk.score}%
                              </span>
                            )}
                            <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${
                              sk.level === "Advanced" ? "bg-emerald-100 text-emerald-800" :
                              sk.level === "Proficient" ? "bg-blue-100 text-blue-800" :
                              sk.level === "Developing" ? "bg-amber-100 text-amber-800" :
                              "bg-gray-200 text-gray-600"
                            }`}>
                              {sk.level}
                            </span>
                          </div>
                        </div>

                        {/* Evidence badges */}
                        {sk.evidence && sk.evidence.length > 0 ? (
                          <div className="flex flex-wrap gap-1.5 pt-1">
                            {sk.evidence.map((ev: any, idx: number) => (
                              <span key={idx} className="bg-white border border-gray-200 text-gray-600 text-[10px] px-2 py-0.5 rounded-md flex items-center gap-1 shadow-2xs">
                                <CheckCheck className="w-3 h-3 text-emerald-600" />
                                <strong>{ev.type}:</strong> {ev.detail}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <div className="text-[10px] text-gray-400 italic">No verification evidence on record yet.</div>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Soft Skills */}
                  <div className="pt-4 border-t border-gray-100 space-y-3">
                    <h5 className="text-xs font-black text-slate-900 uppercase tracking-wider text-gray-400">Soft Skills Evaluation</h5>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {selectedEmployee.skills.soft.map((ss: any, idx: number) => (
                        <div key={idx} className="p-3 bg-gray-50 rounded-xl border border-gray-200 space-y-1">
                          <div className="flex justify-between items-center text-xs">
                            <span className="font-bold text-slate-900">{ss.name}</span>
                            <span className="text-[10px] font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-full border border-purple-200">
                              {ss.level}
                            </span>
                          </div>
                          {ss.evidence?.[0] && (
                            <p className="text-[10px] text-gray-500">{ss.evidence[0].detail}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right Column: Skill Gaps & Current Development Areas */}
                <div className="space-y-6">
                  {/* Skill Gaps Card */}
                  <div className="bg-white rounded-3xl border border-gray-200 p-6 shadow-xs space-y-4">
                    <div className="flex items-center space-x-2 text-xs font-black uppercase tracking-wider text-rose-700">
                      <Target className="w-4 h-4" />
                      <span>Identified Skill Gaps</span>
                    </div>

                    <div className="space-y-3">
                      {selectedEmployee.skillGaps.map((sg: any, i: number) => (
                        <div key={i} className="p-3.5 rounded-2xl bg-rose-50/50 border border-rose-200 space-y-1.5">
                          <div className="flex justify-between items-center">
                            <span className="font-black text-slate-900 text-xs">{sg.skill}</span>
                            <span className="text-[10px] font-black uppercase text-rose-700 bg-rose-100 px-2 py-0.5 rounded-full">
                              Priority {sg.priorityRank}
                            </span>
                          </div>
                          <div className="text-[11px] text-gray-600">
                            Required by: <strong>{sg.requiredBy}</strong>
                          </div>
                          <div className="text-[10px] text-gray-500 flex justify-between pt-1">
                            <span>Current: {sg.currentLevel}</span>
                            <span className="font-bold text-slate-800">Target: {sg.targetLevel}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Current Development Areas */}
                  <div className="bg-white rounded-3xl border border-gray-200 p-6 shadow-xs space-y-3">
                    <div className="flex items-center space-x-2 text-xs font-black uppercase tracking-wider text-indigo-700">
                      <Compass className="w-4 h-4" />
                      <span>Development Focus Areas</span>
                    </div>

                    <div className="space-y-2">
                      {selectedEmployee.developmentAreas.map((area: string, idx: number) => (
                        <div key={idx} className="p-2.5 bg-indigo-50/40 rounded-xl border border-indigo-200 text-xs font-bold text-slate-800 flex items-center gap-2">
                          <ArrowRight className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                          <span>{area}</span>
                        </div>
                      ))}
                    </div>

                    <div className="pt-2">
                      <button
                        onClick={() => setEmployeeSubTab("learning")}
                        className="w-full bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold py-2.5 rounded-xl flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                      >
                        <span>View Tailored Learning Catalog</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* =================================================================== */}
          {/* VIEW 3: PROJECTS & WORK                                             */}
          {/* =================================================================== */}
          {employeeSubTab === "projects" && (
            <div className="space-y-6">
              {/* Project selector */}
              <div className="flex gap-2 overflow-x-auto pb-1">
                {employeeIntelligence?.projects?.map((proj: any) => {
                  const isSelected = selectedProject?.id === proj.id;
                  return (
                    <button
                      key={proj.id}
                      onClick={() => setSelectedProject(proj)}
                      className={`px-4 py-2.5 rounded-2xl text-xs font-bold border transition-all cursor-pointer flex items-center gap-2 ${
                        isSelected 
                          ? "bg-slate-900 text-white border-slate-900 shadow-sm" 
                          : "bg-white text-gray-600 border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <FolderKanban className="w-4 h-4 text-emerald-400" />
                      <span>{proj.codeName}</span>
                      <span className="text-[10px] opacity-70">({proj.department})</span>
                    </button>
                  );
                })}
              </div>

              {selectedProject && (
                <div className="space-y-6">
                  {/* Project Overview Card */}
                  <div className="bg-white rounded-3xl border border-gray-200 p-7 shadow-xs space-y-5">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="text-[10px] font-black uppercase bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full">
                            {selectedProject.status}
                          </span>
                          <span className="text-[10px] font-black uppercase bg-rose-100 text-rose-800 px-2.5 py-0.5 rounded-full">
                            {selectedProject.priority} Priority
                          </span>
                        </div>
                        <h3 className="text-xl font-black text-slate-900 mt-1">{selectedProject.name}</h3>
                        <p className="text-xs text-gray-500 mt-0.5">{selectedProject.description}</p>
                      </div>

                      <div className="text-right text-xs">
                        <div className="text-gray-400 font-bold uppercase text-[10px]">Target Deadline</div>
                        <div className="font-extrabold text-slate-900 flex items-center gap-1 mt-0.5">
                          <Calendar className="w-3.5 h-3.5 text-blue-600" />
                          <span>{selectedProject.deadline}</span>
                        </div>
                        <div className="text-[11px] text-gray-500 mt-1">Lead: <strong>{selectedProject.lead}</strong> • {selectedProject.teamSize} Engineers</div>
                      </div>
                    </div>

                    {/* Technologies & Responsibilities */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-100">
                      <div>
                        <div className="text-[11px] font-bold text-gray-400 uppercase mb-2">Core Tech Stack:</div>
                        <div className="flex flex-wrap gap-1.5">
                          {selectedProject.technologies.map((t: string, idx: number) => (
                            <span key={idx} className="bg-gray-100 text-slate-800 text-xs font-semibold px-2.5 py-1 rounded-lg border border-gray-200">
                              {t}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div>
                        <div className="text-[11px] font-bold text-gray-400 uppercase mb-2">Key Sprint Deliverables:</div>
                        <ul className="text-xs text-gray-600 space-y-1">
                          {selectedProject.responsibilities.map((r: string, idx: number) => (
                            <li key={idx} className="flex items-center gap-1.5">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                              <span>{r}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* Active Tasks */}
                    <div className="pt-4 border-t border-gray-100">
                      <div className="text-[11px] font-bold text-gray-400 uppercase mb-2.5">Assigned Sprint Tasks:</div>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        {selectedProject.tasks.map((task: any) => (
                          <div key={task.id} className="p-3 bg-gray-50 rounded-xl border border-gray-200 space-y-1">
                            <div className="flex justify-between items-center">
                              <span className="text-[10px] font-mono font-bold text-gray-400">{task.id}</span>
                              <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full ${
                                task.status === "Done" ? "bg-emerald-100 text-emerald-800" :
                                task.status === "In Progress" ? "bg-blue-100 text-blue-800" :
                                "bg-rose-100 text-rose-800"
                              }`}>
                                {task.status}
                              </span>
                            </div>
                            <div className="text-xs font-bold text-slate-900">{task.title}</div>
                            <div className="text-[10px] text-gray-500">Assignee: <strong>{task.assignee}</strong></div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* INTERACTIVE COMPARISON MATRIX: Project Requirements vs Employee Skills */}
                  <div className="bg-white rounded-3xl border border-gray-200 p-7 shadow-xs space-y-4">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 pb-3 border-b border-gray-100">
                      <div>
                        <h4 className="text-base font-black text-slate-900 flex items-center gap-2">
                          <SlidersHorizontal className="w-4 h-4 text-emerald-600" />
                          <span>Project Requirements vs. Employee Skills Alignment Matrix</span>
                        </h4>
                        <p className="text-xs text-gray-500">
                          Comparing <strong className="text-slate-800">{selectedProject.codeName}</strong> requirements against <strong className="text-slate-800">{selectedEmployee?.name || "Employee A"}</strong>.
                        </p>
                      </div>

                      <div className="flex items-center gap-2 text-xs">
                        <span className="text-gray-500 font-bold">Select Employee:</span>
                        <select
                          value={selectedEmployee?.id}
                          onChange={(e) => {
                            const emp = employeeIntelligence?.employees.find((x: any) => x.id === e.target.value);
                            if (emp) setSelectedEmployee(emp);
                          }}
                          className="border border-gray-300 rounded-xl px-2.5 py-1.5 font-bold text-xs bg-white text-slate-800"
                        >
                          {employeeIntelligence?.employees.map((e: any) => (
                            <option key={e.id} value={e.id}>{e.name} ({e.role})</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs">
                        <thead>
                          <tr className="border-b border-gray-200 text-gray-400 font-bold uppercase text-[10px] tracking-wider bg-gray-50/60">
                            <th className="py-3 px-4 rounded-l-xl">Project Required Skill</th>
                            <th className="py-3 px-3">Target Required Level</th>
                            <th className="py-3 px-3">Employee Evaluated Level</th>
                            <th className="py-3 px-3">Evidence Match</th>
                            <th className="py-3 px-3">Skill Gap Status</th>
                            <th className="py-3 px-4 text-right rounded-r-xl">Action</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                          {selectedProject.requiredSkills.map((req: any, idx: number) => {
                            const empSkill = selectedEmployee?.skills?.technical?.find((s: any) => s.name.toLowerCase() === req.name.toLowerCase());
                            const hasSkill = !!empSkill;
                            const isMet = hasSkill && (empSkill.score >= req.minScore || empSkill.level === req.requiredLevel || empSkill.level === "Advanced");
                            const isDeveloping = hasSkill && !isMet && empSkill.score > 0;

                            return (
                              <tr key={idx} className="hover:bg-slate-50/80">
                                <td className="py-3.5 px-4 font-black text-slate-900">
                                  {req.name}
                                </td>

                                <td className="py-3.5 px-3">
                                  <span className="bg-slate-100 text-slate-800 font-bold px-2 py-0.5 rounded-md text-[11px] border border-slate-200">
                                    {req.requiredLevel} ({req.minScore}%)
                                  </span>
                                </td>

                                <td className="py-3.5 px-3">
                                  {empSkill ? (
                                    <span className={`font-bold text-[11px] px-2 py-0.5 rounded-md ${
                                      empSkill.level === "Advanced" ? "bg-emerald-50 text-emerald-800 border border-emerald-200" :
                                      empSkill.level === "Proficient" ? "bg-blue-50 text-blue-800 border border-blue-200" :
                                      empSkill.level === "Developing" ? "bg-amber-50 text-amber-800 border border-amber-200" :
                                      "bg-gray-100 text-gray-500"
                                    }`}>
                                      {empSkill.level} {empSkill.score > 0 ? `(${empSkill.score}%)` : ""}
                                    </span>
                                  ) : (
                                    <span className="text-gray-400 italic text-[11px]">Not Assessed (0%)</span>
                                  )}
                                </td>

                                <td className="py-3.5 px-3">
                                  {empSkill?.evidence?.[0] ? (
                                    <span className="text-[10px] text-gray-600 bg-white border border-gray-200 px-2 py-0.5 rounded shadow-2xs font-mono">
                                      {empSkill.evidence[0].type}
                                    </span>
                                  ) : (
                                    <span className="text-[10px] text-gray-400">No Evidence</span>
                                  )}
                                </td>

                                <td className="py-3.5 px-3">
                                  {isMet ? (
                                    <span className="bg-emerald-100 text-emerald-800 font-black text-[10px] uppercase px-2.5 py-0.5 rounded-full flex items-center gap-1 w-max">
                                      <Check className="w-3 h-3 text-emerald-600" />
                                      <span>Requirement Met</span>
                                    </span>
                                  ) : isDeveloping ? (
                                    <span className="bg-amber-100 text-amber-800 font-black text-[10px] uppercase px-2.5 py-0.5 rounded-full flex items-center gap-1 w-max">
                                      <AlertCircle className="w-3 h-3 text-amber-600" />
                                      <span>Developing Gap</span>
                                    </span>
                                  ) : (
                                    <span className="bg-rose-100 text-rose-800 font-black text-[10px] uppercase px-2.5 py-0.5 rounded-full flex items-center gap-1 w-max">
                                      <X className="w-3 h-3 text-rose-600" />
                                      <span>Critical Missing</span>
                                    </span>
                                  )}
                                </td>

                                <td className="py-3.5 px-4 text-right">
                                  {!isMet && (
                                    <button
                                      onClick={() => {
                                        setEmployeeSubTab("learning");
                                        setAssignedLearningNotice(`Switched to Learning Engine to resolve ${req.name} gap for ${selectedEmployee.name}.`);
                                      }}
                                      className="bg-purple-600 hover:bg-purple-700 text-white text-[10px] font-bold px-3 py-1 rounded-lg shadow-2xs cursor-pointer inline-flex items-center gap-1"
                                    >
                                      <span>Assign Remediation</span>
                                      <ArrowRight className="w-3 h-3" />
                                    </button>
                                  )}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* =================================================================== */}
          {/* VIEW 4: EVIDENCE-BASED SKILLS                                       */}
          {/* =================================================================== */}
          {employeeSubTab === "skills" && selectedEmployee && (
            <div className="space-y-6">
              <div className="bg-white rounded-3xl border border-gray-200 p-7 shadow-xs space-y-4">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 pb-3 border-b border-gray-100">
                  <div>
                    <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                      <Award className="w-5 h-5 text-emerald-600" />
                      <span>Company-Level Evidence-Based Skill Profile</span>
                    </h3>
                    <p className="text-xs text-gray-500">
                      Skill proficiencies are verified through verifiable evidence (Assessments, Code Repositories, Manager Evaluations, Certifications) rather than arbitrary manual HR edits.
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-400 font-bold">Inspecting:</span>
                    <span className="bg-slate-900 text-emerald-400 font-bold text-xs px-3 py-1 rounded-xl">
                      {selectedEmployee.name}
                    </span>
                  </div>
                </div>

                {/* 4 Pillars of Evidence explanation */}
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                  <div className="p-3 bg-blue-50/60 rounded-xl border border-blue-200 text-xs">
                    <div className="font-bold text-blue-900 flex items-center gap-1">
                      <Award className="w-3.5 h-3.5 text-blue-600" />
                      <span>1. Assessments</span>
                    </div>
                    <p className="text-[11px] text-blue-700 mt-1">Timed MCQ & Coding benchmarks with cryptographic score stamps.</p>
                  </div>

                  <div className="p-3 bg-emerald-50/60 rounded-xl border border-emerald-200 text-xs">
                    <div className="font-bold text-emerald-900 flex items-center gap-1">
                      <GitPullRequest className="w-3.5 h-3.5 text-emerald-600" />
                      <span>2. Project Code</span>
                    </div>
                    <p className="text-[11px] text-emerald-700 mt-1">Merged pull requests and verified feature implementations.</p>
                  </div>

                  <div className="p-3 bg-purple-50/60 rounded-xl border border-purple-200 text-xs">
                    <div className="font-bold text-purple-900 flex items-center gap-1">
                      <Users className="w-3.5 h-3.5 text-purple-600" />
                      <span>3. Manager Review</span>
                    </div>
                    <p className="text-[11px] text-purple-700 mt-1">Quarterly lead performance reviews and competency ratings.</p>
                  </div>

                  <div className="p-3 bg-amber-50/60 rounded-xl border border-amber-200 text-xs">
                    <div className="font-bold text-amber-900 flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 text-amber-600" />
                      <span>4. Certifications</span>
                    </div>
                    <p className="text-[11px] text-amber-700 mt-1">Industry badges from AWS, Kubernetes (CKAD), Google Cloud, and W3C.</p>
                  </div>
                </div>

                {/* Detailed Evidence Cards */}
                <div className="space-y-4 pt-4">
                  {selectedEmployee.skills.technical.map((sk: any, idx: number) => (
                    <div key={idx} className="p-5 rounded-2xl bg-gray-50/70 border border-gray-200 space-y-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="flex items-center space-x-2">
                            <h4 className="text-sm font-black text-slate-900">{sk.name}</h4>
                            <span className="text-[10px] text-gray-500 font-mono">Category: {sk.category}</span>
                          </div>
                        </div>

                        <div className="flex items-center space-x-2">
                          {sk.score > 0 && (
                            <span className="text-xs font-black text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 font-mono">
                              {sk.score}% Assessed
                            </span>
                          )}
                          <span className={`text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full ${
                            sk.level === "Advanced" ? "bg-emerald-100 text-emerald-800" :
                            sk.level === "Proficient" ? "bg-blue-100 text-blue-800" :
                            sk.level === "Developing" ? "bg-amber-100 text-amber-800" :
                            "bg-gray-200 text-gray-600"
                          }`}>
                            {sk.level}
                          </span>
                        </div>
                      </div>

                      {/* Evidence Timeline / List */}
                      <div className="space-y-2 pt-2 border-t border-gray-200/60">
                        <div className="text-[10px] font-bold text-gray-400 uppercase">Supporting Verification Evidence:</div>
                        {sk.evidence && sk.evidence.length > 0 ? (
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {sk.evidence.map((ev: any, eIdx: number) => (
                              <div key={eIdx} className="bg-white p-2.5 rounded-xl border border-gray-200 text-xs flex items-start gap-2 shadow-2xs">
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                                <div>
                                  <div className="font-bold text-slate-800 text-[11px]">{ev.type}</div>
                                  <div className="text-[11px] text-gray-600">{ev.detail}</div>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-xs text-amber-800 bg-amber-50 p-2.5 rounded-xl border border-amber-200 flex items-center justify-between">
                            <span>No evidence registered for this skill. Employee needs assessment or project demonstration.</span>
                            <button
                              onClick={() => {
                                setEmployeeSubTab("learning");
                                setAssignedLearningNotice(`Assigning skill assessment / practice module for ${sk.name}`);
                              }}
                              className="bg-amber-700 hover:bg-amber-800 text-white text-[10px] font-bold px-3 py-1 rounded-lg cursor-pointer"
                            >
                              Assign Assessment
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* =================================================================== */}
          {/* VIEW 5: SKILL GAP ENGINE                                            */}
          {/* =================================================================== */}
          {employeeSubTab === "gaps" && selectedEmployee && (
            <div className="space-y-6">
              {/* Formula & Architecture Banner */}
              <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white rounded-3xl p-7 shadow-xs space-y-4">
                <div className="flex items-center space-x-2 text-xs font-black uppercase tracking-wider text-emerald-400">
                  <Cpu className="w-4 h-4" />
                  <span>Platform Skill Gap Engine</span>
                </div>
                <h3 className="text-2xl font-black">Triangulated Workforce Gap Analysis</h3>
                <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
                  Calculates gaps by comparing <strong>Employee Evaluated Skills</strong> + <strong>Current Project Sprint Requirements</strong> + <strong>Future Target Role Demands</strong> to compute exact growth priorities.
                </p>

                <div className="flex flex-wrap items-center gap-2 pt-2 text-xs font-mono">
                  <span className="bg-slate-800 border border-slate-700 px-3 py-1.5 rounded-xl text-emerald-300">Employee Skills</span>
                  <span>+</span>
                  <span className="bg-slate-800 border border-slate-700 px-3 py-1.5 rounded-xl text-blue-300">Project Demands</span>
                  <span>+</span>
                  <span className="bg-slate-800 border border-slate-700 px-3 py-1.5 rounded-xl text-purple-300">Future Roles</span>
                  <span>=</span>
                  <span className="bg-emerald-500/20 border border-emerald-400 text-emerald-300 px-3 py-1.5 rounded-xl font-bold">Actionable Priorities</span>
                </div>
              </div>

              {/* 3 Categories: Strengths, Gaps, Future Priorities */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* 1. Current Strengths */}
                <div className="bg-white rounded-3xl border border-gray-200 p-6 shadow-xs space-y-4">
                  <div className="flex items-center space-x-2 text-xs font-black uppercase tracking-wider text-emerald-700 pb-2 border-b border-gray-100">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Current Strengths</span>
                  </div>

                  <div className="space-y-2.5">
                    {selectedEmployee.skills.technical
                      .filter((s: any) => s.level === "Advanced" || s.level === "Proficient")
                      .map((sk: any, idx: number) => (
                        <div key={idx} className="p-3 bg-emerald-50/50 rounded-2xl border border-emerald-200 flex justify-between items-center text-xs">
                          <div>
                            <div className="font-extrabold text-slate-900">{sk.name}</div>
                            <div className="text-[10px] text-gray-500">{sk.category}</div>
                          </div>
                          <span className="text-[11px] font-black text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                            {sk.level} {sk.score > 0 ? `(${sk.score}%)` : ""}
                          </span>
                        </div>
                      ))}
                  </div>
                </div>

                {/* 2. Current Gaps */}
                <div className="bg-white rounded-3xl border border-gray-200 p-6 shadow-xs space-y-4">
                  <div className="flex items-center space-x-2 text-xs font-black uppercase tracking-wider text-rose-700 pb-2 border-b border-gray-100">
                    <AlertCircle className="w-4 h-4" />
                    <span>Active Sprint Gaps</span>
                  </div>

                  <div className="space-y-2.5">
                    {selectedEmployee.skillGaps.map((sg: any, idx: number) => (
                      <div key={idx} className="p-3 bg-rose-50/50 rounded-2xl border border-rose-200 space-y-1 text-xs">
                        <div className="flex justify-between items-center">
                          <span className="font-black text-slate-900">{sg.skill}</span>
                          <span className="text-[10px] font-bold text-rose-700 bg-rose-100 px-2 py-0.5 rounded-full uppercase">
                            {sg.severity}
                          </span>
                        </div>
                        <div className="text-[11px] text-gray-600">Requires: {sg.targetLevel}</div>
                        <div className="text-[10px] text-gray-500">{sg.requiredBy}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 3. Development Priorities */}
                <div className="bg-white rounded-3xl border border-gray-200 p-6 shadow-xs space-y-4">
                  <div className="flex items-center space-x-2 text-xs font-black uppercase tracking-wider text-purple-700 pb-2 border-b border-gray-100">
                    <Target className="w-4 h-4" />
                    <span>Development Priorities</span>
                  </div>

                  <div className="space-y-3">
                    {selectedEmployee.skillGaps.map((sg: any, idx: number) => (
                      <div key={idx} className="p-3.5 bg-purple-50/40 rounded-2xl border border-purple-200 space-y-2">
                        <div className="flex items-center space-x-2">
                          <span className="w-5 h-5 rounded-full bg-purple-600 text-white flex items-center justify-center font-black text-[10px]">
                            {sg.priorityRank}
                          </span>
                          <span className="font-extrabold text-slate-900 text-xs">{sg.skill}</span>
                        </div>
                        <p className="text-[11px] text-gray-600">{sg.requiredBy}</p>
                        <button
                          onClick={() => {
                            setEmployeeSubTab("learning");
                            setAssignedLearningNotice(`Selected learning curriculum for Priority #${sg.priorityRank} (${sg.skill})`);
                          }}
                          className="w-full bg-purple-600 hover:bg-purple-700 text-white text-[11px] font-bold py-1.5 rounded-xl cursor-pointer shadow-2xs flex items-center justify-center gap-1"
                        >
                          <span>Open Recommended Resources</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* =================================================================== */}
          {/* VIEW 6: PERSONALIZED LEARNING & RESOURCES                           */}
          {/* =================================================================== */}
          {employeeSubTab === "learning" && selectedEmployee && (
            <div className="bg-white rounded-3xl border border-gray-200 p-7 shadow-xs space-y-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-4 border-b border-gray-100">
                <div>
                  <div className="flex items-center space-x-2 text-xs font-black uppercase tracking-wider text-purple-700 mb-1">
                    <BookOpen className="w-4 h-4" />
                    <span>Personalized Learning Engine</span>
                  </div>
                  <h3 className="text-xl font-black text-slate-900">Recommended Resources for {selectedEmployee.name}</h3>
                  <p className="text-xs text-gray-500">
                    Resources are automatically ranked by relevance to identified skill gaps, project urgency, and company approval.
                  </p>
                </div>

                <div className="text-right">
                  <span className="text-xs bg-purple-50 text-purple-800 font-bold px-3 py-1.5 rounded-xl border border-purple-200">
                    {selectedEmployee.learningRecommendations.length} Curated Pathways
                  </span>
                </div>
              </div>

              {/* Resource Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {selectedEmployee.learningRecommendations.map((res: any) => {
                  const isAssigned = res.status === "ASSIGNED";

                  return (
                    <div 
                      key={res.id} 
                      className={`rounded-2xl p-5 border-2 transition-all space-y-3 ${
                        isAssigned 
                          ? "bg-purple-50/40 border-purple-200" 
                          : "bg-gray-50/60 border-gray-200 hover:border-purple-300"
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-md bg-purple-100 text-purple-800">
                              {res.type}
                            </span>
                            <span className="text-[10px] font-bold text-gray-500">
                              Target: <strong className="text-slate-900">{res.targetSkill}</strong>
                            </span>
                          </div>
                          <h4 className="text-sm font-black text-slate-900 mt-1">{res.title}</h4>
                          <p className="text-[11px] text-gray-500">{res.provider} • {res.estimatedDuration}</p>
                        </div>

                        <div className="text-right">
                          <span className="text-xs font-black text-emerald-700 bg-emerald-50 px-2 py-1 rounded-lg border border-emerald-200">
                            {res.relevanceScore}% Match
                          </span>
                        </div>
                      </div>

                      <div className="bg-white p-3 rounded-xl border border-gray-200/80 text-xs space-y-1">
                        <div className="text-[10px] font-bold text-gray-400 uppercase">Why this resource:</div>
                        <div className="text-[11px] text-slate-700 font-medium">{res.relevanceReason}</div>
                        {res.certificationAligned && (
                          <div className="text-[10px] text-purple-700 font-bold flex items-center gap-1 pt-1">
                            <Award className="w-3 h-3" />
                            <span>Aligned with: {res.certificationAligned}</span>
                          </div>
                        )}
                      </div>

                      <div className="flex justify-between items-center pt-2">
                        <span className="text-[10px] font-bold text-gray-400 uppercase">
                          Difficulty: <strong className="text-slate-700">{res.difficulty}</strong>
                        </span>

                        <button
                          onClick={() => {
                            setAssignedLearningNotice(`Assigned "${res.title}" to ${selectedEmployee.name}! Synchronized with their LMS schedule.`);
                          }}
                          className={`text-xs font-bold px-4 py-2 rounded-xl flex items-center gap-1.5 cursor-pointer shadow-2xs ${
                            isAssigned
                              ? "bg-emerald-600 text-white hover:bg-emerald-700"
                              : "bg-purple-600 text-white hover:bg-purple-700"
                          }`}
                        >
                          <PlayCircle className="w-3.5 h-3.5" />
                          <span>{isAssigned ? "Enrolled & In Progress" : "Assign to Employee"}</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* =================================================================== */}
          {/* VIEW 7: PRODUCTIVITY & PROCESS DEVELOPMENT                          */}
          {/* =================================================================== */}
          {employeeSubTab === "productivity" && selectedEmployee && (
            <div className="bg-white rounded-3xl border border-gray-200 p-7 shadow-xs space-y-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-4 border-b border-gray-100">
                <div>
                  <div className="flex items-center space-x-2 text-xs font-black uppercase tracking-wider text-amber-600 mb-1">
                    <Lightbulb className="w-4 h-4" />
                    <span>Work & Process Development Insights</span>
                  </div>
                  <h3 className="text-xl font-black text-slate-900">Constructive Process Optimization for {selectedEmployee.name}</h3>
                  <p className="text-xs text-gray-500 max-w-3xl">
                    Derived from authorized work patterns, build telemetry, and sprint bottlenecks. Identifies developmental workflows rather than simplistic numerical scoring.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-5">
                {selectedEmployee.productivityInsights?.map((insight: any) => (
                  <div key={insight.id} className="p-5 rounded-2xl bg-gray-50/70 border border-gray-200 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
                        <Lightbulb className="w-4 h-4 text-amber-500" />
                        <span>Observed Development Area: {insight.observedArea}</span>
                      </span>
                      <span className="text-[10px] font-black uppercase bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                        Workflow Opportunity
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                      <div className="bg-white p-3.5 rounded-xl border border-gray-200 space-y-1">
                        <div className="text-[10px] font-bold text-gray-400 uppercase">Workplace Pattern Observation:</div>
                        <p className="text-gray-700">{insight.observation}</p>
                      </div>

                      <div className="bg-white p-3.5 rounded-xl border border-gray-200 space-y-1">
                        <div className="text-[10px] font-bold text-emerald-600 uppercase">Productivity Enhancement:</div>
                        <p className="text-slate-900 font-medium">{insight.opportunity}</p>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-gray-200/60 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 text-xs">
                      <div className="flex items-center gap-2">
                        <span className="text-gray-400 font-bold uppercase text-[10px]">Recommended Action:</span>
                        <span className="text-slate-800 font-bold">{insight.improvementAction}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        {insight.recommendedResources?.map((resName: string, idx: number) => (
                          <button
                            key={idx}
                            onClick={() => {
                              setEmployeeSubTab("learning");
                              setAssignedLearningNotice(`Opened resource: ${resName}`);
                            }}
                            className="bg-slate-900 hover:bg-slate-800 text-white text-[11px] font-bold px-3 py-1.5 rounded-lg cursor-pointer flex items-center gap-1 shadow-2xs"
                          >
                            <BookOpen className="w-3 h-3" />
                            <span>{resName}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* =================================================================== */}
          {/* VIEW 8: FUTURE PROJECTS & WORKFORCE DECISION LOOP                  */}
          {/* (Upskill Internal Employees vs. Hire External via 7-Step Wizard)    */}
          {/* =================================================================== */}
          {employeeSubTab === "future_planning" && (
            <div className="space-y-6">
              {/* Decision Loop Architecture Card */}
              <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 text-white rounded-3xl p-7 shadow-xs space-y-4">
                <div className="flex items-center space-x-2 text-xs font-black uppercase tracking-wider text-teal-400">
                  <Workflow className="w-4 h-4" />
                  <span>Strategic Workforce Planning Engine</span>
                </div>
                <h3 className="text-2xl font-black">Future Projects & Workforce Decision Loop</h3>
                <p className="text-xs text-slate-300 max-w-3xl leading-relaxed">
                  Avoid external hiring when suitable internal employees can be developed. Compare upcoming roadmap demands against existing workforce skill inventory to branch into:
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                  <div className="bg-white/10 p-4 rounded-2xl border border-white/10 space-y-2">
                    <div className="text-xs font-black uppercase text-teal-300 flex items-center gap-1.5">
                      <GraduationCap className="w-4 h-4" />
                      <span>Branch A: Internal Skill Gap</span>
                    </div>
                    <div className="text-xs text-slate-200">
                      When current employees have close adjacent skills, generate a <strong>Targeted Learning Plan</strong> instead of hiring.
                    </div>
                  </div>

                  <div className="bg-white/10 p-4 rounded-2xl border border-white/10 space-y-2">
                    <div className="text-xs font-black uppercase text-amber-300 flex items-center gap-1.5">
                      <Briefcase className="w-4 h-4" />
                      <span>Branch B: Workforce Shortage</span>
                    </div>
                    <div className="text-xs text-slate-200">
                      When the team size is strictly deficient, launch the <strong>7-Step Verified Internship / Job Posting Wizard</strong> pre-populated with required deficit skills.
                    </div>
                  </div>
                </div>
              </div>

              {/* Upcoming Future Projects */}
              <div className="space-y-5">
                {employeeIntelligence?.futureProjects?.map((fp: any) => (
                  <div key={fp.id} className="bg-white rounded-3xl border border-gray-200 p-7 shadow-xs space-y-5">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-3 border-b border-gray-100">
                      <div>
                        <span className="text-[10px] font-black uppercase bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded-md">
                          Planned: {fp.plannedStartDate} • Duration: {fp.estimatedDuration}
                        </span>
                        <h4 className="text-lg font-black text-slate-900 mt-1">{fp.title}</h4>
                        <p className="text-xs text-gray-500">Department: {fp.department}</p>
                      </div>

                      <div className="text-right">
                        <span className="text-xs font-black text-purple-700 bg-purple-50 px-3 py-1.5 rounded-xl border border-purple-200">
                          {fp.requiredRoles.length} Required Roles
                        </span>
                      </div>
                    </div>

                    {/* Roles Breakdown */}
                    <div className="space-y-4">
                      {fp.requiredRoles.map((role: any, rIdx: number) => (
                        <div key={rIdx} className="p-5 bg-gray-50/70 rounded-2xl border border-gray-200 space-y-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <div className="flex items-center space-x-2">
                                <h5 className="font-extrabold text-slate-900 text-sm">{role.role}</h5>
                                <span className="text-[10px] font-bold text-gray-500">Need: {role.headcountNeeded} Engineers</span>
                              </div>
                              <div className="flex flex-wrap gap-1 mt-1.5">
                                {role.requiredSkills.map((sk: string, sIdx: number) => (
                                  <span key={sIdx} className="bg-white border border-gray-200 text-gray-800 text-[10px] font-bold px-2 py-0.5 rounded-md">
                                    {sk}
                                  </span>
                                ))}
                              </div>
                            </div>

                            <div className="text-right">
                              <span className="text-[11px] font-black uppercase text-rose-700 bg-rose-50 px-2.5 py-1 rounded-lg border border-rose-200">
                                Deficit: {role.shortageGap} External Hires
                              </span>
                            </div>
                          </div>

                          {/* DUAL DECISION BRANCHES: Internal Upskill vs External Hire */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-3 border-t border-gray-200/60">
                            {/* Branch 1: Internal Candidate to Upskill */}
                            <div className="bg-white p-4 rounded-xl border border-emerald-200 space-y-2">
                              <div className="text-xs font-bold text-emerald-800 uppercase flex items-center justify-between">
                                <span className="flex items-center gap-1">
                                  <GraduationCap className="w-3.5 h-3.5 text-emerald-600" />
                                  <span>Upskill Internal Employee</span>
                                </span>
                                <span className="text-[10px] font-black text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                                  {role.internalCandidatesAvailable[0]?.readinessScore}% Ready
                                </span>
                              </div>

                              {role.internalCandidatesAvailable[0] ? (
                                <div className="space-y-1.5 text-xs">
                                  <div className="font-black text-slate-900">{role.internalCandidatesAvailable[0].name}</div>
                                  <p className="text-[11px] text-gray-600">{role.internalCandidatesAvailable[0].upskillPlan}</p>
                                  <button
                                    onClick={() => {
                                      setAssignedLearningNotice(`Internal Upskilling plan assigned to ${role.internalCandidatesAvailable[0].name}!`);
                                    }}
                                    className="bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold px-3 py-1.5 rounded-lg flex items-center gap-1 shadow-2xs cursor-pointer mt-2"
                                  >
                                    <Check className="w-3.5 h-3.5" />
                                    <span>Assign Upskilling Plan</span>
                                  </button>
                                </div>
                              ) : (
                                <div className="text-xs text-gray-400 italic">No existing employee matches adjacent skill profile.</div>
                              )}
                            </div>

                            {/* Branch 2: External Hiring 7-Step Wizard */}
                            <div className="bg-white p-4 rounded-xl border border-amber-200 space-y-2">
                              <div className="text-xs font-bold text-amber-800 uppercase flex items-center justify-between">
                                <span className="flex items-center gap-1">
                                  <Briefcase className="w-3.5 h-3.5 text-amber-600" />
                                  <span>Workforce Shortage Gap</span>
                                </span>
                                <span className="text-[10px] font-black text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                                  Hire {role.shortageGap} Positions
                                </span>
                              </div>

                              <p className="text-[11px] text-gray-600">
                                Convert the remaining staffing shortfall directly into our canonical 7-step verified job posting.
                              </p>

                              <button
                                onClick={() => handleOpenPostInternship({
                                  role: role.role,
                                  department: fp.department,
                                  skills: role.requiredSkills,
                                  salary: "₹45,000 - ₹55,000 / month"
                                })}
                                className="bg-slate-900 hover:bg-slate-800 text-white text-[11px] font-bold px-3 py-1.5 rounded-lg flex items-center gap-1 shadow-2xs cursor-pointer mt-2"
                              >
                                <Plus className="w-3.5 h-3.5 text-emerald-400" />
                                <span>Launch 7-Step Wizard for this Shortage</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* =================================================================== */}
          {/* VIEW 9: DATABASE CAPACITY & MARKET DEMAND                           */}
          {/* =================================================================== */}
          {/* =================================================================== */}
          {/* VIEW 9: WORKFORCE ANALYSIS & DECISION-SUPPORT JOB GENERATOR          */}
          {/* =================================================================== */}
          {employeeSubTab === "capacity" && (
            <div className="space-y-8">
              
              {/* STEP 1: DEPARTMENT WORKFORCE ANALYSIS TABLE */}
              <div className="bg-white rounded-3xl border border-gray-200 p-7 shadow-xs space-y-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-4 border-b border-gray-100">
                  <div>
                    <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-cyan-700 mb-1">
                      <BarChart3 className="w-4 h-4 text-cyan-600" />
                      <span>Step 1: Department Capacity & Deficit Analysis</span>
                    </div>
                    <h3 className="text-xl font-black text-slate-900">Workforce Headcount by Department</h3>
                    <p className="text-xs text-gray-500">
                      Examine current operational capacity vs target headcount across business units. Select a department to drill down into roles and projects.
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-black text-rose-700 bg-rose-50 px-3.5 py-1.5 rounded-xl border border-rose-200 shadow-2xs">
                      Enterprise Shortage: -31 Total Deficit
                    </span>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-gray-200 text-gray-400 font-bold uppercase text-[10px] tracking-wider">
                        <th className="pb-3">Department</th>
                        <th className="pb-3">Description</th>
                        <th className="pb-3 text-center">Current</th>
                        <th className="pb-3 text-center">Required</th>
                        <th className="pb-3 text-center">Staffing Gap</th>
                        <th className="pb-3 text-center">Capacity Status</th>
                        <th className="pb-3 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {workforceData?.departments?.map((dept: any) => {
                        const isSelected = selectedAnalysisDept === dept.name;
                        const hasShortage = dept.gap < 0;

                        return (
                          <tr
                            key={dept.id}
                            className={`transition-colors cursor-pointer ${
                              isSelected ? "bg-cyan-50/60 font-semibold" : "hover:bg-gray-50/80"
                            }`}
                            onClick={() => {
                              setSelectedAnalysisDept(dept.name);
                              const defaultRole = workforceData?.rolesByDepartment?.[dept.name]?.[0]?.role || "Backend Engineer";
                              setSelectedAnalysisRole(defaultRole);
                            }}
                          >
                            <td className="py-4">
                              <div className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
                                <span className={`w-2.5 h-2.5 rounded-full ${isSelected ? "bg-cyan-600" : "bg-gray-300"}`} />
                                <span>{dept.name}</span>
                              </div>
                            </td>
                            <td className="py-4 text-gray-500 max-w-xs truncate">{dept.description}</td>
                            <td className="py-4 text-center font-bold text-slate-700 text-sm">{dept.currentHeadcount}</td>
                            <td className="py-4 text-center font-bold text-slate-900 text-sm">{dept.requiredHeadcount}</td>
                            <td className="py-4 text-center">
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-black ${
                                hasShortage ? "bg-rose-100 text-rose-800 border border-rose-200" : "bg-emerald-100 text-emerald-800"
                              }`}>
                                {dept.gap > 0 ? `+${dept.gap}` : dept.gap}
                              </span>
                            </td>
                            <td className="py-4 text-center">
                              <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-md ${
                                dept.status === "HIGH_SHORTAGE"
                                  ? "bg-rose-100 text-rose-700"
                                  : dept.status === "MODERATE_SHORTAGE"
                                  ? "bg-amber-100 text-amber-800"
                                  : "bg-emerald-100 text-emerald-800"
                              }`}>
                                {dept.status.replace("_", " ")}
                              </span>
                            </td>
                            <td className="py-4 text-right">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedAnalysisDept(dept.name);
                                  const defaultRole = workforceData?.rolesByDepartment?.[dept.name]?.[0]?.role || "Backend Engineer";
                                  setSelectedAnalysisRole(defaultRole);
                                }}
                                className={`text-xs font-black px-3.5 py-1.5 rounded-xl border transition-all cursor-pointer ${
                                  isSelected
                                    ? "bg-slate-900 text-white border-slate-900 shadow-xs"
                                    : "bg-white text-slate-700 border-gray-200 hover:border-slate-400"
                                }`}
                              >
                                {isSelected ? "Analyzing ✓" : "Analyze Roles →"}
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* STEP 2: ROLE ANALYSIS & PROJECT CONNECTION FOR SELECTED DEPARTMENT */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-7">
                
                {/* Left Column (7 cols): Role Breakdown Table */}
                <div className="lg:col-span-7 bg-white rounded-3xl border border-gray-200 p-6 shadow-xs space-y-5">
                  <div className="flex justify-between items-center pb-3 border-b border-gray-100">
                    <div>
                      <span className="text-[10px] font-black uppercase tracking-wider text-indigo-700">Step 2: Role Level Deficit</span>
                      <h4 className="text-base font-black text-slate-900">{selectedAnalysisDept} Roles Breakdown</h4>
                    </div>
                    <span className="text-[11px] font-bold text-gray-500">
                      {workforceData?.rolesByDepartment?.[selectedAnalysisDept]?.length || 0} Roles Configured
                    </span>
                  </div>

                  <div className="space-y-3">
                    {workforceData?.rolesByDepartment?.[selectedAnalysisDept]?.map((roleItem: any) => {
                      const isSelected = selectedAnalysisRole === roleItem.role;
                      const hasGap = roleItem.gap < 0;

                      return (
                        <div
                          key={roleItem.id}
                          onClick={() => setSelectedAnalysisRole(roleItem.role)}
                          className={`p-4 rounded-2xl border-2 transition-all cursor-pointer space-y-3 ${
                            isSelected
                              ? "bg-indigo-50/50 border-indigo-500 shadow-xs"
                              : "bg-gray-50/40 border-gray-200 hover:border-gray-300"
                          }`}
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <div className="flex items-center gap-2">
                                <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full ${
                                  roleItem.priority === "Critical" ? "bg-rose-100 text-rose-800" : "bg-amber-100 text-amber-800"
                                }`}>
                                  {roleItem.priority} Priority
                                </span>
                                <span className="text-xs text-gray-500">{roleItem.salaryRange}</span>
                              </div>
                              <h5 className="text-base font-black text-slate-900 mt-1">{roleItem.role}</h5>
                            </div>

                            <div className="text-right">
                              <span className={`text-xl font-black ${hasGap ? "text-rose-600" : "text-emerald-600"}`}>
                                {roleItem.gap > 0 ? `+${roleItem.gap}` : roleItem.gap}
                              </span>
                              <div className="text-[10px] text-gray-400 font-bold uppercase">Staffing Gap</div>
                            </div>
                          </div>

                          {/* Progress bar */}
                          <div className="space-y-1">
                            <div className="flex justify-between text-[11px] text-gray-600 font-semibold">
                              <span>Current: {roleItem.currentHeadcount}</span>
                              <span>Target: {roleItem.requiredHeadcount}</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                              <div
                                className={`h-2 rounded-full ${hasGap ? "bg-rose-500" : "bg-emerald-500"}`}
                                style={{ width: `${Math.min(100, (roleItem.currentHeadcount / roleItem.requiredHeadcount) * 100)}%` }}
                              />
                            </div>
                          </div>

                          {/* Canonical Skills Chips */}
                          <div className="flex flex-wrap gap-1.5 pt-1">
                            {roleItem.canonicalSkills?.map((sk: string, idx: number) => (
                              <span key={idx} className="bg-white border border-gray-200 text-slate-800 text-[10px] font-bold px-2 py-0.5 rounded-md shadow-2xs">
                                {sk}
                              </span>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Right Column (5 cols): Connected Active Projects & Sprint Commitments */}
                <div className="lg:col-span-5 bg-white rounded-3xl border border-gray-200 p-6 shadow-xs space-y-5">
                  <div className="pb-3 border-b border-gray-100">
                    <span className="text-[10px] font-black uppercase tracking-wider text-purple-700">Step 3: Business Project Impact</span>
                    <h4 className="text-base font-black text-slate-900">Sprint Commitments & Bottlenecks</h4>
                    <p className="text-xs text-gray-500 mt-0.5">Projects directly impacted by staffing shortages in {selectedAnalysisDept}.</p>
                  </div>

                  <div className="space-y-4">
                    {workforceData?.projectStaffing
                      ?.filter((p: any) => p.department === selectedAnalysisDept || p.roles.some((r: any) => r.role === selectedAnalysisRole))
                      ?.map((proj: any) => (
                        <div key={proj.projectId} className="p-4 rounded-2xl bg-purple-50/40 border border-purple-200 space-y-3">
                          <div className="flex justify-between items-start">
                            <div>
                              <span className="text-[9px] font-bold text-purple-800 uppercase tracking-wider">Active Sprints</span>
                              <h5 className="text-sm font-black text-slate-900 leading-snug">{proj.projectName}</h5>
                            </div>
                            <span className="text-[10px] font-mono text-purple-700 bg-white border border-purple-200 px-2 py-0.5 rounded-md font-bold shrink-0">
                              Due {proj.targetDeadline}
                            </span>
                          </div>

                          <div className="p-2.5 rounded-xl bg-white border border-purple-100 text-xs text-purple-950 font-medium leading-relaxed">
                            ⚠️ <strong>Business Risk:</strong> {proj.businessImpact}
                          </div>

                          {/* Role allocations */}
                          <div className="space-y-1.5 pt-1">
                            <div className="text-[10px] font-black uppercase text-gray-400">Team Staffing On This Project:</div>
                            {proj.roles.map((r: any, idx: number) => (
                              <div key={idx} className="flex justify-between items-center text-xs bg-white p-2 rounded-lg border border-gray-100">
                                <span className="font-bold text-slate-800">{r.role}</span>
                                <div className="flex items-center gap-2">
                                  <span className="text-gray-500">{r.assigned} / {r.required} Assigned</span>
                                  <span className={`text-[10px] font-black px-1.5 py-0.2 rounded ${
                                    r.gap < 0 ? "bg-rose-100 text-rose-800" : "bg-emerald-100 text-emerald-800"
                                  }`}>
                                    {r.gap < 0 ? `${r.gap} Gap` : "Full"}
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                  </div>
                </div>

              </div>

              {/* STEP 4 & 5: CANONICAL SKILL IMPORTANCE MATRIX FOR SELECTED ROLE */}
              <div className="bg-white rounded-3xl border border-gray-200 p-7 shadow-xs space-y-5">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-3 border-b border-gray-100">
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-emerald-700">Step 4: Skill Definition & Importance</span>
                    <h3 className="text-lg font-black text-slate-900">Canonical Skill Profile for {selectedAnalysisRole}</h3>
                    <p className="text-xs text-gray-500">
                      Standardized proficiency thresholds and weighted importance for candidate evaluation and internal matching.
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="bg-rose-100 text-rose-800 text-[10px] font-black uppercase px-2.5 py-1 rounded-md">Critical (1.0x)</span>
                    <span className="bg-amber-100 text-amber-800 text-[10px] font-black uppercase px-2.5 py-1 rounded-md">High (0.8-0.9x)</span>
                    <span className="bg-blue-100 text-blue-800 text-[10px] font-black uppercase px-2.5 py-1 rounded-md">Medium / Preferred (0.5-0.7x)</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Required Skills */}
                  <div className="space-y-3">
                    <div className="text-xs font-black uppercase text-slate-900 flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>Required Core Skills (Mandatory Baseline)</span>
                    </div>
                    <div className="space-y-2">
                      {workforceData?.roleSkillProfiles?.[selectedAnalysisRole]?.required?.map((sk: any, idx: number) => (
                        <div key={idx} className="flex justify-between items-center p-3 rounded-xl bg-gray-50 border border-gray-200">
                          <div>
                            <span className="font-extrabold text-slate-900 text-xs">{sk.name}</span>
                            <span className="text-[11px] text-gray-500 ml-2 font-medium">Req: {sk.requirement}</span>
                          </div>
                          <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-full ${
                            sk.importance === "Critical"
                              ? "bg-rose-100 text-rose-800 border border-rose-200"
                              : "bg-amber-100 text-amber-800 border border-amber-200"
                          }`}>
                            {sk.importance}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Preferred Skills */}
                  <div className="space-y-3">
                    <div className="text-xs font-black uppercase text-slate-900 flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-purple-600" />
                      <span>Preferred & Bonus Differentiators</span>
                    </div>
                    <div className="space-y-2">
                      {workforceData?.roleSkillProfiles?.[selectedAnalysisRole]?.preferred?.map((sk: any, idx: number) => (
                        <div key={idx} className="flex justify-between items-center p-3 rounded-xl bg-gray-50 border border-gray-200">
                          <div>
                            <span className="font-extrabold text-slate-900 text-xs">{sk.name}</span>
                            <span className="text-[11px] text-gray-500 ml-2 font-medium">Req: {sk.requirement}</span>
                          </div>
                          <span className="bg-blue-100 text-blue-800 text-[10px] font-black px-2.5 py-0.5 rounded-full border border-blue-200">
                            {sk.importance}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* STEP 6 & 7: "INTERNAL TALENT FIRST" DECISION ENGINE */}
              <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-7 text-white shadow-md space-y-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-4 border-b border-slate-700">
                  <div>
                    <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-emerald-400 mb-1">
                      <Target className="w-4 h-4 text-emerald-400" />
                      <span>Step 5 & 6: Internal Talent First Intelligence</span>
                    </div>
                    <h3 className="text-xl font-black text-white">
                      Can we fill {selectedAnalysisRole} shortages internally before hiring?
                    </h3>
                    <p className="text-xs text-slate-300 max-w-3xl leading-relaxed">
                      Antigravity scans existing employees across all departments to identify near-match candidates who can be quickly upskilled or cross-trained.
                    </p>
                  </div>
                  <div className="bg-emerald-500/20 border border-emerald-400/40 px-3 py-1.5 rounded-xl text-emerald-300 text-xs font-bold">
                    Decision-Support Guardrail Active
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  {workforceData?.internalTalentCandidates?.[selectedAnalysisRole]?.map((cand: any) => (
                    <div key={cand.id} className="bg-slate-800/80 border border-slate-700 p-5 rounded-2xl space-y-4 flex flex-col justify-between">
                      <div className="space-y-2.5">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="text-sm font-black text-white">{cand.name}</h4>
                            <p className="text-[11px] text-slate-400">{cand.currentRole}</p>
                          </div>
                          <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-black px-2.5 py-0.5 rounded-lg">
                            {cand.skillMatchScore}% Match
                          </span>
                        </div>

                        <div className="space-y-1">
                          <div className="text-[10px] uppercase font-bold text-slate-400">Matched Skills:</div>
                          <div className="flex flex-wrap gap-1">
                            {cand.matchedSkills.map((m: string, i: number) => (
                              <span key={i} className="bg-slate-700/60 text-slate-200 text-[10px] font-semibold px-2 py-0.5 rounded">
                                {m}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs text-rose-300">
                          <div className="font-bold text-[10px] uppercase text-rose-400">Targeted Gap:</div>
                          <div>{cand.developmentRequired}</div>
                        </div>

                        <div className="text-[11px] text-slate-300 space-y-0.5">
                          <div><strong>Upskilling Est:</strong> {cand.upskillTime}</div>
                          <div className="text-xs text-emerald-300 font-medium">📘 {cand.upskillPath}</div>
                        </div>
                      </div>

                      {/* Internal Upskill Button */}
                      <button
                        onClick={() => {
                          setAssignedLearningNotice(`Assigned targeted upskilling pathway "${cand.upskillPath}" to ${cand.name}.`);
                          setEmployeeSubTab("learning");
                        }}
                        className="w-full bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black py-2.5 rounded-xl flex items-center justify-center gap-1.5 shadow-xs cursor-pointer transition-all mt-3"
                      >
                        <GraduationCap className="w-4 h-4" />
                        <span>Option A: Assign Learning Plan</span>
                      </button>
                    </div>
                  ))}
                </div>

                {/* Dual-Track Decision Action Banner */}
                <div className="bg-slate-800/90 border border-indigo-400/40 rounded-2xl p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mt-4">
                  <div className="space-y-1">
                    <span className="text-[10px] font-black uppercase tracking-wider text-indigo-400">Dual-Track Decision</span>
                    <h4 className="text-base font-black text-white">
                      Need immediate delivery capacity beyond internal upskilling?
                    </h4>
                    <p className="text-xs text-slate-300 max-w-2xl">
                      Generate an evidence-backed, pre-filled job draft with canonical skills, project context, and pre-screening assessment questions.
                    </p>
                  </div>

                  <button
                    onClick={() => handleGenerateJobDraft(selectedAnalysisRole, selectedAnalysisDept)}
                    className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-black px-6 py-3.5 rounded-xl flex items-center gap-2 shadow-md cursor-pointer transition-all shrink-0"
                  >
                    <Plus className="w-4 h-4 text-emerald-300" />
                    <span>Option B: Generate Job Draft for {selectedAnalysisRole} →</span>
                  </button>
                </div>
              </div>

              {/* STEP 8: "WHY ARE WE HIRING?" EXPLAINABLE REASON INSPECTOR */}
              <div className="bg-white rounded-3xl border border-gray-200 p-7 shadow-xs space-y-5">
                <div className="flex justify-between items-center pb-3 border-b border-gray-100">
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-amber-700">Step 7: Explainable Reason</span>
                    <h3 className="text-lg font-black text-slate-900">Why Are We Hiring? (Hiring Reason Taxonomy)</h3>
                    <p className="text-xs text-gray-500">Every external job creation must cite an explainable business requirement.</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-3.5">
                  {workforceData?.hiringReasons?.map((reason: any) => {
                    const isSelected = selectedHiringReason === reason.label;

                    return (
                      <div
                        key={reason.id}
                        onClick={() => setSelectedHiringReason(reason.label)}
                        className={`p-4 rounded-2xl border-2 transition-all cursor-pointer space-y-1.5 ${
                          isSelected
                            ? "bg-amber-50/60 border-amber-500 shadow-xs"
                            : "bg-gray-50/50 border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        <div className="flex justify-between items-center">
                          <h5 className="text-xs font-black text-slate-900">{reason.label}</h5>
                          {isSelected && <Check className="w-3.5 h-3.5 text-amber-600 font-black" />}
                        </div>
                        <p className="text-[11px] text-gray-500 leading-snug">{reason.description}</p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* STEP 9: ATTACHED QUESTION BANK ASSESSMENT PREVIEW */}
              <div className="bg-white rounded-3xl border border-gray-200 p-7 shadow-xs space-y-5">
                <div className="flex justify-between items-center pb-3 border-b border-gray-100">
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-purple-700">Step 8: Candidate Pre-Screening</span>
                    <h3 className="text-lg font-black text-slate-900">Attached Question Bank Assessments</h3>
                    <p className="text-xs text-gray-500">
                      When candidates apply for this role, they will be automatically evaluated against these verified technical tests.
                    </p>
                  </div>
                  <button
                    onClick={() => handleTabChange("home")}
                    className="text-xs font-bold text-purple-700 hover:underline cursor-pointer"
                  >
                    Manage Question Bank →
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {workforceData?.questionBankAssessmentMappings?.[selectedAnalysisRole]?.map((qa: any, idx: number) => (
                    <div key={idx} className="p-4 rounded-2xl bg-purple-50/50 border border-purple-200 space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] font-black uppercase text-purple-800 bg-purple-100 px-2 py-0.5 rounded-full">
                          {qa.source}
                        </span>
                        <span className="text-[11px] font-bold text-purple-700">{qa.difficulty}</span>
                      </div>
                      <h5 className="text-xs font-extrabold text-slate-900">{qa.topic}</h5>
                      <div className="text-[11px] text-gray-600 font-semibold">
                        📝 <strong>{qa.questionCount} Questions</strong> in Assessment Suite
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* STEP 10: WORKFORCE OUTLOOK (3, 6, 12 MONTHS) & RADAR DEMAND */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-7">
                
                {/* Left (7 cols): Forecasting Outlook */}
                <div className="lg:col-span-7 bg-white rounded-3xl border border-gray-200 p-7 shadow-xs space-y-5">
                  <div className="pb-3 border-b border-gray-100">
                    <span className="text-[10px] font-black uppercase tracking-wider text-teal-700">Predictive Intelligence</span>
                    <h4 className="text-base font-black text-slate-900">Workforce Outlook (3, 6, 12 Months)</h4>
                    <p className="text-xs text-gray-500">Projected organizational demand based on enterprise contract roadmap.</p>
                  </div>

                  <div className="space-y-4">
                    {workforceData?.workforceOutlook?.map((wf: any, idx: number) => (
                      <div key={idx} className="p-4 rounded-2xl bg-teal-50/40 border border-teal-200 space-y-2">
                        <div className="flex justify-between items-start">
                          <div>
                            <span className="text-[10px] font-black uppercase text-teal-800 bg-teal-100 px-2.5 py-0.5 rounded-full">
                              {wf.horizon} ({wf.targetQuarter})
                            </span>
                            <h5 className="text-sm font-black text-slate-900 mt-1">{wf.projectedRole}</h5>
                          </div>
                          <span className="text-sm font-black text-teal-900 bg-white border border-teal-200 px-2.5 py-1 rounded-xl">
                            +{wf.headcountNeeded} Engineers
                          </span>
                        </div>
                        <p className="text-xs text-gray-600"><strong>Driver:</strong> {wf.driver}</p>
                        <div className="text-xs font-bold text-teal-900 pt-1">
                          ⚡ <strong>Recommendation:</strong> {wf.recommendedAction}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Right (5 cols): Internal Upskill vs External Hire Split */}
                <div className="lg:col-span-5 bg-white rounded-3xl border border-gray-200 p-7 shadow-xs space-y-5">
                  <div className="pb-3 border-b border-gray-100">
                    <span className="text-[10px] font-black uppercase tracking-wider text-indigo-700">Talent Mix Radar</span>
                    <h4 className="text-base font-black text-slate-900">Skill Demand: Upskill vs Hire Split</h4>
                    <p className="text-xs text-gray-500">Balanced strategy per critical technology.</p>
                  </div>

                  <div className="space-y-3.5">
                    {workforceData?.companySkillDemand?.map((cs: any, idx: number) => (
                      <div key={idx} className="p-3.5 rounded-2xl bg-gray-50 border border-gray-200 space-y-2">
                        <div className="flex justify-between items-center text-xs">
                          <span className="font-extrabold text-slate-900">{cs.skill}</span>
                          <span className="text-[11px] font-bold text-rose-700">Gap: {cs.gap} Engineers</span>
                        </div>

                        {/* Split Bar */}
                        <div className="space-y-1">
                          <div className="w-full bg-gray-200 rounded-full h-2 flex overflow-hidden">
                            <div
                              className="bg-emerald-500 h-2"
                              style={{ width: `${(cs.employeesToUpskill / cs.gap) * 100}%` }}
                              title="Upskill"
                            />
                            <div
                              className="bg-indigo-600 h-2"
                              style={{ width: `${(cs.employeesToHire / cs.gap) * 100}%` }}
                              title="Hire"
                            />
                          </div>
                          <div className="flex justify-between text-[10px] font-bold">
                            <span className="text-emerald-700">🌱 Upskill: {cs.employeesToUpskill}</span>
                            <span className="text-indigo-700">💼 Hire: {cs.employeesToHire}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

            </div>
          )}

        </div>
      )}

      {/* ======================================================================= */}
      {/* SECTION 4: 🧠 SKILL ASSESSMENTS & CANONICAL QUESTION BANK               */}
      {/* ======================================================================= */}
      {activeSection === "assessments" && (
        <div className="space-y-6 animate-in fade-in duration-200">
          
          <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-amber-700 mb-1">
                <BrainCircuit className="w-4 h-4" />
                <span>Canonical Question Bank</span>
              </div>
              <h2 className="text-xl font-black text-slate-900">Real-Time Skill Assessments</h2>
              <p className="text-xs text-gray-500 mt-0.5">
                Questions created map directly to <strong>Canonical Skill IDs</strong> (Java, React, SQL) to produce verified skill evidence on student profiles.
              </p>
            </div>

            <button
              onClick={() => setShowCreateQuestionModal(true)}
              className="bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl flex items-center gap-1.5 shadow-sm cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Create Skill Question</span>
            </button>
          </div>

          {loadingQuestions ? (
            <div className="bg-white p-16 rounded-3xl border border-gray-200 text-center">
              <div className="w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
              <p className="text-xs text-gray-500">Loading canonical questions...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {questionsData.map((q: any) => (
                <div key={q.id} className="bg-white rounded-3xl border border-gray-200 p-6 shadow-xs space-y-4 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start gap-2">
                    <div className="flex flex-wrap gap-1.5">
                      <span className="bg-amber-100 text-amber-800 text-[10px] font-black uppercase px-2 py-0.5 rounded">
                        {q.difficulty}
                      </span>
                      <span className="bg-blue-100 text-blue-800 text-[10px] font-black uppercase px-2 py-0.5 rounded">
                        {q.type}
                      </span>
                      <span className="bg-emerald-100 text-emerald-800 text-[10px] font-black uppercase px-2 py-0.5 rounded">
                        {q.status}
                      </span>
                    </div>

                    <span className="text-[10px] text-gray-400">
                      {new Date(q.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  <p className="text-xs font-bold text-slate-900 leading-relaxed">
                    {q.text}
                  </p>

                  {/* Canonical Skill Tag */}
                  <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-xs">
                    <div className="flex items-center space-x-1.5">
                      <span className="text-gray-400 text-[11px]">Skill Evidence:</span>
                      {q.skills?.map((sk: any) => (
                        <span key={sk.id} className="bg-purple-50 text-purple-700 font-bold px-2 py-0.5 rounded border border-purple-200 text-[11px]">
                          {sk.skill?.name || "Java"}
                        </span>
                      ))}
                    </div>

                    <span className="text-[11px] text-gray-400">
                      {q.options?.length || 4} Options
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>
      )}

      {/* ======================================================================= */}
      {/* SECTION 3: 💼 JOB POSTINGS & ACTIVE INTERNSHIPS                         */}
      {/* ======================================================================= */}
      {activeSection === "job_postings" && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-lg font-black text-slate-900">Your Active Internships & Openings</h2>
              <p className="text-xs text-gray-500">Live positions visible to students with canonical skill taxonomy matching.</p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => handleOpenPostInternship()}
                className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-2 rounded-xl flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Post New Internship</span>
              </button>
              <Link
                href="/student/opportunities"
                className="text-xs font-bold text-gray-600 hover:text-gray-900 border border-gray-200 px-3 py-2 rounded-xl flex items-center gap-1 bg-white hover:bg-gray-50 transition-all"
              >
                <span>Student Feed</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {jobs.map((job) => (
              <div key={job.id} className="bg-white rounded-3xl border border-gray-200 p-6 shadow-xs space-y-4">
                <div className="flex justify-between items-start gap-2">
                  <div>
                    <span className="bg-purple-100 text-purple-800 text-[10px] font-black uppercase px-2 py-0.5 rounded">
                      {job.workMode || "Hybrid"}
                    </span>
                    <h3 className="text-base font-black text-slate-900 mt-1">{job.title}</h3>
                    <p className="text-xs text-gray-500">{job.department || "Engineering"} • {job.location || "Bangalore"}</p>
                  </div>
                  <div className="text-sm font-black text-emerald-600">{job.salary || "₹45,000 / month"}</div>
                </div>

                <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed">
                  {job.description}
                </p>

                <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-2">
                    <UserCheck className="w-4 h-4 text-emerald-600" />
                    <span className="text-gray-700 font-medium">Mentor: <strong>{job.mentorName || "Vikram Rao"}</strong></span>
                  </div>

                  <span className="bg-blue-50 text-blue-800 font-bold px-2.5 py-1 rounded-lg text-xs">
                    {job.internshipApplications?.length || 0} Applicants
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ======================================================================= */}
      {/* MODAL: CREATE SKILL QUESTION                                            */}
      {/* ======================================================================= */}
      {showCreateQuestionModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-xs z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl border border-gray-100 space-y-5 my-auto">
            <div className="flex justify-between items-center pb-3 border-b border-gray-100">
              <div>
                <h3 className="text-base font-black text-slate-900">Create Canonical Skill Question</h3>
                <p className="text-xs text-gray-500">Maps to canonical skill taxonomy for objective student verification.</p>
              </div>
              <button 
                onClick={() => setShowCreateQuestionModal(false)}
                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateQuestion} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Target Skill *</label>
                  <select
                    value={questionForm.skillName}
                    onChange={(e) => setQuestionForm({ ...questionForm, skillName: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs font-bold"
                  >
                    <option value="Java">Java</option>
                    <option value="React">React</option>
                    <option value="TypeScript">TypeScript</option>
                    <option value="SQL">SQL</option>
                    <option value="Python">Python</option>
                    <option value="Docker">Docker</option>
                    <option value="AWS">AWS</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">Topic *</label>
                  <input
                    type="text"
                    value={questionForm.topic}
                    onChange={(e) => setQuestionForm({ ...questionForm, topic: e.target.value })}
                    placeholder="e.g. Collections / Hooks"
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">Difficulty</label>
                  <select
                    value={questionForm.difficulty}
                    onChange={(e) => setQuestionForm({ ...questionForm, difficulty: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs"
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Question Text *</label>
                <textarea
                  rows={3}
                  value={questionForm.text}
                  onChange={(e) => setQuestionForm({ ...questionForm, text: e.target.value })}
                  placeholder="State the technical scenario or code comprehension question..."
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs"
                />
              </div>

              {/* Options */}
              <div className="space-y-2">
                <label className="block font-bold text-gray-700">Options (Select the correct answer):</label>
                {questionForm.options.map((opt, idx) => (
                  <div key={idx} className="flex items-center space-x-2">
                    <input
                      type="radio"
                      name="correctOption"
                      checked={opt.isCorrect}
                      onChange={() => {
                        const updated = questionForm.options.map((o, i) => ({ ...o, isCorrect: i === idx }));
                        setQuestionForm({ ...questionForm, options: updated });
                      }}
                      className="text-emerald-600 focus:ring-emerald-500 w-4 h-4 cursor-pointer"
                    />
                    <input
                      type="text"
                      value={opt.text}
                      onChange={(e) => {
                        const updated = questionForm.options.map((o, i) => i === idx ? { ...o, text: e.target.value } : o);
                        setQuestionForm({ ...questionForm, options: updated });
                      }}
                      placeholder={`Option ${idx + 1}`}
                      className="flex-1 px-3 py-1.5 rounded-lg border border-gray-200 text-xs"
                    />
                  </div>
                ))}
              </div>

              <div className="pt-2 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowCreateQuestionModal(false)}
                  className="px-4 py-2 rounded-xl text-gray-500 text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingQuestion}
                  className="bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold px-6 py-2 rounded-xl shadow-xs"
                >
                  {isSubmittingQuestion ? "Saving..." : "Publish to Question Bank"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================================= */}
      {/* 7-STEP POST INTERNSHIP MODAL WIZARD                                     */}
      {/* ======================================================================= */}
      {showPostInternshipModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-xs z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-4xl w-full shadow-2xl border border-gray-100 my-auto overflow-hidden flex flex-col max-h-[92vh]">
            
            {/* Modal Header */}
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gradient-to-r from-emerald-50/50 via-white to-teal-50/30">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-xs">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <h3 className="text-lg font-black text-slate-900">Post Structured Internship</h3>
                    <span className="bg-emerald-100 text-emerald-800 text-[10px] font-black uppercase px-2 py-0.5 rounded-full flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3 text-emerald-600" />
                      <span>Verified Recruiter</span>
                    </span>
                  </div>
                  <p className="text-xs text-gray-500">
                    Step {internshipStep} of 7 — {
                      internshipStep === 1 ? "Basic Information" :
                      internshipStep === 2 ? "Role & Responsibilities" :
                      internshipStep === 3 ? "Canonical Skills Selection" :
                      internshipStep === 4 ? "Non-Skill Eligibility Criteria" :
                      internshipStep === 5 ? "Project & Deliverables" :
                      internshipStep === 6 ? "Duration & Mentor Assignment" :
                      "Review & Publish"
                    }
                  </p>
                </div>
              </div>

              <button
                onClick={() => setShowPostInternshipModal(false)}
                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Stepper Indicator Bar */}
            <div className="bg-gray-50 px-6 py-3 border-b border-gray-200 flex items-center justify-between overflow-x-auto gap-2">
              {[
                { step: 1, label: "Basic Info" },
                { step: 2, label: "Role" },
                { step: 3, label: "Skills Taxonomy" },
                { step: 4, label: "Eligibility" },
                { step: 5, label: "Project Work" },
                { step: 6, label: "Mentor" },
                { step: 7, label: "Preview" }
              ].map((s) => (
                <button
                  key={s.step}
                  onClick={() => setInternshipStep(s.step as any)}
                  className={`flex items-center space-x-1.5 text-xs font-bold px-3 py-1.5 rounded-lg whitespace-nowrap transition-all cursor-pointer ${
                    internshipStep === s.step
                      ? "bg-emerald-600 text-white shadow-xs font-black"
                      : internshipStep > s.step
                      ? "bg-emerald-50 text-emerald-800 hover:bg-emerald-100"
                      : "text-gray-400 hover:text-gray-600"
                  }`}
                >
                  <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] ${
                    internshipStep === s.step ? "bg-white text-emerald-700" : "border border-current"
                  }`}>
                    {s.step}
                  </span>
                  <span>{s.label}</span>
                </button>
              ))}
            </div>

            {/* Modal Body: Dynamic Step Content */}
            <div className="p-6 overflow-y-auto flex-1 space-y-6">

              {publishSuccessMessage && (
                <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-xl text-xs text-emerald-900 font-bold flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  <span>{publishSuccessMessage}</span>
                </div>
              )}

              {/* STEP 1: BASIC INFORMATION */}
              {internshipStep === 1 && (
                <div className="space-y-4 animate-in fade-in duration-150">
                  <div className="border-b border-gray-100 pb-3">
                    <h4 className="text-sm font-black text-slate-900">Step 1: Basic Information</h4>
                    <p className="text-xs text-gray-500">Provide clear organizational context and basic listing details.</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">Internship Title *</label>
                      <input
                        type="text"
                        value={internshipPostForm.title}
                        onChange={(e) => setInternshipPostForm({ ...internshipPostForm, title: e.target.value })}
                        placeholder="e.g. Full-Stack Software Engineering Intern"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">Department *</label>
                      <input
                        type="text"
                        value={internshipPostForm.department}
                        onChange={(e) => setInternshipPostForm({ ...internshipPostForm, department: e.target.value })}
                        placeholder="e.g. Core Platform Engineering"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">Work Mode *</label>
                      <select
                        value={internshipPostForm.workMode}
                        onChange={(e) => setInternshipPostForm({ ...internshipPostForm, workMode: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      >
                        <option value="Hybrid">Hybrid (Bangalore Campus + Remote)</option>
                        <option value="In-Office">In-Office (Full-Time On-Premise)</option>
                        <option value="Remote">100% Remote / Virtual</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">Location *</label>
                      <input
                        type="text"
                        value={internshipPostForm.location}
                        onChange={(e) => setInternshipPostForm({ ...internshipPostForm, location: e.target.value })}
                        placeholder="e.g. Bangalore, India"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">Monthly Stipend (INR) *</label>
                      <input
                        type="text"
                        value={internshipPostForm.salary}
                        onChange={(e) => setInternshipPostForm({ ...internshipPostForm, salary: e.target.value })}
                        placeholder="e.g. ₹45,000 / month"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">Industry Sector</label>
                      <input
                        type="text"
                        value={internshipPostForm.industry}
                        onChange={(e) => setInternshipPostForm({ ...internshipPostForm, industry: e.target.value })}
                        placeholder="e.g. Enterprise Cloud & Software"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Internship Overview & Purpose *</label>
                    <textarea
                      rows={3}
                      value={internshipPostForm.description}
                      onChange={(e) => setInternshipPostForm({ ...internshipPostForm, description: e.target.value })}
                      placeholder="Describe what the student will achieve and the mission of the team..."
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>
              )}

              {/* STEP 2: ROLE & RESPONSIBILITIES */}
              {internshipStep === 2 && (
                <div className="space-y-4 animate-in fade-in duration-150">
                  <div className="border-b border-gray-100 pb-3">
                    <h4 className="text-sm font-black text-slate-900">Step 2: Role & Key Responsibilities</h4>
                    <p className="text-xs text-gray-500">Define concrete daily sprint duties and expected contributions.</p>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Role Track / Category</label>
                    <input
                      type="text"
                      value={internshipPostForm.roleCategory}
                      onChange={(e) => setInternshipPostForm({ ...internshipPostForm, roleCategory: e.target.value })}
                      placeholder="e.g. Full-Stack Development / Backend Systems"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-xs font-bold text-gray-700">Specific Sprint Responsibilities ({internshipPostForm.responsibilities.length})</label>
                    
                    <div className="space-y-2">
                      {internshipPostForm.responsibilities.map((resp, idx) => (
                        <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-200 text-xs text-gray-800">
                          <span className="flex items-start gap-2">
                            <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center text-[10px] shrink-0 mt-0.5">
                              {idx + 1}
                            </span>
                            <span>{resp}</span>
                          </span>
                          <button
                            onClick={() => {
                              setInternshipPostForm({
                                ...internshipPostForm,
                                responsibilities: internshipPostForm.responsibilities.filter((_, i) => i !== idx)
                              });
                            }}
                            className="text-gray-400 hover:text-red-600 p-1 cursor-pointer"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>

                    <div className="flex gap-2 pt-1">
                      <input
                        type="text"
                        value={internshipPostForm.newResponsibilityInput}
                        onChange={(e) => setInternshipPostForm({ ...internshipPostForm, newResponsibilityInput: e.target.value })}
                        onKeyDown={(e) => { if (e.key === "Enter") handleAddResponsibility(); }}
                        placeholder="Add another responsibility (e.g. Implement caching layer using Redis)..."
                        className="flex-1 px-3.5 py-2 rounded-xl border border-gray-200 text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                      <button
                        onClick={handleAddResponsibility}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-2 rounded-xl cursor-pointer"
                      >
                        Add
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 3: CANONICAL SKILL TAXONOMY */}
              {internshipStep === 3 && (
                <div className="space-y-4 animate-in fade-in duration-150">
                  <div className="border-b border-gray-100 pb-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-sm font-black text-slate-900">Step 3: Canonical Skill Taxonomy</h4>
                        <p className="text-xs text-gray-500">
                          Select canonical skills from the database taxonomy. Plain text skills are forbidden to ensure accurate matching.
                        </p>
                      </div>
                      <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-lg border border-emerald-200">
                        {internshipPostForm.selectedSkills.length} Selected
                      </span>
                    </div>
                  </div>

                  {/* Taxonomy Picker / Search */}
                  <div className="bg-gray-50 p-4 rounded-2xl border border-gray-200 space-y-3">
                    <div className="relative">
                      <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                      <input
                        type="text"
                        value={skillSearchQuery}
                        onChange={(e) => setSkillSearchQuery(e.target.value)}
                        placeholder="Search canonical taxonomy (e.g. React, TypeScript, Python, Docker)..."
                        className="w-full pl-9 pr-3.5 py-2 rounded-xl bg-white border border-gray-200 text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>

                    {/* Skill Categories & Tags */}
                    <div className="space-y-3 max-h-48 overflow-y-auto pr-1">
                      {skillTaxonomy.map((cat: any) => {
                        const filtered = (cat.skills || []).filter((s: any) => 
                          !skillSearchQuery || s.name.toLowerCase().includes(skillSearchQuery.toLowerCase())
                        );
                        if (filtered.length === 0) return null;

                        return (
                          <div key={cat.id || cat.name} className="space-y-1.5">
                            <div className="text-[10px] font-black uppercase text-gray-400 tracking-wider">
                              {cat.name}
                            </div>
                            <div className="flex flex-wrap gap-1.5">
                              {filtered.map((sk: any) => {
                                const isSelected = internshipPostForm.selectedSkills.some(s => s.skillId === sk.id || s.skillName === sk.name);
                                return (
                                  <button
                                    key={sk.id || sk.name}
                                    onClick={() => handleToggleCanonicalSkill(sk)}
                                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                                      isSelected
                                        ? "bg-emerald-600 text-white shadow-xs"
                                        : "bg-white text-gray-700 border border-gray-200 hover:border-emerald-400"
                                    }`}
                                  >
                                    {isSelected ? <Check className="w-3 h-3" /> : <Plus className="w-3 h-3 text-gray-400" />}
                                    <span>{sk.name}</span>
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Selected Canonical Skills Configurator */}
                  <div className="space-y-2">
                    <label className="block text-xs font-bold text-gray-700">
                      Configure Skill Requirements & Proficiency Thresholds
                    </label>

                    {internshipPostForm.selectedSkills.length === 0 ? (
                      <div className="p-6 bg-amber-50 rounded-xl border border-amber-200 text-center text-xs text-amber-800">
                        Please select at least 2 canonical skills from the taxonomy above to configure matching criteria.
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {internshipPostForm.selectedSkills.map((sk) => (
                          <div key={sk.skillId || sk.skillName} className="p-3 bg-white rounded-xl border border-gray-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                            <div className="flex items-center space-x-2">
                              <span className="font-extrabold text-xs text-gray-900">{sk.skillName}</span>
                              <span className="text-[10px] font-mono text-gray-400">({sk.skillId})</span>
                            </div>

                            <div className="flex items-center space-x-3 text-xs">
                              {/* Requirement Type */}
                              <div className="flex items-center space-x-1">
                                <span className="text-gray-400 text-[10px] font-semibold">Type:</span>
                                <select
                                  value={sk.requirementType}
                                  onChange={(e) => handleUpdateSkillRequirement(sk.skillName, "requirementType", e.target.value)}
                                  className="px-2 py-1 bg-gray-50 border border-gray-200 rounded text-xs font-bold text-gray-800"
                                >
                                  <option value="REQUIRED">REQUIRED (Must Have)</option>
                                  <option value="PREFERRED">PREFERRED (Nice to Have)</option>
                                </select>
                              </div>

                              {/* Proficiency Level */}
                              <div className="flex items-center space-x-1">
                                <span className="text-gray-400 text-[10px] font-semibold">Min Level:</span>
                                <select
                                  value={sk.requiredLevel}
                                  onChange={(e) => handleUpdateSkillRequirement(sk.skillName, "requiredLevel", e.target.value)}
                                  className="px-2 py-1 bg-gray-50 border border-gray-200 rounded text-xs font-bold text-gray-800"
                                >
                                  <option value="Foundational">Foundational (40%+)</option>
                                  <option value="Developing">Developing (60%+)</option>
                                  <option value="Proficient">Proficient (75%+)</option>
                                  <option value="Advanced">Advanced (85%+)</option>
                                </select>
                              </div>

                              <button
                                onClick={() => handleToggleCanonicalSkill({ id: sk.skillId, name: sk.skillName })}
                                className="text-gray-400 hover:text-red-600 p-1 cursor-pointer"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* STEP 4: NON-SKILL ELIGIBILITY CRITERIA */}
              {internshipStep === 4 && (
                <div className="space-y-4 animate-in fade-in duration-150">
                  <div className="border-b border-gray-100 pb-3">
                    <h4 className="text-sm font-black text-slate-900">Step 4: Non-Skill Eligibility Criteria</h4>
                    <p className="text-xs text-gray-500">
                      Academic, cohort, and qualification criteria kept strictly separate from skill assessments.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">Eligible Degrees</label>
                      <input
                        type="text"
                        value={internshipPostForm.eligibleDegrees}
                        onChange={(e) => setInternshipPostForm({ ...internshipPostForm, eligibleDegrees: e.target.value })}
                        placeholder="e.g. B.Tech, B.E., M.Tech, MCA"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">Eligible Branches / Specializations</label>
                      <input
                        type="text"
                        value={internshipPostForm.eligibleBranches}
                        onChange={(e) => setInternshipPostForm({ ...internshipPostForm, eligibleBranches: e.target.value })}
                        placeholder="e.g. Computer Science, IT, Electronics"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">Graduation Cohorts / Passing Year</label>
                      <input
                        type="text"
                        value={internshipPostForm.graduationYears}
                        onChange={(e) => setInternshipPostForm({ ...internshipPostForm, graduationYears: e.target.value })}
                        placeholder="e.g. 2025, 2026"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">Minimum CGPA (out of 10.0)</label>
                      <input
                        type="number"
                        step="0.1"
                        min="0"
                        max="10"
                        value={internshipPostForm.minCgpa}
                        onChange={(e) => setInternshipPostForm({ ...internshipPostForm, minCgpa: parseFloat(e.target.value) || 0 })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Candidate Target Stage</label>
                    <input
                      type="text"
                      value={internshipPostForm.experienceLevel}
                      onChange={(e) => setInternshipPostForm({ ...internshipPostForm, experienceLevel: e.target.value })}
                      placeholder="e.g. 3rd or 4th Year Undergraduates"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>
              )}

              {/* STEP 5: PROJECT & DELIVERABLES */}
              {internshipStep === 5 && (
                <div className="space-y-4 animate-in fade-in duration-150">
                  <div className="border-b border-gray-100 pb-3">
                    <h4 className="text-sm font-black text-slate-900">Step 5: Assigned Project & Concrete Deliverables</h4>
                    <p className="text-xs text-gray-500">
                      Define the actual project scope that feeds into the active internship progress tracker and milestones.
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Assigned Project Title *</label>
                    <input
                      type="text"
                      value={internshipPostForm.projectTitle}
                      onChange={(e) => setInternshipPostForm({ ...internshipPostForm, projectTitle: e.target.value })}
                      placeholder="e.g. Real-Time Observability & Micro-Frontend Platform"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Problem Statement & Architectural Context *</label>
                    <textarea
                      rows={2}
                      value={internshipPostForm.problemStatement}
                      onChange={(e) => setInternshipPostForm({ ...internshipPostForm, problemStatement: e.target.value })}
                      placeholder="Detail the technical challenge the intern will solve..."
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-xs font-bold text-gray-700">Milestone Deliverables ({internshipPostForm.deliverables.length})</label>
                    <div className="space-y-2">
                      {internshipPostForm.deliverables.map((deliv, idx) => (
                        <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-200 text-xs text-gray-800">
                          <span className="flex items-center gap-2">
                            <CheckSquare className="w-4 h-4 text-emerald-600 shrink-0" />
                            <span>{deliv}</span>
                          </span>
                          <button
                            onClick={() => {
                              setInternshipPostForm({
                                ...internshipPostForm,
                                deliverables: internshipPostForm.deliverables.filter((_, i) => i !== idx)
                              });
                            }}
                            className="text-gray-400 hover:text-red-600 p-1 cursor-pointer"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>

                    <div className="flex gap-2 pt-1">
                      <input
                        type="text"
                        value={internshipPostForm.newDeliverableInput}
                        onChange={(e) => setInternshipPostForm({ ...internshipPostForm, newDeliverableInput: e.target.value })}
                        onKeyDown={(e) => { if (e.key === "Enter") handleAddDeliverable(); }}
                        placeholder="Add expected deliverable (e.g. Automated E2E test suite)..."
                        className="flex-1 px-3.5 py-2 rounded-xl border border-gray-200 text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                      <button
                        onClick={handleAddDeliverable}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-2 rounded-xl cursor-pointer"
                      >
                        Add
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">Learning Outcomes</label>
                      <textarea
                        rows={2}
                        value={internshipPostForm.learningOutcomes}
                        onChange={(e) => setInternshipPostForm({ ...internshipPostForm, learningOutcomes: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">Evaluation & Review Method</label>
                      <textarea
                        rows={2}
                        value={internshipPostForm.evaluationMethod}
                        onChange={(e) => setInternshipPostForm({ ...internshipPostForm, evaluationMethod: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 6: DURATION & MENTOR DETAILS */}
              {internshipStep === 6 && (
                <div className="space-y-4 animate-in fade-in duration-150">
                  <div className="border-b border-gray-100 pb-3">
                    <h4 className="text-sm font-black text-slate-900">Step 6: Duration & Designated Mentor</h4>
                    <p className="text-xs text-gray-500">
                      Connects directly to the mentor review system and weekly progress evaluation workflow.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">Start Date</label>
                      <input
                        type="date"
                        value={internshipPostForm.startDate}
                        onChange={(e) => setInternshipPostForm({ ...internshipPostForm, startDate: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">End Date</label>
                      <input
                        type="date"
                        value={internshipPostForm.endDate}
                        onChange={(e) => setInternshipPostForm({ ...internshipPostForm, endDate: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">Duration (Weeks)</label>
                      <input
                        type="number"
                        value={internshipPostForm.durationWeeks}
                        onChange={(e) => setInternshipPostForm({ ...internshipPostForm, durationWeeks: parseInt(e.target.value) || 8 })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Working Schedule / Hours</label>
                    <input
                      type="text"
                      value={internshipPostForm.workingHours}
                      onChange={(e) => setInternshipPostForm({ ...internshipPostForm, workingHours: e.target.value })}
                      placeholder="e.g. 40 hrs/week (Mon - Fri, 9:30 AM - 5:30 PM)"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200 space-y-3">
                    <div className="flex items-center space-x-2 text-xs font-bold text-slate-900">
                      <UserCheck className="w-4 h-4 text-emerald-600" />
                      <span>Dedicated Mentor Assignment</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-bold text-gray-600 mb-1">Mentor Full Name *</label>
                        <input
                          type="text"
                          value={internshipPostForm.mentorName}
                          onChange={(e) => setInternshipPostForm({ ...internshipPostForm, mentorName: e.target.value })}
                          placeholder="e.g. Vikram Rao"
                          className="w-full px-3 py-2 bg-white rounded-xl border border-gray-200 text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-gray-600 mb-1">Mentor Designation *</label>
                        <input
                          type="text"
                          value={internshipPostForm.mentorDesignation}
                          onChange={(e) => setInternshipPostForm({ ...internshipPostForm, mentorDesignation: e.target.value })}
                          placeholder="e.g. Principal Systems Architect"
                          className="w-full px-3 py-2 bg-white rounded-xl border border-gray-200 text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-gray-600 mb-1">Department</label>
                        <input
                          type="text"
                          value={internshipPostForm.mentorDepartment}
                          onChange={(e) => setInternshipPostForm({ ...internshipPostForm, mentorDepartment: e.target.value })}
                          placeholder="e.g. Core Platform Engineering"
                          className="w-full px-3 py-2 bg-white rounded-xl border border-gray-200 text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-gray-600 mb-1">Mentor Work Email</label>
                        <input
                          type="email"
                          value={internshipPostForm.mentorContact}
                          onChange={(e) => setInternshipPostForm({ ...internshipPostForm, mentorContact: e.target.value })}
                          placeholder="e.g. vikram.rao@infosys.com"
                          className="w-full px-3 py-2 bg-white rounded-xl border border-gray-200 text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 7: PREVIEW & PUBLISH */}
              {internshipStep === 7 && (
                <div className="space-y-4 animate-in fade-in duration-150">
                  <div className="border-b border-gray-100 pb-3">
                    <h4 className="text-sm font-black text-slate-900">Step 7: Preview & Final Publication</h4>
                    <p className="text-xs text-gray-500">
                      Verify complete internship specification before making it live to prospective students.
                    </p>
                  </div>

                  {/* Comprehensive Live Preview Card */}
                  <div className="p-6 bg-white rounded-2xl border-2 border-emerald-500/30 shadow-md space-y-6">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-4 border-b border-gray-100">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-purple-100 text-purple-800">
                            {internshipPostForm.workMode} Internship
                          </span>
                          <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 flex items-center gap-1">
                            <ShieldCheck className="w-3 h-3 text-emerald-600" />
                            <span>Verified Company Listing</span>
                          </span>
                        </div>
                        <h3 className="text-xl font-black text-slate-900">{internshipPostForm.title}</h3>
                        <p className="text-xs text-gray-600 mt-0.5">
                          {company?.companyName || "Infosys Labs"} • {internshipPostForm.department} • {internshipPostForm.location}
                        </p>
                      </div>

                      <div className="sm:text-right">
                        <div className="text-lg font-black text-emerald-600">{internshipPostForm.salary}</div>
                        <div className="text-[11px] text-gray-400">{internshipPostForm.durationWeeks} Weeks • {internshipPostForm.workingHours}</div>
                      </div>
                    </div>

                    <p className="text-xs text-gray-700 leading-relaxed">
                      {internshipPostForm.description}
                    </p>

                    {/* Canonical Skills Matrix Preview */}
                    <div>
                      <h5 className="text-xs font-black text-gray-900 mb-2 uppercase tracking-wider">Required & Preferred Skills:</h5>
                      <div className="flex flex-wrap gap-2">
                        {internshipPostForm.selectedSkills.map((sk) => (
                          <span
                            key={sk.skillId || sk.skillName}
                            className={`text-xs px-2.5 py-1 rounded-lg font-bold flex items-center gap-1.5 ${
                              sk.requirementType === "REQUIRED"
                                ? "bg-blue-50 text-blue-900 border border-blue-200"
                                : "bg-gray-100 text-gray-700 border border-gray-200"
                            }`}
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                            <span>{sk.skillName}</span>
                            <span className="text-[10px] font-normal text-gray-500">({sk.requiredLevel})</span>
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Eligibility & Project Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-gray-100 text-xs">
                      <div className="bg-gray-50 p-3.5 rounded-xl space-y-1.5">
                        <div className="font-bold text-gray-900 flex items-center gap-1.5">
                          <GraduationCap className="w-4 h-4 text-purple-600" />
                          <span>Eligibility Criteria</span>
                        </div>
                        <div className="text-gray-600 text-[11px] space-y-0.5">
                          <div><strong>Degrees:</strong> {internshipPostForm.eligibleDegrees}</div>
                          <div><strong>Passing:</strong> {internshipPostForm.graduationYears}</div>
                          <div><strong>Min CGPA:</strong> {internshipPostForm.minCgpa} / 10.0</div>
                        </div>
                      </div>

                      <div className="bg-gray-50 p-3.5 rounded-xl space-y-1.5">
                        <div className="font-bold text-gray-900 flex items-center gap-1.5">
                          <UserCheck className="w-4 h-4 text-emerald-600" />
                          <span>Assigned Mentor</span>
                        </div>
                        <div className="text-gray-600 text-[11px] space-y-0.5">
                          <div><strong>Mentor:</strong> {internshipPostForm.mentorName}</div>
                          <div><strong>Role:</strong> {internshipPostForm.mentorDesignation}</div>
                          <div><strong>Contact:</strong> {internshipPostForm.mentorContact}</div>
                        </div>
                      </div>
                    </div>

                  </div>
                </div>
              )}

            </div>

            {/* Modal Footer: Navigation Controls */}
            <div className="p-4 sm:p-6 border-t border-gray-100 bg-gray-50 flex justify-between items-center">
              <div>
                {internshipStep > 1 && (
                  <button
                    onClick={() => setInternshipStep((internshipStep - 1) as any)}
                    className="px-4 py-2 rounded-xl bg-white border border-gray-200 text-gray-700 text-xs font-bold hover:bg-gray-100 cursor-pointer"
                  >
                    Back
                  </button>
                )}
              </div>

              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setShowPostInternshipModal(false)}
                  className="px-4 py-2 rounded-xl text-gray-500 text-xs font-bold hover:text-gray-800 cursor-pointer"
                >
                  Cancel
                </button>

                {internshipStep < 7 ? (
                  <button
                    onClick={() => setInternshipStep((internshipStep + 1) as any)}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-6 py-2.5 rounded-xl flex items-center gap-1.5 shadow-sm cursor-pointer"
                  >
                    <span>Continue to Step {internshipStep + 1}</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    onClick={handlePublishInternship}
                    disabled={isPublishingInternship}
                    className="bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-xs font-black px-8 py-2.5 rounded-xl flex items-center gap-2 shadow-md cursor-pointer"
                  >
                    {isPublishingInternship ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Publishing to Feed...</span>
                      </>
                    ) : (
                      <>
                        <ShieldCheck className="w-4 h-4" />
                        <span>Publish Verified Internship</span>
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>

          </div>
        </div>
      )}

      {/* ======================================================================= */}
      {/* 6. ADD EMPLOYEE TO DIRECTORY MODAL                                      */}
      {/* ======================================================================= */}
      {showAddEmployeeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-gray-200 p-7 space-y-6">
            
            {/* Header */}
            <div className="flex justify-between items-start pb-4 border-b border-gray-100">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                  <UserPlus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-900">Add Employee to Directory</h3>
                  <p className="text-xs text-gray-500">Register employee profile with project assignments and evidence-based skills.</p>
                </div>
              </div>

              <button
                onClick={() => setShowAddEmployeeModal(false)}
                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 flex items-center justify-center cursor-pointer transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleCreateEmployee} className="space-y-5 text-xs">
              
              {/* Basic Information */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-800 uppercase text-[10px] tracking-wider">
                    Full Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rahul Sharma"
                    value={addEmployeeForm.name}
                    onChange={(e) => setAddEmployeeForm({ ...addEmployeeForm, name: e.target.value })}
                    className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 font-medium focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-slate-800 uppercase text-[10px] tracking-wider">
                    Corporate Email <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="e.g. rahul.sharma@infosys.com"
                    value={addEmployeeForm.email}
                    onChange={(e) => setAddEmployeeForm({ ...addEmployeeForm, email: e.target.value })}
                    className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 font-medium focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              {/* Department & Role */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-800 uppercase text-[10px] tracking-wider">
                    Department <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={addEmployeeForm.department}
                    onChange={(e) => setAddEmployeeForm({ ...addEmployeeForm, department: e.target.value })}
                    className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 font-bold bg-white text-slate-800 focus:outline-none focus:border-emerald-500"
                  >
                    <option value="Engineering">Engineering</option>
                    <option value="Data & Analytics">Data & Analytics</option>
                    <option value="Product">Product</option>
                    <option value="Infrastructure & Platform">Infrastructure & Platform</option>
                    <option value="Cognitive Intelligence Lab">Cognitive Intelligence Lab</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-slate-800 uppercase text-[10px] tracking-wider">
                    Role Title <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Backend Engineer, Cloud Architect"
                    value={addEmployeeForm.role}
                    onChange={(e) => setAddEmployeeForm({ ...addEmployeeForm, role: e.target.value })}
                    className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 font-medium focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              {/* Experience & Assigned Project */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-800 uppercase text-[10px] tracking-wider">
                    Experience Level
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 2.5 years, Senior"
                    value={addEmployeeForm.experience}
                    onChange={(e) => setAddEmployeeForm({ ...addEmployeeForm, experience: e.target.value })}
                    className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 font-medium focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-slate-800 uppercase text-[10px] tracking-wider">
                    Assigned Project
                  </label>
                  <select
                    value={addEmployeeForm.currentProject}
                    onChange={(e) => setAddEmployeeForm({ ...addEmployeeForm, currentProject: e.target.value })}
                    className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 font-bold bg-white text-slate-800 focus:outline-none focus:border-emerald-500"
                  >
                    <option value="Project X">Project X: Telemetry & Observability Pipeline</option>
                    <option value="Project Y">Project Y: NextGen Enterprise Portal</option>
                    <option value="Project Z">Project Z: AI Semantic Search & Knowledge Graph</option>
                    <option value="R&D Lab">R&D Lab Incubator</option>
                  </select>
                </div>
              </div>

              {/* Skills Builder (with Evidence) */}
              <div className="space-y-3 pt-3 border-t border-gray-100">
                <div className="flex justify-between items-center">
                  <div>
                    <label className="font-black text-slate-900 uppercase text-[11px] tracking-wider flex items-center gap-1.5">
                      <Award className="w-4 h-4 text-emerald-600" />
                      <span>Evidence-Based Technical Skills</span>
                    </label>
                    <p className="text-[10px] text-gray-500">Skills are validated with proof (Assessments, Merged PRs, Manager Review, or Certifications).</p>
                  </div>
                </div>

                {/* Added skills chips */}
                {addEmployeeForm.technicalSkills.length > 0 && (
                  <div className="flex flex-wrap gap-2 p-3 bg-gray-50 rounded-2xl border border-gray-200">
                    {addEmployeeForm.technicalSkills.map((sk: any, i: number) => (
                      <span key={i} className="bg-white border border-gray-300 text-slate-800 text-[11px] font-bold px-2.5 py-1 rounded-xl flex items-center gap-2 shadow-2xs">
                        <span>{sk.name}</span>
                        <span className="text-[10px] text-emerald-700 font-mono font-black bg-emerald-50 px-1.5 py-0.5 rounded">
                          {sk.level} {sk.score ? `(${sk.score}%)` : ""}
                        </span>
                        <span className="text-[9px] text-gray-400 font-medium">[{sk.evidenceType}]</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveSkillFromNewEmployee(i)}
                          className="text-gray-400 hover:text-rose-600 cursor-pointer"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}

                {/* Inline Skill Input Box */}
                <div className="p-3.5 bg-gray-50/70 rounded-2xl border border-gray-200 space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-2.5">
                    <input
                      type="text"
                      placeholder="Skill Name (e.g. Docker, Python)"
                      value={addEmployeeForm.newSkillName}
                      onChange={(e) => setAddEmployeeForm({ ...addEmployeeForm, newSkillName: e.target.value })}
                      className="border border-gray-200 rounded-xl px-3 py-2 text-xs bg-white focus:outline-none focus:border-emerald-500"
                    />

                    <select
                      value={addEmployeeForm.newSkillLevel}
                      onChange={(e) => setAddEmployeeForm({ ...addEmployeeForm, newSkillLevel: e.target.value })}
                      className="border border-gray-200 rounded-xl px-2.5 py-2 text-xs bg-white text-slate-800 font-bold focus:outline-none focus:border-emerald-500"
                    >
                      <option value="Advanced">Advanced (85%+)</option>
                      <option value="Proficient">Proficient (70-84%)</option>
                      <option value="Developing">Developing (50-69%)</option>
                      <option value="Foundational">Foundational (&lt;50%)</option>
                    </select>

                    <select
                      value={addEmployeeForm.newSkillEvidenceType}
                      onChange={(e) => setAddEmployeeForm({ ...addEmployeeForm, newSkillEvidenceType: e.target.value })}
                      className="border border-gray-200 rounded-xl px-2.5 py-2 text-xs bg-white text-slate-800 font-bold focus:outline-none focus:border-emerald-500"
                    >
                      <option value="Assessment">Assessment Exam</option>
                      <option value="Project">Project Repo / Code</option>
                      <option value="Manager Evaluation">Manager Evaluation</option>
                      <option value="Certification">Industry Certification</option>
                    </select>

                    <input
                      type="number"
                      min="0"
                      max="100"
                      placeholder="Score %"
                      value={addEmployeeForm.newSkillScore}
                      onChange={(e) => setAddEmployeeForm({ ...addEmployeeForm, newSkillScore: Number(e.target.value) })}
                      className="border border-gray-200 rounded-xl px-3 py-2 text-xs bg-white font-mono focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Evidence details (e.g., CKA Certificate, 91% exam score, merged feature PR)"
                      value={addEmployeeForm.newSkillEvidenceDetail}
                      onChange={(e) => setAddEmployeeForm({ ...addEmployeeForm, newSkillEvidenceDetail: e.target.value })}
                      className="flex-1 border border-gray-200 rounded-xl px-3 py-2 text-xs bg-white focus:outline-none focus:border-emerald-500"
                    />

                    <button
                      type="button"
                      onClick={handleAddSkillToNewEmployee}
                      className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs px-4 py-2 rounded-xl flex items-center gap-1.5 cursor-pointer shrink-0"
                    >
                      <Plus className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Add Skill</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Development Focus Areas */}
              <div className="space-y-3 pt-3 border-t border-gray-100">
                <label className="font-black text-slate-900 uppercase text-[11px] tracking-wider flex items-center gap-1.5">
                  <Compass className="w-4 h-4 text-indigo-600" />
                  <span>Strategic Development Focus Areas</span>
                </label>

                <div className="flex flex-wrap gap-2">
                  {addEmployeeForm.developmentAreas.map((area: string, i: number) => (
                    <span key={i} className="bg-indigo-50 border border-indigo-200 text-indigo-900 text-xs font-bold px-3 py-1 rounded-xl flex items-center gap-2">
                      <span>{area}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveDevAreaFromNewEmployee(i)}
                        className="text-indigo-400 hover:text-rose-600 cursor-pointer"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </span>
                  ))}
                </div>

                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="e.g. Distributed Consensus Algorithms, W3C Web Accessibility"
                    value={addEmployeeForm.newDevArea}
                    onChange={(e) => setAddEmployeeForm({ ...addEmployeeForm, newDevArea: e.target.value })}
                    className="flex-1 border border-gray-200 rounded-xl px-3 py-2 text-xs bg-white focus:outline-none focus:border-emerald-500"
                  />
                  <button
                    type="button"
                    onClick={handleAddDevAreaToNewEmployee}
                    className="bg-gray-100 hover:bg-gray-200 text-slate-800 font-bold text-xs px-4 py-2 rounded-xl cursor-pointer shrink-0"
                  >
                    <span>Add Area</span>
                  </button>
                </div>
              </div>

              {/* Modal Actions */}
              <div className="pt-5 border-t border-gray-100 flex justify-between items-center">
                <button
                  type="button"
                  onClick={() => setShowAddEmployeeModal(false)}
                  className="px-5 py-2.5 rounded-xl text-gray-500 font-bold hover:text-gray-800 cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isAddingEmployee}
                  className="bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-black px-7 py-2.5 rounded-xl flex items-center gap-2 shadow-md cursor-pointer transition-all"
                >
                  {isAddingEmployee ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Adding to Directory...</span>
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Add Employee & Synchronize Intelligence</span>
                    </>
                  )}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* ======================================================================= */}
      {/* MODAL: STRUCTURED JOB DRAFT REVIEW & PUBLISH (DECISION-SUPPORT STEP 9)   */}
      {/* ======================================================================= */}
      {showJobDraftModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl border border-gray-200 shadow-2xl max-w-3xl w-full p-8 space-y-6 max-h-[92vh] overflow-y-auto">
            
            {/* Modal Header */}
            <div className="flex justify-between items-start border-b border-gray-100 pb-5">
              <div>
                <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-indigo-700 mb-1">
                  <Sparkles className="w-4 h-4 text-indigo-600" />
                  <span>Decision-Support: Step 9 Review & Edit Job Requirement</span>
                </div>
                <h3 className="text-2xl font-black text-slate-900">
                  Review & Publish Job: {jobDraftForm.title}
                </h3>
                <p className="text-xs text-gray-500 mt-1">
                  Generated automatically from workforce shortage analysis. Inspect and edit details before making it live in the student feed.
                </p>
              </div>

              <button
                onClick={() => setShowJobDraftModal(false)}
                className="text-gray-400 hover:text-gray-600 p-2 rounded-xl hover:bg-gray-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Editable Fields Form */}
            <div className="space-y-5">
              
              {/* Row 1: Title & Openings */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2 space-y-1.5">
                  <label className="text-[10px] font-black uppercase text-slate-800 tracking-wider">Job Role Title</label>
                  <input
                    type="text"
                    value={jobDraftForm.title}
                    onChange={(e) => setJobDraftForm({ ...jobDraftForm, title: e.target.value })}
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-xs font-bold text-slate-900 focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase text-slate-800 tracking-wider">Headcount Openings</label>
                  <input
                    type="number"
                    min="1"
                    value={jobDraftForm.openings}
                    onChange={(e) => setJobDraftForm({ ...jobDraftForm, openings: Number(e.target.value) })}
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-xs font-bold text-slate-900 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              {/* Row 2: Department, Hiring Reason, Connected Project */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase text-slate-800 tracking-wider">Department</label>
                  <input
                    type="text"
                    value={jobDraftForm.department}
                    onChange={(e) => setJobDraftForm({ ...jobDraftForm, department: e.target.value })}
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-xs font-bold text-slate-900 focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase text-slate-800 tracking-wider">Hiring Reason</label>
                  <select
                    value={jobDraftForm.hiringReason}
                    onChange={(e) => setJobDraftForm({ ...jobDraftForm, hiringReason: e.target.value })}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-xs font-bold text-slate-900 bg-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="Workforce shortage">Workforce shortage</option>
                    <option value="New project">New project</option>
                    <option value="Project expansion">Project expansion</option>
                    <option value="Replacement">Replacement</option>
                    <option value="New technology initiative">New technology initiative</option>
                    <option value="Business expansion">Business expansion</option>
                    <option value="Seasonal demand">Seasonal demand</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase text-slate-800 tracking-wider">Connected Project</label>
                  <input
                    type="text"
                    value={jobDraftForm.projectConnected}
                    onChange={(e) => setJobDraftForm({ ...jobDraftForm, projectConnected: e.target.value })}
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-xs font-bold text-slate-900 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              {/* Row 3: Role Description */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase text-slate-800 tracking-wider">Role Description & Context</label>
                <textarea
                  rows={3}
                  value={jobDraftForm.description}
                  onChange={(e) => setJobDraftForm({ ...jobDraftForm, description: e.target.value })}
                  className="w-full border border-gray-200 rounded-xl p-3 text-xs text-slate-800 focus:outline-none focus:border-indigo-500"
                />
              </div>

              {/* Row 4: Required & Preferred Skills */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 p-4 rounded-2xl bg-gray-50 border border-gray-200">
                <div className="space-y-2">
                  <div className="text-xs font-black uppercase text-slate-900 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Required Core Skills</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {jobDraftForm.requiredSkills?.map((s: any, idx: number) => (
                      <span key={idx} className="bg-white border border-gray-200 text-slate-900 text-xs font-bold px-2.5 py-1 rounded-lg shadow-2xs">
                        {s.name} <span className="text-[10px] text-emerald-600 font-black">({s.importance})</span>
                      </span>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="text-xs font-black uppercase text-slate-900 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                    <span>Preferred Skills</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {jobDraftForm.preferredSkills?.map((s: any, idx: number) => (
                      <span key={idx} className="bg-white border border-gray-200 text-slate-900 text-xs font-bold px-2.5 py-1 rounded-lg shadow-2xs">
                        {s.name} <span className="text-[10px] text-purple-600 font-black">({s.importance})</span>
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Row 5: Attached Question Bank Assessment Pre-screening */}
              <div className="p-4 rounded-2xl bg-purple-50/60 border border-purple-200 space-y-2.5">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-black text-purple-900 uppercase tracking-wider flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-purple-600" />
                    <span>Attached Question Bank Pre-Screening Modules</span>
                  </span>
                  <span className="text-[10px] font-bold text-purple-700 bg-white px-2 py-0.5 rounded border border-purple-200">
                    Automated Candidate Verification
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2 pt-1">
                  {jobDraftForm.attachedAssessments?.map((a: any, idx: number) => (
                    <div key={idx} className="bg-white p-2.5 rounded-xl border border-purple-100 text-xs space-y-0.5">
                      <div className="font-extrabold text-slate-900 truncate">{a.topic}</div>
                      <div className="text-[10px] text-gray-500">{a.questionCount} Questions • {a.source}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Row 6: Compensation & Work Mode */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase text-slate-800 tracking-wider">Salary / Stipend</label>
                  <input
                    type="text"
                    value={jobDraftForm.salary}
                    onChange={(e) => setJobDraftForm({ ...jobDraftForm, salary: e.target.value })}
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-xs font-bold text-slate-900 focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase text-slate-800 tracking-wider">Work Mode & Location</label>
                  <input
                    type="text"
                    value={jobDraftForm.workMode}
                    onChange={(e) => setJobDraftForm({ ...jobDraftForm, workMode: e.target.value })}
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-xs font-bold text-slate-900 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

            </div>

            {/* Modal Actions */}
            <div className="pt-5 border-t border-gray-100 flex justify-between items-center">
              <button
                type="button"
                onClick={() => setShowJobDraftModal(false)}
                className="px-5 py-2.5 rounded-xl text-gray-500 font-bold hover:text-gray-800 cursor-pointer text-xs"
              >
                Back to Workforce Analysis
              </button>

              <button
                type="button"
                disabled={isPublishingDraft}
                onClick={handlePublishDraftJob}
                className="bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-black px-7 py-3 rounded-xl flex items-center gap-2 shadow-md cursor-pointer transition-all text-xs"
              >
                {isPublishingDraft ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Publishing to Platform...</span>
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Confirm & Publish Live Job Posting</span>
                  </>
                )}
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
