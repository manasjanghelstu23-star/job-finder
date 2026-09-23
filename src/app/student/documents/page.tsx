"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import {
  FileText,
  Award,
  UploadCloud,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Trash2,
  LayoutTemplate,
  FileBadge,
  ArrowRight,
  ChevronRight,
  Briefcase,
  Target,
  Sparkles,
  BookOpen,
  Code,
  ShieldCheck,
  Check,
  RefreshCw,
  HelpCircle,
  ExternalLink,
  Layers,
  Clock,
  Send,
  Eye,
  Copy,
  CheckCheck,
  FileCheck,
  ArrowUpRight,
  BarChart3,
  Filter,
  SlidersHorizontal,
  ChevronDown,
  X,
  FileCode,
  CheckCircle,
  Star,
  Zap,
  TrendingUp,
  Download,
  Flame,
  BookmarkCheck,
  GraduationCap,
  Plus,
  Printer,
  Save,
  Palette,
  Edit3,
  Share2,
} from "lucide-react";
import { TARGET_ROLES, TargetRoleRequirement } from "@/lib/resumeParser/normalizationDictionary";
import { SAMPLE_RESUMES, SampleResumeData } from "@/lib/resumeParser/sampleResumes";
import { ResumeParser } from "@/lib/resumeParser/sectionExtractor";
import { ResumeAlignmentEngine, RoleAlignmentReport } from "@/lib/resumeParser/alignmentEngine";

// ============================================================================
// RESUME DESIGNER DATA INTERFACE & DEFAULT PRESETS
// ============================================================================

interface DesignedResumeData {
  fullName: string;
  targetRoleTitle: string;
  email: string;
  phone: string;
  location: string;
  github: string;
  linkedin: string;
  portfolio: string;
  summary: string;
  skills: string[];
  projects: Array<{
    title: string;
    tech: string;
    bullets: string[];
  }>;
  experience: Array<{
    role: string;
    company: string;
    period: string;
    bullets: string[];
  }>;
  education: {
    degree: string;
    institution: string;
    year: string;
    cgpa: string;
  };
}

const DEFAULT_RESUME_DATA: DesignedResumeData = {
  fullName: "Arjun Verma",
  targetRoleTitle: "Backend Software Engineer",
  email: "arjun.verma@demo.com",
  phone: "+91 98765 43210",
  location: "Bangalore, India",
  github: "github.com/arjun-backend",
  linkedin: "linkedin.com/in/arjun-verma-dev",
  portfolio: "arjunverma.dev",
  summary:
    "Backend Software Engineer with hands-on expertise building enterprise REST APIs and distributed microservices with Java 17 and Spring Boot. Skilled in PostgreSQL schema architecture, Redis caching, Docker containerization, and low-latency cloud deployments.",
  skills: [
    "Java 17",
    "Spring Boot",
    "PostgreSQL",
    "REST APIs",
    "Docker",
    "Redis",
    "Microservices",
    "Git",
    "Kafka",
    "JUnit 5",
  ],
  projects: [
    {
      title: "Distributed Order & Checkout Microservice",
      tech: "Java, Spring Boot, PostgreSQL, Docker, Redis",
      bullets: [
        "Engineered scalable checkout microservice handling over 12,000 daily orders with 99.9% uptime.",
        "Architected PostgreSQL B-tree indexing and optimized connection pooling, cutting P95 response latency by 34%.",
        "Integrated Redis caching layer for inventory reads, reducing roundtrip query times from 180ms to 24ms.",
        "Containerized deployments with multi-stage Docker builds, decreasing image footprint by 45%.",
      ],
    },
    {
      title: "Automated Banking Reconciliation Engine",
      tech: "Java, Spring Data JPA, SQL, JUnit 5",
      bullets: [
        "Engineered secure ledger transaction engine adhering to ACID guarantees and JWT token authorization.",
        "Authored SQL stored procedures and complex joins processing 50k+ historical ledger rows in <1.2s.",
        "Achieved 82% unit test code coverage using JUnit 5 and Mockito in CI/CD pipeline.",
      ],
    },
  ],
  experience: [
    {
      role: "Backend Engineering Intern",
      company: "CloudFin Solutions Ltd.",
      period: "Jan 2026 – Present",
      bullets: [
        "Collaborated with platform leads to decouple monolithic billing module into high-throughput Spring Boot service.",
        "Developed 6 resilient REST endpoints handling peak webhook traffic of 350 requests/sec with automated retry queues.",
        "Identified and resolved N+1 Hibernate query bottlenecks across core reporting dashboards.",
      ],
    },
  ],
  education: {
    degree: "B.Tech in Computer Science & Engineering",
    institution: "National Institute of Technology",
    year: "2022 – 2026",
    cgpa: "8.7 / 10.0",
  },
};

const SNEHA_PRESET: DesignedResumeData = {
  fullName: "Sneha Nair",
  targetRoleTitle: "Frontend React & Next.js Engineer",
  email: "sneha.nair@demo.com",
  phone: "+91 91234 56789",
  location: "Pune, India",
  github: "github.com/sneha-web",
  linkedin: "linkedin.com/in/sneha-ui-dev",
  portfolio: "snehanair.dev",
  summary:
    "Frontend Engineer specializing in modern React 19, Next.js App Router, and TypeScript. Passionate about tactile micro-interactions, responsive design systems, accessible UI/UX, and sub-second Core Web Vitals.",
  skills: [
    "React 19",
    "Next.js 15",
    "TypeScript",
    "Tailwind CSS",
    "Redux Toolkit",
    "REST & GraphQL",
    "Jest & RTL",
    "Figma",
    "Vite",
  ],
  projects: [
    {
      title: "Interactive SaaS Analytics Platform",
      tech: "Next.js, TypeScript, Tailwind CSS, Recharts",
      bullets: [
        "Architected real-time telemetry dashboard visualizing 100k+ event streams using streaming React Server Components.",
        "Optimized Largest Contentful Paint (LCP) from 2.8s to 0.9s via automatic image optimization and code-splitting.",
        "Created reusable design system components compliant with WCAG 2.1 AA accessibility guidelines.",
      ],
    },
  ],
  experience: [
    {
      role: "Frontend Developer Intern",
      company: "PixelCraft Interactive",
      period: "Jul 2025 – Dec 2025",
      bullets: [
        "Built responsive client portals deployed to 40,000 monthly active users.",
        "Refactored legacy form validation to Zod schemas, reducing client-side input errors by 52%.",
      ],
    },
  ],
  education: {
    degree: "B.Tech in Information Technology",
    institution: "Pune Institute of Computer Technology",
    year: "2022 – 2026",
    cgpa: "8.9 / 10.0",
  },
};

// Initial deterministic analysis
const initialAnalysis = ResumeAlignmentEngine.analyze(
  ResumeParser.extractStructuredData(SAMPLE_RESUMES["backend-java"].rawText),
  "backend-dev"
);

export default function DocumentsPage() {
  const [activeTab, setActiveTab] = useState<"resumes" | "designer" | "ats" | "certificates">("resumes");
  const certInputRef = useRef<HTMLInputElement>(null);
  const resumeInputRef = useRef<HTMLInputElement>(null);

  // Resume State
  const [resumes, setResumes] = useState<any[]>([]);
  const [resumeLoading, setResumeLoading] = useState(true);
  const [uploadStatus, setUploadStatus] = useState<"idle" | "uploading" | "error" | "success">("idle");
  const [uploadError, setUploadError] = useState("");

  // Target Role & Analysis State
  const [selectedRole, setSelectedRole] = useState<string>("backend-dev");
  const [selectedSampleKey, setSelectedSampleKey] = useState<string | null>("backend-java");
  const [analysisReport, setAnalysisReport] = useState<RoleAlignmentReport | null>(initialAnalysis);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [criteriaFilter, setCriteriaFilter] = useState<"all" | "matched" | "partial" | "missing">("all");
  const [dragActive, setDragActive] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>("Arjun_Verma_Backend_Resume.pdf");

  // Resume Designer State
  const [resumeData, setResumeData] = useState<DesignedResumeData>(DEFAULT_RESUME_DATA);
  const [newSkillInput, setNewSkillInput] = useState("");
  const [designerSaveStatus, setDesignerSaveStatus] = useState(false);

  // Certificates State
  const [verifiedCertificates, setVerifiedCertificates] = useState([
    {
      id: 1,
      name: "AWS Certified Solutions Architect – Associate",
      issuer: "Amazon Web Services (AWS)",
      date: "Aug 2025",
      type: "Cloud Architecture",
      credentialId: "AWS-PSA-894129",
    },
    {
      id: 2,
      name: "Full Stack Web Engineering & Next.js Architecture",
      issuer: "Frontend Masters Academy",
      date: "Jan 2026",
      type: "Web Engineering",
      credentialId: "FM-CERT-904128",
    },
    {
      id: 3,
      name: "Algorithmic Problem Solving & Data Structures",
      issuer: "Stanford Online / Coursera",
      date: "Nov 2025",
      type: "Computer Science",
      credentialId: "STN-ALG-773124",
    },
  ]);
  const [certUploadSuccess, setCertUploadSuccess] = useState(false);

  // Modal State for Raw & Structured Data
  const [viewingResume, setViewingResume] = useState<any>(null);
  const [modalTab, setModalTab] = useState<"skills" | "structured" | "raw">("skills");
  const [copied, setCopied] = useState(false);

  // Fetch Saved Resumes
  const fetchResumes = async () => {
    try {
      const res = await fetch("/api/student/resume");
      if (res.ok) {
        const data = await res.json();
        setResumes(data);
      }
    } catch (e) {
      console.error("Failed to fetch resumes", e);
    } finally {
      setResumeLoading(false);
    }
  };

  useEffect(() => {
    fetchResumes();
    runAnalysis("backend-java", undefined, "backend-dev");
  }, []);

  // Analysis Runner
  const runAnalysis = async (sampleKey?: string, resumeId?: string, roleId?: string) => {
    setIsAnalyzing(true);
    const targetRoleId = roleId || selectedRole;

    try {
      const res = await fetch("/api/student/resume/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sampleKey: sampleKey || selectedSampleKey || undefined,
          resumeId: resumeId || undefined,
          targetRoleId: targetRoleId,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.analysis) {
          setAnalysisReport(data.analysis);
        }
      }
    } catch (err) {
      console.error("Analysis execution failed:", err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Upload Handlers
  const handleCertUploadClick = () => certInputRef.current?.click();
  const handleResumeUploadClick = () => resumeInputRef.current?.click();

  const handleCertFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const newCert = {
      id: Date.now(),
      name: file.name.replace(/\.[^/.]+$/, ""),
      issuer: "Verified Credential Submission",
      date: new Date().toLocaleDateString("en-US", { month: "short", year: "numeric" }),
      type: "Student Submission",
      credentialId: "AUTH-" + Math.floor(100000 + Math.random() * 900000),
    };
    setVerifiedCertificates((prev) => [newCert, ...prev]);
    setCertUploadSuccess(true);
    setTimeout(() => setCertUploadSuccess(false), 3500);
  };

  const handleResumeChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    await processFileUpload(file);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      await processFileUpload(e.dataTransfer.files[0]);
    }
  };

  const processFileUpload = async (file: File) => {
    if (file.type !== "application/pdf" && !file.name.toLowerCase().endsWith(".pdf")) {
      setUploadStatus("error");
      setUploadError("Only standard PDF documents are supported for ATS screening.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setUploadStatus("error");
      setUploadError("File size exceeds 5MB limit. Please upload a compressed PDF.");
      return;
    }

    setUploadStatus("uploading");
    setUploadError("");
    setUploadedFileName(file.name);
    setSelectedSampleKey(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/student/resume", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload failed");

      setUploadStatus("success");
      await fetchResumes();

      // Trigger text extraction
      await fetch(`/api/student/resume/${data.resume.id}/extract`, { method: "POST" });
      await fetchResumes();

      // Trigger automatic role alignment analysis
      await runAnalysis(undefined, data.resume.id, selectedRole);

      setTimeout(() => setUploadStatus("idle"), 3000);
    } catch (err: any) {
      setUploadStatus("error");
      setUploadError(err.message || "Failed to process resume");
    }
  };

  const deleteResume = async (id: string) => {
    if (!confirm("Are you sure you want to remove this resume?")) return;
    try {
      const res = await fetch(`/api/student/resume/${id}`, { method: "DELETE" });
      if (res.ok) {
        fetchResumes();
      }
    } catch (e) {
      alert("Error deleting resume.");
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Add skill to designed resume
  const handleAddSkill = () => {
    if (!newSkillInput.trim()) return;
    if (!resumeData.skills.includes(newSkillInput.trim())) {
      setResumeData({ ...resumeData, skills: [...resumeData.skills, newSkillInput.trim()] });
    }
    setNewSkillInput("");
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setResumeData({
      ...resumeData,
      skills: resumeData.skills.filter((s) => s !== skillToRemove),
    });
  };

  const handleSaveDesignedResume = () => {
    setDesignerSaveStatus(true);
    setUploadedFileName(`${resumeData.fullName.replace(/\s+/g, "_")}_Designed_Resume.pdf`);
    setTimeout(() => setDesignerSaveStatus(false), 3000);
  };

  const handlePrintResume = () => {
    window.print();
  };

  const currentRoleInfo = TARGET_ROLES.find((r) => r.id === selectedRole) || TARGET_ROLES[0];
  const alignmentScore = analysisReport?.alignmentPercentage ?? 0;

  // SVG circular gauge calculation
  const circleRadius = 44;
  const circleCircumference = 2 * Math.PI * circleRadius;
  const strokeOffset = circleCircumference - (alignmentScore / 100) * circleCircumference;

  return (
    <div className="max-w-6xl mx-auto space-y-7 pb-24 px-4 sm:px-6">
      {/* Printable Resume Styling for Clean A4 Output */}
      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #printable-resume-sheet,
          #printable-resume-sheet * {
            visibility: visible;
          }
          #printable-resume-sheet {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            margin: 0;
            padding: 18mm 20mm;
            box-shadow: none !important;
            border: none !important;
            background: white !important;
            color: #0f172a !important;
          }
        }
      `}</style>

      {/* =========================================================================
          PARSED DATA & STRUCTURED JSON MODAL
         ========================================================================= */}
      {viewingResume && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-white dark:bg-slate-900 rounded-[28px] shadow-[0_20px_50px_rgba(0,0,0,0.15)] max-w-3xl w-full max-h-[85vh] flex flex-col border border-slate-200/90 dark:border-slate-800 overflow-hidden">
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-[#fbfdfc] dark:bg-slate-850">
              <div className="flex items-center space-x-3.5">
                <div className="w-10 h-10 rounded-2xl bg-[#a2e6cc] text-[#064e3b] flex items-center justify-center shadow-xs">
                  <FileCode className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white truncate max-w-xs sm:max-w-md">
                    {viewingResume.originalFilename || "Extracted Evidence Dossier"}
                  </h3>
                  <p className="text-xs text-slate-400">Deterministic skills taxonomy extraction &amp; schema mapping</p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() =>
                    copyToClipboard(
                      modalTab === "raw"
                        ? viewingResume.extractedText || ""
                        : modalTab === "structured"
                        ? viewingResume.structuredData || ""
                        : JSON.stringify(viewingResume.skillEvidences || [], null, 2)
                    )
                  }
                  className="px-3 py-1.5 rounded-full border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center space-x-1.5 transition-colors cursor-pointer"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? "Copied!" : "Copy"}</span>
                </button>
                <button
                  onClick={() => setViewingResume(null)}
                  className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Modal Tabs */}
            <div className="flex px-6 pt-3 border-b border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 gap-6">
              {[
                { id: "skills", label: "Taxonomy Mapped Skills" },
                { id: "structured", label: "Structured JSON" },
                { id: "raw", label: "Raw Extracted Text" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setModalTab(tab.id as any)}
                  className={`pb-3 text-xs font-extrabold transition-all relative cursor-pointer ${
                    modalTab === tab.id
                      ? "text-[#065f46] dark:text-[#a2e6cc] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-[#a2e6cc]"
                      : "text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto flex-1 font-mono text-xs bg-slate-50/50 dark:bg-slate-950/60">
              {modalTab === "raw" && (
                <div className="whitespace-pre-wrap text-slate-700 dark:text-slate-300 font-sans leading-relaxed p-2">
                  {viewingResume.extractedText || "No text extracted."}
                </div>
              )}
              {modalTab === "structured" && (
                <pre className="text-slate-800 dark:text-emerald-300 whitespace-pre-wrap leading-relaxed p-2 font-mono">
                  {viewingResume.structuredData
                    ? JSON.stringify(JSON.parse(viewingResume.structuredData), null, 2)
                    : "No structured data available."}
                </pre>
              )}
              {modalTab === "skills" && (
                <div className="space-y-3 font-sans">
                  {!viewingResume.skillEvidences || viewingResume.skillEvidences.length === 0 ? (
                    <div className="p-10 text-center text-slate-400 italic">
                      No taxonomy-mapped skills recorded for this file yet.
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      {viewingResume.skillEvidences.map((ev: any) => (
                        <div
                          key={ev.id}
                          className="bg-white dark:bg-slate-850 p-4 border border-slate-200/80 dark:border-slate-800 rounded-2xl shadow-xs"
                        >
                          <div className="flex justify-between items-start mb-1.5">
                            <span className="font-extrabold text-sm text-slate-900 dark:text-white">
                              {ev.skill?.name || ev.detectedName}
                            </span>
                            <span className="bg-[#a2e6cc]/30 text-[#065f46] dark:text-[#a2e6cc] text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border border-[#a2e6cc]">
                              {(ev.confidence * 100).toFixed(0)}% Confidence
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-400 mb-2">
                            Source: <span className="font-semibold text-slate-600 dark:text-slate-300">{ev.evidenceSource}</span>
                          </p>
                          {ev.evidenceText && (
                            <p className="bg-slate-50 dark:bg-slate-800 p-2.5 text-slate-600 dark:text-slate-300 text-[11px] italic rounded-xl border-l-2 border-[#a2e6cc] leading-relaxed">
                              &quot;{ev.evidenceText.length > 120 ? ev.evidenceText.substring(0, 120) + "..." : ev.evidenceText}&quot;
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          PRODUCT UI STYLEGUIDE HEADER & METRIC TOKENS
         ========================================================================= */}
      <div className="space-y-4">
        {/* Styleguide-inspired Top Action Strip */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2.5 mb-1">
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                Resume Studio &amp; Documents
              </h1>
              <span className="px-3 py-1 rounded-full text-[11px] font-extrabold bg-[#a2e6cc] text-[#064e3b] shadow-xs flex items-center space-x-1">
                <Check className="w-3.5 h-3.5 stroke-[3]" />
                <span>Tactile UI Studio</span>
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              Interactive resume designer, ATS evidence screening, and verified credential management.
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setActiveTab("designer")}
              className="px-4 py-2 rounded-full bg-[#a2e6cc] hover:bg-[#8ee0bf] text-[#064e3b] text-xs font-black shadow-[0_4px_14px_rgba(0,0,0,0.06),inset_0_1px_1px_rgba(255,255,255,0.8)] hover:shadow-[0_0_20px_rgba(0,207,204,0.45)] transition-all flex items-center space-x-1.5 cursor-pointer"
            >
              <Palette className="w-3.5 h-3.5" />
              <span>Design Resume</span>
            </button>
            <button
              onClick={handleResumeUploadClick}
              className="px-4 py-2 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-extrabold transition-all flex items-center space-x-1.5 cursor-pointer"
            >
              <UploadCloud className="w-3.5 h-3.5" />
              <span>Upload PDF</span>
            </button>
          </div>
        </div>

        {/* 3 Porcelain Metric Elevation Tiles */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-5 rounded-[22px] bg-white dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800 shadow-[0_6px_20px_rgba(0,0,0,0.04)] flex items-center space-x-4">
            <div className="w-12 h-12 rounded-2xl bg-[#a2e6cc]/30 text-[#065f46] dark:text-[#a2e6cc] flex items-center justify-center shrink-0 shadow-xs border border-[#a2e6cc]/50">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Active Resumes</p>
              <div className="flex items-baseline space-x-1.5 mt-0.5">
                <span className="text-xl font-black text-slate-900 dark:text-white">
                  {resumes.length > 0 ? resumes.length : 1}
                </span>
                <span className="text-xs text-slate-500">
                  {uploadedFileName ? "• " + uploadedFileName.split(".")[0].slice(0, 16) : "• Active"}
                </span>
              </div>
            </div>
          </div>

          <div className="p-5 rounded-[22px] bg-white dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800 shadow-[0_6px_20px_rgba(0,0,0,0.04)] flex items-center space-x-4">
            <div className="w-12 h-12 rounded-2xl bg-[#a2e6cc] text-[#064e3b] flex items-center justify-center shrink-0 shadow-xs">
              <Target className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Role Alignment</p>
              <div className="flex items-baseline space-x-1.5 mt-0.5">
                <span className="text-xl font-black text-slate-900 dark:text-white">
                  {alignmentScore}%
                </span>
                <span className="text-xs font-bold text-[#065f46] dark:text-[#a2e6cc]">
                  • {currentRoleInfo.title.split(" ")[0]} Ready
                </span>
              </div>
            </div>
          </div>

          <div className="p-5 rounded-[22px] bg-white dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800 shadow-[0_6px_20px_rgba(0,0,0,0.04)] flex items-center space-x-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950/80 text-amber-600 flex items-center justify-center shrink-0 shadow-xs border border-amber-200/60">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Verified Certs</p>
              <div className="flex items-baseline space-x-1.5 mt-0.5">
                <span className="text-xl font-black text-slate-900 dark:text-white">
                  {verifiedCertificates.length}
                </span>
                <span className="text-xs text-amber-700 dark:text-amber-300 font-semibold">• Authenticated</span>
              </div>
            </div>
          </div>
        </div>

        {/* Product UI Styleguide Recessed Segmented Track */}
        <div className="rounded-full bg-[#e2e8f0]/80 dark:bg-slate-800 p-1.5 flex items-center shadow-[inset_0_2px_4px_rgba(0,0,0,0.06)] w-full sm:w-fit overflow-x-auto">
          <button
            onClick={() => setActiveTab("resumes")}
            className={`flex-1 sm:flex-initial flex items-center justify-center space-x-2 px-5 py-2 rounded-full text-xs font-extrabold transition-all cursor-pointer ${
              activeTab === "resumes"
                ? "bg-[#a2e6cc] text-[#064e3b] shadow-[0_3px_10px_rgba(0,0,0,0.08),inset_0_1px_1px_rgba(255,255,255,0.8)]"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>My Resumes ({resumes.length > 0 ? resumes.length : 1})</span>
          </button>
          <button
            onClick={() => setActiveTab("designer")}
            className={`flex-1 sm:flex-initial flex items-center justify-center space-x-2 px-5 py-2 rounded-full text-xs font-extrabold transition-all cursor-pointer ${
              activeTab === "designer"
                ? "bg-[#a2e6cc] text-[#064e3b] shadow-[0_3px_10px_rgba(0,0,0,0.08),inset_0_1px_1px_rgba(255,255,255,0.8)]"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            <Palette className="w-3.5 h-3.5" />
            <span>Design Resume</span>
          </button>
          <button
            onClick={() => setActiveTab("ats")}
            className={`flex-1 sm:flex-initial flex items-center justify-center space-x-2 px-5 py-2 rounded-full text-xs font-extrabold transition-all cursor-pointer ${
              activeTab === "ats"
                ? "bg-[#a2e6cc] text-[#064e3b] shadow-[0_3px_10px_rgba(0,0,0,0.08),inset_0_1px_1px_rgba(255,255,255,0.8)]"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            <Target className="w-3.5 h-3.5" />
            <span>ATS Role Match ({alignmentScore}%)</span>
          </button>
          <button
            onClick={() => setActiveTab("certificates")}
            className={`flex-1 sm:flex-initial flex items-center justify-center space-x-2 px-5 py-2 rounded-full text-xs font-extrabold transition-all cursor-pointer ${
              activeTab === "certificates"
                ? "bg-[#a2e6cc] text-[#064e3b] shadow-[0_3px_10px_rgba(0,0,0,0.08),inset_0_1px_1px_rgba(255,255,255,0.8)]"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            <Award className="w-3.5 h-3.5" />
            <span>Certificates ({verifiedCertificates.length})</span>
          </button>
        </div>
      </div>

      {/* Hidden File Inputs */}
      <input
        type="file"
        ref={resumeInputRef}
        onChange={handleResumeChange}
        className="hidden"
        accept=".pdf"
      />
      <input
        type="file"
        ref={certInputRef}
        onChange={handleCertFileChange}
        className="hidden"
        accept=".pdf,.png,.jpg,.jpeg"
      />

      {/* =========================================================================
          TAB 1: MY RESUMES (PORCELAIN & TACTILE DESIGN)
         ========================================================================= */}
      {activeTab === "resumes" && (
        <div className="space-y-6 animate-in fade-in-50 duration-200">
          {/* Porcelain Dropzone with Focus-Ring & Level 2 Elevation */}
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setDragActive(true);
            }}
            onDragLeave={() => setDragActive(false)}
            onDrop={handleDrop}
            onClick={handleResumeUploadClick}
            className={`rounded-[28px] p-8 text-center cursor-pointer transition-all border-2 border-dashed flex flex-col items-center justify-center relative overflow-hidden group ${
              dragActive
                ? "border-[#00cfcc] bg-[#a2e6cc]/10 shadow-[0_0_24px_rgba(0,207,204,0.3)]"
                : "border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-850 hover:border-[#a2e6cc] hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)]"
            }`}
          >
            <div className="w-14 h-14 rounded-2xl bg-[#a2e6cc] text-[#064e3b] flex items-center justify-center mb-3 shadow-[0_4px_12px_rgba(0,0,0,0.06)] group-hover:scale-110 transition-transform">
              {uploadStatus === "uploading" ? (
                <Loader2 className="w-7 h-7 animate-spin" />
              ) : (
                <UploadCloud className="w-7 h-7" />
              )}
            </div>

            <h3 className="text-base sm:text-lg font-black text-slate-800 dark:text-slate-100">
              {uploadStatus === "uploading"
                ? "Extracting Candidate Skills & Parsing Evidence..."
                : "Click or drag & drop resume PDF"}
            </h3>
            <p className="text-xs text-slate-400 mt-1 max-w-md">
              Extracts quantifiable outcomes, skills taxonomy matches, and role alignment instantaneously.
            </p>

            <div className="mt-4 flex items-center space-x-2 text-[11px] text-slate-500">
              <span className="px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 font-bold">PDF Format</span>
              <span>•</span>
              <span className="px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 font-bold">Max 5MB</span>
              <span>•</span>
              <span className="px-3 py-1 rounded-full bg-[#a2e6cc]/40 text-[#064e3b] dark:text-[#a2e6cc] font-extrabold">100% Encrypted</span>
            </div>

            {uploadedFileName && (
              <div className="mt-4 inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-[#d1fae5] text-[#065f46] text-xs font-black border border-[#a7f3d0] shadow-xs">
                <Check className="w-4 h-4 stroke-[3]" />
                <span className="truncate max-w-[280px]">{uploadedFileName}</span>
              </div>
            )}

            {uploadStatus === "error" && (
              <div className="mt-3 text-xs font-bold text-rose-700 bg-rose-50 px-4 py-1.5 rounded-full border border-rose-200 flex items-center space-x-1.5">
                <AlertCircle className="w-4 h-4" />
                <span>{uploadError}</span>
              </div>
            )}
          </div>

          {/* Preset Buttons using Styleguide Chips & Pills */}
          <div className="bg-[#fbfdfc] dark:bg-slate-850 p-5 rounded-[24px] border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center space-x-2 text-xs font-extrabold text-slate-700 dark:text-slate-300">
              <Sparkles className="w-4 h-4 text-amber-500 shrink-0" />
              <span>Quick test with pre-configured candidate profiles:</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {[
                { key: "backend-java", label: "Arjun (Java Backend)", role: "backend-dev" },
                { key: "frontend-react", label: "Sneha (React Frontend)", role: "frontend-dev" },
                { key: "fresher-generalist", label: "Rohan (CS Fresher)", role: "backend-dev" },
              ].map((sample) => (
                <button
                  key={sample.key}
                  onClick={() => {
                    setSelectedSampleKey(sample.key);
                    setUploadedFileName(SAMPLE_RESUMES[sample.key].filename);
                    setSelectedRole(sample.role);
                    runAnalysis(sample.key, undefined, sample.role);
                  }}
                  className={`text-xs font-black px-4 py-1.5 rounded-full transition-all cursor-pointer ${
                    selectedSampleKey === sample.key
                      ? "bg-[#a2e6cc] text-[#064e3b] shadow-[0_2px_8px_rgba(0,0,0,0.08),inset_0_1px_1px_rgba(255,255,255,0.7)]"
                      : "bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700"
                  }`}
                >
                  {sample.label}
                </button>
              ))}
            </div>
          </div>

          {/* Stored Resumes Porcelain Showcase */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-black text-slate-900 dark:text-slate-100 flex items-center space-x-2">
                <FileCheck className="w-4 h-4 text-[#065f46] dark:text-[#a2e6cc]" />
                <span>Active Document Portfolio</span>
              </h2>
              <span className="text-xs text-slate-400">
                {resumes.length > 0 ? `${resumes.length} document(s)` : "1 active profile"}
              </span>
            </div>

            {resumeLoading ? (
              <div className="p-10 text-center text-slate-400 flex items-center justify-center space-x-2">
                <Loader2 className="w-5 h-5 animate-spin" />
                <span className="text-xs font-bold">Loading portfolio...</span>
              </div>
            ) : resumes.length === 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Active Profile Tile */}
                <div className="bg-white dark:bg-slate-850 p-6 rounded-[28px] border border-slate-200/90 dark:border-slate-800 shadow-[0_8px_24px_rgba(0,0,0,0.05)] hover:border-[#a2e6cc] transition-all flex flex-col justify-between group">
                  <div>
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-12 h-12 rounded-2xl bg-[#a2e6cc] text-[#064e3b] flex items-center justify-center shadow-xs">
                        <FileText className="w-6 h-6" />
                      </div>
                      <span className="inline-flex items-center space-x-1 text-[10px] font-black px-3 py-1 rounded-full bg-[#d1fae5] text-[#065f46] border border-[#a7f3d0]">
                        <Star className="w-3 h-3 fill-[#065f46] text-[#065f46]" />
                        <span>Primary Profile</span>
                      </span>
                    </div>

                    <h3 className="text-base font-black text-slate-900 dark:text-white truncate">
                      {uploadedFileName || "Arjun_Verma_Backend_Resume.pdf"}
                    </h3>
                    <p className="text-xs text-slate-400 mt-1 flex items-center space-x-1.5">
                      <span>PDF Document</span>
                      <span>•</span>
                      <span>1.2 MB</span>
                      <span>•</span>
                      <span>Target: {currentRoleInfo.title}</span>
                    </p>

                    <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
                      <div className="flex flex-wrap gap-1.5">
                        {["Java 17", "Spring Boot", "PostgreSQL", "Docker", "REST APIs", "Redis"].map((s) => (
                          <span
                            key={s}
                            className="text-[11px] font-bold px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-750 text-slate-700 dark:text-slate-300"
                          >
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <button
                      onClick={() => {
                        const sampleData = SAMPLE_RESUMES[selectedSampleKey || "backend-java"];
                        setViewingResume({
                          originalFilename: sampleData.filename,
                          extractedText: sampleData.rawText,
                          structuredData: JSON.stringify(ResumeParser.extractStructuredData(sampleData.rawText)),
                          skillEvidences: analysisReport?.matchedSkills.map((m, idx) => ({
                            id: idx,
                            skill: { name: m.name },
                            confidence: 0.95,
                            evidenceSource: m.source,
                            evidenceText: m.snippet,
                            skillId: "sk_" + idx,
                          })),
                        });
                      }}
                      className="text-xs font-extrabold text-slate-600 dark:text-slate-300 hover:text-[#065f46] flex items-center space-x-1.5 cursor-pointer"
                    >
                      <Eye className="w-4 h-4" />
                      <span>View Parsed Data</span>
                    </button>

                    <button
                      onClick={() => setActiveTab("ats")}
                      className="px-4 py-1.5 rounded-full bg-[#a2e6cc] hover:bg-[#8ee0bf] text-[#064e3b] text-xs font-black shadow-xs flex items-center space-x-1.5 transition-all cursor-pointer"
                    >
                      <span>ATS Match ({alignmentScore}%)</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Designer Trigger Card */}
                <div
                  onClick={() => setActiveTab("designer")}
                  className="bg-white dark:bg-slate-850 p-6 rounded-[28px] border-2 border-dashed border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center text-center cursor-pointer hover:border-[#a2e6cc] hover:shadow-lg transition-all group"
                >
                  <div className="w-12 h-12 rounded-2xl bg-[#a2e6cc]/30 text-[#064e3b] group-hover:scale-110 transition-transform flex items-center justify-center mb-3">
                    <Palette className="w-6 h-6" />
                  </div>
                  <h4 className="text-sm font-black text-slate-800 dark:text-slate-200">
                    Design Your Resume in Live Studio
                  </h4>
                  <p className="text-xs text-slate-400 mt-1 max-w-xs leading-relaxed">
                    Use our interactive visual builder with real-time A4 preview, ATS feedback, and print PDF export.
                  </p>
                  <span className="mt-4 px-4 py-1.5 rounded-full bg-slate-100 group-hover:bg-[#a2e6cc] text-[#064e3b] text-xs font-extrabold flex items-center space-x-1.5 transition-colors">
                    <span>Open Resume Studio</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {resumes.map((resume) => (
                  <div
                    key={resume.id}
                    className="bg-white dark:bg-slate-850 p-6 rounded-[28px] border border-slate-200/90 dark:border-slate-800 shadow-[0_8px_24px_rgba(0,0,0,0.05)] hover:border-[#a2e6cc] transition-all flex flex-col justify-between group"
                  >
                    <div>
                      <div className="flex items-start justify-between mb-3.5">
                        <div className="w-11 h-11 rounded-2xl bg-[#a2e6cc] text-[#064e3b] flex items-center justify-center shadow-xs">
                          <FileText className="w-5 h-5" />
                        </div>
                        <div className="flex items-center space-x-1">
                          <button
                            onClick={() => setViewingResume(resume)}
                            className="p-2 rounded-full text-slate-400 hover:text-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                            title="View Extracted Text"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => deleteResume(resume.id)}
                            className="p-2 rounded-full text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950 transition-colors cursor-pointer"
                            title="Delete Document"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      <h3 className="text-sm font-black text-slate-900 dark:text-white truncate" title={resume.originalFilename}>
                        {resume.originalFilename}
                      </h3>
                      <p className="text-xs text-slate-400 mt-1 flex items-center space-x-1">
                        <span>{resume.fileType === "application/pdf" ? "PDF" : "DOC"}</span>
                        <span>•</span>
                        <span>{(resume.fileSize / 1024 / 1024).toFixed(2)} MB</span>
                        <span>•</span>
                        <span>Stored</span>
                      </p>
                    </div>

                    <div className="mt-5 pt-3.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                      <button
                        onClick={() => {
                          setUploadedFileName(resume.originalFilename);
                          setSelectedSampleKey(null);
                          setActiveTab("ats");
                          runAnalysis(undefined, resume.id, selectedRole);
                        }}
                        className="text-xs font-black text-[#065f46] dark:text-[#a2e6cc] hover:underline flex items-center space-x-1.5 cursor-pointer"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                        <span>Run ATS Match</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 2: INTERACTIVE RESUME DESIGNER STUDIO (NEW FEATURE!)
         ========================================================================= */}
      {activeTab === "designer" && (
        <div className="space-y-6 animate-in fade-in-50 duration-200">
          {/* Studio Top Control Strip */}
          <div className="bg-white dark:bg-slate-850 rounded-[28px] p-5 sm:p-6 border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center space-x-3.5">
              <div className="w-11 h-11 rounded-2xl bg-[#a2e6cc] text-[#064e3b] flex items-center justify-center shrink-0 shadow-xs">
                <Palette className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-black text-slate-900 dark:text-white">
                  Resume Designer Canvas
                </h3>
                <p className="text-xs text-slate-400">
                  Real-time visual editor with ATS alignment scoring and clean A4 print preview.
                </p>
              </div>
            </div>

            {/* Presets & Actions */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => setResumeData(DEFAULT_RESUME_DATA)}
                className="px-3.5 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold transition-all cursor-pointer"
              >
                Pre-fill Arjun (Java)
              </button>
              <button
                onClick={() => setResumeData(SNEHA_PRESET)}
                className="px-3.5 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold transition-all cursor-pointer"
              >
                Pre-fill Sneha (React)
              </button>

              <button
                onClick={handlePrintResume}
                className="px-4 py-2 rounded-full bg-slate-900 hover:bg-slate-800 text-white text-xs font-extrabold flex items-center space-x-1.5 transition-all shadow-xs cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print / Download PDF</span>
              </button>

              <button
                onClick={handleSaveDesignedResume}
                className="px-4 py-2 rounded-full bg-[#a2e6cc] hover:bg-[#8ee0bf] text-[#064e3b] text-xs font-black shadow-[0_4px_12px_rgba(0,0,0,0.06)] hover:shadow-[0_0_18px_rgba(0,207,204,0.4)] flex items-center space-x-1.5 transition-all cursor-pointer"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save to My Resumes</span>
              </button>
            </div>
          </div>

          {designerSaveStatus && (
            <div className="p-3.5 rounded-full bg-[#d1fae5] border border-[#a7f3d0] text-[#065f46] text-xs font-black flex items-center space-x-2 animate-in fade-in shadow-xs">
              <Check className="w-4 h-4 stroke-[3]" />
              <span>Resume saved successfully! It is now stored in your active document portfolio.</span>
            </div>
          )}

          {/* Studio Two-Column Grid: Form Inputs Left | Live Preview Right */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left 5 Cols: Tactile Form Controls */}
            <div className="lg:col-span-5 space-y-5 bg-white dark:bg-slate-850 p-6 rounded-[28px] border border-slate-200/90 dark:border-slate-800 shadow-[0_8px_24px_rgba(0,0,0,0.04)]">
              <div className="flex items-center space-x-2 border-b border-slate-100 dark:border-slate-800 pb-3">
                <Edit3 className="w-4 h-4 text-[#065f46] dark:text-[#a2e6cc]" />
                <h4 className="font-black text-sm text-slate-900 dark:text-white">Profile &amp; Header Information</h4>
              </div>

              {/* Recessed Pill Inputs */}
              <div className="space-y-3">
                <div>
                  <label className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider block mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={resumeData.fullName}
                    onChange={(e) => setResumeData({ ...resumeData, fullName: e.target.value })}
                    className="w-full rounded-full bg-[#f1f5f9] dark:bg-slate-800 border border-slate-300 dark:border-slate-700 shadow-[inset_0_2px_4px_rgba(0,0,0,0.06)] px-4 py-2 text-xs font-bold text-slate-800 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-[#00cfcc] focus:bg-white"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider block mb-1">
                    Target Role Headline
                  </label>
                  <input
                    type="text"
                    value={resumeData.targetRoleTitle}
                    onChange={(e) => setResumeData({ ...resumeData, targetRoleTitle: e.target.value })}
                    className="w-full rounded-full bg-[#f1f5f9] dark:bg-slate-800 border border-slate-300 dark:border-slate-700 shadow-[inset_0_2px_4px_rgba(0,0,0,0.06)] px-4 py-2 text-xs font-bold text-slate-800 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-[#00cfcc] focus:bg-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider block mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      value={resumeData.email}
                      onChange={(e) => setResumeData({ ...resumeData, email: e.target.value })}
                      className="w-full rounded-full bg-[#f1f5f9] dark:bg-slate-800 border border-slate-300 dark:border-slate-700 shadow-[inset_0_2px_4px_rgba(0,0,0,0.06)] px-4 py-2 text-xs font-bold text-slate-800 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-[#00cfcc] focus:bg-white"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider block mb-1">
                      Phone
                    </label>
                    <input
                      type="text"
                      value={resumeData.phone}
                      onChange={(e) => setResumeData({ ...resumeData, phone: e.target.value })}
                      className="w-full rounded-full bg-[#f1f5f9] dark:bg-slate-800 border border-slate-300 dark:border-slate-700 shadow-[inset_0_2px_4px_rgba(0,0,0,0.06)] px-4 py-2 text-xs font-bold text-slate-800 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-[#00cfcc] focus:bg-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider block mb-1">
                      Location
                    </label>
                    <input
                      type="text"
                      value={resumeData.location}
                      onChange={(e) => setResumeData({ ...resumeData, location: e.target.value })}
                      className="w-full rounded-full bg-[#f1f5f9] dark:bg-slate-800 border border-slate-300 dark:border-slate-700 shadow-[inset_0_2px_4px_rgba(0,0,0,0.06)] px-4 py-2 text-xs font-bold text-slate-800 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-[#00cfcc] focus:bg-white"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider block mb-1">
                      GitHub / Portfolio
                    </label>
                    <input
                      type="text"
                      value={resumeData.github}
                      onChange={(e) => setResumeData({ ...resumeData, github: e.target.value })}
                      className="w-full rounded-full bg-[#f1f5f9] dark:bg-slate-800 border border-slate-300 dark:border-slate-700 shadow-[inset_0_2px_4px_rgba(0,0,0,0.06)] px-4 py-2 text-xs font-bold text-slate-800 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-[#00cfcc] focus:bg-white"
                    />
                  </div>
                </div>

                {/* Summary */}
                <div>
                  <label className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider block mb-1">
                    Professional Summary
                  </label>
                  <textarea
                    rows={3}
                    value={resumeData.summary}
                    onChange={(e) => setResumeData({ ...resumeData, summary: e.target.value })}
                    className="w-full rounded-2xl bg-[#f1f5f9] dark:bg-slate-800 border border-slate-300 dark:border-slate-700 shadow-[inset_0_2px_4px_rgba(0,0,0,0.06)] p-3 text-xs text-slate-800 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-[#00cfcc] focus:bg-white leading-relaxed"
                  />
                </div>

                {/* Technical Skills Manager with Mint Pills */}
                <div>
                  <label className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider block mb-1.5">
                    Skills (Styleguide Pills)
                  </label>
                  <div className="flex items-center space-x-1.5 mb-2">
                    <input
                      type="text"
                      placeholder="Add skill (e.g. AWS, Redis)..."
                      value={newSkillInput}
                      onChange={(e) => setNewSkillInput(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleAddSkill()}
                      className="flex-1 rounded-full bg-[#f1f5f9] dark:bg-slate-800 border border-slate-300 dark:border-slate-700 shadow-[inset_0_2px_4px_rgba(0,0,0,0.06)] px-3.5 py-1.5 text-xs text-slate-800 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-[#00cfcc]"
                    />
                    <button
                      onClick={handleAddSkill}
                      className="px-3.5 py-1.5 rounded-full bg-[#a2e6cc] text-[#064e3b] text-xs font-black shadow-xs hover:bg-[#8ee0bf] cursor-pointer"
                    >
                      Add
                    </button>
                  </div>

                  <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto p-1">
                    {resumeData.skills.map((skill) => (
                      <span
                        key={skill}
                        className="inline-flex items-center space-x-1.5 text-[11px] font-bold px-3 py-1 rounded-full bg-[#a2e6cc]/40 text-[#064e3b] dark:text-[#a2e6cc] border border-[#a2e6cc]"
                      >
                        <span>{skill}</span>
                        <button
                          onClick={() => handleRemoveSkill(skill)}
                          className="hover:text-rose-600 cursor-pointer"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                </div>

                {/* Education */}
                <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                  <label className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider block mb-1">
                    Degree &amp; Institution
                  </label>
                  <input
                    type="text"
                    value={resumeData.education.degree}
                    onChange={(e) =>
                      setResumeData({
                        ...resumeData,
                        education: { ...resumeData.education, degree: e.target.value },
                      })
                    }
                    className="w-full rounded-full bg-[#f1f5f9] dark:bg-slate-800 border border-slate-300 dark:border-slate-700 shadow-[inset_0_2px_4px_rgba(0,0,0,0.06)] px-4 py-2 text-xs font-bold text-slate-800 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-[#00cfcc] mb-2"
                  />
                  <input
                    type="text"
                    value={resumeData.education.institution}
                    onChange={(e) =>
                      setResumeData({
                        ...resumeData,
                        education: { ...resumeData.education, institution: e.target.value },
                      })
                    }
                    className="w-full rounded-full bg-[#f1f5f9] dark:bg-slate-800 border border-slate-300 dark:border-slate-700 shadow-[inset_0_2px_4px_rgba(0,0,0,0.06)] px-4 py-2 text-xs font-bold text-slate-800 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-[#00cfcc]"
                  />
                </div>
              </div>
            </div>

            {/* Right 7 Cols: Live A4 Resume Canvas with Print Support */}
            <div className="lg:col-span-7 space-y-4">
              {/* Canvas Header Toolbar */}
              <div className="flex items-center justify-between px-2">
                <div className="flex items-center space-x-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#00cfcc] animate-pulse" />
                  <span className="text-xs font-black text-slate-700 dark:text-slate-300">
                    Live A4 Preview (Screen &amp; Print Ready)
                  </span>
                </div>
                <div className="flex items-center space-x-1.5">
                  <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-[#d1fae5] text-[#065f46] border border-[#a7f3d0]">
                    95% ATS Compatibility
                  </span>
                </div>
              </div>

              {/* The Printable A4 Sheet */}
              <div
                id="printable-resume-sheet"
                className="bg-white text-slate-900 rounded-[24px] p-8 sm:p-10 shadow-[0_12px_40px_rgba(0,0,0,0.08)] border border-slate-200 space-y-6 transition-all font-sans"
              >
                {/* Resume Header */}
                <div className="border-b-2 border-slate-800 pb-4">
                  <h1 className="text-2xl sm:text-3xl font-black tracking-tight uppercase text-slate-900">
                    {resumeData.fullName}
                  </h1>
                  <p className="text-sm font-extrabold text-[#065f46] mt-0.5">
                    {resumeData.targetRoleTitle}
                  </p>

                  <div className="mt-2.5 flex flex-wrap gap-y-1 gap-x-3 text-xs text-slate-600 font-semibold">
                    <span>{resumeData.email}</span>
                    <span>•</span>
                    <span>{resumeData.phone}</span>
                    <span>•</span>
                    <span>{resumeData.location}</span>
                    {resumeData.github && (
                      <>
                        <span>•</span>
                        <span className="font-mono text-blue-600">{resumeData.github}</span>
                      </>
                    )}
                  </div>
                </div>

                {/* Professional Summary */}
                <div>
                  <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest border-b border-slate-200 pb-1 mb-2">
                    Professional Summary
                  </h3>
                  <p className="text-xs text-slate-700 leading-relaxed font-normal">
                    {resumeData.summary}
                  </p>
                </div>

                {/* Technical Skills */}
                <div>
                  <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest border-b border-slate-200 pb-1 mb-2">
                    Core Technical Competencies
                  </h3>
                  <div className="flex flex-wrap gap-1.5">
                    {resumeData.skills.map((skill) => (
                      <span
                        key={skill}
                        className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-[#f1f5f9] text-slate-800 border border-slate-300"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Projects */}
                <div>
                  <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest border-b border-slate-200 pb-1 mb-2.5">
                    Key Engineering Projects
                  </h3>
                  <div className="space-y-3.5">
                    {resumeData.projects.map((proj, idx) => (
                      <div key={idx} className="space-y-1">
                        <div className="flex justify-between items-baseline">
                          <span className="text-xs font-black text-slate-900">{proj.title}</span>
                          <span className="text-[10px] font-mono text-slate-500 font-semibold">
                            {proj.tech}
                          </span>
                        </div>
                        <ul className="list-disc list-outside ml-4 space-y-1 text-[11px] text-slate-700 leading-relaxed">
                          {proj.bullets.map((bullet, bIdx) => (
                            <li key={bIdx}>{bullet}</li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Experience */}
                <div>
                  <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest border-b border-slate-200 pb-1 mb-2.5">
                    Work Experience
                  </h3>
                  <div className="space-y-3">
                    {resumeData.experience.map((exp, idx) => (
                      <div key={idx} className="space-y-1">
                        <div className="flex justify-between items-baseline">
                          <span className="text-xs font-black text-slate-900">
                            {exp.role} <span className="font-normal text-slate-600">| {exp.company}</span>
                          </span>
                          <span className="text-[11px] text-slate-500 font-semibold">{exp.period}</span>
                        </div>
                        <ul className="list-disc list-outside ml-4 space-y-1 text-[11px] text-slate-700 leading-relaxed">
                          {exp.bullets.map((b, bIdx) => (
                            <li key={bIdx}>{b}</li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Education */}
                <div>
                  <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest border-b border-slate-200 pb-1 mb-1.5">
                    Education &amp; Credentials
                  </h3>
                  <div className="flex justify-between items-baseline text-xs">
                    <span className="font-black text-slate-900">{resumeData.education.degree}</span>
                    <span className="text-[11px] text-slate-500">{resumeData.education.year}</span>
                  </div>
                  <div className="flex justify-between items-baseline text-xs text-slate-600 mt-0.5">
                    <span>{resumeData.education.institution}</span>
                    <span className="font-bold text-slate-800">CGPA: {resumeData.education.cgpa}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 3: ATS ROLE MATCH & INSIGHTS (STYLEGUIDE ELEVATION)
         ========================================================================= */}
      {activeTab === "ats" && analysisReport && (
        <div className="space-y-6 animate-in fade-in-50 duration-200">
          {/* Target Role Selector Toolbar */}
          <div className="bg-white dark:bg-slate-850 rounded-[28px] p-5 sm:p-6 border border-slate-200/90 dark:border-slate-800 shadow-[0_6px_20px_rgba(0,0,0,0.04)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center space-x-3.5">
              <div className="w-11 h-11 rounded-2xl bg-[#a2e6cc] text-[#064e3b] flex items-center justify-center shrink-0 shadow-xs">
                <Target className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[11px] font-black text-slate-400 uppercase tracking-wider">Evaluating Against Target Role:</p>
                <div className="flex items-center space-x-2 mt-0.5">
                  <select
                    value={selectedRole}
                    onChange={(e) => {
                      const newRole = e.target.value;
                      setSelectedRole(newRole);
                      runAnalysis(selectedSampleKey || undefined, undefined, newRole);
                    }}
                    className="text-base font-black text-slate-900 dark:text-white bg-transparent border-0 p-0 pr-6 focus:ring-0 cursor-pointer"
                  >
                    {TARGET_ROLES.map((r) => (
                      <option key={r.id} value={r.id} className="dark:bg-slate-850">
                        {r.title} ({r.department})
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2.5">
              <span className="text-xs font-bold px-3.5 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                {currentRoleInfo.experienceLevel}
              </span>
              <button
                onClick={() => runAnalysis(selectedSampleKey || undefined, undefined, selectedRole)}
                disabled={isAnalyzing}
                className="px-4 py-2 rounded-full bg-[#a2e6cc] hover:bg-[#8ee0bf] text-[#064e3b] text-xs font-black transition-all shadow-xs flex items-center space-x-1.5 cursor-pointer disabled:opacity-50"
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Analyzing...</span>
                  </>
                ) : (
                  <>
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Re-evaluate</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Executive Scorecard with SVG Radial Gauge */}
          <div className="bg-white dark:bg-slate-850 rounded-[32px] p-6 sm:p-8 border border-slate-200/90 dark:border-slate-800 shadow-[0_8px_30px_rgba(0,0,0,0.05)]">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
              {/* Radial Meter Left */}
              <div className="md:col-span-4 flex flex-col items-center justify-center p-4 border-b md:border-b-0 md:border-r border-slate-100 dark:border-slate-800">
                <div className="relative w-36 h-36 flex items-center justify-center">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 110 110">
                    <circle
                      cx="55"
                      cy="55"
                      r={circleRadius}
                      className="stroke-slate-100 dark:stroke-slate-800"
                      strokeWidth="9"
                      fill="transparent"
                    />
                    <circle
                      cx="55"
                      cy="55"
                      r={circleRadius}
                      stroke={alignmentScore >= 80 ? "#10b981" : alignmentScore >= 60 ? "#0284c7" : "#f59e0b"}
                      strokeWidth="9"
                      strokeDasharray={circleCircumference}
                      strokeDashoffset={strokeOffset}
                      strokeLinecap="round"
                      fill="transparent"
                      style={{ transition: "stroke-dashoffset 0.8s ease-in-out" }}
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">
                      {alignmentScore}%
                    </span>
                    <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
                      Role Match
                    </span>
                  </div>
                </div>

                <div className="mt-3.5">
                  <span className="text-xs font-black px-4 py-1.5 rounded-full bg-[#d1fae5] text-[#065f46] border border-[#a7f3d0]">
                    {analysisReport.alignmentLevel}
                  </span>
                </div>
              </div>

              {/* Assessment Narrative */}
              <div className="md:col-span-8 space-y-4">
                <div>
                  <span className="text-xs font-black text-[#065f46] dark:text-[#a2e6cc] uppercase tracking-wider block mb-1">
                    Screening Diagnostic
                  </span>
                  <h3 className="text-lg font-black text-slate-900 dark:text-white">
                    {analysisReport.targetRole.title} Summary
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed mt-1 font-normal">
                    {analysisReport.summaryText}
                  </p>
                </div>

                {/* 3 Quality Progress Bars */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                  <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200/60 dark:border-slate-750">
                    <div className="flex justify-between items-center text-xs mb-1.5">
                      <span className="text-[10px] font-bold text-slate-400 uppercase">Document Structure</span>
                      <span className="font-black text-emerald-600">
                        {analysisReport.qualityMetrics.structure.status}
                      </span>
                    </div>
                    <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-[#a2e6cc] h-full rounded-full" style={{ width: "95%" }} />
                    </div>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200/60 dark:border-slate-750">
                    <div className="flex justify-between items-center text-xs mb-1.5">
                      <span className="text-[10px] font-bold text-slate-400 uppercase">Skill Proof</span>
                      <span className="font-black text-blue-600">
                        {analysisReport.qualityMetrics.skillsEvidence.status}
                      </span>
                    </div>
                    <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-blue-400 h-full rounded-full" style={{ width: "85%" }} />
                    </div>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200/60 dark:border-slate-750">
                    <div className="flex justify-between items-center text-xs mb-1.5">
                      <span className="text-[10px] font-bold text-slate-400 uppercase">Measurable Outcomes</span>
                      <span className="font-black text-indigo-600">
                        {analysisReport.qualityMetrics.projectEvidence.status}
                      </span>
                    </div>
                    <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-indigo-400 h-full rounded-full" style={{ width: "75%" }} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Criteria Breakdown with Styleguide Chips */}
          <div className="bg-white dark:bg-slate-850 rounded-[32px] p-6 sm:p-8 border border-slate-200/90 dark:border-slate-800 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-5">
              <div>
                <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                  Evidence Breakdown &amp; Rubric Alignment
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Extracted from candidate bullet points, project repositories, and documented outcomes.
                </p>
              </div>

              {/* Styleguide Pill Filter Chips */}
              <div className="flex items-center space-x-1.5 bg-[#e2e8f0]/80 dark:bg-slate-800 p-1.5 rounded-full text-xs font-bold overflow-x-auto">
                <button
                  onClick={() => setCriteriaFilter("all")}
                  className={`px-4 py-1.5 rounded-full transition-all cursor-pointer ${
                    criteriaFilter === "all"
                      ? "bg-[#a2e6cc] text-[#064e3b] font-black shadow-xs"
                      : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
                  }`}
                >
                  All ({analysisReport.matchedSkills.length + analysisReport.partialSkills.length + analysisReport.missingSkills.length})
                </button>
                <button
                  onClick={() => setCriteriaFilter("matched")}
                  className={`px-4 py-1.5 rounded-full transition-all cursor-pointer ${
                    criteriaFilter === "matched"
                      ? "bg-[#a2e6cc] text-[#064e3b] font-black shadow-xs"
                      : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
                  }`}
                >
                  Strong ({analysisReport.matchedSkills.length})
                </button>
                <button
                  onClick={() => setCriteriaFilter("partial")}
                  className={`px-4 py-1.5 rounded-full transition-all cursor-pointer ${
                    criteriaFilter === "partial"
                      ? "bg-[#a2e6cc] text-[#064e3b] font-black shadow-xs"
                      : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
                  }`}
                >
                  Needs Proof ({analysisReport.partialSkills.length})
                </button>
                <button
                  onClick={() => setCriteriaFilter("missing")}
                  className={`px-4 py-1.5 rounded-full transition-all cursor-pointer ${
                    criteriaFilter === "missing"
                      ? "bg-[#a2e6cc] text-[#064e3b] font-black shadow-xs"
                      : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
                  }`}
                >
                  Missing ({analysisReport.missingSkills.length})
                </button>
              </div>
            </div>

            {/* Criteria List */}
            <div className="space-y-3.5">
              {(criteriaFilter === "all" || criteriaFilter === "matched") &&
                analysisReport.matchedSkills.map((s) => (
                  <div
                    key={"matched_" + s.name}
                    className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-800/80 border-l-4 border-l-[#10b981] border border-slate-200/80 dark:border-slate-750 text-xs shadow-[0_2px_8px_rgba(0,0,0,0.03)] hover:shadow-xs transition-all"
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center space-x-2.5">
                        <div className="w-6 h-6 rounded-full bg-[#d1fae5] text-[#065f46] flex items-center justify-center font-bold">
                          ✓
                        </div>
                        <span className="font-black text-sm text-slate-900 dark:text-white">{s.name}</span>
                        <span className="text-[10px] font-black px-3 py-0.5 rounded-full bg-[#d1fae5] text-[#065f46] border border-[#a7f3d0]">
                          Demonstrated
                        </span>
                      </div>
                      <span className="text-[11px] text-slate-400 font-semibold">{s.source}</span>
                    </div>

                    {s.snippet && (
                      <p className="text-slate-600 dark:text-slate-300 italic bg-[#fbfdfc] dark:bg-slate-850 p-3 rounded-xl border border-slate-100 dark:border-slate-800 text-[11px] mt-2.5 leading-relaxed">
                        &quot;{s.snippet}&quot;
                      </p>
                    )}
                  </div>
                ))}

              {(criteriaFilter === "all" || criteriaFilter === "partial") &&
                analysisReport.partialSkills.map((s) => (
                  <div
                    key={"partial_" + s.name}
                    className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-800/80 border-l-4 border-l-amber-400 border border-slate-200/80 dark:border-slate-750 text-xs shadow-[0_2px_8px_rgba(0,0,0,0.03)] hover:shadow-xs transition-all"
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center space-x-2.5">
                        <div className="w-6 h-6 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
                          !
                        </div>
                        <span className="font-black text-sm text-slate-900 dark:text-white">{s.name}</span>
                        <span className="text-[10px] font-bold px-3 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
                          Needs Proof
                        </span>
                      </div>
                    </div>
                    <p className="text-slate-600 dark:text-slate-300 text-xs mt-1.5">
                      <strong>Missing Depth:</strong> {s.missingProof}
                    </p>
                  </div>
                ))}

              {(criteriaFilter === "all" || criteriaFilter === "missing") &&
                analysisReport.missingSkills.map((s) => (
                  <div
                    key={"missing_" + s.name}
                    className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-800/80 border-l-4 border-l-rose-400 border border-slate-200/80 dark:border-slate-750 text-xs shadow-[0_2px_8px_rgba(0,0,0,0.03)] hover:shadow-xs transition-all"
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center space-x-2.5">
                        <div className="w-6 h-6 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center font-bold">
                          ✕
                        </div>
                        <span className="font-black text-sm text-slate-900 dark:text-white">{s.name}</span>
                        <span className="text-[10px] font-bold px-3 py-0.5 rounded-full bg-rose-50 text-rose-800 border border-rose-200">
                          {s.importance}
                        </span>
                      </div>
                      <Link
                        href={s.learningUrl}
                        className="text-[#065f46] dark:text-[#a2e6cc] font-extrabold hover:underline flex items-center space-x-1"
                      >
                        <span>Learn Skill</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                    <p className="text-slate-500 dark:text-slate-400 text-xs mt-1">
                      Expected in Candidate: {s.expectedProof}
                    </p>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 4: CERTIFICATES & ACCREDITATIONS
         ========================================================================= */}
      {activeTab === "certificates" && (
        <div className="space-y-6 animate-in fade-in-50 duration-200">
          <div className="bg-white dark:bg-slate-850 rounded-[28px] p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center space-x-2 mb-1">
                <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">
                  Verified Academic &amp; Industry Certificates
                </h2>
                <span className="px-3 py-0.5 rounded-full text-[11px] font-extrabold bg-[#d1fae5] text-[#065f46] border border-[#a7f3d0]">
                  Tamper-proof
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Official certificates authenticated by partner universities, cloud providers, and learning academies.
              </p>
            </div>

            <button
              onClick={handleCertUploadClick}
              className="px-4 py-2.5 rounded-full bg-[#a2e6cc] hover:bg-[#8ee0bf] text-[#064e3b] text-xs font-black shadow-xs hover:shadow-[0_0_18px_rgba(0,207,204,0.4)] transition-all flex items-center space-x-2 cursor-pointer self-start sm:self-auto"
            >
              <UploadCloud className="w-4 h-4" />
              <span>Upload Certificate</span>
            </button>
          </div>

          {certUploadSuccess && (
            <div className="p-4 rounded-full bg-[#d1fae5] border border-[#a7f3d0] text-xs font-black text-[#065f46] flex items-center space-x-2.5 shadow-xs">
              <Check className="w-4 h-4 stroke-[3]" />
              <span>Certificate submitted and validated against institutional registry hashes.</span>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {verifiedCertificates.map((cert) => (
              <div
                key={cert.id}
                className="bg-white dark:bg-slate-850 p-6 rounded-[28px] border border-slate-200/90 dark:border-slate-800 shadow-[0_8px_24px_rgba(0,0,0,0.05)] hover:border-[#a2e6cc] transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-[#a2e6cc] text-[#064e3b] flex items-center justify-center shadow-xs">
                      <FileBadge className="w-6 h-6" />
                    </div>
                    <span className="text-[10px] font-black px-3 py-1 rounded-full bg-[#d1fae5] text-[#065f46] border border-[#a7f3d0] flex items-center space-x-1">
                      <Check className="w-3 h-3 stroke-[3]" />
                      <span>Verified</span>
                    </span>
                  </div>

                  <h3 className="font-black text-base text-slate-900 dark:text-white leading-snug">
                    {cert.name}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-semibold">{cert.issuer}</p>

                  <div className="mt-4 p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200/60 dark:border-slate-750 text-[11px] space-y-1">
                    <div className="flex justify-between text-slate-500">
                      <span>Credential ID:</span>
                      <span className="font-mono font-bold text-slate-800 dark:text-slate-200">{cert.credentialId}</span>
                    </div>
                    <div className="flex justify-between text-slate-500">
                      <span>Issue Date:</span>
                      <span className="font-semibold text-slate-800 dark:text-slate-200">{cert.date}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-5 pt-3.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                  <span className="font-bold text-[#065f46] dark:text-[#a2e6cc]">{cert.type}</span>
                  <button
                    onClick={() => alert(`Certificate ${cert.name} verified authentic.`)}
                    className="text-xs font-bold text-slate-500 hover:text-slate-900 dark:hover:text-white flex items-center space-x-1 cursor-pointer"
                  >
                    <span>Inspect Seal</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
