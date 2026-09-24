"use client";

import { useState, useEffect, Suspense } from "react";
import {
  LayoutDashboard,
  GraduationCap,
  Users,
  BrainCircuit,
  Briefcase,
  Award,
  TrendingUp,
  Building2,
  FolderGit2,
  FileText,
  BarChart3,
  MessagesSquare,
  Mail,
  Settings,
  ShieldCheck,
  Search,
  Filter,
  Plus,
  CheckCircle2,
  Clock,
  ChevronRight,
  ExternalLink,
  BookOpen,
  ArrowUpRight,
  Sparkles,
  Download,
  AlertTriangle,
  Flame,
  Check,
  X,
  Target,
  FileCheck,
  Compass,
  Send,
  Building,
  Calendar,
  Layers,
  HelpCircle,
  LogOut
} from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { CampusBridgeLogo } from "../../login/page";

// Primary Section Navigation Definition (14 sections exact matching prompt)
type SectionType =
  | "dashboard"
  | "students"
  | "faculty"
  | "skills_assessments"
  | "internships"
  | "faculty_opportunities"
  | "placements"
  | "industry"
  | "projects"
  | "documents"
  | "reports_analytics"
  | "community"
  | "messages"
  | "settings";

type FacultySubTab = "internships" | "training" | "fdps" | "applications";

function InstituteDashboardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Active section state
  const tabParam = searchParams.get("tab") as SectionType | null;
  const subParam = searchParams.get("sub") as FacultySubTab | null;

  const [activeSection, setActiveSection] = useState<SectionType>(tabParam || "dashboard");
  const [facultySubTab, setFacultySubTab] = useState<FacultySubTab>(subParam || "internships");

  // Overview Data
  const [overviewData, setOverviewData] = useState<any>(null);
  const [loadingOverview, setLoadingOverview] = useState(true);

  // Students Data
  const [studentsData, setStudentsData] = useState<any[]>([]);
  const [loadingStudents, setLoadingStudents] = useState(false);
  const [studentSearch, setStudentSearch] = useState("");
  const [studentDeptFilter, setStudentDeptFilter] = useState("ALL");

  // Faculty Opportunities Data
  const [facultyOps, setFacultyOps] = useState<any>(null);
  const [loadingFacultyOps, setLoadingFacultyOps] = useState(false);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [selectedOpportunity, setSelectedOpportunity] = useState<any>(null);
  const [applicationForm, setApplicationForm] = useState({
    facultyName: "Dr. Arvind Ramanathan",
    department: "Computer Science & Engineering",
    designation: "Professor & HOD",
    remarks: "Seeking approval for sabbatical immersion and curriculum co-development."
  });
  const [applySuccessNotice, setApplySuccessNotice] = useState<string | null>(null);

  // Message Thread State
  const [activeChatPeer, setActiveChatPeer] = useState<string>("Infosys Campus Lead (Pooja Rao)");
  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState<any[]>([
    {
      sender: "Infosys Campus Lead (Pooja Rao)",
      time: "10:15 AM",
      text: "Greetings Dean! We are scheduling the campus drive batch interview for Oct 12th. 45 students passed our pre-screening benchmark."
    },
    {
      sender: "You (Dean Academics)",
      time: "10:32 AM",
      text: "Thank you Pooja! The Computer Science & AI-DS auditoriums and high-speed coding labs have been reserved for your team."
    }
  ]);

  // Fetch Institutional Overview
  const fetchOverview = () => {
    setLoadingOverview(true);
    fetch("/api/institution/overview")
      .then((res) => res.json())
      .then((d) => {
        setOverviewData(d);
        setLoadingOverview(false);
      })
      .catch(() => setLoadingOverview(false));
  };

  // Fetch Students Directory
  const fetchStudents = () => {
    setLoadingStudents(true);
    fetch("/api/institution/students")
      .then((res) => res.json())
      .then((d) => {
        if (d.students) setStudentsData(d.students);
        setLoadingStudents(false);
      })
      .catch(() => setLoadingStudents(false));
  };

  // Fetch Faculty Opportunities
  const fetchFacultyOps = () => {
    setLoadingFacultyOps(true);
    fetch("/api/institution/faculty-opportunities")
      .then((res) => res.json())
      .then((d) => {
        setFacultyOps(d);
        setLoadingFacultyOps(false);
      })
      .catch(() => setLoadingFacultyOps(false));
  };

  useEffect(() => {
    fetchOverview();
    fetchStudents();
    fetchFacultyOps();
  }, []);

  // Synchronize Tab Changes
  const handleNavChange = (sec: SectionType) => {
    setActiveSection(sec);
    router.push(`/institute/dashboard?tab=${sec}`);
  };

  const handleFacultySubChange = (sub: FacultySubTab) => {
    setFacultySubTab(sub);
    router.push(`/institute/dashboard?tab=faculty_opportunities&sub=${sub}`);
  };

  // Submit Faculty Opportunity Application
  const handleSubmitFacultyApplication = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOpportunity) return;

    try {
      const res = await fetch("/api/institution/faculty-opportunities", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          facultyName: applicationForm.facultyName,
          department: applicationForm.department,
          designation: applicationForm.designation,
          category: selectedOpportunity.category || "Industry Opportunity",
          opportunityTitle: selectedOpportunity.title,
          organization: selectedOpportunity.company || selectedOpportunity.sponsor || selectedOpportunity.organizer,
          duration: selectedOpportunity.duration,
          remarks: applicationForm.remarks
        })
      });

      const data = await res.json();
      if (res.ok) {
        setShowApplyModal(false);
        setApplySuccessNotice(data.message || "Application successfully submitted!");
        fetchFacultyOps();
        setFacultySubTab("applications");
      } else {
        alert(data.error || "Failed to submit application");
      }
    } catch (err: any) {
      alert("Error: " + err.message);
    }
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    setChatMessages([
      ...chatMessages,
      {
        sender: "You (Dean Academics)",
        time: "Just now",
        text: chatInput.trim()
      }
    ]);
    setChatInput("");
  };

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
  };

  // Navigation Items Config
  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, badge: null },
    { id: "students", label: "Students", icon: GraduationCap, badge: "1,420" },
    { id: "faculty", label: "Faculty", icon: Users, badge: "88" },
    { id: "skills_assessments", label: "Skills & Assessments", icon: BrainCircuit, badge: "Live" },
    { id: "internships", label: "Internships", icon: Briefcase, badge: "78%" },
    {
      id: "faculty_opportunities",
      label: "Faculty Opportunities",
      icon: Award,
      badge: "4 Tracks",
      hasSub: true
    },
    { id: "placements", label: "Placements", icon: TrendingUp, badge: "84.5%" },
    { id: "industry", label: "Industry", icon: Building2, badge: "24 MoUs" },
    { id: "projects", label: "Projects", icon: FolderGit2, badge: "142" },
    { id: "documents", label: "Documents", icon: FileText, badge: "NAAC" },
    { id: "reports_analytics", label: "Reports & Analytics", icon: BarChart3, badge: "YoY" },
    { id: "community", label: "Community", icon: MessagesSquare, badge: "New" },
    { id: "messages", label: "Messages", icon: Mail, badge: "3" },
    { id: "settings", label: "Settings", icon: Settings, badge: null }
  ];

  const inst = overviewData?.institution;
  const metrics = overviewData?.metrics;

  return (
    <div className="flex h-screen bg-[#f4f6f5] text-[#14231E] overflow-hidden font-sans">
      
      {/* ======================================================================= */}
      {/* 1. LEFT SIDEBAR                                                         */}
      {/* ======================================================================= */}
      <aside className="w-72 bg-white text-[#14231E] flex flex-col border-r border-slate-200/80 shrink-0 select-none">
        
        {/* Brand Header */}
        <div className="p-5 border-b border-slate-200/80">
          <div className="flex items-center space-x-3">
            <CampusBridgeLogo className="w-7 h-7" />
          </div>
          <p className="font-mono text-[10px] tracking-[0.2em] font-semibold text-slate-400 uppercase mt-4">
            INSTITUTION WORKSPACE
          </p>
        </div>

        {/* Navigation Items List */}
        <nav className="flex-1 px-3 py-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;

            return (
              <div key={item.id} className="space-y-1">
                <button
                  onClick={() => handleNavChange(item.id as SectionType)}
                  className={`w-full flex items-center justify-between px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    isActive
                      ? "bg-[#e8f5f1] text-[#13664d]"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <Icon className={`w-4 h-4 ${isActive ? "text-[#13664d]" : "text-slate-400"}`} />
                    <span>{item.label}</span>
                  </div>

                  {item.badge && (
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        isActive
                          ? "bg-[#13664d] text-white"
                          : "bg-slate-100 text-slate-500"
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>

                {/* Sub-items if Faculty Opportunities is active */}
                {item.id === "faculty_opportunities" && isActive && (
                  <div className="ml-7 pl-3 border-l-2 border-indigo-500/40 space-y-1 pt-1 pb-1">
                    <button
                      onClick={() => handleFacultySubChange("internships")}
                      className={`w-full text-left px-2.5 py-1.5 rounded-lg text-[11px] font-bold flex items-center justify-between cursor-pointer ${
                        facultySubTab === "internships"
                          ? "bg-indigo-500/20 text-indigo-300 font-black"
                          : "text-slate-400 hover:text-slate-200"
                      }`}
                    >
                      <span>├─ Industry Internships</span>
                      <span className="text-[9px] bg-slate-800 px-1.5 py-0.2 rounded font-mono">3 Open</span>
                    </button>

                    <button
                      onClick={() => handleFacultySubChange("training")}
                      className={`w-full text-left px-2.5 py-1.5 rounded-lg text-[11px] font-bold flex items-center justify-between cursor-pointer ${
                        facultySubTab === "training"
                          ? "bg-indigo-500/20 text-indigo-300 font-black"
                          : "text-slate-400 hover:text-slate-200"
                      }`}
                    >
                      <span>├─ Industrial Training</span>
                      <span className="text-[9px] bg-slate-800 px-1.5 py-0.2 rounded font-mono">3 Tracks</span>
                    </button>

                    <button
                      onClick={() => handleFacultySubChange("fdps")}
                      className={`w-full text-left px-2.5 py-1.5 rounded-lg text-[11px] font-bold flex items-center justify-between cursor-pointer ${
                        facultySubTab === "fdps"
                          ? "bg-indigo-500/20 text-indigo-300 font-black"
                          : "text-slate-400 hover:text-slate-200"
                      }`}
                    >
                      <span>├─ FDPs (AICTE/Corp)</span>
                      <span className="text-[9px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.2 rounded font-mono">Enrolling</span>
                    </button>

                    <button
                      onClick={() => handleFacultySubChange("applications")}
                      className={`w-full text-left px-2.5 py-1.5 rounded-lg text-[11px] font-bold flex items-center justify-between cursor-pointer ${
                        facultySubTab === "applications"
                          ? "bg-indigo-500/20 text-indigo-300 font-black"
                          : "text-slate-400 hover:text-slate-200"
                      }`}
                    >
                      <span>└─ Applications Tracker</span>
                      <span className="text-[9px] bg-amber-500/20 text-amber-300 px-1.5 py-0.2 rounded font-mono">4 Submissions</span>
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* User / Sign Out Footer */}
        <div className="p-4 border-t border-slate-800/80 flex items-center justify-between">
          <div className="flex items-center space-x-3 overflow-hidden">
            <div className="w-8 h-8 rounded-xl bg-slate-800 text-indigo-400 font-bold flex items-center justify-center text-xs">
              DE
            </div>
            <div className="truncate">
              <p className="text-xs font-bold text-slate-200 truncate">Dean Academics</p>
              <p className="text-[10px] text-slate-400 font-mono truncate">{inst?.domain || "iite.ac.in"}</p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            title="Sign Out"
            className="p-2 text-slate-400 hover:text-rose-400 hover:bg-slate-900 rounded-xl transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>

      </aside>

      {/* ======================================================================= */}
      {/* 2. MAIN CONTENT WRAPPER                                                 */}
      {/* ======================================================================= */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        
        {/* Top Header Bar */}
        <header className="h-16 bg-white border-b border-slate-200/80 px-6 flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-xs font-semibold text-slate-500">
              <Building className="w-4 h-4 text-[#13664d]" />
              <span>{inst?.name || "Indian Institute of Technology & Engineering"}</span>
              <span>/</span>
              <span className="text-[#14231E] font-bold capitalize">
                {activeSection.replace("_", " ")}
              </span>
            </div>
          </div>

          {/* Center: Preview Role Switcher */}
          <div className="hidden lg:flex items-center space-x-2 bg-slate-100/80 p-1 rounded-full text-xs font-medium">
            <span className="text-slate-400 font-mono text-[11px] px-3">Preview as</span>
            <Link
              href="/student/dashboard"
              className="px-3 py-1 rounded-full text-slate-600 hover:text-slate-900 transition-colors"
            >
              Student
            </Link>
            <Link
              href="/company/dashboard"
              className="px-3 py-1 rounded-full text-slate-600 hover:text-slate-900 transition-colors"
            >
              Company
            </Link>
            <Link
              href="/institute/dashboard"
              className="px-3 py-1 rounded-full bg-white text-[#13664d] font-semibold shadow-2xs"
            >
              Institution
            </Link>
            <Link
              href="/institute/dashboard"
              className="px-3 py-1 rounded-full text-slate-600 hover:text-slate-900 transition-colors"
            >
              Academician
            </Link>
          </div>

          <div className="flex items-center space-x-3">
            <span className="text-[11px] font-semibold text-[#13664d] bg-[#e8f5f1] border border-[#13664d]/20 px-3 py-1 rounded-xl flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-[#13664d]" />
              <span>NIRF Ranked #18 • Tier-1 Accredited</span>
            </span>

            <button
              onClick={() => handleNavChange("messages")}
              className="p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors relative cursor-pointer"
            >
              <Mail className="w-4 h-4" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-[#13664d] rounded-full" />
            </button>
          </div>
        </header>

        {/* Scrollable Work Area */}
        <main className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-8">
          
          {/* Global Alert Notification */}
          {applySuccessNotice && (
            <div className="bg-[#e8f5f1] border border-[#13664d]/30 text-[#13664d] px-5 py-3.5 rounded-2xl text-xs font-semibold flex items-center justify-between shadow-2xs">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#13664d] shrink-0" />
                <span>{applySuccessNotice}</span>
              </div>
              <button onClick={() => setApplySuccessNotice(null)} className="text-[#13664d] hover:text-black">
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* =================================================================== */}
          {/* SECTION 1: 🏠 DASHBOARD OVERVIEW                                    */}
          {/* =================================================================== */}
          {activeSection === "dashboard" && (
            <div className="space-y-8">
              
              {/* Executive Top Banner */}
              <div className="bg-[#13664d] rounded-3xl p-8 text-white shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative overflow-hidden">
                <div className="absolute -bottom-16 -right-16 w-80 h-80 rounded-full border border-white/10 pointer-events-none" />

                <div className="relative z-10">
                  <div className="flex items-center gap-2 text-xs font-mono font-semibold uppercase tracking-wider text-[#a7f3d0] mb-2">
                    <ShieldCheck className="w-4 h-4" />
                    <span>Autonomous Institutional Authority Hub</span>
                  </div>
                  <h1 className="font-serif text-3xl font-normal text-white tracking-tight">
                    {inst?.name || "Indian Institute of Technology & Engineering (IITE)"}
                  </h1>
                  <p className="text-xs text-emerald-100/90 font-light mt-1 max-w-2xl leading-relaxed">
                    Centrally managing student placement readiness, verified skill credentials, corporate hiring pipelines, and faculty industrial sabbatical tracks.
                  </p>
                </div>

                <div className="flex flex-wrap gap-2.5 shrink-0">
                  <button
                    onClick={() => handleNavChange("students")}
                    className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-xs cursor-pointer flex items-center gap-1.5"
                  >
                    <GraduationCap className="w-4 h-4" />
                    <span>View Student Cohort</span>
                  </button>

                  <button
                    onClick={() => handleNavChange("faculty_opportunities")}
                    className="bg-white/10 hover:bg-white/20 text-white border border-white/20 font-bold text-xs px-4 py-2.5 rounded-xl cursor-pointer flex items-center gap-1.5"
                  >
                    <Award className="w-4 h-4 text-emerald-300" />
                    <span>Faculty Sabbaticals</span>
                  </button>
                </div>
              </div>

              {/* 4 Primary Top Metrics */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-xs space-y-2">
                  <div className="flex justify-between items-start">
                    <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Placement Readiness</span>
                    <span className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
                      <TrendingUp className="w-4 h-4" />
                    </span>
                  </div>
                  <div className="text-3xl font-black text-slate-900">{metrics?.placementReadinessRate || 84.5}%</div>
                  <div className="text-xs text-emerald-700 font-semibold flex items-center gap-1">
                    <span>+6.2% YoY</span>
                    <span className="text-gray-400 font-normal">vs last academic cycle</span>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-xs space-y-2">
                  <div className="flex justify-between items-start">
                    <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Enrolled Students</span>
                    <span className="p-2 bg-blue-50 text-blue-600 rounded-xl">
                      <GraduationCap className="w-4 h-4" />
                    </span>
                  </div>
                  <div className="text-3xl font-black text-slate-900">{metrics?.totalStudents || 1420}</div>
                  <div className="text-xs text-blue-700 font-semibold">
                    Across 4 Engineering Departments
                  </div>
                </div>

                <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-xs space-y-2">
                  <div className="flex justify-between items-start">
                    <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Average CTC Package</span>
                    <span className="p-2 bg-purple-50 text-purple-600 rounded-xl">
                      <Briefcase className="w-4 h-4" />
                    </span>
                  </div>
                  <div className="text-3xl font-black text-slate-900">{metrics?.averagePlacementCtc || "14.8 LPA"}</div>
                  <div className="text-xs text-purple-700 font-semibold">
                    Highest: {metrics?.highestPackage || "48.5 LPA"} (Google)
                  </div>
                </div>

                <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-xs space-y-2">
                  <div className="flex justify-between items-start">
                    <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Active Corporate MoUs</span>
                    <span className="p-2 bg-amber-50 text-amber-600 rounded-xl">
                      <Building2 className="w-4 h-4" />
                    </span>
                  </div>
                  <div className="text-3xl font-black text-slate-900">{metrics?.activeCorporateMoUs || 24}</div>
                  <div className="text-xs text-amber-700 font-semibold">
                    Infosys, Google, Cisco, NVIDIA & Bosch
                  </div>
                </div>
              </div>

              {/* Department Readiness & Critical Alerts Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-7">
                
                {/* Left 8 Cols: Department Performance Matrix */}
                <div className="lg:col-span-8 bg-white rounded-3xl border border-gray-200 p-7 shadow-xs space-y-5">
                  <div className="flex justify-between items-center pb-3 border-b border-gray-100">
                    <div>
                      <h3 className="text-base font-black text-slate-900">Academic Department Capacity & Readiness</h3>
                      <p className="text-xs text-gray-500">Student enrollment, placement percentage, and verified skill index by branch.</p>
                    </div>
                    <button
                      onClick={() => handleNavChange("reports_analytics")}
                      className="text-xs font-bold text-indigo-600 hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <span>Full Analytics</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="border-b border-gray-100 text-gray-400 font-bold uppercase text-[10px] tracking-wider">
                          <th className="pb-3">Department</th>
                          <th className="pb-3 text-center">Students</th>
                          <th className="pb-3 text-center">Faculty</th>
                          <th className="pb-3 text-center">Placement Rate</th>
                          <th className="pb-3 text-center">Average Package</th>
                          <th className="pb-3 text-right">Top Recruiter</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {overviewData?.departments?.map((dept: any) => (
                          <tr key={dept.id} className="hover:bg-gray-50/80">
                            <td className="py-3.5">
                              <div className="font-extrabold text-slate-900 text-xs">{dept.name}</div>
                              <div className="text-[10px] text-gray-400 font-mono">HOD: {dept.hod}</div>
                            </td>
                            <td className="py-3.5 text-center font-bold text-slate-700">{dept.studentsCount}</td>
                            <td className="py-3.5 text-center font-bold text-slate-700">{dept.facultyCount}</td>
                            <td className="py-3.5 text-center">
                              <span className="bg-emerald-100 text-emerald-800 text-[10px] font-black px-2 py-0.5 rounded-full">
                                {dept.placementRate}%
                              </span>
                            </td>
                            <td className="py-3.5 text-center font-extrabold text-slate-900">{dept.avgCtc}</td>
                            <td className="py-3.5 text-right font-semibold text-indigo-700">
                              {dept.topRecruiters[0]}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Right 4 Cols: Urgent Alerts & Drive Notices */}
                <div className="lg:col-span-4 bg-white rounded-3xl border border-gray-200 p-7 shadow-xs space-y-4">
                  <div className="pb-3 border-b border-gray-100">
                    <h3 className="text-base font-black text-slate-900">Institutional Action Items</h3>
                    <p className="text-xs text-gray-500">Recruitment drives, regulatory reports, and faculty reviews.</p>
                  </div>

                  <div className="space-y-3.5">
                    {overviewData?.alerts?.map((alt: any) => (
                      <div
                        key={alt.id}
                        className={`p-4 rounded-2xl border space-y-2 ${
                          alt.type === "URGENT"
                            ? "bg-rose-50/50 border-rose-200"
                            : alt.type === "ACTION_REQUIRED"
                            ? "bg-amber-50/50 border-amber-200"
                            : "bg-blue-50/50 border-blue-200"
                        }`}
                      >
                        <div className="flex justify-between items-start">
                          <span
                            className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-md ${
                              alt.type === "URGENT"
                                ? "bg-rose-100 text-rose-800"
                                : alt.type === "ACTION_REQUIRED"
                                ? "bg-amber-100 text-amber-800"
                                : "bg-blue-100 text-blue-800"
                            }`}
                          >
                            {alt.type.replace("_", " ")}
                          </span>
                          <span className="text-[10px] text-gray-400 font-mono">{alt.timestamp}</span>
                        </div>

                        <h4 className="text-xs font-black text-slate-900 leading-snug">{alt.title}</h4>
                        <p className="text-[11px] text-gray-600 leading-relaxed">{alt.description}</p>

                        <button
                          onClick={() => {
                            if (alt.title.includes("Infosys")) handleNavChange("placements");
                            else if (alt.title.includes("Faculty")) handleNavChange("faculty_opportunities");
                            else handleNavChange("documents");
                          }}
                          className="text-[11px] font-bold text-indigo-700 hover:underline flex items-center gap-1 cursor-pointer pt-1"
                        >
                          <span>{alt.action} →</span>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

            </div>
          )}

          {/* =================================================================== */}
          {/* SECTION 2: 👨🎓 STUDENTS DIRECTORY                                  */}
          {/* =================================================================== */}
          {activeSection === "students" && (
            <div className="bg-white rounded-3xl border border-gray-200 p-7 shadow-xs space-y-6">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-4 border-b border-gray-100">
                <div>
                  <h3 className="text-xl font-black text-slate-900">Student Cohort Directory</h3>
                  <p className="text-xs text-gray-500">Track verified technical skills, assessment benchmarks, CGPA, and placement readiness.</p>
                </div>

                <div className="flex items-center gap-3 w-full md:w-auto">
                  <div className="relative flex-1 md:w-64">
                    <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      placeholder="Search student or roll no..."
                      value={studentSearch}
                      onChange={(e) => setStudentSearch(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 text-xs border border-gray-200 rounded-xl focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  <select
                    value={studentDeptFilter}
                    onChange={(e) => setStudentDeptFilter(e.target.value)}
                    className="border border-gray-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 bg-white"
                  >
                    <option value="ALL">All Departments</option>
                    <option value="Computer Science">Computer Science</option>
                    <option value="Information Technology">Information Technology</option>
                    <option value="AI & Data Science">AI & Data Science</option>
                    <option value="Electronics & Communication">Electronics & Communication</option>
                  </select>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-gray-200 text-gray-400 font-bold uppercase text-[10px] tracking-wider">
                      <th className="pb-3">Student Name</th>
                      <th className="pb-3">Department & Batch</th>
                      <th className="pb-3 text-center">CGPA</th>
                      <th className="pb-3">Target Career Role</th>
                      <th className="pb-3">Verified Skills</th>
                      <th className="pb-3 text-center">Placement Status</th>
                      <th className="pb-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {studentsData
                      .filter((s) => {
                        const matchesSearch =
                          s.name.toLowerCase().includes(studentSearch.toLowerCase()) ||
                          s.rollNumber.toLowerCase().includes(studentSearch.toLowerCase());
                        const matchesDept = studentDeptFilter === "ALL" || s.department === studentDeptFilter;
                        return matchesSearch && matchesDept;
                      })
                      .map((student) => (
                        <tr key={student.id} className="hover:bg-gray-50/80">
                          <td className="py-4">
                            <div className="font-extrabold text-slate-900 text-sm">{student.name}</div>
                            <div className="text-[10px] text-gray-400 font-mono">{student.rollNumber} • {student.email}</div>
                          </td>
                          <td className="py-4">
                            <div className="font-bold text-slate-800 text-xs">{student.department}</div>
                            <div className="text-[10px] text-gray-500">{student.degree} • {student.year}</div>
                          </td>
                          <td className="py-4 text-center font-extrabold text-slate-900 text-sm">
                            {student.cgpa}
                          </td>
                          <td className="py-4">
                            <span className="font-semibold text-slate-700">{student.targetRole}</span>
                          </td>
                          <td className="py-4">
                            <div className="flex flex-wrap gap-1 max-w-xs">
                              {student.verifiedSkills.map((sk: string, i: number) => (
                                <span
                                  key={i}
                                  className="bg-indigo-50 border border-indigo-200 text-indigo-800 text-[10px] font-bold px-2 py-0.5 rounded-md"
                                >
                                  {sk}
                                </span>
                              ))}
                            </div>
                          </td>
                          <td className="py-4 text-center">
                            <span
                              className={`text-[10px] font-black uppercase px-2.5 py-1 rounded-full ${
                                student.placementStatus === "PLACED"
                                  ? "bg-emerald-100 text-emerald-800"
                                  : student.placementStatus === "OFFER_RECEIVED"
                                  ? "bg-blue-100 text-blue-800"
                                  : student.placementStatus === "SHORTLISTED"
                                  ? "bg-amber-100 text-amber-800"
                                  : "bg-gray-100 text-gray-700"
                              }`}
                            >
                              {student.placementStatus}
                            </span>
                            {student.companyPlaced && (
                              <div className="text-[10px] text-slate-500 font-medium mt-1">
                                {student.companyPlaced}
                              </div>
                            )}
                          </td>
                          <td className="py-4 text-right">
                            <button
                              onClick={() => alert(`Opening student dossier for ${student.name} (${student.rollNumber})`)}
                              className="text-xs font-bold text-indigo-600 hover:text-indigo-800 cursor-pointer"
                            >
                              View Dossier →
                            </button>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* =================================================================== */}
          {/* SECTION 3: 👨🏫 FACULTY DIRECTORY                                  */}
          {/* =================================================================== */}
          {activeSection === "faculty" && (
            <div className="bg-white rounded-3xl border border-gray-200 p-7 shadow-xs space-y-6">
              <div className="flex justify-between items-center pb-4 border-b border-gray-100">
                <div>
                  <h3 className="text-xl font-black text-slate-900">Faculty Members Directory</h3>
                  <p className="text-xs text-gray-500">88 Tenured & Research Faculty across departments with industrial sabbaticals and publications.</p>
                </div>
                <button
                  onClick={() => handleNavChange("faculty_opportunities")}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-4 py-2 rounded-xl flex items-center gap-1.5 cursor-pointer"
                >
                  <Award className="w-3.5 h-3.5" />
                  <span>Assign Sabbatical / FDP</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {[
                  {
                    name: "Dr. Arvind Ramanathan",
                    designation: "Professor & Head of Department",
                    dept: "Computer Science",
                    email: "arvind.r@iite.ac.in",
                    experience: "18 Years",
                    specialization: "Distributed Systems, Sovereign Cloud Virtualization",
                    publications: "42 Papers (IEEE / ACM)",
                    patents: "3 Granted",
                    status: "Google Cloud Residency (Approved)"
                  },
                  {
                    name: "Dr. Sunita Kulkarni",
                    designation: "Professor & HOD",
                    dept: "Information Technology",
                    email: "sunita.k@iite.ac.in",
                    experience: "15 Years",
                    specialization: "Cloud Cryptography & Zero Trust Network Architecture",
                    publications: "31 Papers",
                    patents: "2 Granted",
                    status: "Active Campus Teaching"
                  },
                  {
                    name: "Dr. Rajeshwar Sharma",
                    designation: "Associate Professor",
                    dept: "AI & Data Science",
                    email: "rajeshwar.s@iite.ac.in",
                    experience: "11 Years",
                    specialization: "Foundation Models, Vector Databases & NLP Benchmarks",
                    publications: "28 Papers (NeurIPS / ACL)",
                    patents: "1 Pending",
                    status: "Infosys Labs Immersion Nominee"
                  },
                  {
                    name: "Dr. Meenakshi Sundaram",
                    designation: "Professor & HOD",
                    dept: "Electronics & Communication",
                    email: "meenakshi.s@iite.ac.in",
                    experience: "19 Years",
                    specialization: "VLSI Physical Design, 3nm Silicon Architecture",
                    publications: "38 Papers",
                    patents: "4 Granted",
                    status: "Synopsys Silicon Tapeout Fellow"
                  },
                  {
                    name: "Prof. Priya Chandrasekar",
                    designation: "Assistant Professor",
                    dept: "Information Technology",
                    email: "priya.c@iite.ac.in",
                    experience: "6 Years",
                    specialization: "Full-Stack Web Architectures & Accessibility",
                    publications: "8 Papers",
                    patents: "-",
                    status: "AICTE-ATAL FDP Certified"
                  },
                  {
                    name: "Dr. Vigneshwar Balan",
                    designation: "Associate Professor",
                    dept: "Computer Science",
                    email: "vignesh.b@iite.ac.in",
                    experience: "12 Years",
                    specialization: "Automated Software Verification & Compilers",
                    publications: "22 Papers",
                    patents: "1 Granted",
                    status: "Active Campus Teaching"
                  }
                ].map((fac, idx) => (
                  <div key={idx} className="p-5 rounded-2xl bg-gray-50/60 border border-gray-200 space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-extrabold text-slate-900 text-sm">{fac.name}</h4>
                        <p className="text-[11px] text-indigo-700 font-bold">{fac.designation}</p>
                        <p className="text-[10px] text-gray-500 font-mono">{fac.dept} • {fac.experience}</p>
                      </div>
                      <span className="text-[9px] font-bold text-slate-700 bg-white border border-gray-200 px-2 py-0.5 rounded-md">
                        {fac.publications}
                      </span>
                    </div>

                    <div className="p-2.5 rounded-xl bg-white border border-gray-100 text-[11px] text-gray-700">
                      <strong>Research Domain:</strong> {fac.specialization}
                    </div>

                    <div className="flex justify-between items-center pt-1 text-[11px]">
                      <span className="text-emerald-800 font-semibold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        {fac.status}
                      </span>
                      <a href={`mailto:${fac.email}`} className="text-indigo-600 font-bold hover:underline text-[10px]">
                        Contact
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* =================================================================== */}
          {/* SECTION 4: 🧠 SKILLS & ASSESSMENTS                                  */}
          {/* =================================================================== */}
          {activeSection === "skills_assessments" && (
            <div className="space-y-6">
              <div className="bg-white rounded-3xl border border-gray-200 p-7 shadow-xs space-y-5">
                <div className="flex justify-between items-center pb-3 border-b border-gray-100">
                  <div>
                    <h3 className="text-xl font-black text-slate-900">Institutional Skill Proficiency Matrix</h3>
                    <p className="text-xs text-gray-500">
                      Live assessment benchmark scores aggregated across all 1,420 students against industry requirements.
                    </p>
                  </div>
                  <span className="text-xs font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 px-3 py-1 rounded-xl">
                    6,420 Verified Skills Documented
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {[
                    { skill: "Data Structures & Algorithms", category: "Core CS", avgScore: 89, verifiedCount: 940, demandIndex: "Critical" },
                    { skill: "Java & Spring Boot", category: "Backend", avgScore: 84, verifiedCount: 780, demandIndex: "Critical" },
                    { skill: "Cloud (Kubernetes & AWS)", category: "DevOps", avgScore: 76, verifiedCount: 420, demandIndex: "High Deficit" },
                    { skill: "Python & Machine Learning", category: "AI/Data", avgScore: 88, verifiedCount: 650, demandIndex: "High" },
                    { skill: "PostgreSQL & Query Tuning", category: "Databases", avgScore: 82, verifiedCount: 810, demandIndex: "High" },
                    { skill: "React & TypeScript", category: "Frontend", avgScore: 85, verifiedCount: 560, demandIndex: "High" }
                  ].map((s, i) => (
                    <div key={i} className="p-5 rounded-2xl bg-gray-50 border border-gray-200 space-y-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="text-[10px] font-bold text-gray-400 uppercase">{s.category}</span>
                          <h4 className="text-sm font-black text-slate-900">{s.skill}</h4>
                        </div>
                        <span
                          className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full ${
                            s.demandIndex === "High Deficit"
                              ? "bg-rose-100 text-rose-800"
                              : "bg-emerald-100 text-emerald-800"
                          }`}
                        >
                          {s.demandIndex}
                        </span>
                      </div>

                      <div className="space-y-1">
                        <div className="flex justify-between text-xs font-semibold text-gray-600">
                          <span>Average Cohort Score</span>
                          <span className="text-slate-900 font-extrabold">{s.avgScore}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                          <div className="bg-indigo-600 h-2 rounded-full" style={{ width: `${s.avgScore}%` }} />
                        </div>
                      </div>

                      <div className="text-[11px] text-gray-500 pt-1 flex justify-between">
                        <span>{s.verifiedCount} Students Benchmark Passed</span>
                        <span className="text-indigo-600 font-bold cursor-pointer">Inspect Test →</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* =================================================================== */}
          {/* SECTION 5: 💼 INTERNSHIPS                                           */}
          {/* =================================================================== */}
          {activeSection === "internships" && (
            <div className="bg-white rounded-3xl border border-gray-200 p-7 shadow-xs space-y-6">
              <div className="flex justify-between items-center pb-4 border-b border-gray-100">
                <div>
                  <h3 className="text-xl font-black text-slate-900">Student Internship Pipeline</h3>
                  <p className="text-xs text-gray-500">Corporate semester internships, mentor feedback, and stipend compliance.</p>
                </div>
                <span className="text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-xl">
                  78.2% Student Participation Rate
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {[
                  {
                    company: "Infosys Labs",
                    role: "Full-Stack Software Engineering Intern",
                    studentsCount: 24,
                    stipend: "₹45,000 / month",
                    mentor: "Principal Engineering Lead",
                    duration: "8 Weeks",
                    status: "ACTIVE_SPRINT"
                  },
                  {
                    company: "Cisco Systems",
                    role: "Cloud & Network Automation Intern",
                    studentsCount: 16,
                    stipend: "₹50,000 / month",
                    mentor: "Director of Systems SRE",
                    duration: "12 Weeks",
                    status: "ACTIVE_SPRINT"
                  },
                  {
                    company: "NVIDIA",
                    role: "Deep Learning Systems Intern",
                    studentsCount: 8,
                    stipend: "₹65,000 / month",
                    mentor: "AI Research Lead",
                    duration: "6 Months",
                    status: "ACTIVE_SPRINT"
                  }
                ].map((item, idx) => (
                  <div key={idx} className="p-5 rounded-2xl bg-gray-50 border border-gray-200 space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-[10px] font-black uppercase text-indigo-600 tracking-wider">Corporate Partner</span>
                        <h4 className="text-base font-black text-slate-900">{item.company}</h4>
                        <p className="text-xs text-gray-600 font-semibold">{item.role}</p>
                      </div>
                      <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-md">
                        {item.studentsCount} Students
                      </span>
                    </div>

                    <div className="text-xs space-y-1 bg-white p-3 rounded-xl border border-gray-100">
                      <div><strong>Stipend:</strong> {item.stipend}</div>
                      <div><strong>Mentor:</strong> {item.mentor}</div>
                      <div><strong>Duration:</strong> {item.duration}</div>
                    </div>

                    <button
                      onClick={() => alert(`Reviewing active deliverables and mentor feedback for ${item.company}`)}
                      className="w-full bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold py-2 rounded-xl cursor-pointer"
                    >
                      Inspect Bi-Weekly Milestones
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* =================================================================== */}
          {/* SECTION 6: 🎓 FACULTY OPPORTUNITIES (MULTI-TRACK MODULE)            */}
          {/* =================================================================== */}
          {activeSection === "faculty_opportunities" && (
            <div className="space-y-6">
              
              {/* Header with Sub-Tabs */}
              <div className="bg-white rounded-3xl border border-gray-200 p-7 shadow-xs space-y-5">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-3 border-b border-gray-100">
                  <div>
                    <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-indigo-700 mb-1">
                      <Award className="w-4 h-4 text-indigo-600" />
                      <span>Institutional Sabbaticals & Professional Development</span>
                    </div>
                    <h2 className="text-2xl font-black text-slate-900">Faculty Opportunities Portal</h2>
                    <p className="text-xs text-gray-500">
                      Empower professors and lecturers to engage directly with industry R&D teams, certified masterclasses, and AICTE-approved pedagogy.
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      setSelectedOpportunity({
                        title: "Custom Sabbatical Fellowship Nomination",
                        company: "Corporate Research Partner",
                        duration: "4-12 Weeks",
                        category: "Industry Opportunity"
                      });
                      setShowApplyModal(true);
                    }}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl flex items-center gap-2 shadow-xs cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Nominate Faculty Member</span>
                  </button>
                </div>

                {/* 4 Sub-Tabs Navigation */}
                <div className="bg-gray-100 p-1.5 rounded-2xl border border-gray-200 flex flex-wrap gap-1">
                  <button
                    onClick={() => handleFacultySubChange("internships")}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      facultySubTab === "internships"
                        ? "bg-white text-slate-900 shadow-xs font-black"
                        : "text-gray-600 hover:text-gray-900"
                    }`}
                  >
                    <Briefcase className="w-3.5 h-3.5 text-blue-600" />
                    <span>1. Industry Internships ({facultyOps?.industryInternships?.length || 3})</span>
                  </button>

                  <button
                    onClick={() => handleFacultySubChange("training")}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      facultySubTab === "training"
                        ? "bg-white text-slate-900 shadow-xs font-black"
                        : "text-gray-600 hover:text-gray-900"
                    }`}
                  >
                    <FolderGit2 className="w-3.5 h-3.5 text-purple-600" />
                    <span>2. Industrial Training ({facultyOps?.industrialTraining?.length || 3})</span>
                  </button>

                  <button
                    onClick={() => handleFacultySubChange("fdps")}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      facultySubTab === "fdps"
                        ? "bg-white text-slate-900 shadow-xs font-black"
                        : "text-gray-600 hover:text-gray-900"
                    }`}
                  >
                    <BookOpen className="w-3.5 h-3.5 text-emerald-600" />
                    <span>3. FDPs & Pedagogy ({facultyOps?.fdps?.length || 3})</span>
                  </button>

                  <button
                    onClick={() => handleFacultySubChange("applications")}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      facultySubTab === "applications"
                        ? "bg-white text-slate-900 shadow-xs font-black"
                        : "text-gray-600 hover:text-gray-900"
                    }`}
                  >
                    <FileCheck className="w-3.5 h-3.5 text-amber-600" />
                    <span>4. Applications & Sanctions ({facultyOps?.applications?.length || 4})</span>
                  </button>
                </div>
              </div>

              {/* SUB-VIEW 1: INDUSTRY INTERNSHIPS */}
              {facultySubTab === "internships" && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {facultyOps?.industryInternships?.map((op: any) => (
                    <div key={op.id} className="bg-white rounded-3xl border border-gray-200 p-6 shadow-xs flex flex-col justify-between space-y-4">
                      <div className="space-y-2.5">
                        <div className="flex justify-between items-start">
                          <span className="text-[10px] font-black uppercase tracking-wider text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200">
                            {op.company}
                          </span>
                          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                            {op.openings} Openings
                          </span>
                        </div>

                        <h4 className="text-base font-black text-slate-900">{op.title}</h4>
                        <p className="text-[11px] text-gray-500 leading-relaxed">{op.description}</p>

                        <div className="p-3 bg-gray-50 rounded-2xl border border-gray-200 text-xs space-y-1">
                          <div><strong>Stipend/Grant:</strong> {op.stipend}</div>
                          <div><strong>Duration:</strong> {op.duration}</div>
                          <div><strong>Eligibility:</strong> {op.eligibility}</div>
                        </div>

                        <div className="flex flex-wrap gap-1">
                          {op.skills.map((sk: string, i: number) => (
                            <span key={i} className="text-[10px] bg-slate-100 text-slate-800 font-semibold px-2 py-0.5 rounded">
                              {sk}
                            </span>
                          ))}
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          setSelectedOpportunity({ ...op, category: "Industry Internship" });
                          setShowApplyModal(true);
                        }}
                        className="w-full bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold py-2.5 rounded-xl flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Apply / Nominate Faculty</span>
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* SUB-VIEW 2: INDUSTRIAL TRAINING */}
              {facultySubTab === "training" && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {facultyOps?.industrialTraining?.map((trn: any) => (
                    <div key={trn.id} className="bg-white rounded-3xl border border-gray-200 p-6 shadow-xs flex flex-col justify-between space-y-4">
                      <div className="space-y-2.5">
                        <div className="flex justify-between items-start">
                          <span className="text-[10px] font-black uppercase text-purple-700 bg-purple-50 px-2.5 py-0.5 rounded-full border border-purple-200">
                            {trn.organizer}
                          </span>
                          <span className="text-[10px] font-bold text-gray-500">{trn.duration}</span>
                        </div>

                        <h4 className="text-base font-black text-slate-900">{trn.title}</h4>
                        <p className="text-[11px] text-gray-500 leading-relaxed">{trn.description}</p>

                        <div className="p-3 bg-purple-50/40 rounded-2xl border border-purple-200 text-xs space-y-1">
                          <div><strong>Certification:</strong> {trn.certification}</div>
                          <div><strong>Start Date:</strong> {trn.startDate}</div>
                          <div><strong>Available Seats:</strong> {trn.seats} Faculty seats reserved</div>
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          setSelectedOpportunity({ ...trn, category: "Industrial Training" });
                          setShowApplyModal(true);
                        }}
                        className="w-full bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold py-2.5 rounded-xl flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Enroll Faculty Cohort</span>
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* SUB-VIEW 3: FDPs */}
              {facultySubTab === "fdps" && (
                <div className="space-y-5">
                  {facultyOps?.fdps?.map((fdp: any) => (
                    <div key={fdp.id} className="bg-white rounded-3xl border border-gray-200 p-7 shadow-xs space-y-4">
                      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2 border-b border-gray-100 pb-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-black uppercase text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                              {fdp.sponsor}
                            </span>
                            <span className="text-xs font-bold text-gray-500">{fdp.dates} ({fdp.duration})</span>
                          </div>
                          <h4 className="text-lg font-black text-slate-900 mt-1">{fdp.title}</h4>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-slate-700 bg-gray-100 px-3 py-1.5 rounded-xl border border-gray-200">
                            Credits: <strong>{fdp.credits} ECTS</strong>
                          </span>
                          <button
                            onClick={() => {
                              setSelectedOpportunity({ ...fdp, category: "FDP" });
                              setShowApplyModal(true);
                            }}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-2 rounded-xl flex items-center gap-1.5 shadow-xs cursor-pointer"
                          >
                            <span>Register Faculty</span>
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <div className="text-[10px] font-black uppercase text-gray-400">Curricular Modules Covered:</div>
                          <ul className="space-y-1 text-xs text-gray-700 font-medium">
                            {fdp.topics?.map((topic: string, i: number) => (
                              <li key={i} className="flex items-center gap-1.5">
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                                <span>{topic}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div className="p-4 bg-emerald-50/40 rounded-2xl border border-emerald-200 text-xs text-slate-800 space-y-1">
                          <div><strong>Venue / Mode:</strong> {fdp.venue}</div>
                          <div><strong>Faculty Coordinator:</strong> {fdp.coordinator}</div>
                          <div><strong>Remaining Seats:</strong> {fdp.seatsAvailable} Faculty Nominations remaining</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* SUB-VIEW 4: APPLICATIONS TRACKER & SANCTIONS */}
              {facultySubTab === "applications" && (
                <div className="bg-white rounded-3xl border border-gray-200 p-7 shadow-xs space-y-5">
                  <div className="flex justify-between items-center pb-3 border-b border-gray-100">
                    <div>
                      <h3 className="text-base font-black text-slate-900">Faculty Sabbatical & FDP Applications Tracker</h3>
                      <p className="text-xs text-gray-500">Track Dean approvals, corporate sponsorships, and duty leave sanctions.</p>
                    </div>
                    <span className="text-xs font-bold text-amber-800 bg-amber-50 px-3 py-1.5 rounded-xl border border-amber-200">
                      4 Total Tracked
                    </span>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="border-b border-gray-200 text-gray-400 font-bold uppercase text-[10px] tracking-wider">
                          <th className="pb-3">Faculty Member</th>
                          <th className="pb-3">Program Category</th>
                          <th className="pb-3">Opportunity Title & Organization</th>
                          <th className="pb-3">Leave Sanction Status</th>
                          <th className="pb-3">Funding / Grant</th>
                          <th className="pb-3 text-right">Sanction Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {facultyOps?.applications?.map((app: any) => (
                          <tr key={app.id} className="hover:bg-gray-50/80">
                            <td className="py-4">
                              <div className="font-extrabold text-slate-900 text-sm">{app.facultyName}</div>
                              <div className="text-[10px] text-gray-500">{app.designation} • {app.department}</div>
                            </td>
                            <td className="py-4">
                              <span className="bg-slate-100 text-slate-800 font-bold px-2 py-0.5 rounded text-[10px]">
                                {app.category}
                              </span>
                            </td>
                            <td className="py-4">
                              <div className="font-bold text-slate-900 text-xs">{app.opportunityTitle}</div>
                              <div className="text-[10px] text-indigo-700 font-semibold">{app.organization} ({app.duration})</div>
                            </td>
                            <td className="py-4">
                              <span
                                className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${
                                  app.status.includes("APPROVED") || app.status === "COMPLETED"
                                    ? "bg-emerald-100 text-emerald-800"
                                    : "bg-amber-100 text-amber-800"
                                }`}
                              >
                                {app.status.replace(/_/g, " ")}
                              </span>
                              <div className="text-[10px] text-gray-500 mt-1">{app.leaveSanction}</div>
                            </td>
                            <td className="py-4 text-xs font-semibold text-slate-800 max-w-xs">
                              {app.fundingGrant}
                            </td>
                            <td className="py-4 text-right">
                              <button
                                onClick={() => alert(`Issuing formal Dean Sanction Certificate for ${app.facultyName}`)}
                                className="bg-slate-900 hover:bg-slate-800 text-white text-[11px] font-bold px-3 py-1.5 rounded-lg cursor-pointer"
                              >
                                Sanction Leave →
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

            </div>
          )}

          {/* =================================================================== */}
          {/* SECTION 7: 💼 PLACEMENTS                                            */}
          {/* =================================================================== */}
          {activeSection === "placements" && (
            <div className="bg-white rounded-3xl border border-gray-200 p-7 shadow-xs space-y-6">
              <div className="flex justify-between items-center pb-4 border-b border-gray-100">
                <div>
                  <h3 className="text-xl font-black text-slate-900">Campus Placement & Drive Operations</h3>
                  <p className="text-xs text-gray-500">Corporate recruiter schedule, offer letters generated, and salary band distributions.</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-xl">
                    84.5% Placement Rate
                  </span>
                  <button className="bg-indigo-600 text-white text-xs font-bold px-3.5 py-1.5 rounded-xl cursor-pointer">
                    Schedule Drive
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
                {[
                  { label: "Total Offers Made", val: "1,198", sub: "92% in Tier-1 & Core" },
                  { label: "Median CTC", val: "12.5 LPA", sub: "Engineering baseline" },
                  { label: "Top Super-Dream Offer", val: "48.5 LPA", sub: "Google AI Systems" },
                  { label: "Recruiting Companies", val: "142", sub: "Fortune 500 & Startups" }
                ].map((stat, i) => (
                  <div key={i} className="p-5 rounded-2xl bg-gray-50 border border-gray-200">
                    <span className="text-[10px] font-bold uppercase text-gray-400">{stat.label}</span>
                    <div className="text-2xl font-black text-slate-900 mt-1">{stat.val}</div>
                    <div className="text-[11px] text-indigo-700 font-semibold mt-0.5">{stat.sub}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* =================================================================== */}
          {/* SECTION 8: 🏢 INDUSTRY PARTNERSHIPS                                 */}
          {/* =================================================================== */}
          {activeSection === "industry" && (
            <div className="bg-white rounded-3xl border border-gray-200 p-7 shadow-xs space-y-6">
              <div className="flex justify-between items-center pb-4 border-b border-gray-100">
                <div>
                  <h3 className="text-xl font-black text-slate-900">Corporate Industry Network & Active MoUs</h3>
                  <p className="text-xs text-gray-500">24 Active Corporate Bilateral Agreements powering sponsored research and campus drives.</p>
                </div>
                <button className="bg-slate-900 text-white text-xs font-bold px-4 py-2 rounded-xl cursor-pointer">
                  + Add New Corporate MoU
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {[
                  { name: "Infosys Labs", scope: "Center of Excellence for Enterprise AI & Distributed Computing", signed: "2024 - 2029", tier: "Strategic Tier-1" },
                  { name: "Google Cloud", scope: "Faculty Research Residencies & Cloud Virtualization Sandbox", signed: "2023 - 2028", tier: "Cloud Partner" },
                  { name: "Cisco Systems", scope: "IoT Telemetry Lab & Cyber Range Infrastructure", signed: "2025 - 2030", tier: "Network Partner" },
                  { name: "NVIDIA", scope: "DGX Supercomputer Access for Deep Learning Research", signed: "2024 - 2027", tier: "AI Hardware Partner" },
                  { name: "Synopsys", scope: "3nm Silicon Physical Design & EDA Educational Licenses", signed: "2023 - 2028", tier: "Semiconductor" },
                  { name: "Bosch Engineering", scope: "Connected Mobility & AUTOSAR Automotive Labs", signed: "2025 - 2028", tier: "Automotive CoE" }
                ].map((item, idx) => (
                  <div key={idx} className="p-5 rounded-2xl bg-gray-50 border border-gray-200 space-y-3">
                    <div className="flex justify-between items-start">
                      <h4 className="font-black text-slate-900 text-sm">{item.name}</h4>
                      <span className="bg-indigo-100 text-indigo-800 text-[9px] font-black uppercase px-2 py-0.5 rounded-full">
                        {item.tier}
                      </span>
                    </div>
                    <p className="text-xs text-gray-600">{item.scope}</p>
                    <div className="text-[10px] text-gray-400 font-mono">Valid: {item.signed}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* =================================================================== */}
          {/* SECTION 9: 📁 PROJECTS & R&D                                        */}
          {/* =================================================================== */}
          {activeSection === "projects" && (
            <div className="bg-white rounded-3xl border border-gray-200 p-7 shadow-xs space-y-6">
              <div className="flex justify-between items-center pb-4 border-b border-gray-100">
                <div>
                  <h3 className="text-xl font-black text-slate-900">Institutional Capstones & Faculty Patents</h3>
                  <p className="text-xs text-gray-500">142 Collaborative engineering initiatives, research publications, and patent filings.</p>
                </div>
                <button className="bg-indigo-600 text-white text-xs font-bold px-4 py-2 rounded-xl cursor-pointer">
                  + Register Project
                </button>
              </div>

              <div className="space-y-4">
                {[
                  {
                    title: "Sub-Second Distributed Telemetry Pipeline for High-Throughput Microservices",
                    dept: "Computer Science",
                    mentor: "Dr. Arvind Ramanathan",
                    students: "Aakash Verma, Bhavna Patel",
                    status: "Corporate Funded (Infosys Labs)",
                    patent: "Patent Application Filed (Ref #2026/IITE/042)"
                  },
                  {
                    title: "Automated Hallucination Mitigation in Large Language Models for Healthcare Diagnoses",
                    dept: "AI & Data Science",
                    mentor: "Dr. Rajeshwar Sharma",
                    students: "Divya Nambiar, Karthik Raja",
                    status: "Published in IEEE Access",
                    patent: "Granted (Patent #IN-98212)"
                  },
                  {
                    title: "Ultra-Low Power AUTOSAR CAN-FD Transceiver for Electric Vehicle BMS",
                    dept: "Electronics & Communication",
                    mentor: "Dr. Meenakshi Sundaram",
                    students: "Eshwar Sundaram",
                    status: "Hardware Tapeout Phase",
                    patent: "Patent Application Filed (Ref #2026/IITE/089)"
                  }
                ].map((proj, i) => (
                  <div key={i} className="p-5 rounded-2xl bg-gray-50 border border-gray-200 space-y-2">
                    <div className="flex justify-between items-start">
                      <h4 className="font-black text-slate-900 text-sm leading-snug">{proj.title}</h4>
                      <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
                        {proj.status}
                      </span>
                    </div>
                    <div className="text-xs text-gray-600">
                      <strong>Lead Faculty:</strong> {proj.mentor} • <strong>Student Cohort:</strong> {proj.students}
                    </div>
                    <div className="text-[11px] font-mono text-indigo-700">{proj.patent}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* =================================================================== */}
          {/* SECTION 10: 📄 DOCUMENTS & ACCREDITATION COMPLIANCE                 */}
          {/* =================================================================== */}
          {activeSection === "documents" && (
            <div className="bg-white rounded-3xl border border-slate-200/80 p-6 md:p-8 shadow-xs space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-100">
                <div>
                  <div className="flex items-center space-x-2 mb-1">
                    <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">Institutional Documents &amp; Regulatory Filings</h3>
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200/60">
                      NAAC A++ Ready
                    </span>
                  </div>
                  <p className="text-xs text-slate-500">Official NAAC Self-Study Reports (SSR), NBA compliance audits, and AICTE mandatory disclosures.</p>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => alert("Ready to upload new statutory document")}
                    className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all flex items-center space-x-1.5 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5 text-slate-600" />
                    <span>Upload Filing</span>
                  </button>
                  <button
                    onClick={() => alert("Downloading consolidated NAAC SSR Bundle (43.5 MB)...")}
                    className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-4 py-2 rounded-xl flex items-center gap-1.5 cursor-pointer transition-all shadow-xs"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download SSR Bundle</span>
                  </button>
                </div>
              </div>

              {/* Document Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { name: "NAAC Institutional Accreditation SSR Report 2026.pdf", size: "18.4 MB", type: "Accreditation", date: "Verified June 2026", color: "indigo" },
                  { name: "NBA Tier-1 Compliance Document for CSE & IT.pdf", size: "12.2 MB", type: "NBA Regulatory", date: "Verified May 2026", color: "blue" },
                  { name: "AICTE Mandatory Institutional Disclosure 2026-27.pdf", size: "4.8 MB", type: "AICTE Statutory", date: "Annual Filing", color: "emerald" },
                  { name: "Bilateral Corporate MoUs Consolidated Registry.pdf", size: "8.1 MB", type: "Legal Contracts", date: "Updated Weekly", color: "amber" }
                ].map((doc, idx) => (
                  <div key={idx} className="p-4 sm:p-5 rounded-2xl bg-slate-50/70 border border-slate-200/80 hover:border-indigo-300 hover:bg-white transition-all flex justify-between items-center group shadow-2xs">
                    <div className="flex items-center space-x-3.5 min-w-0">
                      <div className="w-11 h-11 rounded-xl bg-white border border-slate-200/80 text-indigo-600 flex items-center justify-center shrink-0 shadow-2xs group-hover:scale-105 transition-transform">
                        <FileText className="w-5 h-5" />
                      </div>
                      <div className="min-w-0">
                        <h4 className="text-xs font-bold text-slate-900 truncate" title={doc.name}>{doc.name}</h4>
                        <div className="flex items-center space-x-2 mt-1">
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-white border border-slate-200 text-slate-600">
                            {doc.type}
                          </span>
                          <span className="text-[11px] text-slate-400">• {doc.size}</span>
                          <span className="text-[11px] text-slate-400 hidden sm:inline">• {doc.date}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-1 shrink-0 ml-3">
                      <button
                        onClick={() => alert(`Downloading verified document: ${doc.name}`)}
                        className="px-3 py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold cursor-pointer transition-colors flex items-center space-x-1"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">Download</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* =================================================================== */}
          {/* SECTION 11: 📊 REPORTS & ANALYTICS                                  */}
          {/* =================================================================== */}
          {activeSection === "reports_analytics" && (
            <div className="bg-white rounded-3xl border border-gray-200 p-7 shadow-xs space-y-6">
              <div className="flex justify-between items-center pb-4 border-b border-gray-100">
                <div>
                  <h3 className="text-xl font-black text-slate-900">Year-over-Year Placement & Cohort Trends</h3>
                  <p className="text-xs text-gray-500">Comprehensive longitudinal metrics across placement packages, skill audits, and retention.</p>
                </div>
                <button className="bg-indigo-600 text-white text-xs font-bold px-4 py-2 rounded-xl cursor-pointer">
                  Export PDF Analytics Dossier
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div className="p-5 rounded-2xl bg-indigo-50/50 border border-indigo-200 space-y-2">
                  <span className="text-[10px] font-bold text-indigo-700 uppercase">Average CTC Growth</span>
                  <div className="text-2xl font-black text-indigo-950">+18.4% YoY</div>
                  <p className="text-xs text-gray-600">Driven by Cloud Architecture & AI Engineering campus hiring demand.</p>
                </div>
                <div className="p-5 rounded-2xl bg-emerald-50/50 border border-emerald-200 space-y-2">
                  <span className="text-[10px] font-bold text-emerald-700 uppercase">Skill Gap Reduction</span>
                  <div className="text-2xl font-black text-emerald-950">-42% Gaps</div>
                  <p className="text-xs text-gray-600">Institutional test bench bridged deficits in Java, Spring Boot, and Linux.</p>
                </div>
                <div className="p-5 rounded-2xl bg-purple-50/50 border border-purple-200 space-y-2">
                  <span className="text-[10px] font-bold text-purple-700 uppercase">Faculty Industry Immersion</span>
                  <div className="text-2xl font-black text-purple-950">34 Faculty</div>
                  <p className="text-xs text-gray-600">Completed certified sabbaticals, research residencies, and corporate FDPs.</p>
                </div>
              </div>
            </div>
          )}

          {/* =================================================================== */}
          {/* SECTION 12: 💬 COMMUNITY FORUM                                      */}
          {/* =================================================================== */}
          {activeSection === "community" && (
            <div className="bg-white rounded-3xl border border-gray-200 p-7 shadow-xs space-y-6">
              <div className="flex justify-between items-center pb-4 border-b border-gray-100">
                <div>
                  <h3 className="text-xl font-black text-slate-900">Campus & Alumni Network Community</h3>
                  <p className="text-xs text-gray-500">Academic updates, alumni hackathons, and corporate mentorship forums.</p>
                </div>
                <button className="bg-slate-900 text-white text-xs font-bold px-4 py-2 rounded-xl cursor-pointer">
                  + Post Campus Announcement
                </button>
              </div>

              <div className="space-y-4">
                {[
                  {
                    author: "Alumni Affairs & Career Council",
                    title: "Google Cloud Immersion & Hackathon 2026 Announced",
                    time: "3 hours ago",
                    content: "All pre-final and final year students with verified Kubernetes & Go skills can register for the campus sprint on July 10th."
                  },
                  {
                    author: "Dean Academic Affairs",
                    title: "AICTE-ATAL FDP on Foundation Models: Sabbatical Leave Sanction Guidelines",
                    time: "1 day ago",
                    content: "Faculty members participating in the Microsoft Research FDP will be granted official duty leave and institutional registration sponsorships."
                  }
                ].map((post, i) => (
                  <div key={i} className="p-5 rounded-2xl bg-gray-50 border border-gray-200 space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-black text-indigo-700">{post.author}</span>
                      <span className="text-[10px] text-gray-400 font-mono">{post.time}</span>
                    </div>
                    <h4 className="font-black text-slate-900 text-sm">{post.title}</h4>
                    <p className="text-xs text-gray-600 leading-relaxed">{post.content}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* =================================================================== */}
          {/* SECTION 13: ✉ MESSAGES & RECRUITER LIAISON                         */}
          {/* =================================================================== */}
          {activeSection === "messages" && (
            <div className="bg-white rounded-3xl border border-gray-200 shadow-xs overflow-hidden h-[600px] flex">
              
              {/* Message Peers Sidebar */}
              <div className="w-80 border-r border-gray-200 flex flex-col">
                <div className="p-4 border-b border-gray-100">
                  <h3 className="font-black text-slate-900 text-sm">Recruiter & Faculty Inbox</h3>
                </div>
                <div className="flex-1 overflow-y-auto divide-y divide-gray-100">
                  {[
                    { name: "Infosys Campus Lead (Pooja Rao)", preview: "Scheduled for Oct 12th. 45 students pre-screened...", time: "10:15 AM", unread: true },
                    { name: "Google Cloud Academic Sabbatical Desk", preview: "Dr. Arvind's research fellowship sanctioned...", time: "Yesterday", unread: false },
                    { name: "Cisco University Relations", preview: "Finalizing offer letters for 16 cloud interns...", time: "2 days ago", unread: false }
                  ].map((peer, i) => (
                    <div
                      key={i}
                      onClick={() => setActiveChatPeer(peer.name)}
                      className={`p-4 cursor-pointer transition-colors ${
                        activeChatPeer === peer.name ? "bg-indigo-50/60" : "hover:bg-gray-50"
                      }`}
                    >
                      <div className="flex justify-between items-baseline">
                        <h4 className="font-extrabold text-xs text-slate-900 truncate">{peer.name}</h4>
                        <span className="text-[10px] text-gray-400">{peer.time}</span>
                      </div>
                      <p className="text-[11px] text-gray-500 truncate mt-1">{peer.preview}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Chat Canvas */}
              <div className="flex-1 flex flex-col">
                <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                  <div>
                    <h4 className="font-black text-slate-900 text-xs">{activeChatPeer}</h4>
                    <p className="text-[10px] text-emerald-600 font-bold">Verified Corporate Recruiter</p>
                  </div>
                </div>

                <div className="flex-1 p-6 overflow-y-auto space-y-4">
                  {chatMessages.map((msg, i) => (
                    <div
                      key={i}
                      className={`flex flex-col ${
                        msg.sender.includes("You") ? "items-end" : "items-start"
                      }`}
                    >
                      <div className="text-[10px] text-gray-400 mb-1">{msg.sender} • {msg.time}</div>
                      <div
                        className={`p-3.5 rounded-2xl max-w-md text-xs leading-relaxed ${
                          msg.sender.includes("You")
                            ? "bg-indigo-600 text-white rounded-tr-none"
                            : "bg-gray-100 text-slate-800 rounded-tl-none"
                        }`}
                      >
                        {msg.text}
                      </div>
                    </div>
                  ))}
                </div>

                <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-200 flex gap-2">
                  <input
                    type="text"
                    placeholder="Type official reply or coordinate campus logistics..."
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    className="flex-1 border border-gray-200 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-indigo-500"
                  />
                  <button
                    type="submit"
                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs px-5 py-2.5 rounded-xl flex items-center gap-1.5 cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Send</span>
                  </button>
                </form>
              </div>

            </div>
          )}

          {/* =================================================================== */}
          {/* SECTION 14: ⚙ SETTINGS                                              */}
          {/* =================================================================== */}
          {activeSection === "settings" && (
            <div className="bg-white rounded-3xl border border-gray-200 p-7 shadow-xs space-y-6 max-w-3xl">
              <div className="pb-4 border-b border-gray-100">
                <h3 className="text-xl font-black text-slate-900">Institution Configuration & Settings</h3>
                <p className="text-xs text-gray-500">Accreditation profiles, administrative coordinators, and corporate partnership rules.</p>
              </div>

              <div className="space-y-4 text-xs">
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-800 uppercase text-[10px]">Institution Legal Name</label>
                  <input
                    type="text"
                    defaultValue={inst?.name || "Indian Institute of Technology & Engineering"}
                    className="w-full border border-gray-200 rounded-xl p-3 font-bold text-slate-900"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="font-bold text-slate-800 uppercase text-[10px]">NAAC Accreditation</label>
                    <input
                      type="text"
                      defaultValue="A++ Grade (3.78/4.00)"
                      className="w-full border border-gray-200 rounded-xl p-3 font-medium"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="font-bold text-slate-800 uppercase text-[10px]">NIRF Ranking</label>
                    <input
                      type="text"
                      defaultValue="Rank 18 (Engineering)"
                      className="w-full border border-gray-200 rounded-xl p-3 font-medium"
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    onClick={() => alert("Institutional parameters successfully saved!")}
                    className="bg-slate-900 text-white text-xs font-bold px-6 py-2.5 rounded-xl cursor-pointer"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          )}

        </main>
      </div>

      {/* ======================================================================= */}
      {/* MODAL: FACULTY APPLICATION & SABBATICAL NOMINATION                      */}
      {/* ======================================================================= */}
      {showApplyModal && selectedOpportunity && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl border border-gray-200 shadow-2xl max-w-lg w-full p-7 space-y-5">
            
            <div className="flex justify-between items-start border-b border-gray-100 pb-3">
              <div>
                <span className="text-[10px] font-black uppercase text-indigo-700 tracking-wider">Faculty Sabbatical Nomination</span>
                <h3 className="text-lg font-black text-slate-900 mt-0.5">{selectedOpportunity.title}</h3>
                <p className="text-xs text-gray-500">
                  {selectedOpportunity.company || selectedOpportunity.sponsor || selectedOpportunity.organizer}
                </p>
              </div>
              <button onClick={() => setShowApplyModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitFacultyApplication} className="space-y-4 text-xs">
              <div className="space-y-1.5">
                <label className="font-bold text-slate-800 uppercase text-[10px]">Nominated Faculty Member</label>
                <input
                  type="text"
                  required
                  value={applicationForm.facultyName}
                  onChange={(e) => setApplicationForm({ ...applicationForm, facultyName: e.target.value })}
                  className="w-full border border-gray-200 rounded-xl p-2.5 font-bold text-slate-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-800 uppercase text-[10px]">Department</label>
                  <input
                    type="text"
                    required
                    value={applicationForm.department}
                    onChange={(e) => setApplicationForm({ ...applicationForm, department: e.target.value })}
                    className="w-full border border-gray-200 rounded-xl p-2.5"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-800 uppercase text-[10px]">Designation</label>
                  <input
                    type="text"
                    required
                    value={applicationForm.designation}
                    onChange={(e) => setApplicationForm({ ...applicationForm, designation: e.target.value })}
                    className="w-full border border-gray-200 rounded-xl p-2.5"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-slate-800 uppercase text-[10px]">Academic Justification / Plan</label>
                <textarea
                  rows={3}
                  value={applicationForm.remarks}
                  onChange={(e) => setApplicationForm({ ...applicationForm, remarks: e.target.value })}
                  className="w-full border border-gray-200 rounded-xl p-2.5"
                />
              </div>

              <div className="pt-3 border-t border-gray-100 flex justify-between items-center">
                <button
                  type="button"
                  onClick={() => setShowApplyModal(false)}
                  className="text-gray-500 font-bold hover:text-slate-800 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-black px-5 py-2.5 rounded-xl cursor-pointer shadow-xs"
                >
                  Submit for Dean Approval
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
}

export default function InstituteDashboardPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-sm text-gray-500">Loading Institute Dashboard...</div>}>
      <InstituteDashboardContent />
    </Suspense>
  );
}
