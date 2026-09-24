"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { 
  Search, 
  MapPin, 
  Briefcase as BriefcaseIcon, 
  CheckCircle2, 
  AlertTriangle, 
  Building, 
  ArrowRight, 
  ShieldCheck, 
  FileText, 
  Globe,
  Sparkles,
  Award,
  Filter,
  Layers,
  ChevronRight,
  RotateCcw,
  GraduationCap,
  Percent,
  ChevronDown,
  ChevronUp,
  SlidersHorizontal,
  Info,
  Clock,
  Star,
  Send,
  X,
  Calendar,
  CheckCircle,
  XCircle,
  UserCheck,
  UserX,
  MessageSquare,
  FileCheck,
  Eye,
  Rocket,
  CheckSquare,
  Square,
  MessageCircle,
  FileBadge,
  ExternalLink,
  Download,
  Share2,
  TrendingUp,
  Plus,
  Check,
  ShieldAlert,
  Lock
} from "lucide-react";

function OpportunitiesContent() {
  const searchParams = useSearchParams();
  const applyJobIdParam = searchParams.get("applyJobId");

  const [opportunities, setOpportunities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Auto-open application modal if navigated with ?applyJobId=...
  useEffect(() => {
    if (applyJobIdParam && opportunities.length > 0) {
      const targetOpp = opportunities.find(o => o.job.id === applyJobIdParam);
      if (targetOpp) {
        setSelectedJobForApply(targetOpp.job);
        setAppSubmissionSuccess(null);
      }
    }
  }, [applyJobIdParam, opportunities]);
  
  // 5 Primary Navigation Tabs:
  // "openings" -> Real-Time Openings
  // "internships" -> Discover Internships
  // "active_internship" -> Active Internship Lifecycle (Progress, Feedback, Completion)
  // "applications" -> My Applications (Track Status)
  // "matches" -> Verified Matches
  const [activeTab, setActiveTab] = useState<"openings" | "internships" | "active_internship" | "applications" | "matches">("openings");

  // Active Internship Lifecycle Subsections
  // "progress" -> Progress Tracking
  // "mentor" -> Mentor Feedback
  // "completion" -> Completion Records & Certificate
  const [internshipSubTab, setInternshipSubTab] = useState<"progress" | "mentor" | "completion">("progress");
  const [activeInternship, setActiveInternship] = useState<any | null>(null);
  const [loadingActiveInternship, setLoadingActiveInternship] = useState(false);
  const [isTogglingTask, setIsTogglingTask] = useState<string | null>(null);

  // New Weekly Update Form State
  const [showWeeklyUpdateModal, setShowWeeklyUpdateModal] = useState(false);
  const [weeklyUpdateForm, setWeeklyUpdateForm] = useState({
    weekNumber: 5,
    weekTitle: "Week 5: Authentication & Token Security",
    summary: "",
    submittedWorkUrl: "",
    blockers: ""
  });
  const [isSubmittingWeeklyUpdate, setIsSubmittingWeeklyUpdate] = useState(false);

  // Mentor Feedback Simulation State
  const [showMentorFeedbackModal, setShowMentorFeedbackModal] = useState(false);
  const [mentorForm, setMentorForm] = useState({
    mentorName: "Vikram Rao",
    mentorRole: "Principal Systems Architect",
    generalFeedback: "Outstanding sprint execution. Arjun handled database indexing and asynchronous caching exceptionally well.",
    strengthsText: "Strong API design, proactive sprint communication, robust error boundary handling",
    improvementsText: "Explore more automated integration test fixtures, review redis failover metrics",
    evaluatedSkill1: "Javascript",
    proficiency1: "Proficient",
    score1: 90,
    evaluatedSkill2: "React JS",
    proficiency2: "Developing",
    score2: 78
  });
  const [isSubmittingMentorFeedback, setIsSubmittingMentorFeedback] = useState(false);

  // Certificate Modal State
  const [showCertificateModal, setShowCertificateModal] = useState(false);
  const [isFinalizingInternship, setIsFinalizingInternship] = useState(false);

  // Track expanded job cards for viewing the detailed Skill Compatibility Breakdown
  const [expandedJobId, setExpandedJobId] = useState<string | null>(null);

  // Application Modal State
  const [selectedJobForApply, setSelectedJobForApply] = useState<any | null>(null);
  const [isSubmittingApp, setIsSubmittingApp] = useState(false);
  const [appSubmissionSuccess, setAppSubmissionSuccess] = useState<any | null>(null);
  const [applicationForm, setApplicationForm] = useState({
    fullName: "Arjun Sharma",
    email: "student@demo.com",
    phone: "+91 98765 43210",
    institution: "IIT Bombay",
    degree: "B.Tech Computer Science & Engineering",
    graduationYear: "2026",
    coverLetter: "I am eager to contribute to core engineering delivery and apply my assessed skills in building robust, performant functionality.",
    portfolioUrl: "https://github.com/arjun-dev",
    availability: "Immediate (Full-time)",
    projectHighlights: "E-Commerce Microservices Engine, Real-Time Chat System",
    employerAnswer1: "Yes, I am comfortable working in hybrid/on-site setups in Bangalore and collaborating across sprints."
  });

  // Applications List State (My Applications / Track Status)
  const [myApplications, setMyApplications] = useState<any[]>([]);
  const [loadingApps, setLoadingApps] = useState(false);
  const [appFilter, setAppFilter] = useState<"ALL" | "ACTIVE" | "SELECTED" | "REJECTED">("ALL");
  const [inspectingApp, setInspectingApp] = useState<any | null>(null);

  // Verified Skill Profile from student tests
  const [verifiedSkills, setVerifiedSkills] = useState<any[]>([]);
  const [filterBySkillPortfolio, setFilterBySkillPortfolio] = useState(false);
  const [selectedVerifiedSkills, setSelectedVerifiedSkills] = useState<string[]>([]);
  const [minProficiencyFilter, setMinProficiencyFilter] = useState<number>(0);

  // General Filters State
  const [jobTypes, setJobTypes] = useState<string[]>([]);
  const [selectedCity, setSelectedCity] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  // =========================================================================
  // POST INTERNSHIP & COMPANY VERIFICATION WORKFLOW (Phases 1 - 7)
  // =========================================================================
  // Role & Company State: Default role can be switched for simulation/testing
  const [currentUserRole, setCurrentUserRole] = useState<"STUDENT" | "COMPANY" | "INSTITUTE" | "ADMIN">("COMPANY");
  const [companyProfile, setCompanyProfile] = useState<any | null>({
    id: "comp-demo-1",
    companyName: "Infosys Labs",
    industry: "Enterprise AI & Cloud",
    verificationStatus: "VERIFIED",
    verifiedAt: new Date().toISOString(),
    isVerified: true
  });
  const [simulationRole, setSimulationRole] = useState<"STUDENT" | "COMPANY_VERIFIED" | "COMPANY_UNVERIFIED">("COMPANY_VERIFIED");
  
  // Post Internship Modal & Step Wizard State
  const [showPostInternshipModal, setShowPostInternshipModal] = useState(false);
  const [showVerificationWarningModal, setShowVerificationWarningModal] = useState(false);
  const [internshipStep, setInternshipStep] = useState<1 | 2 | 3 | 4 | 5 | 6 | 7>(1);
  const [isPublishingInternship, setIsPublishingInternship] = useState(false);
  const [publishSuccessMessage, setPublishSuccessMessage] = useState<string | null>(null);

  // Canonical Skill Taxonomy from Backend
  const [skillTaxonomy, setSkillTaxonomy] = useState<any[]>([]);
  const [skillSearchQuery, setSkillSearchQuery] = useState("");

  // Step 1 - 7 Internship Form State
  const [internshipPostForm, setInternshipPostForm] = useState({
    // Step 1: Basic Information
    title: "Full-Stack Software Engineering Intern",
    department: "Core Platform Engineering",
    industry: "Software & Technology",
    location: "Bangalore, India",
    workMode: "Hybrid",
    description: "Join our core engineering sprint team to architect, build, and optimize scalable enterprise web services, responsive UI dashboards, and automated CI/CD microservices.",
    salary: "₹45,000 / month",

    // Step 2: Role & Responsibilities
    roleCategory: "Full-Stack Development",
    responsibilities: [
      "Collaborate with senior architects to implement RESTful and GraphQL APIs",
      "Build reusable, accessible front-end components using React and TypeScript",
      "Write comprehensive unit and integration tests with >80% code coverage",
      "Participate in daily Agile standups, code reviews, and sprint planning"
    ],
    newResponsibilityInput: "",

    // Step 3: Canonical Skills Taxonomy (Requirement Type, Proficiency Level, Importance Weight)
    selectedSkills: [
      {
        skillId: "sk-ts",
        skillName: "TypeScript",
        requirementType: "REQUIRED",
        requiredLevel: "Proficient",
        weight: 1.0
      },
      {
        skillId: "sk-react",
        skillName: "React",
        requirementType: "REQUIRED",
        requiredLevel: "Proficient",
        weight: 1.0
      },
      {
        skillId: "sk-node",
        skillName: "Node.js",
        requirementType: "PREFERRED",
        requiredLevel: "Developing",
        weight: 0.8
      },
      {
        skillId: "sk-sql",
        skillName: "SQL",
        requirementType: "PREFERRED",
        requiredLevel: "Foundational",
        weight: 0.6
      }
    ],

    // Step 4: Non-Skill Eligibility Criteria
    eligibleDegrees: "B.Tech, B.E., M.Tech, MCA",
    eligibleBranches: "Computer Science, Information Technology, Electronics & Communication",
    graduationYears: "2025, 2026",
    minCgpa: 7.5,
    experienceLevel: "Current Students & Pre-Final / Final Year Candidates",

    // Step 5: Project / Work Deliverables
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

    // Step 6: Duration & Mentor Details
    startDate: "2026-06-01",
    endDate: "2026-07-31",
    durationWeeks: 8,
    workingHours: "40 hrs/week (Mon - Fri, 9:30 AM - 5:30 PM)",
    mentorName: "Vikram Rao",
    mentorDesignation: "Principal Systems Architect",
    mentorDepartment: "Core Platform Engineering",
    mentorContact: "vikram.rao@infosys.com",

    // Step 7: Publishing Status
    publishStatus: "OPEN"
  });

  const toggleJobType = (type: string) => {
    setJobTypes(prev => prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]);
  };

  const toggleVerifiedSkill = (skillName: string) => {
    setSelectedVerifiedSkills(prev => 
      prev.includes(skillName) ? prev.filter(s => s !== skillName) : [...prev, skillName]
    );
  };

  const formatTimeAgo = (dateInput: string | Date | undefined, index: number) => {
    if (!dateInput) return `${index + 2} hours ago`;
    const past = new Date(dateInput).getTime();
    const now = new Date().getTime();
    const diffHours = Math.floor(Math.abs(now - past) / (1000 * 60 * 60));
    
    if (diffHours < 1) return "Just now";
    if (diffHours < 24) return `${diffHours} hours ago`;
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays === 1) return "1 day ago";
    return `${diffDays} days ago`;
  };

  const formatRupeesSalary = (salaryText: string | undefined, employmentType: string) => {
    if (!salaryText) {
      return employmentType.toLowerCase().includes("intern") ? "₹35,000 - ₹50,000 / month" : "₹12,00,000 - ₹16,00,000 / year (12-16 LPA)";
    }
    if (salaryText.includes("LPA")) {
      return `₹${salaryText} (INR)`;
    }
    if (salaryText.toLowerCase().includes("month") || salaryText.includes("k")) {
      return `₹${salaryText} (Stipend)`;
    }
    return `₹${salaryText}`;
  };

  // Fetch opportunities, verified skills, and applications
  const fetchApplications = () => {
    setLoadingApps(true);
    fetch("/api/internships/applications")
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setMyApplications(data);
          if (data.length > 0 && !inspectingApp) {
            setInspectingApp(data[0]);
          }
        }
        setLoadingApps(false);
      })
      .catch(() => setLoadingApps(false));
  };

  // Fetch Active Internship Lifecycle Data
  const fetchActiveInternship = () => {
    setLoadingActiveInternship(true);
    fetch("/api/internships/active")
      .then(res => res.json())
      .then(data => {
        if (data.success && data.internship) {
          setActiveInternship(data.internship);
        }
        setLoadingActiveInternship(false);
      })
      .catch(() => setLoadingActiveInternship(false));
  };

  useEffect(() => {
    // 1. Fetch Opportunities
    fetch("/api/opportunities")
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setOpportunities(data);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));

    // 2. Fetch Student Verified Skills
    fetch("/api/students/me/skills")
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setVerifiedSkills(data);
          setSelectedVerifiedSkills(data.map(d => d.skill.name));
        }
      })
      .catch(() => {});

    // 3. Fetch Applications
    fetchApplications();

    // 4. Fetch Active Internship Lifecycle
    fetchActiveInternship();

    // 5. Fetch Canonical Skills Taxonomy for Post Internship
    fetch("/api/skills/taxonomy")
      .then(res => res.json())
      .then(data => {
        if (data.categories) {
          setSkillTaxonomy(data.categories);
        }
      })
      .catch(() => {});

    // 6. Fetch Logged-in User Session / Role
    fetch("/api/auth/me")
      .then(res => res.json())
      .then(data => {
        if (data.user?.role) {
          setCurrentUserRole(data.user.role);
          if (data.user.role === "STUDENT") {
            setSimulationRole("STUDENT");
          } else {
            setSimulationRole("COMPANY_VERIFIED");
          }
        }
      })
      .catch(() => {});
  }, []);

  // Update simulation role handler
  const handleRoleSimulationChange = (newRole: "STUDENT" | "COMPANY_VERIFIED" | "COMPANY_UNVERIFIED") => {
    setSimulationRole(newRole);
    if (newRole === "STUDENT") {
      setCurrentUserRole("STUDENT");
      setCompanyProfile(null);
    } else if (newRole === "COMPANY_VERIFIED") {
      setCurrentUserRole("COMPANY");
      setCompanyProfile({
        id: "comp-sim-1",
        companyName: "Infosys Labs",
        industry: "Enterprise AI & Cloud",
        verificationStatus: "VERIFIED",
        verifiedAt: new Date().toISOString(),
        isVerified: true
      });
    } else if (newRole === "COMPANY_UNVERIFIED") {
      setCurrentUserRole("COMPANY");
      setCompanyProfile({
        id: "comp-sim-2",
        companyName: "Acme Tech Startups",
        industry: "Fintech",
        verificationStatus: "PENDING",
        verifiedAt: null,
        isVerified: false
      });
    }
  };

  // Click "Post Internship" button handler
  const handleOpenPostInternship = () => {
    // Phase 1 verification check
    if (currentUserRole === "STUDENT") {
      alert("Only registered and verified Companies or Institutes can post internships.");
      return;
    }

    if (companyProfile?.verificationStatus !== "VERIFIED") {
      setShowVerificationWarningModal(true);
      return;
    }

    setShowPostInternshipModal(true);
    setInternshipStep(1);
    setPublishSuccessMessage(null);
  };

  // Canonical skill selection helpers
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

  // Add responsibility helper
  const handleAddResponsibility = () => {
    if (!internshipPostForm.newResponsibilityInput.trim()) return;
    setInternshipPostForm(prev => ({
      ...prev,
      responsibilities: [...prev.responsibilities, prev.newResponsibilityInput.trim()],
      newResponsibilityInput: ""
    }));
  };

  // Add deliverable helper
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
        simulateRole: simulationRole
      };

      const res = await fetch("/api/internships/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.code === "COMPANY_NOT_VERIFIED") {
          setShowPostInternshipModal(false);
          setShowVerificationWarningModal(true);
          return;
        }
        alert(data.error || "Failed to publish internship");
        return;
      }

      setPublishSuccessMessage("Internship published successfully! It is now live in the Discover Internships feed.");
      
      // Refresh opportunities feed
      fetch("/api/opportunities")
        .then(r => r.json())
        .then(opps => {
          if (Array.isArray(opps)) setOpportunities(opps);
        });

      setTimeout(() => {
        setShowPostInternshipModal(false);
        setActiveTab("internships");
      }, 1500);

    } catch (err: any) {
      alert("Error publishing internship: " + err.message);
    } finally {
      setIsPublishingInternship(false);
    }
  };

  // Toggle Task Completion
  const handleToggleTask = async (taskId: string, currentCompleted: boolean) => {
    setIsTogglingTask(taskId);
    try {
      const res = await fetch("/api/internships/active/tasks/toggle", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ taskId, isCompleted: !currentCompleted })
      });
      const data = await res.json();
      if (res.ok && data.internship) {
        setActiveInternship(data.internship);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsTogglingTask(null);
    }
  };

  // Submit Weekly Progress Update
  const handleSubmitWeeklyUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeInternship) return;
    setIsSubmittingWeeklyUpdate(true);
    try {
      const res = await fetch("/api/internships/active/updates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          internshipId: activeInternship.id,
          weekNumber: weeklyUpdateForm.weekNumber,
          weekTitle: weeklyUpdateForm.weekTitle,
          summary: weeklyUpdateForm.summary,
          submittedWorkUrl: weeklyUpdateForm.submittedWorkUrl,
          blockers: weeklyUpdateForm.blockers
        })
      });
      const data = await res.json();
      if (res.ok && data.internship) {
        setActiveInternship(data.internship);
        setShowWeeklyUpdateModal(false);
        setWeeklyUpdateForm({
          weekNumber: weeklyUpdateForm.weekNumber + 1,
          weekTitle: `Week ${weeklyUpdateForm.weekNumber + 1}: Sprint Progress`,
          summary: "",
          submittedWorkUrl: "",
          blockers: ""
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmittingWeeklyUpdate(false);
    }
  };

  // Submit Mentor Feedback Simulator
  const handleSubmitMentorFeedback = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeInternship) return;
    setIsSubmittingMentorFeedback(true);
    try {
      const strengthsArr = mentorForm.strengthsText.split(",").map(s => s.trim()).filter(Boolean);
      const improvementsArr = mentorForm.improvementsText.split(",").map(s => s.trim()).filter(Boolean);
      const evaluations = [
        { skillName: mentorForm.evaluatedSkill1, proficiencyLevel: mentorForm.proficiency1, scoreImpact: mentorForm.score1 },
        { skillName: mentorForm.evaluatedSkill2, proficiencyLevel: mentorForm.proficiency2, scoreImpact: mentorForm.score2 }
      ];

      const res = await fetch("/api/internships/active/mentor-feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          internshipId: activeInternship.id,
          mentorName: mentorForm.mentorName,
          mentorRole: mentorForm.mentorRole,
          generalFeedback: mentorForm.generalFeedback,
          strengths: strengthsArr,
          improvementAreas: improvementsArr,
          skillEvaluations: evaluations
        })
      });
      const data = await res.json();
      if (res.ok && data.internship) {
        setActiveInternship(data.internship);
        setShowMentorFeedbackModal(false);
        // Refresh verified skills so changes appear immediately in the student profile
        fetch("/api/students/me/skills")
          .then(r => r.json())
          .then(d => { if (Array.isArray(d)) setVerifiedSkills(d); });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmittingMentorFeedback(false);
    }
  };

  // Complete Internship & Generate Certificate
  const handleFinalizeInternship = async () => {
    if (!activeInternship) return;
    setIsFinalizingInternship(true);
    try {
      const res = await fetch("/api/internships/active/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          internshipId: activeInternship.id,
          finalRating: 4.3,
          recommendationNote: "Demonstrated exceptional competence in production-grade backend systems and agile engineering."
        })
      });
      const data = await res.json();
      if (res.ok && data.internship) {
        setActiveInternship(data.internship);
        setShowCertificateModal(true);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsFinalizingInternship(false);
    }
  };

  // Handle Application Submit
  const handleOpenApplyModal = (job: any) => {
    setSelectedJobForApply(job);
    setAppSubmissionSuccess(null);
  };

  const handleSubmitApplication = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedJobForApply) return;
    setIsSubmittingApp(true);

    try {
      const payload = {
        jobId: selectedJobForApply.id,
        fullName: applicationForm.fullName,
        email: applicationForm.email,
        phone: applicationForm.phone,
        institution: applicationForm.institution,
        degree: applicationForm.degree,
        graduationYear: applicationForm.graduationYear,
        coverLetter: applicationForm.coverLetter,
        portfolioUrl: applicationForm.portfolioUrl,
        availability: applicationForm.availability,
        relevantSkills: verifiedSkills.map(s => `${s.skill.name} (${Math.round(s.score)}%)`).join(", "),
        additionalAnswers: {
          projectHighlights: applicationForm.projectHighlights,
          employerAnswer1: applicationForm.employerAnswer1
        }
      };

      const res = await fetch("/api/internships/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (res.ok) {
        setAppSubmissionSuccess(data);
        fetchApplications();
      } else {
        alert(data.error || "Failed to submit application");
      }
    } catch (err) {
      alert("Error submitting application. Please try again.");
    } finally {
      setIsSubmittingApp(false);
    }
  };

  // Simulate Recruiter Updating Status (For Testing the Complete Pipeline)
  const handleSimulateStatusChange = async (appId: string, newStatus: string, remarks: string) => {
    try {
      const res = await fetch(`/api/internships/applications/${appId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus, remarks, changedBy: "Recruiter" })
      });
      if (res.ok) {
        const data = await res.json();
        setInspectingApp(data.application);
        fetchApplications();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Filtered logic based on Active Tab, Search, City, Job Types, and Skill Portfolio
  const displayedOpps = opportunities.filter(opp => {
    const job = opp.job;
    const typeLower = job.employmentType.toLowerCase();

    // 1. Tab-Specific Filtering
    if (activeTab === "internships") {
      if (!typeLower.includes("intern")) return false;
    }

    // 2. Search query filter
    if (searchQuery.trim() !== "") {
      const q = searchQuery.toLowerCase();
      const matchesTitle = job.title.toLowerCase().includes(q);
      const matchesCompany = job.company.toLowerCase().includes(q);
      const matchesSkills = (job.requiredSkills || []).some((s: string) => s.toLowerCase().includes(q));
      if (!matchesTitle && !matchesCompany && !matchesSkills) return false;
    }

    // 3. City / Location filter
    if (selectedCity && selectedCity !== "All Cities") {
      if (!job.location.toLowerCase().includes(selectedCity.toLowerCase())) return false;
    }

    // 4. Job types checkboxes
    if (jobTypes.length > 0) {
      const matchesType = jobTypes.some(t => {
        if (t === 'remote' && job.location.toLowerCase() === 'remote') return true;
        if (t === 'internship' && typeLower.includes('intern')) return true;
        if (t === 'full-time' && typeLower.includes('full')) return true;
        if (t === 'part-time' && typeLower.includes('part')) return true;
        return false;
      });
      if (!matchesType) return false;
    }

    // 5. "Apply filter from skill portfolio" Toggle Logic:
    if (filterBySkillPortfolio) {
      if (verifiedSkills.length === 0) {
        return false;
      }

      const jobReqSkills: string[] = (job.requiredSkills || []).map((s: string) => s.toLowerCase().trim());
      
      const activePortfolioSkills = verifiedSkills.filter(v => 
        selectedVerifiedSkills.includes(v.skill.name) &&
        (v.score || 0) >= minProficiencyFilter
      );

      const hasMatchingSkill = activePortfolioSkills.some(v => {
        const studentSkillName = v.skill.name.toLowerCase().trim();
        return jobReqSkills.some(req => 
          req.includes(studentSkillName) || studentSkillName.includes(req)
        );
      });

      if (!hasMatchingSkill) return false;
    }

    return true;
  }).sort((a, b) => {
    if (activeTab === "matches") {
      return b.matchResult.matchScore - a.matchResult.matchScore;
    }
    // Real-time openings and internships: prioritize newest postings from companies first
    return new Date(b.job.postedAt).getTime() - new Date(a.job.postedAt).getTime();
  });

  const clearAllFilters = () => {
    setJobTypes([]);
    setSelectedCity("");
    setSearchQuery("");
    setFilterBySkillPortfolio(false);
    setMinProficiencyFilter(0);
    setSelectedVerifiedSkills(verifiedSkills.map(d => d.skill.name));
  };

  const indianCities = [
    "All Cities",
    "Bangalore",
    "Hyderabad",
    "Pune",
    "Gurgaon (Delhi-NCR)",
    "Chennai",
    "Mumbai",
    "Remote"
  ];

  const internshipCount = opportunities.filter(o => o.job.employmentType.toLowerCase().includes("intern")).length;

  // Track status stages definition
  const TRACK_STAGES = [
    { key: "Applied", label: "Application Submitted", desc: "Resume & Skill Profile received" },
    { key: "Under Review", label: "Under Review", desc: "Recruiter screening qualifications" },
    { key: "Shortlisted", label: "Shortlisted", desc: "Selected for interview rounds" },
    { key: "Interview", label: "Interview Scheduled", desc: "Technical / HR evaluation in progress" },
    { key: "Selected", label: "Offer / Selected", desc: "Offer letter generated" }
  ];

  const getStageIndex = (status: string) => {
    if (status === "Rejected") return -1;
    const idx = TRACK_STAGES.findIndex(s => s.key.toLowerCase() === status.toLowerCase());
    return idx >= 0 ? idx : 0;
  };

  // Filter applications by status tab
  const filteredApplications = myApplications.filter(app => {
    if (appFilter === "ALL") return true;
    if (appFilter === "ACTIVE") return app.currentStatus !== "Selected" && app.currentStatus !== "Rejected";
    if (appFilter === "SELECTED") return app.currentStatus === "Selected";
    if (appFilter === "REJECTED") return app.currentStatus === "Rejected";
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-16">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-200 pb-6">
        <div>
          <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-emerald-600 mb-1">
            <Sparkles className="w-4 h-4 text-emerald-500" />
            <span>Career Discovery & Application Lifecycle</span>
          </div>
          <h1 className="text-3xl font-extrabold text-[#0c2340]">Opportunities & Internships</h1>
          <p className="text-gray-500 mt-1 text-sm">
            Browse live company openings, submit internship applications, and track your multi-stage hiring status in real-time.
          </p>
        </div>

        {/* 4 Main Tab Switchers (Real-Time Openings, Internships, My Applications, Verified Matches) */}
        <div className="flex bg-gray-100 p-1 rounded-xl border border-gray-200 flex-wrap gap-1">
          
          {/* Tab 1: Real-Time Openings */}
          <button
            onClick={() => setActiveTab("openings")}
            className={`flex items-center space-x-2 px-4 py-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === "openings" 
                ? "bg-white text-[#0c2340] shadow-sm font-extrabold" 
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            <Globe className="w-4 h-4 text-blue-600" />
            <span>Real-Time Openings</span>
          </button>

          {/* Tab 2: Discover Internships Sub-Section */}
          <button
            onClick={() => setActiveTab("internships")}
            className={`flex items-center space-x-2 px-4 py-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === "internships" 
                ? "bg-white text-[#0c2340] shadow-sm font-extrabold" 
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            <GraduationCap className="w-4 h-4 text-purple-600" />
            <span>🎓 Discover Internships</span>
            <span className="ml-1 bg-purple-100 text-purple-800 text-[10px] px-2 py-0.5 rounded-full font-bold">
              {internshipCount}
            </span>
          </button>

          {/* Tab 3: Active Internship Lifecycle (Progress -> Mentor -> Completion) */}
          <button
            onClick={() => { setActiveTab("active_internship"); fetchActiveInternship(); }}
            className={`flex items-center space-x-2 px-4 py-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === "active_internship" 
                ? "bg-white text-[#0c2340] shadow-sm font-extrabold" 
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            <Rocket className="w-4 h-4 text-emerald-600" />
            <span>🚀 Active Internship Lifecycle</span>
            {activeInternship && (
              <span className="ml-1 bg-emerald-100 text-emerald-800 text-[10px] px-2 py-0.5 rounded-full font-bold">
                {Math.round(activeInternship.overallProgress)}%
              </span>
            )}
          </button>

          {/* Tab 4: Track Status of Application Sub-Section */}
          <button
            onClick={() => { setActiveTab("applications"); fetchApplications(); }}
            className={`flex items-center space-x-2 px-4 py-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === "applications" 
                ? "bg-white text-[#0c2340] shadow-sm font-extrabold" 
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            <Clock className="w-4 h-4 text-orange-600" />
            <span>📋 My Applications & Status</span>
            {myApplications.length > 0 && (
              <span className="ml-1 bg-orange-100 text-orange-800 text-[10px] px-2 py-0.5 rounded-full font-bold">
                {myApplications.length}
              </span>
            )}
          </button>

          {/* Tab 4: Verified Matches */}
          <button
            onClick={() => setActiveTab("matches")}
            className={`flex items-center space-x-2 px-4 py-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === "matches" 
                ? "bg-white text-[#0c2340] shadow-sm font-extrabold" 
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Verified Matches</span>
            {verifiedSkills.length > 0 && (
              <span className="ml-1 bg-emerald-100 text-emerald-800 text-[10px] px-2 py-0.5 rounded-full font-bold">
                {verifiedSkills.length} Tested
              </span>
            )}
          </button>

        </div>
      </div>

      {/* ======================================================================= */}
      {/* 1. TRACK STATUS SUBSECTION (MY APPLICATIONS)                           */}
      {/* ======================================================================= */}
      {activeTab === "applications" && (
        <div className="space-y-8 animate-in fade-in duration-200">
          
          {/* Sub-header & Status Filter Buttons */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white p-5 rounded-2xl border border-gray-200 shadow-xs gap-4">
            <div>
              <h2 className="text-xl font-bold text-[#0c2340] flex items-center">
                <Clock className="w-5 h-5 mr-2 text-orange-600" />
                <span>Track Application Status</span>
              </h2>
              <p className="text-xs text-gray-500 mt-0.5">
                Real-time status updates managed exclusively by employers and recruiters.
              </p>
            </div>

            {/* Status Pills */}
            <div className="flex bg-gray-100 p-1 rounded-lg border border-gray-200 text-xs font-bold">
              {[
                { id: "ALL", label: "All" },
                { id: "ACTIVE", label: "Active" },
                { id: "SELECTED", label: "Selected" },
                { id: "REJECTED", label: "Rejected" },
              ].map(f => (
                <button
                  key={f.id}
                  onClick={() => setAppFilter(f.id as any)}
                  className={`px-3 py-1.5 rounded-md transition-all cursor-pointer ${
                    appFilter === f.id ? "bg-white text-[#0c2340] shadow-xs font-black" : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {loadingApps ? (
            <div className="bg-white p-12 rounded-2xl border border-gray-200 text-center">
              <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
              <p className="text-gray-500 text-sm font-medium">Fetching your application records & recruiter milestones...</p>
            </div>
          ) : filteredApplications.length === 0 ? (
            <div className="bg-white p-12 rounded-2xl border border-gray-200 text-center space-y-4 max-w-xl mx-auto">
              <div className="w-16 h-16 bg-orange-50 text-orange-600 rounded-full flex items-center justify-center mx-auto">
                <BriefcaseIcon className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">No Internship Applications Found</h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                You haven't submitted any internship applications yet. Browse active openings and click <strong>"Apply for Internship"</strong> to submit your application with your verified skill profile!
              </p>
              <button
                onClick={() => setActiveTab("internships")}
                className="bg-[#27AE60] hover:bg-[#219653] text-white text-xs font-bold px-6 py-3 rounded uppercase tracking-wider transition-all shadow-xs cursor-pointer"
              >
                Browse Curated Internships
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Left Column (5 cols): Applications List */}
              <div className="lg:col-span-5 space-y-3">
                <div className="text-xs font-bold text-gray-500 uppercase tracking-wider px-1">
                  Submitted Applications ({filteredApplications.length})
                </div>

                {filteredApplications.map((app) => {
                  const isSelected = inspectingApp?.id === app.id;
                  const isRejected = app.currentStatus === "Rejected";
                  const isOffered = app.currentStatus === "Selected";

                  return (
                    <div
                      key={app.id}
                      onClick={() => setInspectingApp(app)}
                      className={`p-5 rounded-xl border transition-all cursor-pointer ${
                        isSelected 
                          ? "bg-blue-50/70 border-blue-400 shadow-sm ring-1 ring-blue-400" 
                          : "bg-white hover:border-gray-300 border-gray-200 shadow-xs"
                      }`}
                    >
                      <div className="flex justify-between items-start gap-2 mb-2">
                        <div>
                          <span className="text-[11px] font-bold text-blue-600 uppercase tracking-wider">
                            {app.job.company}
                          </span>
                          <h4 className="text-base font-bold text-gray-900 leading-snug">
                            {app.job.title}
                          </h4>
                        </div>

                        {/* Status Badge */}
                        <span className={`text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider shrink-0 ${
                          isOffered 
                            ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                            : isRejected 
                            ? "bg-red-100 text-red-800 border border-red-300"
                            : "bg-blue-100 text-blue-800 border border-blue-300"
                        }`}>
                          {app.currentStatus}
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-xs text-gray-500 pt-2 border-t border-gray-100">
                        <span>Applied on {new Date(app.appliedAt).toLocaleDateString()}</span>
                        <span className="font-semibold text-gray-700 flex items-center">
                          <span>View Timeline</span>
                          <ChevronRight className="w-3 h-3 ml-1" />
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Right Column (7 cols): Full Interactive Tracking Page & Timeline */}
              {inspectingApp && (
                <div className="lg:col-span-7 bg-white rounded-2xl border border-gray-200 shadow-sm p-6 sm:p-8 space-y-8 animate-in fade-in duration-200">
                  
                  {/* Top Header of Selected Application */}
                  <div className="border-b border-gray-100 pb-6">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-2">
                      <div>
                        <div className="flex items-center space-x-2 text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">
                          <span>Application ID:</span>
                          <span className="font-mono text-[#0c2340] bg-gray-100 px-2 py-0.5 rounded">
                            {inspectingApp.id}
                          </span>
                        </div>
                        <h3 className="text-2xl font-black text-[#0c2340]">
                          {inspectingApp.job.title}
                        </h3>
                        <div className="text-sm font-bold text-blue-600 mt-0.5">
                          {inspectingApp.job.company} • {inspectingApp.job.location}
                        </div>
                      </div>

                      {/* Current Status Pill */}
                      <div className="text-right">
                        <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                          Current Stage
                        </div>
                        <span className={`text-xs font-black px-3.5 py-1.5 rounded-full uppercase tracking-wider inline-block ${
                          inspectingApp.currentStatus === "Selected"
                            ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                            : inspectingApp.currentStatus === "Rejected"
                            ? "bg-red-100 text-red-800 border border-red-300"
                            : "bg-blue-100 text-blue-800 border border-blue-300"
                        }`}>
                          {inspectingApp.currentStatus}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* ============================================================ */}
                  {/* MULTI-STAGE PROGRESS STEPPER (Applied -> Under Review -> Shortlisted -> Interview -> Selected) */}
                  {/* ============================================================ */}
                  <div>
                    <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-6">
                      Recruitment Pipeline Progress
                    </h4>

                    {inspectingApp.currentStatus === "Rejected" ? (
                      <div className="p-4 bg-red-50 rounded-xl border border-red-200 flex items-start space-x-3 text-red-800">
                        <XCircle className="w-5 h-5 shrink-0 mt-0.5" />
                        <div className="text-xs leading-relaxed">
                          <div className="font-bold text-sm">Application Not Selected</div>
                          <p className="mt-1">
                            Thank you for your interest in {inspectingApp.job.company}. At this time the hiring team has decided to proceed with other candidates whose skill profiles closely match their urgent requirements.
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="relative">
                        {/* Connecting Line */}
                        <div className="hidden sm:block absolute top-4 left-6 right-6 h-0.5 bg-gray-200 z-0" />
                        
                        <div className="grid grid-cols-1 sm:grid-cols-5 gap-4 relative z-10">
                          {TRACK_STAGES.map((stage, idx) => {
                            const currentIdx = getStageIndex(inspectingApp.currentStatus);
                            const isCompleted = idx <= currentIdx;
                            const isCurrent = idx === currentIdx;

                            return (
                              <div key={stage.key} className="flex sm:flex-col items-center sm:text-center space-x-3 sm:space-x-0">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shrink-0 transition-all ${
                                  isCurrent
                                    ? "bg-blue-600 text-white ring-4 ring-blue-100 shadow-sm"
                                    : isCompleted
                                    ? "bg-[#27AE60] text-white"
                                    : "bg-gray-100 text-gray-400 border border-gray-300"
                                }`}>
                                  {isCompleted ? "✓" : idx + 1}
                                </div>

                                <div className="mt-2 sm:mt-2">
                                  <div className={`text-xs font-bold ${isCurrent ? "text-blue-600" : isCompleted ? "text-gray-900" : "text-gray-400"}`}>
                                    {stage.key}
                                  </div>
                                  <div className="text-[10px] text-gray-500 hidden sm:block mt-0.5 leading-tight">
                                    {stage.desc}
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* ============================================================ */}
                  {/* STATUS AUDIT HISTORY TIMELINE (from application_status_history) */}
                  {/* ============================================================ */}
                  <div className="border-t border-gray-100 pt-6 space-y-4">
                    <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider flex items-center">
                      <Clock className="w-4 h-4 mr-1.5 text-blue-600" />
                      <span>Status History & Official Remarks</span>
                    </h4>

                    <div className="space-y-4 border-l-2 border-blue-200 ml-2 pl-4 py-1">
                      {(inspectingApp.statusHistory || []).map((history: any, hIdx: number) => (
                        <div key={history.id || hIdx} className="relative">
                          <div className="absolute -left-[23px] top-1 w-3 h-3 rounded-full bg-blue-600 ring-4 ring-white" />
                          <div className="text-xs">
                            <div className="flex items-center space-x-2">
                              <span className="font-bold text-gray-900">{history.status}</span>
                              <span className="text-[10px] bg-gray-100 px-2 py-0.5 rounded text-gray-500 font-medium">
                                By {history.changedBy || "Recruiter"}
                              </span>
                              <span className="text-gray-400">•</span>
                              <span className="text-gray-400">{new Date(history.changedAt).toLocaleDateString()} at {new Date(history.changedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                            </div>
                            {history.remarks && (
                              <p className="text-gray-600 mt-1 bg-gray-50 p-2.5 rounded border border-gray-100 leading-relaxed text-xs">
                                {history.remarks}
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Recruiter Simulation Box (Allows User to Test Recruiter Status Shifts) */}
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-800 flex items-center">
                        <ShieldCheck className="w-4 h-4 mr-1 text-blue-600" />
                        Employer / Recruiter Test Console:
                      </span>
                      <span className="text-[10px] text-gray-400">Simulate recruitment actions</span>
                    </div>

                    <p className="text-[11px] text-gray-500">
                      As authorized by Mercer / Mettl RBAC, recruiters update candidate status in real-time:
                    </p>

                    <div className="flex flex-wrap gap-2 pt-1">
                      {["Under Review", "Shortlisted", "Interview", "Selected", "Rejected"].map(st => (
                        <button
                          key={st}
                          onClick={() => handleSimulateStatusChange(inspectingApp.id, st, `Status updated to ${st} following technical evaluation.`)}
                          className={`text-[11px] font-bold px-3 py-1.5 rounded transition-all cursor-pointer ${
                            inspectingApp.currentStatus === st 
                              ? "bg-slate-800 text-white" 
                              : "bg-white hover:bg-slate-200 border border-slate-300 text-slate-700"
                          }`}
                        >
                          Move to &quot;{st}&quot;
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Submitted Application Data Preview */}
                  <div className="border-t border-gray-100 pt-6 space-y-3 text-xs">
                    <h4 className="font-bold text-gray-700 uppercase tracking-wider">
                      Submitted Application Dossier
                    </h4>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-gray-600">
                      <div>
                        <strong>Applicant:</strong> {inspectingApp.fullName} ({inspectingApp.email})
                      </div>
                      <div>
                        <strong>Institution:</strong> {inspectingApp.institution}
                      </div>
                      <div>
                        <strong>Degree:</strong> {inspectingApp.degree} (Class of {inspectingApp.graduationYear})
                      </div>
                      <div>
                        <strong>Availability:</strong> {inspectingApp.availability}
                      </div>
                      <div className="sm:col-span-2">
                        <strong>Verified Skills Attached:</strong> {inspectingApp.relevantSkills || "JavaScript, React, SQL"}
                      </div>
                      {inspectingApp.coverLetter && (
                        <div className="sm:col-span-2 bg-gray-50 p-3 rounded border border-gray-100">
                          <strong className="block text-gray-800 mb-1">Cover Letter Statement:</strong>
                          <p className="text-gray-600 italic leading-relaxed">{inspectingApp.coverLetter}</p>
                        </div>
                      )}
                    </div>
                  </div>

                </div>
              )}

            </div>
          )}

        </div>
      )}

      {/* ======================================================================= */}
      {/* 2. ACTIVE INTERNSHIP LIFECYCLE SUBSECTION                               */}
      {/* (Progress Tracking -> Mentor Feedback -> Completion Record)            */}
      {/* ======================================================================= */}
      {activeTab === "active_internship" && (
        <div className="space-y-8 animate-in fade-in duration-200">
          
          {loadingActiveInternship && !activeInternship ? (
            <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center text-gray-500">
              <RotateCcw className="w-8 h-8 animate-spin mx-auto mb-3 text-emerald-600" />
              <p className="font-semibold text-sm">Loading active internship lifecycle records...</p>
            </div>
          ) : !activeInternship ? (
            <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center text-gray-500">
              <p>No active internship currently assigned. Apply to internships to begin tracking.</p>
            </div>
          ) : (
            <>
              {/* Internship Top Banner & Stats */}
              <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                <div>
                  <div className="flex items-center space-x-2 text-xs font-bold text-emerald-600 uppercase tracking-wider mb-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span>{activeInternship.status === "COMPLETED" ? "Internship Completed & Certified" : "Ongoing Verified Internship"}</span>
                    <span>•</span>
                    <span>{activeInternship.duration || "8 Weeks Duration"}</span>
                  </div>
                  <h2 className="text-2xl font-black text-[#0c2340]">
                    {activeInternship.roleTitle}
                  </h2>
                  <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-gray-600 mt-2">
                    <span className="flex items-center text-blue-700 bg-blue-50 px-2.5 py-1 rounded-md">
                      <Building className="w-3.5 h-3.5 mr-1" />
                      {activeInternship.company}
                    </span>
                    <span className="flex items-center text-gray-500">
                      <MapPin className="w-3.5 h-3.5 mr-1" />
                      {activeInternship.location}
                    </span>
                    <span className="flex items-center text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md">
                      <Award className="w-3.5 h-3.5 mr-1" />
                      Stipend: {activeInternship.stipend}
                    </span>
                    <span className="flex items-center text-purple-700 bg-purple-50 px-2.5 py-1 rounded-md">
                      <UserCheck className="w-3.5 h-3.5 mr-1" />
                      Mentor: {activeInternship.mentorName} ({activeInternship.mentorRole})
                    </span>
                  </div>
                </div>

                {/* Overall Progress Gauge */}
                <div className="flex items-center gap-6 bg-gray-50 border border-gray-200/80 p-4 rounded-xl shrink-0 w-full sm:w-auto">
                  <div className="relative w-16 h-16 flex items-center justify-center shrink-0">
                    <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 36 36">
                      <path
                        className="text-gray-200"
                        strokeWidth="3.5"
                        stroke="currentColor"
                        fill="none"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                      <path
                        className={`${activeInternship.overallProgress >= 100 ? "text-emerald-500" : "text-blue-600"}`}
                        strokeDasharray={`${activeInternship.overallProgress}, 100`}
                        strokeWidth="3.5"
                        strokeLinecap="round"
                        stroke="currentColor"
                        fill="none"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                    </svg>
                    <div className="absolute text-center">
                      <span className="text-sm font-black text-gray-900">{Math.round(activeInternship.overallProgress)}%</span>
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Internship Lifecycle</div>
                    <div className="text-sm font-extrabold text-[#0c2340]">Overall Completion</div>
                    <div className="text-xs text-gray-500 mt-0.5">
                      {activeInternship.overallProgress >= 100 ? "Ready for Certification" : "Active Sprint Deliverables"}
                    </div>
                  </div>
                </div>
              </div>

              {/* 3 Unified Lifecycle Tabs: Progress Tracking -> Mentor Feedback -> Completion Record */}
              <div className="flex border-b border-gray-200 bg-white px-4 rounded-xl shadow-xs gap-2">
                <button
                  onClick={() => setInternshipSubTab("progress")}
                  className={`flex items-center space-x-2 py-4 px-4 border-b-2 font-bold text-xs transition-colors cursor-pointer ${
                    internshipSubTab === "progress"
                      ? "border-blue-600 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-800"
                  }`}
                >
                  <TrendingUp className="w-4 h-4" />
                  <span>1. Progress Tracking</span>
                  <span className="bg-blue-100 text-blue-800 text-[10px] px-2 py-0.5 rounded-full font-bold">
                    {Math.round(activeInternship.overallProgress)}%
                  </span>
                </button>

                <button
                  onClick={() => setInternshipSubTab("mentor")}
                  className={`flex items-center space-x-2 py-4 px-4 border-b-2 font-bold text-xs transition-colors cursor-pointer ${
                    internshipSubTab === "mentor"
                      ? "border-purple-600 text-purple-600"
                      : "border-transparent text-gray-500 hover:text-gray-800"
                  }`}
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>2. Mentor Feedback</span>
                  <span className="bg-purple-100 text-purple-800 text-[10px] px-2 py-0.5 rounded-full font-bold">
                    {activeInternship.mentorFeedbacks?.length || 1} Reviews
                  </span>
                </button>

                <button
                  onClick={() => setInternshipSubTab("completion")}
                  className={`flex items-center space-x-2 py-4 px-4 border-b-2 font-bold text-xs transition-colors cursor-pointer ${
                    internshipSubTab === "completion"
                      ? "border-emerald-600 text-emerald-600"
                      : "border-transparent text-gray-500 hover:text-gray-800"
                  }`}
                >
                  <FileBadge className="w-4 h-4" />
                  <span>3. Completion Record & Certification</span>
                  {activeInternship.completionRecord && (
                    <span className="bg-emerald-100 text-emerald-800 text-[10px] px-2 py-0.5 rounded-full font-bold">
                      Verified
                    </span>
                  )}
                </button>
              </div>

              {/* ------------------------------------------------------------- */}
              {/* SUBSECTION 1: PROGRESS TRACKING                               */}
              {/* ------------------------------------------------------------- */}
              {internshipSubTab === "progress" && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                  
                  {/* Left (7 cols): Milestones & Task Deliverables Checklist */}
                  <div className="lg:col-span-7 space-y-6">
                    <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs space-y-6">
                      <div className="flex justify-between items-center pb-4 border-b border-gray-100">
                        <div>
                          <h3 className="text-lg font-black text-[#0c2340]">Internship Milestones & Tasks</h3>
                          <p className="text-xs text-gray-500 mt-0.5">
                            Click tasks to mark deliverables complete. Milestone & overall progress update dynamically.
                          </p>
                        </div>
                      </div>

                      {/* Milestones List */}
                      <div className="space-y-6">
                        {activeInternship.milestones?.map((milestone: any, mIdx: number) => {
                          const isDone = milestone.percentage >= 100;
                          const inProgress = milestone.percentage > 0 && milestone.percentage < 100;

                          return (
                            <div key={milestone.id} className="border border-gray-200 rounded-xl p-5 hover:border-gray-300 transition-all bg-gray-50/50">
                              
                              <div className="flex items-start justify-between gap-4 mb-3">
                                <div className="flex items-center space-x-3">
                                  <div className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs ${
                                    isDone 
                                      ? "bg-emerald-100 text-emerald-700" 
                                      : inProgress 
                                      ? "bg-blue-100 text-blue-700" 
                                      : "bg-gray-200 text-gray-500"
                                  }`}>
                                    {isDone ? <CheckCircle2 className="w-4 h-4" /> : mIdx + 1}
                                  </div>
                                  <div>
                                    <h4 className="text-sm font-bold text-gray-900">{milestone.title}</h4>
                                    <p className="text-xs text-gray-500">{milestone.description}</p>
                                  </div>
                                </div>

                                <div className="text-right shrink-0">
                                  <span className={`text-xs font-black px-2.5 py-1 rounded-full ${
                                    isDone 
                                      ? "bg-emerald-100 text-emerald-800" 
                                      : inProgress 
                                      ? "bg-blue-100 text-blue-800" 
                                      : "bg-gray-100 text-gray-600"
                                  }`}>
                                    {Math.round(milestone.percentage)}%
                                  </span>
                                </div>
                              </div>

                              {/* Progress bar */}
                              <div className="w-full bg-gray-200 rounded-full h-2 mb-4 overflow-hidden">
                                <div 
                                  className={`h-2 rounded-full transition-all duration-300 ${
                                    isDone ? "bg-emerald-500" : inProgress ? "bg-blue-600" : "bg-gray-300"
                                  }`} 
                                  style={{ width: `${milestone.percentage}%` }}
                                ></div>
                              </div>

                              {/* Nested Tasks Checklist */}
                              <div className="space-y-2 pt-2 border-t border-gray-200/60">
                                <div className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">
                                  Assigned Tasks ({milestone.tasks?.filter((t: any) => t.isCompleted).length} / {milestone.tasks?.length})
                                </div>
                                {milestone.tasks?.map((task: any) => (
                                  <div 
                                    key={task.id}
                                    onClick={() => handleToggleTask(task.id, task.isCompleted)}
                                    className={`flex items-start justify-between p-2.5 rounded-lg border text-xs cursor-pointer transition-all ${
                                      task.isCompleted 
                                        ? "bg-emerald-50/70 border-emerald-200 text-gray-700" 
                                        : "bg-white border-gray-200 hover:border-blue-300 text-gray-800"
                                    }`}
                                  >
                                    <div className="flex items-start space-x-2.5">
                                      <button 
                                        type="button"
                                        disabled={isTogglingTask === task.id}
                                        className="mt-0.5 text-blue-600 shrink-0"
                                      >
                                        {task.isCompleted ? (
                                          <CheckSquare className="w-4 h-4 text-emerald-600" />
                                        ) : (
                                          <Square className="w-4 h-4 text-gray-400" />
                                        )}
                                      </button>
                                      <span className={task.isCompleted ? "line-through text-gray-500 font-medium" : "font-semibold"}>
                                        {task.title}
                                      </span>
                                    </div>
                                    {task.dueDate && !task.isCompleted && (
                                      <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded ml-2 shrink-0">
                                        Due {task.dueDate}
                                      </span>
                                    )}
                                  </div>
                                ))}
                              </div>

                            </div>
                          );
                        })}
                      </div>

                    </div>
                  </div>

                  {/* Right (5 cols): Weekly Updates & Work Evidence Log */}
                  <div className="lg:col-span-5 space-y-6">
                    <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs space-y-6">
                      
                      <div className="flex justify-between items-center pb-4 border-b border-gray-100">
                        <div>
                          <h3 className="text-lg font-black text-[#0c2340]">Weekly Updates & Evidence</h3>
                          <p className="text-xs text-gray-500 mt-0.5">
                            Submit your weekly sprint log, merged PRs, and live code deliverables.
                          </p>
                        </div>
                        <button
                          onClick={() => setShowWeeklyUpdateModal(true)}
                          className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-3 py-2 rounded-lg flex items-center shadow-xs cursor-pointer"
                        >
                          <Send className="w-3.5 h-3.5 mr-1.5" />
                          <span>Submit Update</span>
                        </button>
                      </div>

                      {/* Weekly Updates Timeline */}
                      <div className="space-y-4">
                        {activeInternship.weeklyUpdates?.map((update: any) => (
                          <div key={update.id} className="p-4 rounded-xl border border-gray-200 bg-gray-50/70 hover:bg-white hover:border-gray-300 transition-all space-y-2">
                            <div className="flex justify-between items-center">
                              <span className="text-xs font-extrabold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded">
                                {update.weekTitle || `Week ${update.weekNumber}`}
                              </span>
                              <span className="text-[11px] text-gray-400 flex items-center">
                                <Clock className="w-3 h-3 mr-1" />
                                {new Date(update.submittedAt).toLocaleDateString()}
                              </span>
                            </div>

                            <p className="text-xs text-gray-700 leading-relaxed font-medium">
                              {update.summary}
                            </p>

                            {update.submittedWorkUrl && (
                              <div className="pt-2 border-t border-gray-200/60 flex items-center justify-between text-xs">
                                <span className="text-gray-500 font-semibold text-[11px]">Artifact / PR:</span>
                                <a 
                                  href={update.submittedWorkUrl} 
                                  target="_blank" 
                                  rel="noreferrer"
                                  className="text-blue-600 hover:underline flex items-center font-bold text-[11px]"
                                >
                                  <span>View Submitted Work</span>
                                  <ExternalLink className="w-3 h-3 ml-1" />
                                </a>
                              </div>
                            )}

                            {update.blockers && (
                              <div className="p-2 bg-amber-50 rounded border border-amber-200 text-[11px] text-amber-800">
                                <strong>Blocker / Risk:</strong> {update.blockers}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>

                    </div>
                  </div>

                </div>
              )}

              {/* ------------------------------------------------------------- */}
              {/* SUBSECTION 2: MENTOR FEEDBACK                                 */}
              {/* ------------------------------------------------------------- */}
              {internshipSubTab === "mentor" && (
                <div className="space-y-6">
                  
                  {/* Action Banner for Simulator */}
                  <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-2xl p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                      <div className="flex items-center space-x-2 text-xs font-bold text-purple-700 uppercase tracking-wider mb-1">
                        <Award className="w-4 h-4" />
                        <span>Corporate Mentor Review Console</span>
                      </div>
                      <h3 className="text-lg font-black text-[#0c2340]">Official Mentor Evaluation & Feedback</h3>
                      <p className="text-xs text-gray-600 mt-0.5">
                        Mentor evaluations feed verified proof directly into your student skill profile and portfolio.
                      </p>
                    </div>

                    <button
                      onClick={() => setShowMentorFeedbackModal(true)}
                      className="bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold px-4 py-2.5 rounded-lg flex items-center shadow-xs cursor-pointer shrink-0"
                    >
                      <Sparkles className="w-3.5 h-3.5 mr-1.5" />
                      <span>Simulate Mentor Evaluation</span>
                    </button>
                  </div>

                  {/* Mentor Feedback Cards */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    
                    {/* Left (8 cols): Feedback details */}
                    <div className="lg:col-span-8 space-y-6">
                      {activeInternship.mentorFeedbacks?.map((feedback: any) => {
                        let strengths: string[] = [];
                        let improvements: string[] = [];
                        try { strengths = JSON.parse(feedback.strengths); } catch (e) { strengths = [feedback.strengths]; }
                        try { improvements = JSON.parse(feedback.improvementAreas); } catch (e) { improvements = [feedback.improvementAreas]; }

                        return (
                          <div key={feedback.id} className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8 shadow-xs space-y-6">
                            
                            {/* Reviewer Header */}
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-4 border-b border-gray-100 gap-2">
                              <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-sm">
                                  {feedback.mentorName.charAt(0)}
                                </div>
                                <div>
                                  <h4 className="text-base font-bold text-gray-900">{feedback.mentorName}</h4>
                                  <p className="text-xs text-gray-500">{feedback.mentorRole || "Senior Engineering Mentor"} • {activeInternship.company}</p>
                                </div>
                              </div>
                              <span className="text-xs text-gray-400">
                                Evaluated on {new Date(feedback.reviewDate).toLocaleDateString()}
                              </span>
                            </div>

                            {/* General Feedback Quote */}
                            <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1">
                                Performance Evaluation:
                              </span>
                              <p className="text-sm text-gray-800 leading-relaxed italic">
                                "{feedback.generalFeedback}"
                              </p>
                            </div>

                            {/* Strengths & Improvement Areas Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="bg-emerald-50/70 border border-emerald-200 rounded-xl p-4 space-y-2">
                                <div className="text-xs font-black text-emerald-800 uppercase tracking-wider flex items-center">
                                  <CheckCircle2 className="w-4 h-4 mr-1.5 text-emerald-600" />
                                  <span>Demonstrated Strengths</span>
                                </div>
                                <ul className="text-xs text-emerald-950 space-y-1.5 list-disc list-inside">
                                  {strengths.map((str, sIdx) => (
                                    <li key={sIdx} className="leading-snug">{str}</li>
                                  ))}
                                </ul>
                              </div>

                              <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-4 space-y-2">
                                <div className="text-xs font-black text-amber-800 uppercase tracking-wider flex items-center">
                                  <AlertTriangle className="w-4 h-4 mr-1.5 text-amber-600" />
                                  <span>Areas of Improvement</span>
                                </div>
                                <ul className="text-xs text-amber-950 space-y-1.5 list-disc list-inside">
                                  {improvements.map((imp, iIdx) => (
                                    <li key={iIdx} className="leading-snug">{imp}</li>
                                  ))}
                                </ul>
                              </div>
                            </div>

                          </div>
                        );
                      })}
                    </div>

                    {/* Right (4 cols): Skill Evaluation Radar/List feeding into verified skill profile */}
                    <div className="lg:col-span-4 space-y-6">
                      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs space-y-4">
                        <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                          <div>
                            <h4 className="text-sm font-black text-[#0c2340]">Mentor Skill Ratings</h4>
                            <p className="text-[11px] text-gray-500">Verified into Student Skill Profile</p>
                          </div>
                          <ShieldCheck className="w-5 h-5 text-emerald-600" />
                        </div>

                        <div className="space-y-3">
                          {activeInternship.mentorFeedbacks?.[0]?.skillEvaluations?.map((evalItem: any) => (
                            <div key={evalItem.id} className="p-3 bg-gray-50 rounded-xl border border-gray-200 space-y-2">
                              <div className="flex justify-between items-center">
                                <span className="text-xs font-bold text-gray-900">{evalItem.skillName}</span>
                                <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-blue-100 text-blue-800">
                                  {evalItem.proficiencyLevel}
                                </span>
                              </div>
                              <div className="flex justify-between items-center text-[11px] text-gray-500">
                                <span>Assessed Score</span>
                                <span className="font-extrabold text-emerald-600">{Math.round(evalItem.scoreImpact)}%</span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-1.5 overflow-hidden">
                                <div 
                                  className="h-1.5 bg-emerald-500 rounded-full" 
                                  style={{ width: `${evalItem.scoreImpact}%` }}
                                ></div>
                              </div>
                              <div className="text-[10px] text-emerald-700 flex items-center pt-1 font-semibold">
                                <CheckCircle2 className="w-3 h-3 mr-1" />
                                <span>Verified by {activeInternship.mentorName}</span>
                              </div>
                            </div>
                          ))}
                        </div>

                        <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-xs text-blue-900 leading-relaxed font-medium">
                          <strong>Automatic Profile Sync:</strong> Ratings assigned by verified company mentors update your master skill profile and raise your recruiter visibility.
                        </div>
                      </div>
                    </div>

                  </div>

                </div>
              )}

              {/* ------------------------------------------------------------- */}
              {/* SUBSECTION 3: COMPLETION RECORD & CERTIFICATION               */}
              {/* ------------------------------------------------------------- */}
              {internshipSubTab === "completion" && (
                <div className="space-y-6">
                  
                  {activeInternship.completionRecord ? (
                    /* Finalized Certificate & Record View */
                    <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm space-y-8">
                      
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b border-gray-100">
                        <div>
                          <div className="flex items-center space-x-2 text-xs font-bold text-emerald-600 uppercase tracking-wider mb-1">
                            <CheckCircle2 className="w-4 h-4" />
                            <span>Official Completion Credential</span>
                          </div>
                          <h3 className="text-2xl font-black text-[#0c2340]">
                            Verified Internship Certificate & Record
                          </h3>
                        </div>

                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => setShowCertificateModal(true)}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-2.5 rounded-lg flex items-center shadow-xs cursor-pointer"
                          >
                            <Eye className="w-4 h-4 mr-1.5" />
                            <span>View Full Certificate</span>
                          </button>
                          <Link
                            href="/student/portfolio"
                            className="border border-gray-300 hover:bg-gray-50 text-gray-700 text-xs font-bold px-4 py-2.5 rounded-lg flex items-center cursor-pointer"
                          >
                            <span>Open in Portfolio</span>
                            <ChevronRight className="w-4 h-4 ml-1" />
                          </Link>
                        </div>
                      </div>

                      {/* Summary Cards */}
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                          <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Final Evaluation</div>
                          <div className="text-2xl font-black text-emerald-600 mt-1">
                            {activeInternship.completionRecord.finalRating} <span className="text-xs text-gray-400 font-normal">/ 5.0</span>
                          </div>
                        </div>

                        <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                          <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Credential ID</div>
                          <div className="text-sm font-mono font-bold text-gray-800 mt-2">
                            {activeInternship.completionRecord.certificateNumber}
                          </div>
                        </div>

                        <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                          <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Verification Status</div>
                          <div className="text-sm font-bold text-emerald-700 flex items-center mt-2">
                            <ShieldCheck className="w-4 h-4 mr-1 text-emerald-600" />
                            <span>Verified by {activeInternship.company}</span>
                          </div>
                        </div>

                        <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                          <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Date Issued</div>
                          <div className="text-sm font-bold text-gray-800 mt-2">
                            {new Date(activeInternship.completionRecord.issuedAt).toLocaleDateString()}
                          </div>
                        </div>
                      </div>

                      {/* Certificate Visual Preview Card */}
                      <div className="relative border-4 border-double border-amber-700/40 rounded-2xl p-8 sm:p-12 bg-gradient-to-b from-amber-50/40 via-white to-amber-50/20 text-center space-y-6 shadow-inner">
                        <div className="w-14 h-14 mx-auto rounded-full bg-amber-100 border-2 border-amber-400 flex items-center justify-center text-amber-800">
                          <Award className="w-7 h-7" />
                        </div>

                        <div className="space-y-1">
                          <div className="text-xs font-black tracking-widest text-amber-900 uppercase">
                            Certificate of Internship Completion
                          </div>
                          <h4 className="text-2xl sm:text-3xl font-serif font-black text-gray-900">
                            Arjun Sharma
                          </h4>
                          <p className="text-xs text-gray-600 max-w-xl mx-auto pt-2">
                            Has successfully completed the engineering curriculum and deliverables for the role of <strong>{activeInternship.roleTitle}</strong> at <strong>{activeInternship.company}</strong> with an overall performance rating of <strong>{activeInternship.completionRecord.finalRating} / 5.0</strong>.
                          </p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 max-w-md mx-auto pt-6 border-t border-amber-200/80 text-left gap-4 text-xs">
                          <div>
                            <span className="text-[10px] font-bold uppercase text-gray-400 block">Mentor Signature</span>
                            <span className="font-bold text-gray-800">{activeInternship.mentorName}</span>
                            <span className="text-[10px] text-gray-500 block">{activeInternship.mentorRole}</span>
                          </div>
                          <div className="sm:text-right">
                            <span className="text-[10px] font-bold uppercase text-gray-400 block">Cryptographic Hash</span>
                            <span className="font-mono text-[10px] text-gray-600 break-all">{activeInternship.completionRecord.verificationHash}</span>
                          </div>
                        </div>
                      </div>

                    </div>
                  ) : (
                    /* Finalize Internship CTA if not completed yet */
                    <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm text-center max-w-2xl mx-auto space-y-6">
                      <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                        <Award className="w-8 h-8" />
                      </div>

                      <div className="space-y-2">
                        <h3 className="text-2xl font-black text-[#0c2340]">Ready for Completion & Certification?</h3>
                        <p className="text-xs text-gray-500 max-w-md mx-auto leading-relaxed">
                          Your milestones are currently at <strong>{Math.round(activeInternship.overallProgress)}%</strong>. When ready, finalize the internship to generate your verified digital certificate and publish it to your Student Portfolio.
                        </p>
                      </div>

                      <div className="pt-2">
                        <button
                          onClick={handleFinalizeInternship}
                          disabled={isFinalizingInternship}
                          className="bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold text-xs px-8 py-3 rounded-xl shadow-md transition-all cursor-pointer"
                        >
                          {isFinalizingInternship ? "Generating Verified Certificate..." : "Finalize Internship & Issue Certificate"}
                        </button>
                      </div>
                    </div>
                  )}

                </div>
              )}

            </>
          )}

        </div>
      )}

      {/* ======================================================================= */}
      {/* 2. REAL-TIME OPENINGS & INTERNSHIPS DISCOVERY FEED                     */}
      {/* ======================================================================= */}
      {activeTab !== "applications" && activeTab !== "active_internship" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT COLUMN: FILTERS & SKILL PORTFOLIO FILTER */}
          <div className="lg:col-span-4 space-y-6">
            
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 space-y-6">
              
              <div className="flex justify-between items-center pb-3 border-b border-gray-100">
                <h3 className="font-bold text-[#0c2340] text-sm uppercase tracking-wider flex items-center">
                  <Filter className="w-4 h-4 mr-2 text-[#27AE60]" />
                  Filters
                </h3>
                {(filterBySkillPortfolio || jobTypes.length > 0 || selectedCity || searchQuery) && (
                  <button 
                    onClick={clearAllFilters}
                    className="text-xs font-semibold text-red-600 hover:underline flex items-center space-x-1 cursor-pointer"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Reset All</span>
                  </button>
                )}
              </div>

              {/* Filter by Skill Portfolio Toggle */}
              <div className="p-4 rounded-xl border-2 border-emerald-500/40 bg-gradient-to-br from-emerald-50/50 via-teal-50/20 to-white space-y-4">
                
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-start space-x-2.5">
                    <div className="w-8 h-8 rounded-lg bg-[#27AE60] text-white flex items-center justify-center shrink-0 shadow-xs">
                      <Award className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-[#0c2340] leading-tight">
                        Filter by Skill Portfolio
                      </h4>
                      <p className="text-[11px] text-gray-500 mt-0.5">
                        Match jobs against your verified test results
                      </p>
                    </div>
                  </div>

                  <label className="relative inline-flex items-center cursor-pointer shrink-0 mt-0.5">
                    <input 
                      type="checkbox" 
                      checked={filterBySkillPortfolio}
                      onChange={(e) => setFilterBySkillPortfolio(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#27AE60]"></div>
                  </label>
                </div>

                {filterBySkillPortfolio && (
                  <div className="space-y-4 pt-3 border-t border-emerald-200/60 animate-in fade-in duration-200">
                    {verifiedSkills.length === 0 ? (
                      <div className="p-3 bg-amber-50 rounded-lg border border-amber-200 text-xs text-amber-800 space-y-2">
                        <p className="font-semibold">No verified test results found yet!</p>
                        <p className="text-[11px] text-amber-700">Take a test in the Skill Assessment section so our filter can match jobs to your proven scores.</p>
                        <Link 
                          href="/student/skills"
                          className="inline-flex items-center space-x-1 text-xs font-bold text-amber-900 underline"
                        >
                          <span>Take a Skill Test</span>
                          <ChevronRight className="w-3 h-3" />
                        </Link>
                      </div>
                    ) : (
                      <>
                        <div>
                          <label className="block text-xs font-bold text-[#0c2340] mb-2 uppercase tracking-wider">
                            Select Tested Skills:
                          </label>
                          <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                            {verifiedSkills.map((item) => {
                              const isChecked = selectedVerifiedSkills.includes(item.skill.name);
                              const sc = Math.round(item.score || 0);

                              return (
                                <label 
                                  key={item.id}
                                  className={`flex items-center justify-between p-2.5 rounded-lg border cursor-pointer transition-all text-xs ${
                                    isChecked 
                                      ? "bg-white border-emerald-400 shadow-xs ring-1 ring-emerald-400" 
                                      : "bg-gray-50 border-gray-200 opacity-70"
                                  }`}
                                >
                                  <div className="flex items-center space-x-2">
                                    <input 
                                      type="checkbox"
                                      checked={isChecked}
                                      onChange={() => toggleVerifiedSkill(item.skill.name)}
                                      className="rounded text-[#27AE60] focus:ring-[#27AE60] w-3.5 h-3.5"
                                    />
                                    <span className="font-bold text-gray-800">{item.skill.name}</span>
                                  </div>

                                  <div className="flex items-center space-x-2">
                                    <span className="font-black text-[#0c2340]">{sc}%</span>
                                    <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded border uppercase ${
                                      sc >= 75 ? 'bg-emerald-100 text-emerald-800 border-emerald-300' : sc >= 50 ? 'bg-blue-100 text-blue-800 border-blue-300' : 'bg-amber-100 text-amber-800 border-amber-300'
                                    }`}>
                                      {sc >= 75 ? 'Exp' : sc >= 50 ? 'Inter' : 'Beg'}
                                    </span>
                                  </div>
                                </label>
                              );
                            })}
                          </div>
                        </div>

                        <div className="pt-2">
                          <div className="flex justify-between text-xs font-semibold mb-1">
                            <span className="text-gray-600">Min. Test Proficiency</span>
                            <span className="font-bold text-[#27AE60]">{minProficiencyFilter}%+</span>
                          </div>
                          <input 
                            type="range"
                            min="0"
                            max="80"
                            step="10"
                            value={minProficiencyFilter}
                            onChange={(e) => setMinProficiencyFilter(Number(e.target.value))}
                            className="w-full accent-[#27AE60] cursor-pointer"
                          />
                          <div className="flex justify-between text-[10px] text-gray-400 font-medium">
                            <span>Any Score (0%)</span>
                            <span>Intermediate (50%)</span>
                            <span>Experienced (75%)</span>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                )}
              </div>

              {/* Keyword Search */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-2 uppercase tracking-wider">
                  Keyword / Role Search
                </label>
                <div className="relative">
                  <Search className="absolute left-3.5 top-3 h-4 w-4 text-gray-400" />
                  <input 
                    type="text" 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="e.g. Front-End, React, Python..." 
                    className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg text-xs focus:ring-1 focus:ring-[#27AE60] focus:border-[#27AE60]" 
                  />
                </div>
              </div>

              {/* Location (Indian Cities) */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-2 uppercase tracking-wider">
                  Location (Indian Cities)
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3.5 top-3 h-4 w-4 text-gray-400" />
                  <select
                    value={selectedCity}
                    onChange={(e) => setSelectedCity(e.target.value)}
                    className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg text-xs bg-white focus:ring-1 focus:ring-[#27AE60] focus:border-[#27AE60]"
                  >
                    {indianCities.map(city => (
                      <option key={city} value={city}>{city}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Job Types (Multi-select) */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-3 uppercase tracking-wider">
                  Job Type & Mode
                </label>
                <div className="space-y-2.5">
                  {[
                    { id: 'full-time', label: 'Full Time' },
                    { id: 'internship', label: 'Internship' },
                    { id: 'remote', label: 'Remote Only' },
                    { id: 'part-time', label: 'Part Time' },
                  ].map(type => (
                    <label key={type.id} className="flex items-center space-x-2.5 cursor-pointer group">
                      <input 
                        type="checkbox" 
                        checked={jobTypes.includes(type.id)}
                        onChange={() => toggleJobType(type.id)}
                        className="rounded border-gray-300 text-[#27AE60] focus:ring-[#27AE60] w-4 h-4 cursor-pointer"
                      />
                      <span className="text-xs font-medium text-gray-700 group-hover:text-gray-900">{type.label}</span>
                    </label>
                  ))}
                </div>
              </div>

            </div>

          </div>

          {/* RIGHT COLUMN: JOB FEED */}
          <div className="lg:col-span-8 space-y-6">
            
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white p-4.5 rounded-xl border border-gray-200 shadow-xs gap-3">
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-base font-bold text-[#0c2340] flex items-center">
                    <span>
                      {activeTab === "internships" 
                        ? "🎓 Curated Student Internships" 
                        : activeTab === "matches" 
                        ? "Your Verified Matches" 
                        : "Real-Time Company Openings"}
                    </span>
                    <span className="ml-2 bg-blue-100 text-blue-800 text-xs px-2.5 py-0.5 rounded-full font-extrabold">
                      {displayedOpps.length} Available
                    </span>
                  </h2>

                  {/* Verification Badge for Company View */}
                  {currentUserRole === "COMPANY" && companyProfile && (
                    <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full flex items-center gap-1 ${
                      companyProfile.verificationStatus === "VERIFIED"
                        ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                        : "bg-amber-100 text-amber-800 border border-amber-300"
                    }`}>
                      {companyProfile.verificationStatus === "VERIFIED" ? (
                        <>
                          <ShieldCheck className="w-3 h-3 text-emerald-600" />
                          <span>Verified Company</span>
                        </>
                      ) : (
                        <>
                          <ShieldAlert className="w-3 h-3 text-amber-600" />
                          <span>Verification Pending</span>
                        </>
                      )}
                    </span>
                  )}
                </div>

                {filterBySkillPortfolio && (
                  <div className="flex items-center space-x-1.5 text-xs text-emerald-700 font-medium mt-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Filtered using your Verified Skill Portfolio ({selectedVerifiedSkills.join(", ") || "All Skills"})</span>
                  </div>
                )}
              </div>

              {/* Right Side Header Controls: Post Internship Button & Role Simulator */}
              <div className="flex items-center gap-2.5 flex-wrap">
                {/* Dev / Testing Role Simulator */}
                <div className="flex items-center bg-gray-100 rounded-lg p-1 text-[11px] font-semibold text-gray-600 border border-gray-200">
                  <span className="px-2 text-gray-400">Role View:</span>
                  <button
                    onClick={() => handleRoleSimulationChange("STUDENT")}
                    className={`px-2 py-1 rounded transition-all cursor-pointer ${
                      simulationRole === "STUDENT" ? "bg-white text-gray-900 shadow-xs font-bold" : "hover:text-gray-900"
                    }`}
                  >
                    Student
                  </button>
                  <button
                    onClick={() => handleRoleSimulationChange("COMPANY_VERIFIED")}
                    className={`px-2 py-1 rounded transition-all cursor-pointer ${
                      simulationRole === "COMPANY_VERIFIED" ? "bg-emerald-600 text-white shadow-xs font-bold" : "hover:text-gray-900"
                    }`}
                  >
                    Verified Company
                  </button>
                  <button
                    onClick={() => handleRoleSimulationChange("COMPANY_UNVERIFIED")}
                    className={`px-2 py-1 rounded transition-all cursor-pointer ${
                      simulationRole === "COMPANY_UNVERIFIED" ? "bg-amber-500 text-white shadow-xs font-bold" : "hover:text-gray-900"
                    }`}
                  >
                    Unverified
                  </button>
                </div>

                {/* POST INTERNSHIP BUTTON (Shown strictly for COMPANY or INSTITUTE) */}
                {(currentUserRole === "COMPANY" || currentUserRole === "INSTITUTE" || currentUserRole === "ADMIN") && (
                  <button
                    onClick={handleOpenPostInternship}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-2.5 rounded-lg flex items-center gap-1.5 shadow-sm transition-all hover:shadow cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Post Internship</span>
                  </button>
                )}
              </div>
            </div>

            {loading ? (
              <div className="bg-white p-12 rounded-2xl border border-gray-200 text-center">
                <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                <p className="text-gray-500 text-sm font-medium">Retrieving real-time industry openings & calculating compatibility...</p>
              </div>
            ) : displayedOpps.length === 0 ? (
              <div className="bg-white p-12 rounded-2xl border border-gray-200 text-center space-y-3">
                <div className="w-12 h-12 bg-gray-100 text-gray-400 rounded-full flex items-center justify-center mx-auto">
                  <Search className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-gray-900">No opportunities matched your current filters</h3>
                <p className="text-xs text-gray-500 max-w-sm mx-auto">
                  Try loosening your city, keyword, or skill proficiency filters to view more opportunities.
                </p>
                <button 
                  onClick={clearAllFilters} 
                  className="mt-2 text-xs font-bold text-[#27AE60] hover:underline uppercase tracking-wider cursor-pointer"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                {displayedOpps.map((opp, idx) => {
                  const job = opp.job;
                  const matchResult = opp.matchResult;
                  const isExpanded = expandedJobId === (job.id || String(idx));
                  const matchScore = matchResult.matchScore;
                  const timeAgo = formatTimeAgo(job.postedAt, idx);
                  const rupeesSalary = formatRupeesSalary(job.salary, job.employmentType);
                  const isIntern = job.employmentType.toLowerCase().includes("intern");

                  // Check if student already applied to this job
                  const existingApp = myApplications.find(a => a.jobId === job.id);

                  return (
                    <div 
                      key={job.id || idx} 
                      className="bg-white rounded-lg shadow-sm border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all overflow-hidden"
                    >
                      
                      {/* Top Row: Company Logo Badge, Tags & Posted Time Ago */}
                      <div className="p-6 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100">
                        
                        <div className="flex items-center space-x-4">
                          <div className="w-32 h-14 bg-[#1b2a26] rounded flex items-center justify-center text-white px-3 shrink-0">
                            <div className="flex items-center space-x-1.5 font-bold tracking-wider text-xs">
                              <span className="text-[#27AE60] text-sm">◆</span>
                              <span className="uppercase text-[11px] font-black">{job.company}</span>
                            </div>
                          </div>

                          <div className="space-y-1">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="bg-[#0091DA] text-white text-[11px] font-bold px-3 py-0.5 rounded-full">
                                Recruiter
                              </span>

                              <span className="bg-slate-100 text-slate-800 text-[11px] font-bold px-2.5 py-0.5 rounded flex items-center space-x-1">
                                <span className="text-blue-900 tracking-tighter">★★★</span>
                                <span className="ml-1">{isIntern ? "Internship / Trainee" : job.experience || "Mid-Senior Level"}</span>
                              </span>

                              {existingApp && (
                                <span className="bg-orange-100 text-orange-800 text-[11px] font-bold px-2.5 py-0.5 rounded-full border border-orange-200">
                                  Applied ({existingApp.currentStatus})
                                </span>
                              )}
                            </div>

                            <div className="text-[11px] text-gray-500 font-medium italic">
                              (Company is verified & active hiring)
                            </div>
                          </div>
                        </div>

                        {/* Right: Hours/Days Ago & Compatibility Badge */}
                        <div className="flex items-center space-x-3 sm:text-right">
                          <div className="text-right">
                            <div className="flex items-center text-xs font-semibold text-gray-500 space-x-1">
                              <Clock className="w-3.5 h-3.5 text-gray-400" />
                              <span>{timeAgo}</span>
                            </div>
                            <div className="text-[11px] font-bold text-emerald-700 mt-0.5">
                              {matchScore}% Compatible
                            </div>
                          </div>

                          <div className={`w-12 h-12 rounded-xl flex flex-col items-center justify-center border-2 shrink-0 ${
                            matchScore >= 75 
                              ? 'border-emerald-500 text-emerald-700 bg-emerald-50' 
                              : matchScore >= 50 
                              ? 'border-blue-500 text-blue-700 bg-blue-50' 
                              : 'border-gray-300 text-gray-500 bg-gray-50'
                          }`}>
                            <span className="text-sm font-black leading-none">{matchScore}%</span>
                          </div>
                        </div>

                      </div>

                      {/* Middle Section: Job Title */}
                      <div className="px-6 pt-5 pb-4">
                        <h3 className="text-xl sm:text-2xl font-bold text-gray-900 leading-snug tracking-tight">
                          {job.title} | {rupeesSalary} | Flexible working hours and hybrid available
                        </h3>
                      </div>

                      {/* Two-Column Specification & Description Grid */}
                      <div className="px-6 pb-6 grid grid-cols-1 md:grid-cols-12 gap-6 pt-2">
                        
                        {/* Left Column (5 cols) */}
                        <div className="md:col-span-5 space-y-4 text-xs">
                          <div>
                            <div className="font-bold text-gray-900 text-xs">Recruiter</div>
                            <div className="text-gray-700 font-medium mt-0.5">{job.company} Talent Network</div>
                          </div>

                          <div>
                            <div className="font-bold text-gray-900 text-xs">Location</div>
                            <div className="text-gray-700 font-medium mt-0.5 flex items-center">
                              <MapPin className="w-3.5 h-3.5 mr-1 text-gray-400" />
                              <span>India {job.location}</span>
                            </div>
                          </div>

                          <div>
                            <div className="font-bold text-gray-900 text-xs">Salary / Stipend</div>
                            <div className="text-gray-900 font-bold mt-0.5 text-sm text-[#0c2340]">
                              {rupeesSalary}
                            </div>
                          </div>

                          <div>
                            <div className="font-bold text-gray-900 text-xs">Experience Level</div>
                            <div className="text-gray-700 font-medium mt-0.5">
                              {isIntern ? "Internship / 0-1 Years" : job.experience || "1-3 Years"} (Skill Assessment Verified)
                            </div>
                          </div>

                          {job.mentorName && (
                            <div>
                              <div className="font-bold text-gray-900 text-xs">Direct Mentor</div>
                              <div className="text-gray-700 font-medium mt-0.5">
                                {job.mentorName} {job.mentorDesignation ? `(${job.mentorDesignation})` : ""}
                              </div>
                            </div>
                          )}

                          <div>
                            <div className="font-bold text-gray-900 text-xs mb-1.5">Required Skills</div>
                            <div className="flex flex-wrap gap-1.5">
                              {(job.requiredSkills || []).map((sk: string) => {
                                const verifiedMatch = verifiedSkills.find(v => 
                                  v.skill.name.toLowerCase().trim() === sk.toLowerCase().trim()
                                );
                                return (
                                  <span 
                                    key={sk}
                                    className={`text-[11px] font-semibold px-2 py-0.5 rounded ${
                                      verifiedMatch 
                                        ? "bg-emerald-100 text-emerald-900 border border-emerald-300 font-bold" 
                                        : "bg-gray-100 text-gray-700 border border-gray-200"
                                    }`}
                                  >
                                    {verifiedMatch && "✓ "}{sk}
                                    {verifiedMatch && ` (${Math.round(verifiedMatch.score)}%)`}
                                  </span>
                                );
                              })}
                            </div>
                          </div>
                        </div>

                        {/* Right Column (7 cols): Job Description */}
                        <div className="md:col-span-7 text-xs text-gray-700 space-y-2 border-t md:border-t-0 md:border-l border-gray-100 md:pl-6 pt-4 md:pt-0">
                          <div className="font-bold text-gray-900 text-xs">Job Description</div>
                          <div className="text-gray-500 font-semibold">[Job Description]</div>
                          
                          <div className="space-y-2 leading-relaxed">
                            <p>
                              1. Responsible for developing and optimizing technical software systems, feature delivery, and code review within the engineering squad.
                            </p>
                            <p>
                              2. As the technical point of contact for the engineering group, you will collaborate with cross-functional stakeholders, product teams, and offshore architects to confirm specifications and manage implementation.
                            </p>
                            <p>
                              3. Ensure high test coverage, perform root-cause debugging, and participate in sprint architectures and code reviews.
                            </p>
                            {job.description && (
                              <p className="text-gray-600 bg-gray-50 p-2.5 rounded border border-gray-100 mt-2">
                                <strong>Role Summary:</strong> {job.description}
                              </p>
                            )}
                          </div>
                        </div>

                      </div>

                      {/* SKILL COMPATIBILITY vs. COMPANY REQUIREMENT METERS */}
                      <div className="px-6 py-4 bg-gray-50/70 border-t border-gray-200">
                        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 mb-2">
                          <div className="flex items-center space-x-2">
                            <SlidersHorizontal className="w-4 h-4 text-blue-600" />
                            <span className="text-xs font-bold text-[#0c2340]">
                              Skill Compatibility vs. Company Benchmark:
                            </span>
                            <span className="text-xs font-black text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                              {matchScore}% Matched
                            </span>
                          </div>

                          <button 
                            onClick={() => setExpandedJobId(isExpanded ? null : (job.id || String(idx)))}
                            className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center space-x-1 cursor-pointer"
                          >
                            <span>{isExpanded ? "Hide Requirements Breakdown" : "View Skill Compatibility Details"}</span>
                            {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                          </button>
                        </div>

                        <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
                          <div 
                            className={`h-full rounded-full transition-all duration-700 ${
                              matchScore >= 75 ? 'bg-[#27AE60]' : matchScore >= 50 ? 'bg-[#0091DA]' : 'bg-gray-400'
                            }`}
                            style={{ width: `${Math.max(6, matchScore)}%` }}
                          />
                        </div>

                        {isExpanded && (
                          <div className="mt-4 pt-4 border-t border-gray-200 space-y-3 animate-in fade-in duration-200 text-xs">
                            <div className="font-bold text-gray-800 uppercase tracking-wider text-[11px]">
                              Detailed Requirement Matching:
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              {(job.detailedSkillRequirements || []).map((req: any, rIdx: number) => {
                                const verifiedMatch = verifiedSkills.find(v => 
                                  v.skill.name.toLowerCase().trim() === req.name.toLowerCase().trim()
                                );
                                const studentScore = verifiedMatch ? Math.round(verifiedMatch.score) : 0;
                                const isSufficient = studentScore >= req.requiredLevel;

                                return (
                                  <div 
                                    key={rIdx}
                                    className={`p-3 rounded-lg border flex items-center justify-between ${
                                      isSufficient 
                                        ? "bg-emerald-50 border-emerald-200" 
                                        : studentScore > 0 
                                        ? "bg-amber-50 border-amber-200" 
                                        : "bg-red-50 border-red-200"
                                    }`}
                                  >
                                    <div>
                                      <div className="font-bold text-gray-900 flex items-center space-x-1.5">
                                        <span>{req.name}</span>
                                        <span className={`text-[9px] px-1.5 py-0.2 rounded font-bold uppercase ${
                                          req.requirementType === "REQUIRED" ? "bg-red-100 text-red-700" : "bg-blue-100 text-blue-700"
                                        }`}>
                                          {req.requirementType}
                                        </span>
                                      </div>
                                      <div className="text-[11px] text-gray-500 mt-0.5">
                                        Company Requirement: <strong>{req.requiredLevel}%+</strong>
                                      </div>
                                    </div>

                                    <div className="text-right">
                                      <div className={`font-black text-sm ${
                                        isSufficient ? "text-emerald-700" : studentScore > 0 ? "text-amber-700" : "text-red-600"
                                      }`}>
                                        {studentScore > 0 ? `${studentScore}%` : "Not Tested"}
                                      </div>
                                      <div className="text-[10px] font-semibold text-gray-600">
                                        {isSufficient ? "✓ Fully Met" : studentScore > 0 ? "⚠ Needs Polish" : "✕ Skill Gap"}
                                      </div>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>

                            {matchResult.missingRequired && matchResult.missingRequired.length > 0 && (
                              <div className="p-3 bg-blue-50 rounded-lg border border-blue-200 text-blue-900 flex items-start space-x-2">
                                <Sparkles className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                                <div>
                                  <span className="font-bold">Next Step: </span>
                                  Bridge the gap in <strong>{matchResult.missingRequired.map((m: any) => m.skill).join(", ")}</strong> in the{" "}
                                  <Link href="/student/learning" className="underline font-bold text-blue-800">
                                    Learn the Gap section
                                  </Link>{" "}
                                  to unlock 90%+ compatibility.
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Bottom Actions Bar */}
                      <div className="px-6 py-3.5 bg-white border-t border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                        <div className="text-xs text-gray-500 flex items-center space-x-2">
                          <Clock className="w-3.5 h-3.5 text-gray-400" />
                          <span>Posted <strong>{timeAgo}</strong></span>
                          <span>•</span>
                          <span>Source: <strong>{job.source || "Direct Opening"}</strong></span>
                        </div>

                        <div className="flex items-center space-x-3">
                          {existingApp ? (
                            <button 
                              onClick={() => {
                                setActiveTab("applications");
                                setInspectingApp(existingApp);
                              }}
                              className="bg-orange-50 hover:bg-orange-100 text-orange-700 border border-orange-300 text-xs font-bold px-5 py-2.5 rounded uppercase tracking-wider transition-all flex items-center cursor-pointer"
                            >
                              <span>Track Status ({existingApp.currentStatus})</span>
                              <ChevronRight className="w-3.5 h-3.5 ml-1" />
                            </button>
                          ) : (
                            <button 
                              onClick={() => handleOpenApplyModal(job)}
                              className="bg-[#27AE60] hover:bg-[#219653] text-white text-xs font-bold px-6 py-2.5 rounded uppercase tracking-wider transition-all shadow-xs flex items-center cursor-pointer"
                            >
                              <span>{isIntern ? "Apply for Internship" : "Apply Now"}</span>
                              <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                            </button>
                          )}
                        </div>
                      </div>

                    </div>
                  );
                })}
              </div>
            )}

          </div>

        </div>
      )}

      {/* ======================================================================= */}
      {/* 3. INTERNSHIP APPLICATION MODAL (Full 8-step Application Form)         */}
      {/* ======================================================================= */}
      {selectedJobForApply && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-gray-200 my-8 max-h-[90vh] overflow-y-auto relative animate-in zoom-in-95 duration-200">
            
            {/* Close Button */}
            <button
              onClick={() => setSelectedJobForApply(null)}
              className="absolute top-5 right-5 text-gray-400 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {appSubmissionSuccess ? (
              /* Success Confirmation View */
              <div className="text-center py-8 space-y-4">
                <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-sm">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h3 className="text-2xl font-black text-[#0c2340]">
                  Application Submitted Successfully!
                </h3>
                <p className="text-xs sm:text-sm text-gray-500 max-w-md mx-auto leading-relaxed">
                  Your application for <strong>{selectedJobForApply.title}</strong> at <strong>{selectedJobForApply.company}</strong> has been saved.
                </p>

                <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 max-w-md mx-auto text-left text-xs space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-500 font-medium">Application ID:</span>
                    <span className="font-mono font-bold text-[#0c2340]">{appSubmissionSuccess.applicationId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500 font-medium">Initial Status:</span>
                    <span className="text-blue-700 font-bold bg-blue-50 px-2 py-0.5 rounded">Applied</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500 font-medium">Verified Skills Attached:</span>
                    <span className="text-emerald-700 font-bold">{verifiedSkills.length} Tests</span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
                  <button
                    onClick={() => {
                      setSelectedJobForApply(null);
                      setActiveTab("applications");
                      fetchApplications();
                    }}
                    className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-6 py-3 rounded-lg uppercase tracking-wider shadow-sm transition-all cursor-pointer"
                  >
                    Track in &quot;My Applications&quot;
                  </button>
                  <button
                    onClick={() => setSelectedJobForApply(null)}
                    className="bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold px-6 py-3 rounded-lg uppercase tracking-wider transition-all cursor-pointer"
                  >
                    Browse More Openings
                  </button>
                </div>
              </div>
            ) : (
              /* Application Form */
              <form onSubmit={handleSubmitApplication} className="space-y-6">
                <div>
                  <span className="text-[11px] font-bold text-[#0091DA] uppercase tracking-wider">
                    Internship Application
                  </span>
                  <h3 className="text-2xl font-black text-[#0c2340] leading-tight">
                    Apply for {selectedJobForApply.title}
                  </h3>
                  <p className="text-xs text-gray-500 mt-1">
                    {selectedJobForApply.company} • {selectedJobForApply.location} • {formatRupeesSalary(selectedJobForApply.salary, selectedJobForApply.employmentType)}
                  </p>
                </div>

                {/* 1. Student Profile Information */}
                <div className="space-y-3 pt-3 border-t border-gray-100">
                  <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider flex items-center">
                    <Building className="w-3.5 h-3.5 mr-1 text-blue-600" />
                    1. Student Profile & Academic Background
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div>
                      <label className="block text-gray-600 font-medium mb-1">Full Name</label>
                      <input 
                        type="text" 
                        value={applicationForm.fullName}
                        onChange={(e) => setApplicationForm({...applicationForm, fullName: e.target.value})}
                        required
                        className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500" 
                      />
                    </div>
                    <div>
                      <label className="block text-gray-600 font-medium mb-1">Official Email</label>
                      <input 
                        type="email" 
                        value={applicationForm.email}
                        onChange={(e) => setApplicationForm({...applicationForm, email: e.target.value})}
                        required
                        className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500" 
                      />
                    </div>
                    <div>
                      <label className="block text-gray-600 font-medium mb-1">Phone Number</label>
                      <input 
                        type="tel" 
                        value={applicationForm.phone}
                        onChange={(e) => setApplicationForm({...applicationForm, phone: e.target.value})}
                        required
                        className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500" 
                      />
                    </div>
                    <div>
                      <label className="block text-gray-600 font-medium mb-1">College / Institution</label>
                      <input 
                        type="text" 
                        value={applicationForm.institution}
                        onChange={(e) => setApplicationForm({...applicationForm, institution: e.target.value})}
                        required
                        className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500" 
                      />
                    </div>
                    <div>
                      <label className="block text-gray-600 font-medium mb-1">Degree & Major</label>
                      <input 
                        type="text" 
                        value={applicationForm.degree}
                        onChange={(e) => setApplicationForm({...applicationForm, degree: e.target.value})}
                        required
                        className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500" 
                      />
                    </div>
                    <div>
                      <label className="block text-gray-600 font-medium mb-1">Graduation Year</label>
                      <input 
                        type="text" 
                        value={applicationForm.graduationYear}
                        onChange={(e) => setApplicationForm({...applicationForm, graduationYear: e.target.value})}
                        required
                        className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500" 
                      />
                    </div>
                  </div>
                </div>

                {/* 2. Resume & Verified Skill Profile (Automatically Attached) */}
                <div className="space-y-3 pt-3 border-t border-gray-100">
                  <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider flex items-center">
                    <FileCheck className="w-3.5 h-3.5 mr-1 text-emerald-600" />
                    2. Resume & Verified Skill Profile
                  </h4>

                  <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs space-y-2">
                    <div className="flex justify-between items-center text-emerald-900 font-bold">
                      <span className="flex items-center">
                        <CheckCircle2 className="w-4 h-4 mr-1 text-emerald-600" />
                        Verified Assessment Portfolio Attached
                      </span>
                      <span>{verifiedSkills.length} Verified Tests</span>
                    </div>
                    <p className="text-[11px] text-emerald-800">
                      Your proved scores ({verifiedSkills.map(s => `${s.skill.name}: ${Math.round(s.score)}%`).join(", ") || "Active profile"}) will be directly shared with the hiring manager.
                    </p>
                  </div>
                </div>

                {/* 3. Cover Letter / Application Statement */}
                <div className="space-y-2 pt-3 border-t border-gray-100">
                  <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                    3. Cover Letter / Application Statement
                  </h4>
                  <textarea
                    rows={3}
                    value={applicationForm.coverLetter}
                    onChange={(e) => setApplicationForm({...applicationForm, coverLetter: e.target.value})}
                    required
                    placeholder="Why are you a strong fit for this internship position?"
                    className="w-full p-3 border border-gray-300 rounded-lg text-xs focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                {/* 4. Portfolio & Availability */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-3 border-t border-gray-100">
                  <div>
                    <label className="block text-gray-600 font-medium mb-1">GitHub / Portfolio URL</label>
                    <input 
                      type="url" 
                      value={applicationForm.portfolioUrl}
                      onChange={(e) => setApplicationForm({...applicationForm, portfolioUrl: e.target.value})}
                      placeholder="https://github.com/..." 
                      className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500" 
                    />
                  </div>
                  <div>
                    <label className="block text-gray-600 font-medium mb-1">Earliest Availability</label>
                    <select
                      value={applicationForm.availability}
                      onChange={(e) => setApplicationForm({...applicationForm, availability: e.target.value})}
                      className="w-full p-2.5 border border-gray-300 rounded-lg bg-white focus:ring-1 focus:ring-blue-500"
                    >
                      <option value="Immediate (Full-time)">Immediate (Full-time)</option>
                      <option value="Within 2 Weeks">Within 2 Weeks</option>
                      <option value="Part-time (20 hrs/week)">Part-time (20 hrs/week)</option>
                      <option value="Summer 2026">Summer 2026</option>
                    </select>
                  </div>
                </div>

                {/* 5. Additional Employer Question */}
                <div className="space-y-2 pt-3 border-t border-gray-100">
                  <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                    5. Employer Question: Hybrid / Sprint Collaboration
                  </h4>
                  <input
                    type="text"
                    value={applicationForm.employerAnswer1}
                    onChange={(e) => setApplicationForm({...applicationForm, employerAnswer1: e.target.value})}
                    className="w-full p-2.5 border border-gray-300 rounded-lg text-xs focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                {/* Submit Action */}
                <div className="pt-4 border-t border-gray-200 flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setSelectedJobForApply(null)}
                    className="px-5 py-2.5 rounded-lg border border-gray-300 text-xs font-bold text-gray-600 hover:bg-gray-50 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmittingApp}
                    className="bg-[#27AE60] hover:bg-[#219653] disabled:opacity-50 text-white text-xs font-bold px-7 py-2.5 rounded-lg uppercase tracking-wider shadow-sm transition-all flex items-center cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5 mr-2" />
                    <span>{isSubmittingApp ? "Submitting..." : "Submit Application"}</span>
                  </button>
                </div>

              </form>
            )}

          </div>
        </div>
      )}

      {/* ======================================================================= */}
      {/* 4. MODAL: SUBMIT WEEKLY PROGRESS UPDATE & EVIDENCE                     */}
      {/* ======================================================================= */}
      {showWeeklyUpdateModal && activeInternship && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-gray-100 space-y-6">
            
            <div className="flex justify-between items-center pb-4 border-b border-gray-100">
              <div>
                <h3 className="text-xl font-bold text-[#0c2340]">Submit Weekly Progress Update</h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  Record your completed sprint deliverables and attach live work evidence.
                </p>
              </div>
              <button 
                onClick={() => setShowWeeklyUpdateModal(false)}
                className="text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitWeeklyUpdate} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-gray-700 font-bold mb-1">Week Number</label>
                  <input
                    type="number"
                    min="1"
                    max="16"
                    value={weeklyUpdateForm.weekNumber}
                    onChange={(e) => setWeeklyUpdateForm({ ...weeklyUpdateForm, weekNumber: Number(e.target.value) })}
                    className="w-full p-2.5 border border-gray-300 rounded-lg"
                    required
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-gray-700 font-bold mb-1">Update Title / Milestone Focus</label>
                  <input
                    type="text"
                    value={weeklyUpdateForm.weekTitle}
                    onChange={(e) => setWeeklyUpdateForm({ ...weeklyUpdateForm, weekTitle: e.target.value })}
                    className="w-full p-2.5 border border-gray-300 rounded-lg"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-700 font-bold mb-1">Sprint Summary & Key Deliverables Completed</label>
                <textarea
                  rows={4}
                  value={weeklyUpdateForm.summary}
                  onChange={(e) => setWeeklyUpdateForm({ ...weeklyUpdateForm, summary: e.target.value })}
                  placeholder="e.g., Implemented token refresh rotation in Redis, wrote 12 unit test cases for auth controller, merged PR #189..."
                  className="w-full p-2.5 border border-gray-300 rounded-lg leading-relaxed"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 font-bold mb-1">Submitted Work Link (GitHub PR / Figma / Document)</label>
                <input
                  type="url"
                  value={weeklyUpdateForm.submittedWorkUrl}
                  onChange={(e) => setWeeklyUpdateForm({ ...weeklyUpdateForm, submittedWorkUrl: e.target.value })}
                  placeholder="https://github.com/company/repo/pull/..."
                  className="w-full p-2.5 border border-gray-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-bold mb-1">Blockers / Challenges (Optional)</label>
                <input
                  type="text"
                  value={weeklyUpdateForm.blockers}
                  onChange={(e) => setWeeklyUpdateForm({ ...weeklyUpdateForm, blockers: e.target.value })}
                  placeholder="e.g., Awaiting staging cluster secret rotation from DevOps"
                  className="w-full p-2.5 border border-gray-300 rounded-lg"
                />
              </div>

              <div className="pt-4 border-t border-gray-200 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowWeeklyUpdateModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg font-bold text-gray-600 hover:bg-gray-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingWeeklyUpdate}
                  className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold px-6 py-2 rounded-lg shadow-sm cursor-pointer flex items-center"
                >
                  <Send className="w-3.5 h-3.5 mr-1.5" />
                  <span>{isSubmittingWeeklyUpdate ? "Saving..." : "Submit Weekly Update"}</span>
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

      {/* ======================================================================= */}
      {/* 5. MODAL: CORPORATE MENTOR EVALUATION & SKILL GRADING SIMULATOR       */}
      {/* ======================================================================= */}
      {showMentorFeedbackModal && activeInternship && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-gray-100 space-y-6 max-h-[90vh] overflow-y-auto">
            
            <div className="flex justify-between items-center pb-4 border-b border-gray-100">
              <div>
                <div className="flex items-center space-x-2 text-xs font-bold text-purple-700 uppercase tracking-wider mb-1">
                  <Sparkles className="w-4 h-4" />
                  <span>Mentor Simulation Console</span>
                </div>
                <h3 className="text-xl font-bold text-[#0c2340]">Record Corporate Mentor Evaluation</h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  Graded skills will directly verify and boost the student's Verified Skill Profile.
                </p>
              </div>
              <button 
                onClick={() => setShowMentorFeedbackModal(false)}
                className="text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitMentorFeedback} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-700 font-bold mb-1">Mentor Name</label>
                  <input
                    type="text"
                    value={mentorForm.mentorName}
                    onChange={(e) => setMentorForm({ ...mentorForm, mentorName: e.target.value })}
                    className="w-full p-2.5 border border-gray-300 rounded-lg"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-bold mb-1">Mentor Designation</label>
                  <input
                    type="text"
                    value={mentorForm.mentorRole}
                    onChange={(e) => setMentorForm({ ...mentorForm, mentorRole: e.target.value })}
                    className="w-full p-2.5 border border-gray-300 rounded-lg"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-700 font-bold mb-1">Technical Review & General Feedback</label>
                <textarea
                  rows={3}
                  value={mentorForm.generalFeedback}
                  onChange={(e) => setMentorForm({ ...mentorForm, generalFeedback: e.target.value })}
                  className="w-full p-2.5 border border-gray-300 rounded-lg leading-relaxed"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 font-bold mb-1">Demonstrated Strengths (comma-separated)</label>
                <input
                  type="text"
                  value={mentorForm.strengthsText}
                  onChange={(e) => setMentorForm({ ...mentorForm, strengthsText: e.target.value })}
                  className="w-full p-2.5 border border-gray-300 rounded-lg"
                  placeholder="Clean code, proactive standups, async patterns"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 font-bold mb-1">Areas for Improvement (comma-separated)</label>
                <input
                  type="text"
                  value={mentorForm.improvementsText}
                  onChange={(e) => setMentorForm({ ...mentorForm, improvementsText: e.target.value })}
                  className="w-full p-2.5 border border-gray-300 rounded-lg"
                  placeholder="Automated fixtures, boundary test coverage"
                  required
                />
              </div>

              {/* Verified Skill Grading Section */}
              <div className="p-4 bg-purple-50/70 rounded-xl border border-purple-200 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="font-extrabold text-purple-900 text-xs uppercase tracking-wider">
                    Mentor Skill Proficiency Ratings (Pushes into Skill Profile)
                  </span>
                  <ShieldCheck className="w-4 h-4 text-purple-700" />
                </div>

                {/* Skill 1 */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 bg-white p-2.5 rounded-lg border border-purple-100">
                  <div>
                    <span className="block text-[10px] font-bold text-gray-500 mb-1">Skill #1</span>
                    <input
                      type="text"
                      value={mentorForm.evaluatedSkill1}
                      onChange={(e) => setMentorForm({ ...mentorForm, evaluatedSkill1: e.target.value })}
                      className="w-full p-1.5 border border-gray-300 rounded text-xs"
                      required
                    />
                  </div>
                  <div>
                    <span className="block text-[10px] font-bold text-gray-500 mb-1">Proficiency Level</span>
                    <select
                      value={mentorForm.proficiency1}
                      onChange={(e) => setMentorForm({ ...mentorForm, proficiency1: e.target.value })}
                      className="w-full p-1.5 border border-gray-300 rounded text-xs bg-white"
                    >
                      <option value="Proficient">Proficient</option>
                      <option value="Mastery">Mastery</option>
                      <option value="Developing">Developing</option>
                    </select>
                  </div>
                  <div>
                    <span className="block text-[10px] font-bold text-gray-500 mb-1">Score Impact ({mentorForm.score1}%)</span>
                    <input
                      type="range"
                      min="50"
                      max="100"
                      value={mentorForm.score1}
                      onChange={(e) => setMentorForm({ ...mentorForm, score1: Number(e.target.value) })}
                      className="w-full mt-2"
                    />
                  </div>
                </div>

                {/* Skill 2 */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 bg-white p-2.5 rounded-lg border border-purple-100">
                  <div>
                    <span className="block text-[10px] font-bold text-gray-500 mb-1">Skill #2</span>
                    <input
                      type="text"
                      value={mentorForm.evaluatedSkill2}
                      onChange={(e) => setMentorForm({ ...mentorForm, evaluatedSkill2: e.target.value })}
                      className="w-full p-1.5 border border-gray-300 rounded text-xs"
                      required
                    />
                  </div>
                  <div>
                    <span className="block text-[10px] font-bold text-gray-500 mb-1">Proficiency Level</span>
                    <select
                      value={mentorForm.proficiency2}
                      onChange={(e) => setMentorForm({ ...mentorForm, proficiency2: e.target.value })}
                      className="w-full p-1.5 border border-gray-300 rounded text-xs bg-white"
                    >
                      <option value="Proficient">Proficient</option>
                      <option value="Mastery">Mastery</option>
                      <option value="Developing">Developing</option>
                    </select>
                  </div>
                  <div>
                    <span className="block text-[10px] font-bold text-gray-500 mb-1">Score Impact ({mentorForm.score2}%)</span>
                    <input
                      type="range"
                      min="50"
                      max="100"
                      value={mentorForm.score2}
                      onChange={(e) => setMentorForm({ ...mentorForm, score2: Number(e.target.value) })}
                      className="w-full mt-2"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-200 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowMentorFeedbackModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg font-bold text-gray-600 hover:bg-gray-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingMentorFeedback}
                  className="bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white font-bold px-6 py-2 rounded-lg shadow-sm cursor-pointer flex items-center"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 mr-1.5" />
                  <span>{isSubmittingMentorFeedback ? "Submitting..." : "Save Evaluation & Sync Skills"}</span>
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

      {/* ======================================================================= */}
      {/* 6. MODAL: OFFICIAL VERIFIED DIGITAL CERTIFICATE VIEWER                  */}
      {/* ======================================================================= */}
      {showCertificateModal && activeInternship?.completionRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-3xl w-full p-6 sm:p-10 shadow-2xl border border-gray-200 space-y-6 relative overflow-hidden">
            
            {/* Close Button */}
            <button 
              onClick={() => setShowCertificateModal(false)}
              className="absolute top-5 right-5 text-gray-400 hover:text-gray-600 p-1.5 rounded-full hover:bg-gray-100 cursor-pointer z-10"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Certificate Canvas */}
            <div className="relative border-8 border-double border-[#0c2340] rounded-2xl p-8 sm:p-12 bg-radial from-amber-50/50 via-white to-amber-100/20 text-center space-y-6 shadow-xl">
              
              {/* Top Seal & Company Header */}
              <div className="flex justify-between items-center border-b border-gray-200 pb-4">
                <div className="text-left">
                  <div className="text-xs font-black text-gray-400 uppercase tracking-widest">Issuing Organization</div>
                  <div className="text-base font-black text-[#0c2340]">{activeInternship.company}</div>
                </div>

                <div className="w-16 h-16 rounded-full bg-amber-50 border-2 border-amber-500 flex items-center justify-center text-amber-800 shadow-md">
                  <Award className="w-8 h-8" />
                </div>

                <div className="text-right">
                  <div className="text-xs font-black text-gray-400 uppercase tracking-widest">Verified Credential</div>
                  <div className="text-xs font-mono font-bold text-emerald-700">{activeInternship.completionRecord.certificateNumber}</div>
                </div>
              </div>

              {/* Core Text */}
              <div className="space-y-2 py-4">
                <span className="text-xs font-black tracking-[0.25em] text-amber-800 uppercase">
                  Certificate of Internship Excellence
                </span>
                <p className="text-xs text-gray-500 italic">This is proudly presented to</p>
                <h2 className="text-3xl sm:text-4xl font-serif font-black text-[#0c2340] tracking-wide">
                  Arjun Sharma
                </h2>
                <p className="text-xs text-gray-600 max-w-xl mx-auto pt-3 leading-relaxed">
                  In recognition of meritorious performance as <strong>{activeInternship.roleTitle}</strong> during the term of <strong>{activeInternship.duration}</strong>, achieving a cumulative performance evaluation score of <strong>{activeInternship.completionRecord.finalRating} out of 5.0</strong>.
                </p>
              </div>

              {/* Bottom Signatures & Verification Hash */}
              <div className="grid grid-cols-1 sm:grid-cols-3 pt-6 border-t border-gray-200 text-xs items-center gap-4 text-left">
                <div>
                  <span className="text-[10px] font-bold text-gray-400 uppercase block">Mentor & Signatory</span>
                  <span className="font-extrabold text-gray-900">{activeInternship.mentorName}</span>
                  <span className="text-[10px] text-gray-500 block">{activeInternship.mentorRole}</span>
                </div>

                <div className="text-center">
                  <span className="inline-flex items-center px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 font-extrabold text-[10px] uppercase tracking-wider">
                    <ShieldCheck className="w-3.5 h-3.5 mr-1" />
                    Verified by Platform
                  </span>
                  <span className="block text-[10px] text-gray-400 mt-0.5">
                    Issued: {new Date(activeInternship.completionRecord.issuedAt).toLocaleDateString()}
                  </span>
                </div>

                <div className="sm:text-right">
                  <span className="text-[10px] font-bold text-gray-400 uppercase block">Verification Hash</span>
                  <span className="font-mono text-[9px] text-gray-600 break-all">{activeInternship.completionRecord.verificationHash}</span>
                </div>
              </div>

            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-2">
              <div className="text-xs text-gray-500 font-medium">
                This credential is cryptographically stamped and pushed to your public <strong>Digital Portfolio</strong>.
              </div>
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => alert("Certificate PDF ready for printing/download.")}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-bold px-4 py-2.5 rounded-xl flex items-center cursor-pointer"
                >
                  <Download className="w-4 h-4 mr-1.5" />
                  <span>Download PDF</span>
                </button>
                <Link
                  href="/student/portfolio"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-5 py-2.5 rounded-xl flex items-center shadow-md cursor-pointer"
                >
                  <span>Open in Portfolio</span>
                  <ExternalLink className="w-4 h-4 ml-1.5" />
                </Link>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* ======================================================================= */}
      {/* 4. COMPANY VERIFICATION WARNING MODAL (Phase 1 Guard)                  */}
      {/* ======================================================================= */}
      {showVerificationWarningModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-gray-100 space-y-5 animate-in fade-in zoom-in-95 duration-200">
            <div className="w-12 h-12 rounded-full bg-amber-100 border-2 border-amber-300 flex items-center justify-center text-amber-700 mx-auto">
              <ShieldAlert className="w-6 h-6" />
            </div>

            <div className="text-center space-y-2">
              <h3 className="text-lg font-bold text-gray-900">Organization Verification Required</h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Your company profile status is currently <strong>PENDING ADMIN VERIFICATION</strong>. In accordance with platform quality standards, only <strong>VERIFIED</strong> employers and academic institutes are authorized to publish live internships.
              </p>
              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-[11px] text-amber-800 text-left space-y-1 mt-3">
                <div className="font-bold flex items-center">
                  <Lock className="w-3.5 h-3.5 mr-1 text-amber-700" />
                  <span>Student Safety & Quality Policy</span>
                </div>
                <div>Students and unverified recruiters cannot bypass this restriction. Verification ensures guaranteed stipends, verified mentors, and legitimate credentials.</div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                onClick={() => setShowVerificationWarningModal(false)}
                className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs py-2.5 rounded-xl cursor-pointer"
              >
                Close
              </button>
              <button
                onClick={() => {
                  handleRoleSimulationChange("COMPANY_VERIFIED");
                  setShowVerificationWarningModal(false);
                  setShowPostInternshipModal(true);
                }}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-2.5 rounded-xl flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Simulate Verified Approval</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================================= */}
      {/* 5. STRUCTURED 7-STEP POST INTERNSHIP MODAL WIZARD                      */}
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
                    <h3 className="text-lg font-black text-[#0c2340]">Post Structured Internship</h3>
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
                    <h4 className="text-sm font-black text-[#0c2340]">Step 1: Basic Information</h4>
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
                    <h4 className="text-sm font-black text-[#0c2340]">Step 2: Role & Key Responsibilities</h4>
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

              {/* STEP 3: CANONICAL SKILL TAXONOMY (Strict Requirement: No Plain-Text) */}
              {internshipStep === 3 && (
                <div className="space-y-4 animate-in fade-in duration-150">
                  <div className="border-b border-gray-100 pb-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-sm font-black text-[#0c2340]">Step 3: Canonical Skill Taxonomy</h4>
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

                  {/* Selected Canonical Skills Configurator (Requirement Type & Proficiency) */}
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
                    <h4 className="text-sm font-black text-[#0c2340]">Step 4: Non-Skill Eligibility Criteria</h4>
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
                    <h4 className="text-sm font-black text-[#0c2340]">Step 5: Assigned Project & Concrete Deliverables</h4>
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
                        className="w-full px-3.5 py-2 rounded-xl border border-gray-200 text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">Evaluation & Review Method</label>
                      <textarea
                        rows={2}
                        value={internshipPostForm.evaluationMethod}
                        onChange={(e) => setInternshipPostForm({ ...internshipPostForm, evaluationMethod: e.target.value })}
                        className="w-full px-3.5 py-2 rounded-xl border border-gray-200 text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 6: DURATION & MENTOR DETAILS */}
              {internshipStep === 6 && (
                <div className="space-y-4 animate-in fade-in duration-150">
                  <div className="border-b border-gray-100 pb-3">
                    <h4 className="text-sm font-black text-[#0c2340]">Step 6: Duration & Designated Mentor</h4>
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
                    <div className="flex items-center space-x-2 text-xs font-bold text-[#0c2340]">
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
                    <h4 className="text-sm font-black text-[#0c2340]">Step 7: Preview & Final Publication</h4>
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
                        <h3 className="text-xl font-black text-[#0c2340]">{internshipPostForm.title}</h3>
                        <p className="text-xs text-gray-600 mt-0.5">
                          {companyProfile?.companyName || "Infosys Labs"} • {internshipPostForm.department} • {internshipPostForm.location}
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

    </div>
  );
}

export default function OpportunitiesPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-sm text-gray-500">Loading Opportunities...</div>}>
      <OpportunitiesContent />
    </Suspense>
  );
}
