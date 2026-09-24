"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  GraduationCap,
  Users,
  Plus,
  MoreVertical,
  Calendar as CalendarIcon,
  ArrowUpRight,
  Play,
  TrendingUp,
  Award,
  BookOpen,
  PieChart as PieIcon,
  MessageCircle,
  UserPlus,
  Check,
  Search,
  Sparkles,
  X,
  Send,
  Video,
  ExternalLink,
  ChevronRight,
  Smile,
  Code,
  Layers,
  Terminal,
  Newspaper,
  Building2,
  Briefcase,
  Globe,
  Flame,
  Clock,
  ArrowRight,
  Share2,
  Bookmark,
  CheckCircle2,
  FileText,
  CheckSquare,
  ShieldCheck,
  MapPin,
} from "lucide-react";
import {
  GraduatingStudentsIllustration,
} from "./student-illustrations";

// Mock data for popular courses
const popularCourses = [
  {
    id: "uiux",
    initial: "U",
    title: "UI/UX Design",
    coursesCount: "30+ Courses",
    badgeText: "View Courses",
    bgClass: "bg-[#ffbe1a]",
    badgeBg: "bg-[#fff8e7] text-[#d97706] hover:bg-amber-100",
    href: "/student/learning?topic=uiux",
    description: "User Experience, Wireframing, Figma & Prototyping",
  },
  {
    id: "marketing",
    initial: "M",
    title: "Marketing",
    coursesCount: "25+ Courses",
    badgeText: "View Courses",
    bgClass: "bg-[#ff426f]",
    badgeBg: "bg-[#ffeef2] text-[#e11d48] hover:bg-rose-100",
    href: "/student/learning?topic=marketing",
    description: "Digital Strategy, Growth Hacking & Brand Building",
  },
  {
    id: "webdev",
    initial: "W",
    title: "Web Dev.",
    coursesCount: "30+ Courses",
    badgeText: "View Courses",
    bgClass: "bg-[#20c997]",
    badgeBg: "bg-[#e6fbf5] text-[#0d9488] hover:bg-teal-100",
    href: "/student/learning?topic=webdev",
    description: "React, Next.js, Node.js, Full Stack Development",
  },
  {
    id: "math",
    initial: "M",
    title: "Mathematics",
    coursesCount: "50+ Courses",
    badgeText: "View Courses",
    bgClass: "bg-[#3b82f6]",
    badgeBg: "bg-[#eff6ff] text-[#2563eb] hover:bg-blue-100",
    href: "/student/learning?topic=math",
    description: "Linear Algebra, Calculus, Statistics & Data Math",
  },
];

// Mock data for top trending industry skills
const trendingSkills = [
  {
    id: "fullstack",
    name: "React & Next.js",
    metric: "95% Hiring Demand • 1.4k Openings",
    courseCount: "8 Courses",
    icon: Code,
    iconBg: "bg-blue-100 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400",
    href: "/student/learning?topic=webdev",
  },
  {
    id: "genai",
    name: "Generative AI & LLMs",
    metric: "92% Hiring Demand • 980 Openings",
    courseCount: "6 Courses",
    icon: Sparkles,
    iconBg: "bg-purple-100 text-purple-600 dark:bg-purple-950/60 dark:text-purple-400",
    href: "/student/skills?skill=ai",
  },
  {
    id: "cloud",
    name: "Cloud & DevOps (AWS)",
    metric: "89% Hiring Demand • 1.1k Openings",
    courseCount: "5 Courses",
    icon: Terminal,
    iconBg: "bg-amber-100 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400",
    href: "/student/learning?topic=cloud",
  },
  {
    id: "systemdesign",
    name: "System Design & Microservices",
    metric: "87% Hiring Demand • 820 Openings",
    courseCount: "7 Courses",
    icon: Layers,
    iconBg: "bg-emerald-100 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400",
    href: "/student/opportunities",
  },
];

// Mock news dataset for Top Companies, Tech Innovations, and Industry / Job Trends
interface NewsItem {
  id: string;
  category: "companies" | "tech" | "jobs";
  categoryLabel: string;
  badgeColor: string;
  title: string;
  summary: string;
  company?: string;
  companyLogoText?: string;
  companyLogoBg?: string;
  date: string;
  readTime: string;
  trending?: boolean;
  takeaways: string[];
  fullStory: string;
  actionUrl: string;
  actionLabel: string;
}

const newsArticles: NewsItem[] = [
  {
    id: "news-1",
    category: "companies",
    categoryLabel: "Top Companies",
    badgeColor: "bg-blue-100 text-blue-700 dark:bg-blue-950/80 dark:text-blue-300 border-blue-200 dark:border-blue-800",
    company: "Google",
    companyLogoText: "G",
    companyLogoBg: "bg-blue-600 text-white",
    title: "Google Opens 2026 Campus Innovation Fellowship & Early AI Engineering Cohorts",
    summary: "Google Cloud and DeepMind open worldwide applications for university engineering students with 1-on-1 mentorship and full-time hiring fast-tracks.",
    date: "2 hours ago",
    readTime: "3 min read",
    trending: true,
    takeaways: [
      "Over 1,200 summer and fall fellowship openings across Cloud, AI Systems, and Distributed Infrastructure.",
      "Applicants with verified GitHub portfolio projects and hands-on React/Next.js experience receive priority screening.",
      "Stipends include $12,000 research grant and direct access to Google Gemini 1.5 Pro developer credits."
    ],
    fullStory: "Google has announced the rollout of its 2026 Campus Innovation Fellowship, expanding candidate intake across global universities. The program pairs promising student engineers with principal Google Cloud and DeepMind mentors to develop scalable real-world applications. Successful fellows gain priority fast-track interviews for early-career software engineering (SWE) and machine learning positions.",
    actionUrl: "https://careers.google.com/students",
    actionLabel: "View Company Fellowship",
  },
  {
    id: "news-2",
    category: "tech",
    categoryLabel: "Tech & Innovation",
    badgeColor: "bg-purple-100 text-purple-700 dark:bg-purple-950/80 dark:text-purple-300 border-purple-200 dark:border-purple-800",
    company: "Next.js & React",
    companyLogoText: "⚡",
    companyLogoBg: "bg-slate-900 text-white dark:bg-white dark:text-slate-900",
    title: "React 19 & Next.js 15 Now Standard Across 80% of Enterprise Web Stacks",
    summary: "React Server Components, Actions, and Turbopack compiler acceleration become primary evaluation benchmarks in modern frontend developer interviews.",
    date: "4 hours ago",
    readTime: "4 min read",
    trending: true,
    takeaways: [
      "Companies report up to 60% faster page speeds when moving to React Server Components.",
      "Knowledge of server actions, streaming SSR, and edge caching now replaces legacy Redux patterns.",
      "Junior candidates demonstrating SSR proficiency see an average 25% higher placement offer rate."
    ],
    fullStory: "Industry adoption data released this quarter reveals that over 80% of high-growth technology companies have standardized their frontend engineering infrastructure around React 19 and Next.js 15. The shift places heavy emphasis on server-side performance, compiler optimizations, and modern web vitals.",
    actionUrl: "https://nextjs.org/blog",
    actionLabel: "Read Tech Breakdown",
  },
  {
    id: "news-3",
    category: "jobs",
    categoryLabel: "Jobs & Industry",
    badgeColor: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/80 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800",
    company: "Hiring Trends",
    companyLogoText: "💼",
    companyLogoBg: "bg-emerald-600 text-white",
    title: "Global Tech Hiring Index: Remote Internships Surge 38% for Verified Developers",
    summary: "Fintech, cybersecurity, and enterprise scale-ups prioritize verified skill assessments and interactive code portfolios over traditional resumes.",
    date: "6 hours ago",
    readTime: "3 min read",
    trending: false,
    takeaways: [
      "Median starting compensation for verified remote developer interns reached $42/hr.",
      "Most in-demand competencies: TypeScript, RESTful microservices, and Docker containerization.",
      "Recruiters note that students with completed end-to-end applications receive 3.2x more interview callbacks."
    ],
    fullStory: "The quarterly Global Tech Placement Report highlights a significant surge in off-campus remote internship contracts. Companies are leveraging automated technical skill verification platforms to hire from a broader, global talent pool without geographic constraints.",
    actionUrl: "/student/opportunities",
    actionLabel: "Explore Remote Openings",
  },
  {
    id: "news-4",
    category: "companies",
    categoryLabel: "Top Companies",
    badgeColor: "bg-blue-100 text-blue-700 dark:bg-blue-950/80 dark:text-blue-300 border-blue-200 dark:border-blue-800",
    company: "Microsoft",
    companyLogoText: "M",
    companyLogoBg: "bg-sky-600 text-white",
    title: "Microsoft Expands Azure AI Grants: $1,500 Credits for Enrolled Students",
    summary: "Students can now build, test, and deploy production-grade LLM applications with complimentary OpenAI models and GitHub Copilot licenses.",
    date: "1 day ago",
    readTime: "2 min read",
    trending: false,
    takeaways: [
      "Free access to GPT-4o and Azure OpenAI developer endpoints for university projects.",
      "Includes complimentary GitHub Enterprise Student developer pack and CI/CD compute minutes.",
      "Graduates with Azure AI certifications receive interview invites with Microsoft partner firms."
    ],
    fullStory: "Microsoft has expanded its Azure Student Developer initiative, giving university students free access to enterprise cloud resources and foundation model APIs to accelerate hands-on generative AI learning.",
    actionUrl: "https://azure.microsoft.com/free/students",
    actionLabel: "Claim Student Credits",
  },
  {
    id: "news-5",
    category: "tech",
    categoryLabel: "Tech & Innovation",
    badgeColor: "bg-purple-100 text-purple-700 dark:bg-purple-950/80 dark:text-purple-300 border-purple-200 dark:border-purple-800",
    company: "Edge AI",
    companyLogoText: "🤖",
    companyLogoBg: "bg-indigo-600 text-white",
    title: "WebGPU & On-Device Small Language Models Bring Edge AI to Modern Browsers",
    summary: "Developers can now run high-efficiency 3B-parameter models directly client-side at 45 tokens/second with zero server API charges.",
    date: "1 day ago",
    readTime: "3 min read",
    trending: false,
    takeaways: [
      "Zero server latency and complete user data privacy for interactive web apps.",
      "Chrome and Edge introduce first-class WebGPU shader acceleration for neural network inference.",
      "Paves the way for client-side summarization, speech recognition, and instant smart code suggestions."
    ],
    fullStory: "Breakthroughs in WebAssembly and WebGPU have made it viable to run quantized neural network models directly within modern desktop and mobile browsers. Developers can deliver instant intelligent features without ongoing API operational costs.",
    actionUrl: "https://developer.chrome.com",
    actionLabel: "View WebGPU Guide",
  },
  {
    id: "news-6",
    category: "jobs",
    categoryLabel: "Jobs & Industry",
    badgeColor: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/80 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800",
    company: "Campus Drives",
    companyLogoText: "🚀",
    companyLogoBg: "bg-amber-600 text-white",
    title: "Campus Placement Benchmark: Top 5 In-Demand Roles For Graduating Batches",
    summary: "Full-Stack Engineer, AI Solutions Architect, and Cloud DevOps Specialist lead placement package offers across top tech firms this season.",
    date: "2 days ago",
    readTime: "4 min read",
    trending: false,
    takeaways: [
      "Average campus compensation packages grew 14% for dual-skilled (Frontend + Backend) graduates.",
      "Strong demand for candidates who understand microservices, relational databases, and API security.",
      "System design and clean code test scores carry double the weight of traditional aptitude tests."
    ],
    fullStory: "An aggregated audit of placement statistics across 150+ technology institutions shows a distinct pivot toward specialized technical competencies. Students who build tangible portfolio applications and showcase verified skills in modern frameworks outperform generalist candidates across all interview rounds.",
    actionUrl: "/student/opportunities",
    actionLabel: "View Placement Guide",
  },
];

// Mock friends list for Friends Connect
const initialFriends = [
  {
    id: "f1",
    name: "Arjun Sharma",
    avatarBg: "bg-blue-100 text-blue-700",
    avatarInitials: "AS",
    status: "Studying Web Dev.",
    online: true,
    activityTime: "Online now",
    mutualCourses: 3,
    college: "Tech Institute",
  },
  {
    id: "f2",
    name: "Sophia Chen",
    avatarBg: "bg-rose-100 text-rose-700",
    avatarInitials: "SC",
    status: "In UI/UX Assessment",
    online: true,
    activityTime: "Active 4m ago",
    mutualCourses: 4,
    college: "Design Academy",
  },
  {
    id: "f3",
    name: "Marcus Vance",
    avatarBg: "bg-amber-100 text-amber-700",
    avatarInitials: "MV",
    status: "Reviewing Mathematics Quiz",
    online: true,
    activityTime: "Active 10m ago",
    mutualCourses: 2,
    college: "State College",
  },
  {
    id: "f4",
    name: "Priya Patel",
    avatarBg: "bg-emerald-100 text-emerald-700",
    avatarInitials: "PP",
    status: "Studying Marketing Strategies",
    online: true,
    activityTime: "Online now",
    mutualCourses: 5,
    college: "National University",
  },
  {
    id: "f5",
    name: "David Kim",
    avatarBg: "bg-purple-100 text-purple-700",
    avatarInitials: "DK",
    status: "Practicing React Components",
    online: false,
    activityTime: "Last seen 2h ago",
    mutualCourses: 1,
    college: "Tech Institute",
  },
];

export default function StudentDashboardPage() {
  const [activeCourseModal, setActiveCourseModal] = useState<string | null>(null);
  const [showFriendsDrawer, setShowFriendsDrawer] = useState(false);
  const [friendsList, setFriendsList] = useState(initialFriends);
  const [friendSearch, setFriendSearch] = useState("");
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [chartHoverMonth, setChartHoverMonth] = useState<string | null>("Jun");
  const [activeFriendsTab, setActiveFriendsTab] = useState<"online" | "all" | "add">("online");
  const [newFriendEmail, setNewFriendEmail] = useState("");
  const [activeNewsTab, setActiveNewsTab] = useState<"all" | "companies" | "tech" | "jobs">("all");
  const [selectedNewsArticle, setSelectedNewsArticle] = useState<NewsItem | null>(null);

  // Live Opportunities posted by companies
  const [liveOpportunities, setLiveOpportunities] = useState<any[]>([]);
  const [loadingOpportunities, setLoadingOpportunities] = useState(true);

  useEffect(() => {
    fetch("/api/opportunities")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setLiveOpportunities(data);
        }
        setLoadingOpportunities(false);
      })
      .catch(() => setLoadingOpportunities(false));
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3200);
  };

  const handleWave = (friendName: string) => {
    showToast(`👋 Sent a wave to ${friendName}! They will receive a ping.`);
  };

  const handleInviteStudy = (friendName: string) => {
    showToast(`📚 Study room invite sent to ${friendName}!`);
  };

  const handleAddNewFriend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFriendEmail) return;
    showToast(`✨ Friend request sent to ${newFriendEmail}!`);
    setNewFriendEmail("");
  };

  const filteredFriends = friendsList.filter((f) => {
    const matchesSearch = f.name.toLowerCase().includes(friendSearch.toLowerCase()) ||
      f.status.toLowerCase().includes(friendSearch.toLowerCase());
    if (activeFriendsTab === "online") return f.online && matchesSearch;
    return matchesSearch;
  });

  return (
    <div className="space-y-6 relative pb-16">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center space-x-3 text-sm animate-bounce">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* =========================================================================
          ROW 1: HERO PROMO BANNER (Full width)
         ========================================================================= */}
      <div className="w-full rounded-3xl bg-gradient-to-r from-[#3aa38f] via-[#359d89] to-[#308d7c] text-white p-6 sm:p-8 md:p-10 relative overflow-hidden shadow-sm flex flex-col justify-between min-h-[220px]">
        {/* Subtle Decorative glow shapes */}
        <div className="absolute -top-12 -left-12 w-48 h-48 rounded-full bg-white/10 blur-xl pointer-events-none" />
        <div className="absolute -bottom-16 right-1/3 w-64 h-64 rounded-full bg-teal-400/20 blur-2xl pointer-events-none" />

        {/* Banner Content */}
        <div className="relative z-10 max-w-lg">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight leading-snug text-white">
            Learn With Effectively With Us!
          </h1>
          <p className="text-sm sm:text-base text-teal-50/90 mt-2 font-medium">
            Get 30% off every course on january.
          </p>
        </div>

        {/* Floating Stats Chips at Bottom-Left of Banner */}
        <div className="relative z-10 flex flex-wrap items-center gap-3 sm:gap-4 mt-6">
          {/* Students Chip */}
          <div className="flex items-center space-x-3 bg-white/15 backdrop-blur-md px-3.5 py-2 rounded-2xl border border-white/20 shadow-xs">
            <div className="w-9 h-9 rounded-full bg-[#f43f5e] flex items-center justify-center text-white shadow-xs">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[11px] font-medium text-teal-100 leading-tight">Students</p>
              <p className="text-sm font-bold text-white leading-tight">75,000+</p>
            </div>
          </div>

          {/* Expert Mentors Chip */}
          <div className="flex items-center space-x-3 bg-white/15 backdrop-blur-md px-3.5 py-2 rounded-2xl border border-white/20 shadow-xs">
            <div className="w-9 h-9 rounded-full bg-[#f59e0b] flex items-center justify-center text-white shadow-xs">
              <Users className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[11px] font-medium text-teal-100 leading-tight">Expert Mentors</p>
              <p className="text-sm font-bold text-white leading-tight">200+</p>
            </div>
          </div>
        </div>

        {/* Right Vector Illustration of Graduating Students */}
        <div className="absolute right-0 bottom-0 top-0 w-64 sm:w-80 md:w-96 pointer-events-none select-none flex items-end justify-end pr-2 sm:pr-6">
          <GraduatingStudentsIllustration className="w-full h-auto max-h-[230px] md:max-h-[250px] object-contain drop-shadow-md" />
        </div>
      </div>

      {/* =========================================================================
          PORTAL QUICK ACCESS: ALL SECTIONS UNDER STUDENT DASHBOARD
         ========================================================================= */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between px-1">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            Student Dashboard Sections
          </p>
          <span className="text-[11px] font-semibold text-blue-600 dark:text-blue-400">
            6 Connected Portals
          </span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {[
            {
              name: "Documents",
              desc: "Resume & Credentials",
              href: "/student/documents",
              icon: FileText,
              badge: "3 files",
              color: "from-blue-500/10 to-indigo-500/10 text-blue-600 border-blue-200/50",
            },
            {
              name: "Opportunities",
              desc: "Jobs & Internships",
              href: "/student/opportunities",
              icon: Briefcase,
              badge: `${liveOpportunities.length || 18}+ Active`,
              color: "from-emerald-500/10 to-teal-500/10 text-emerald-600 border-emerald-200/50",
            },
            {
              name: "Communities",
              desc: "Discord Guilds & Voice",
              href: "/student/communities",
              icon: Users,
              badge: "Live Chat",
              color: "from-indigo-500/10 to-purple-500/10 text-indigo-600 border-indigo-200/50",
            },
            {
              name: "Skill Assessment",
              desc: "Taxonomy & Tests",
              href: "/student/skills",
              icon: CheckSquare,
              badge: "Verify Skills",
              color: "from-amber-500/10 to-orange-500/10 text-amber-600 border-amber-200/50",
            },
            {
              name: "Learning",
              desc: "Skill Gaps & Courses",
              href: "/student/learning",
              icon: BookOpen,
              badge: "Bridge Modules",
              color: "from-cyan-500/10 to-sky-500/10 text-cyan-600 border-cyan-200/50",
            },
            {
              name: "Portfolio",
              desc: "Verified Badges & Work",
              href: "/student/portfolio",
              icon: Award,
              badge: "Credential ID",
              color: "from-rose-500/10 to-pink-500/10 text-rose-600 border-rose-200/50",
            },
          ].map((sec) => (
            <Link
              key={sec.name}
              href={sec.href}
              className="group p-3.5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700/60 hover:border-blue-400 dark:hover:border-blue-500 hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div className="flex items-center justify-between">
                <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${sec.color} flex items-center justify-center font-bold`}>
                  <sec.icon className="w-4 h-4" />
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-all" />
              </div>
              <div className="mt-3">
                <h4 className="text-xs font-bold text-slate-800 dark:text-slate-100 group-hover:text-blue-600 transition-colors">
                  {sec.name}
                </h4>
                <p className="text-[10px] text-slate-400 font-medium truncate mt-0.5">
                  {sec.desc}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* =========================================================================
          FEATURED: LIVE OPPORTUNITIES FROM VERIFIED COMPANIES
         ========================================================================= */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl p-5 sm:p-6 border border-slate-100 dark:border-slate-700/60 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-700/50">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-500/15 to-teal-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold shadow-xs">
              <Briefcase className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">
                  Opportunities & Company Postings
                </h3>
                <span className="flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800/60">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span>Live Feed</span>
                </span>
              </div>
              <p className="text-xs text-slate-400 font-medium">
                Live positions posted by verified enterprise employers with canonical skill matching
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <Link
              href="/student/opportunities"
              className="text-xs font-bold text-emerald-700 dark:text-emerald-300 hover:text-emerald-800 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 px-3.5 py-2 rounded-xl flex items-center space-x-1.5 transition-all hover:shadow-xs group"
            >
              <span>Explore All {liveOpportunities.length > 0 ? `(${liveOpportunities.length})` : ""}</span>
              <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>
        </div>

        {/* Opportunities Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-1">
          {loadingOpportunities ? (
            [1, 2, 3].map((i) => (
              <div key={i} className="p-4 rounded-2xl border border-slate-100 dark:border-slate-700/50 bg-slate-50/50 dark:bg-slate-800/40 animate-pulse space-y-3">
                <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/2" />
                <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded w-3/4" />
                <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-full" />
              </div>
            ))
          ) : liveOpportunities.length === 0 ? (
            <div className="col-span-full py-8 text-center text-xs text-slate-400">
              No active job postings right now. Check back soon!
            </div>
          ) : (
            [...liveOpportunities]
              .sort((a, b) => new Date(b.job.postedAt).getTime() - new Date(a.job.postedAt).getTime())
              .slice(0, 3)
              .map((opp, idx) => {
              const job = opp.job;
              const matchResult = opp.matchResult;

              return (
                <div
                  key={job.id || idx}
                  className="p-4.5 rounded-2xl border border-slate-100 dark:border-slate-700/50 bg-white dark:bg-slate-800/90 hover:border-emerald-300 dark:hover:border-emerald-600/60 hover:shadow-md transition-all flex flex-col justify-between space-y-3 group"
                >
                  <div className="space-y-2.5">
                    {/* Top Company Row */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 rounded-xl bg-slate-900 text-emerald-400 font-black text-xs flex items-center justify-center shrink-0">
                          {job.company ? job.company.slice(0, 2).toUpperCase() : "GE"}
                        </div>
                        <div>
                          <div className="flex items-center space-x-1.5">
                            <span className="text-xs font-bold text-slate-900 dark:text-slate-100 leading-tight">
                              {job.company || "Google Enterprise Partner"}
                            </span>
                          </div>
                          <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 flex items-center space-x-0.5">
                            <ShieldCheck className="w-3 h-3 text-emerald-600" />
                            <span>Verified Employer</span>
                          </span>
                        </div>
                      </div>

                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                        {job.workMode || "Hybrid"}
                      </span>
                    </div>

                    {/* Job Title & Salary */}
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors line-clamp-1">
                        {job.title}
                      </h4>
                      <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">
                        {job.salary || "₹45,000 / month"}
                      </p>
                    </div>

                    {/* Department & Location */}
                    <p className="text-[11px] text-slate-400 flex items-center space-x-1 truncate">
                      <MapPin className="w-3 h-3 shrink-0 text-slate-400" />
                      <span>{job.location || "Bangalore, India"}</span>
                      {job.department && (
                        <>
                          <span>•</span>
                          <span>{job.department}</span>
                        </>
                      )}
                    </p>

                    {/* Required Skills Chips */}
                    <div className="flex flex-wrap gap-1 pt-0.5">
                      {(job.requiredSkills || []).slice(0, 3).map((sk: string) => (
                        <span
                          key={sk}
                          className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-700/60 text-slate-700 dark:text-slate-300"
                        >
                          {sk}
                        </span>
                      ))}
                      {(job.requiredSkills || []).length > 3 && (
                        <span className="text-[10px] font-medium text-slate-400 px-1 py-0.5">
                          +{(job.requiredSkills || []).length - 3} more
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Card Bottom: Match Meter & Apply Action */}
                  <div className="pt-2.5 border-t border-slate-100 dark:border-slate-700/50 flex items-center justify-between gap-2">
                    <div className="flex items-center space-x-1.5 text-xs">
                      <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400">Match:</span>
                      <span className="font-extrabold text-xs text-emerald-600 dark:text-emerald-400">
                        {matchResult?.matchScore || 92}%
                      </span>
                    </div>

                    <Link
                      href={`/student/opportunities?applyJobId=${job.id}`}
                      className="text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white px-3.5 py-1.5 rounded-xl flex items-center space-x-1 transition-all shadow-xs"
                    >
                      <span>Apply</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* =========================================================================
          ROW 2: THREE COLUMNS
          Col 1: Popular Courses
          Col 2: Current Activity (Monthly Progress Chart + 2 Highlight Stat Cards)
          Col 3: Best Instructors
         ========================================================================= */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {/* -------------------------------------------------------------
            COLUMN 1: POPULAR COURSES
           ------------------------------------------------------------- */}
        <div className="bg-white dark:bg-slate-800 rounded-3xl p-5 sm:p-6 border border-slate-100 dark:border-slate-700/60 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">Popular Courses</h3>
              <Link
                href="/student/learning"
                className="text-xs font-semibold text-slate-400 hover:text-blue-600 transition-colors"
              >
                All Courses
              </Link>
            </div>

            {/* Course Cards List */}
            <div className="space-y-3">
              {popularCourses.map((course) => (
                <div
                  key={course.id}
                  className="p-3 rounded-2xl border border-slate-100 dark:border-slate-700/50 hover:border-slate-200 dark:hover:border-slate-600 bg-white dark:bg-slate-800/80 hover:shadow-xs transition-all flex items-center justify-between group"
                >
                  <div className="flex items-center space-x-3.5 min-w-0">
                    {/* Course Initial Square Icon */}
                    <div
                      className={`w-11 h-11 rounded-xl ${course.bgClass} text-white font-extrabold text-lg flex items-center justify-center flex-shrink-0 shadow-xs group-hover:scale-105 transition-transform`}
                    >
                      {course.initial}
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100 truncate group-hover:text-blue-600 transition-colors">
                        {course.title}
                      </h4>
                      <p className="text-xs text-slate-400 font-medium">{course.coursesCount}</p>
                    </div>
                  </div>

                  {/* Action Badge & Menu */}
                  <div className="flex items-center space-x-2 flex-shrink-0">
                    <Link
                      href={course.href}
                      className={`text-xs font-bold px-3 py-1.5 rounded-full transition-colors ${course.badgeBg}`}
                    >
                      {course.badgeText}
                    </Link>
                    <button
                      onClick={() => setActiveCourseModal(course.id)}
                      className="text-slate-300 hover:text-slate-600 dark:hover:text-slate-200 p-1"
                      aria-label="Course options"
                    >
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* -------------------------------------------------------------
            COLUMN 2: CURRENT ACTIVITY
           ------------------------------------------------------------- */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">Current Activity</h3>
          </div>

          {/* Monthly Progress Area Chart Card */}
          <div className="bg-white dark:bg-slate-800 rounded-3xl p-5 border border-slate-100 dark:border-slate-700/60 shadow-xs">
            <div className="flex items-start justify-between">
              <div>
                <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100">Monthly Progress</h4>
                <p className="text-xs text-slate-400 mt-0.5">This is the latest Improvement</p>
              </div>
              <div className="w-8 h-8 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-500 flex items-center justify-center">
                <CalendarIcon className="w-4 h-4" />
              </div>
            </div>

            {/* Custom Smooth Area SVG Line Chart */}
            <div className="mt-4 relative h-36 w-full">
              <svg viewBox="0 0 320 140" className="w-full h-full overflow-visible">
                <defs>
                  <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#0284c7" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.0" />
                  </linearGradient>
                </defs>

                {/* Horizontal Guide Lines */}
                <line x1="30" y1="20" x2="310" y2="20" stroke="#f1f5f9" strokeDasharray="3 3" />
                <line x1="30" y1="45" x2="310" y2="45" stroke="#f1f5f9" strokeDasharray="3 3" />
                <line x1="30" y1="70" x2="310" y2="70" stroke="#f1f5f9" strokeDasharray="3 3" />
                <line x1="30" y1="95" x2="310" y2="95" stroke="#f1f5f9" strokeDasharray="3 3" />
                <line x1="30" y1="120" x2="310" y2="120" stroke="#f1f5f9" />

                {/* Y-axis labels */}
                <text x="5" y="23" fill="#94a3b8" fontSize="8" fontWeight="600">80%</text>
                <text x="5" y="48" fill="#94a3b8" fontSize="8" fontWeight="600">60%</text>
                <text x="5" y="73" fill="#94a3b8" fontSize="8" fontWeight="600">40%</text>
                <text x="5" y="98" fill="#94a3b8" fontSize="8" fontWeight="600">20%</text>
                <text x="8" y="122" fill="#94a3b8" fontSize="8" fontWeight="600">0%</text>

                {/* Smooth Curve Area */}
                <path
                  d="M 35 120 C 65 118, 90 95, 120 90 C 150 85, 175 60, 205 60 C 235 60, 260 30, 295 24 L 295 120 L 35 120 Z"
                  fill="url(#chartGradient)"
                />

                {/* Smooth Curve Line */}
                <path
                  d="M 35 120 C 65 118, 90 95, 120 90 C 150 85, 175 60, 205 60 C 235 60, 260 30, 295 24"
                  fill="none"
                  stroke="#0284c7"
                  strokeWidth="3"
                  strokeLinecap="round"
                />

                {/* Points on curve with hover interaction */}
                {[
                  { x: 35, y: 120, label: "Jan", val: "5%" },
                  { x: 88, y: 100, label: "Feb", val: "22%" },
                  { x: 140, y: 88, label: "Mar", val: "38%" },
                  { x: 195, y: 62, label: "Apr", val: "54%" },
                  { x: 245, y: 48, label: "May", val: "68%" },
                  { x: 295, y: 24, label: "Jun", val: "78%" },
                ].map((pt) => (
                  <g
                    key={pt.label}
                    className="cursor-pointer group/pt"
                    onMouseEnter={() => setChartHoverMonth(pt.label)}
                  >
                    <circle
                      cx={pt.x}
                      cy={pt.y}
                      r={chartHoverMonth === pt.label ? "5" : "3.5"}
                      fill="#ffffff"
                      stroke="#0284c7"
                      strokeWidth={chartHoverMonth === pt.label ? "3" : "2"}
                      className="transition-all"
                    />
                    <text
                      x={pt.x}
                      y="134"
                      textAnchor="middle"
                      fill={chartHoverMonth === pt.label ? "#0284c7" : "#94a3b8"}
                      fontSize="9"
                      fontWeight={chartHoverMonth === pt.label ? "bold" : "500"}
                    >
                      {pt.label}
                    </text>
                  </g>
                ))}
              </svg>
            </div>
          </div>

          {/* Two Highlight Metric Cards Below Chart */}
          <div className="grid grid-cols-2 gap-3.5">
            {/* Amber Card: 450K+ Completed Course */}
            <div className="bg-[#ffbe1a] rounded-3xl p-4 sm:p-5 text-white shadow-xs relative overflow-hidden flex flex-col justify-between min-h-[125px] group">
              <div>
                <p className="text-2xl sm:text-3xl font-extrabold tracking-tight">450K+</p>
                <p className="text-xs sm:text-sm font-bold mt-1 text-white leading-tight">Completed Course</p>
                <p className="text-[10px] text-amber-100/90 mt-1">This is the latest Data</p>
              </div>
              <div className="flex justify-end mt-2">
                <button
                  onClick={() => showToast("📈 Viewing 450K+ Completed Courses report")}
                  className="w-8 h-8 rounded-full bg-white text-[#ffbe1a] flex items-center justify-center shadow-xs transition-transform group-hover:scale-110"
                  aria-label="View Course details"
                >
                  <ArrowUpRight className="w-4 h-4 font-bold" />
                </button>
              </div>
            </div>

            {/* Coral/Rose Card: 200K+ Video Course */}
            <div className="bg-[#ff426f] rounded-3xl p-4 sm:p-5 text-white shadow-xs relative overflow-hidden flex flex-col justify-between min-h-[125px] group">
              <div>
                <p className="text-2xl sm:text-3xl font-extrabold tracking-tight">200K+</p>
                <p className="text-xs sm:text-sm font-bold mt-1 text-white leading-tight">Video Course</p>
              </div>
              <div className="flex justify-end mt-2">
                <button
                  onClick={() => showToast("▶ Launching Video Learning stream")}
                  className="w-8 h-8 rounded-full bg-white text-[#ff426f] flex items-center justify-center shadow-xs transition-transform group-hover:scale-110"
                  aria-label="Play video courses"
                >
                  <Play className="w-3.5 h-3.5 ml-0.5 fill-current" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* -------------------------------------------------------------
            COLUMN 3: TOP TRENDING INDUSTRY SKILLS
           ------------------------------------------------------------- */}
        <div className="bg-white dark:bg-slate-800 rounded-3xl p-5 sm:p-6 border border-slate-100 dark:border-slate-700/60 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">Trending Industry Skills</h3>
                <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400">
                  Top
                </span>
              </div>
              <Link
                href="/student/skills"
                className="text-xs font-semibold text-slate-400 hover:text-blue-600 transition-colors"
              >
                See All
              </Link>
            </div>

            {/* Trending Skills List */}
            <div className="space-y-4">
              {trendingSkills.map((skill) => {
                const Icon = skill.icon;
                return (
                  <div
                    key={skill.id}
                    className="flex items-center justify-between p-2 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-700/40 transition-colors group"
                  >
                    <div className="flex items-center space-x-3.5 min-w-0 pr-2">
                      <div
                        className={`w-11 h-11 rounded-2xl ${skill.iconBg} flex items-center justify-center flex-shrink-0 shadow-2xs group-hover:scale-105 transition-transform`}
                      >
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-100 truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                          {skill.name}
                        </p>
                        <p className="text-[11px] text-slate-400 dark:text-slate-500 font-medium truncate mt-0.5">
                          {skill.metric}
                        </p>
                      </div>
                    </div>
                    <Link
                      href={skill.href}
                      className="text-xs font-semibold text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-700 hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-900/40 dark:hover:text-blue-300 px-3.5 py-1.5 rounded-xl border border-slate-200/70 dark:border-slate-600 transition-all flex-shrink-0"
                    >
                      Courses
                    </Link>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================================
          ROW 3: NEWS & BOTTOM FRIENDS CONNECT SECTION
          1. News (Top Companies, Tech Innovations, Jobs & Industry Market News)
             User Request: "remove all of these and add a top companies and tech and industry or job relatd news as heading will be ' news '"
          2. Embedded Friends Connect Section (Bottom Right)
         ========================================================================= */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* NEW COMPONENT: News Section (Spans 3 Columns, Heading "News") */}
        <div className="lg:col-span-3 bg-white dark:bg-slate-800 rounded-3xl p-5 md:p-6 border border-slate-100 dark:border-slate-700/60 shadow-xs flex flex-col justify-between">
          <div>
            {/* News Header with Title "News" */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-4 mb-4 border-b border-slate-100 dark:border-slate-700/60">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-2xl bg-blue-50 dark:bg-blue-950/70 text-blue-600 dark:text-blue-400 flex items-center justify-center border border-blue-100 dark:border-blue-900/60 shadow-2xs">
                  <Newspaper className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <h3 className="text-base md:text-lg font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
                      News
                    </h3>
                    <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 text-[10px] font-bold border border-rose-200 dark:border-rose-900/50">
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
                      <span>Live Updates</span>
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">
                    Top companies, tech innovations, and industry job market telemetry
                  </p>
                </div>
              </div>

              {/* Category Filter Pills */}
              <div className="flex items-center flex-wrap gap-1.5">
                {[
                  { id: "all", label: "All News" },
                  { id: "companies", label: "Top Companies", icon: Building2 },
                  { id: "tech", label: "Tech", icon: Globe },
                  { id: "jobs", label: "Jobs & Industry", icon: Briefcase },
                ].map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeNewsTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveNewsTab(tab.id as any)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 ${
                        isActive
                          ? "bg-blue-600 text-white shadow-xs"
                          : "bg-slate-100 dark:bg-slate-700/60 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
                      }`}
                    >
                      {Icon && <Icon className="w-3.5 h-3.5" />}
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Articles Grid (3 Cards) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {(activeNewsTab === "all"
                ? newsArticles
                : newsArticles.filter((n) => n.category === activeNewsTab)
              )
                .slice(0, 3)
                .map((article) => (
                  <div
                    key={article.id}
                    onClick={() => setSelectedNewsArticle(article)}
                    className="group cursor-pointer rounded-2xl p-4 bg-slate-50/70 hover:bg-blue-50/40 dark:bg-slate-750 dark:hover:bg-slate-700/80 border border-slate-100 hover:border-blue-200 dark:border-slate-700/50 dark:hover:border-blue-800/60 transition-all flex flex-col justify-between"
                  >
                    <div>
                      {/* Top company/category badge and time */}
                      <div className="flex items-center justify-between gap-2 mb-2.5">
                        <div className="flex items-center space-x-1.5 min-w-0">
                          {article.companyLogoText && (
                            <span
                              className={`w-5 h-5 rounded-md ${article.companyLogoBg} font-black text-[10px] flex items-center justify-center flex-shrink-0 shadow-2xs`}
                            >
                              {article.companyLogoText}
                            </span>
                          )}
                          <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300 truncate">
                            {article.company}
                          </span>
                        </div>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${article.badgeColor} flex-shrink-0`}
                        >
                          {article.categoryLabel}
                        </span>
                      </div>

                      {/* Article Title */}
                      <h4 className="text-xs md:text-sm font-bold text-slate-800 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2 mb-1.5 leading-snug">
                        {article.title}
                      </h4>

                      {/* Summary */}
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                        {article.summary}
                      </p>
                    </div>

                    {/* Footer Meta & Read Action */}
                    <div className="mt-3.5 pt-2.5 border-t border-slate-200/60 dark:border-slate-700/50 flex items-center justify-between text-[11px] text-slate-400">
                      <div className="flex items-center space-x-2">
                        <span className="flex items-center space-x-1">
                          <Clock className="w-3 h-3" />
                          <span>{article.date}</span>
                        </span>
                        <span>•</span>
                        <span>{article.readTime}</span>
                      </div>
                      <span className="text-blue-600 dark:text-blue-400 font-bold group-hover:translate-x-0.5 transition-transform flex items-center space-x-0.5 text-[11px]">
                        <span>Read</span>
                        <ChevronRight className="w-3 h-3" />
                      </span>
                    </div>
                  </div>
                ))}
            </div>
          </div>

          {/* Bottom ticker & link to opportunities */}
          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-700/60 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-xs text-slate-500 dark:text-slate-400">
            <div className="flex items-center space-x-2">
              <span className="flex h-2 w-2 rounded-full bg-emerald-500" />
              <span className="text-[11px]">
                Curated feeds updated daily for verified campus placement drives & tech roadmaps.
              </span>
            </div>
            <Link
              href="/student/opportunities"
              className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center space-x-1"
            >
              <span>Explore 200+ Active Job Postings</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* -------------------------------------------------------------
            BOTTOM CARD 4: USER'S EXPLICIT FEATURE:
            "on right bottom side friends connect button section showing friends"
           ------------------------------------------------------------- */}
        <div className="bg-gradient-to-br from-blue-50/80 via-white to-sky-50/60 dark:from-slate-800 dark:to-slate-800/90 rounded-3xl p-5 border-2 border-blue-200/80 dark:border-blue-900/60 shadow-sm flex flex-col justify-between relative overflow-hidden">
          <div className="absolute -top-6 -right-6 w-24 h-24 bg-blue-400/10 rounded-full blur-xl pointer-events-none" />

          <div>
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center space-x-2">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
                </span>
                <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100">Friends Connect</h4>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                4 Active
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">Study with your batchmates</p>

            {/* Quick Friends Avatars Stack & Mini list */}
            <div className="space-y-2">
              {friendsList.slice(0, 3).map((friend) => (
                <div
                  key={friend.id}
                  className="flex items-center justify-between p-1.5 rounded-xl bg-white/80 dark:bg-slate-700/60 border border-slate-100 dark:border-slate-600/50"
                >
                  <div className="flex items-center space-x-2 min-w-0">
                    <div className="relative">
                      <div className={`w-7 h-7 rounded-full ${friend.avatarBg} font-bold text-[10px] flex items-center justify-center flex-shrink-0`}>
                        {friend.avatarInitials}
                      </div>
                      {friend.online && (
                        <span className="w-2 h-2 rounded-full bg-emerald-500 ring-1 ring-white absolute -bottom-0.5 -right-0.5" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">{friend.name}</p>
                      <p className="text-[10px] text-slate-400 truncate">{friend.status}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleWave(friend.name)}
                    className="p-1 text-slate-400 hover:text-amber-500 transition-colors"
                    title={`Wave at ${friend.name}`}
                  >
                    👋
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Open Full Friends Connect Button */}
          <button
            onClick={() => setShowFriendsDrawer(true)}
            className="mt-3.5 w-full py-2.5 px-3 rounded-xl bg-[#1a73e8] hover:bg-[#1557b0] text-white text-xs font-bold shadow-xs hover:shadow-md transition-all flex items-center justify-center space-x-2"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Connect & Study ({friendsList.length})</span>
          </button>
        </div>
      </div>

      {/* =========================================================================
          FLOATING BOTTOM-RIGHT "FRIENDS CONNECT" LAUNCHER BUTTON
         ========================================================================= */}
      <div className="fixed bottom-6 right-6 md:right-10 z-40">
        <button
          onClick={() => setShowFriendsDrawer(true)}
          className="group flex items-center space-x-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white pl-3.5 pr-4 py-3 rounded-full shadow-[0_10px_30px_rgba(26,115,232,0.4)] border-2 border-white dark:border-slate-800 transition-all transform hover:scale-105 active:scale-95"
        >
          {/* Overlapping friends avatar stack */}
          <div className="flex -space-x-2 overflow-hidden">
            <div className="inline-block h-7 w-7 rounded-full ring-2 ring-white bg-blue-200 text-blue-800 text-[10px] font-bold flex items-center justify-center">
              AS
            </div>
            <div className="inline-block h-7 w-7 rounded-full ring-2 ring-white bg-rose-200 text-rose-800 text-[10px] font-bold flex items-center justify-center">
              SC
            </div>
            <div className="inline-block h-7 w-7 rounded-full ring-2 ring-white bg-amber-200 text-amber-800 text-[10px] font-bold flex items-center justify-center">
              MV
            </div>
          </div>

          <div className="text-left">
            <div className="flex items-center space-x-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs font-extrabold tracking-tight">Friends Connect</span>
            </div>
            <p className="text-[10px] text-blue-100 font-medium">4 online studying</p>
          </div>
        </button>
      </div>

      {/* =========================================================================
          INTERACTIVE FRIENDS CONNECT DRAWER / MODAL
         ========================================================================= */}
      {showFriendsDrawer && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
            onClick={() => setShowFriendsDrawer(false)}
          />

          {/* Slide-in Panel */}
          <div className="relative w-full max-w-md bg-white dark:bg-slate-900 shadow-2xl h-full flex flex-col z-50 border-l border-slate-200 dark:border-slate-800 animate-in slide-in-from-right duration-300">
            {/* Header */}
            <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/50">
              <div className="flex items-center space-x-2.5">
                <div className="w-9 h-9 rounded-2xl bg-blue-100 dark:bg-blue-950 text-blue-600 flex items-center justify-center">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">Friends Connect</h3>
                  <p className="text-xs text-slate-400">Connect, ping & study together</p>
                </div>
              </div>
              <button
                onClick={() => setShowFriendsDrawer(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Filter Tabs */}
            <div className="px-5 pt-3 pb-2 flex space-x-2 border-b border-slate-100 dark:border-slate-800">
              <button
                onClick={() => setActiveFriendsTab("online")}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                  activeFriendsTab === "online"
                    ? "bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                Online ({friendsList.filter((f) => f.online).length})
              </button>
              <button
                onClick={() => setActiveFriendsTab("all")}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                  activeFriendsTab === "all"
                    ? "bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                All Friends ({friendsList.length})
              </button>
              <button
                onClick={() => setActiveFriendsTab("add")}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                  activeFriendsTab === "add"
                    ? "bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                + Add Friend
              </button>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {activeFriendsTab === "add" ? (
                /* Add Friend Tab */
                <div className="space-y-4">
                  <div className="p-4 rounded-2xl bg-blue-50/70 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/60">
                    <h4 className="text-sm font-bold text-blue-900 dark:text-blue-300">Invite a Classmate</h4>
                    <p className="text-xs text-blue-700/80 dark:text-blue-400 mt-1">
                      Enter your friend&apos;s email or student username to connect and share study progress.
                    </p>
                    <form onSubmit={handleAddNewFriend} className="mt-3 space-y-2">
                      <input
                        type="text"
                        placeholder="friend@edulearn.org or @username"
                        value={newFriendEmail}
                        onChange={(e) => setNewFriendEmail(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl text-xs border border-blue-200 dark:border-blue-800 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                        required
                      />
                      <button
                        type="submit"
                        className="w-full py-2.5 rounded-xl bg-blue-600 text-white font-bold text-xs hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
                      >
                        <UserPlus className="w-3.5 h-3.5" />
                        <span>Send Friend Request</span>
                      </button>
                    </form>
                  </div>

                  <div>
                    <h5 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Suggested Peers</h5>
                    {[
                      { name: "Ananya Roy", course: "UI/UX Design", college: "Design Institute" },
                      { name: "Kavya Sundaram", course: "Mathematics", college: "State University" },
                    ].map((peer) => (
                      <div
                        key={peer.name}
                        className="flex items-center justify-between p-3 rounded-2xl border border-slate-100 dark:border-slate-800 mb-2"
                      >
                        <div>
                          <p className="text-xs font-bold text-slate-800 dark:text-slate-200">{peer.name}</p>
                          <p className="text-[10px] text-slate-400">{peer.course} • {peer.college}</p>
                        </div>
                        <button
                          onClick={() => showToast(`Friend request sent to ${peer.name}!`)}
                          className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-blue-50 text-blue-600 text-xs font-bold"
                        >
                          Connect
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                /* Friends List Tab */
                <>
                  {/* Search Input */}
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search friends or subject..."
                      value={friendSearch}
                      onChange={(e) => setFriendSearch(e.target.value)}
                      className="w-full pl-9 pr-4 py-2.5 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    />
                    <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  </div>

                  {filteredFriends.length === 0 ? (
                    <div className="text-center py-8 text-slate-400 text-xs">
                      No friends found matching &quot;{friendSearch}&quot;
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {filteredFriends.map((friend) => (
                        <div
                          key={friend.id}
                          className="p-3.5 rounded-2xl border border-slate-100 dark:border-slate-800 hover:border-blue-200 dark:hover:border-blue-800 bg-white dark:bg-slate-800/80 transition-all shadow-xs"
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex items-center space-x-3">
                              <div className="relative">
                                <div className={`w-10 h-10 rounded-full ${friend.avatarBg} font-bold text-xs flex items-center justify-center shadow-xs`}>
                                  {friend.avatarInitials}
                                </div>
                                <span
                                  className={`w-2.5 h-2.5 rounded-full ring-2 ring-white absolute bottom-0 right-0 ${
                                    friend.online ? "bg-emerald-500" : "bg-slate-300"
                                  }`}
                                />
                              </div>
                              <div>
                                <h4 className="text-xs font-bold text-slate-800 dark:text-slate-100">{friend.name}</h4>
                                <p className="text-[11px] text-blue-600 dark:text-blue-400 font-semibold">{friend.status}</p>
                                <p className="text-[10px] text-slate-400">{friend.college} • {friend.activityTime}</p>
                              </div>
                            </div>
                          </div>

                          {/* Quick Action Buttons */}
                          <div className="flex items-center space-x-2 mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-700/60">
                            <button
                              onClick={() => handleWave(friend.name)}
                              className="flex-1 py-1.5 px-2 rounded-lg bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 text-[11px] font-semibold hover:bg-amber-100 transition-colors flex items-center justify-center space-x-1"
                            >
                              <span>👋</span>
                              <span>Wave</span>
                            </button>
                            <button
                              onClick={() => handleInviteStudy(friend.name)}
                              className="flex-1 py-1.5 px-2 rounded-lg bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 text-[11px] font-semibold hover:bg-blue-100 transition-colors flex items-center justify-center space-x-1"
                            >
                              <BookOpen className="w-3 h-3" />
                              <span>Study Room</span>
                            </button>
                            <Link
                              href="/student/communities"
                              onClick={() => setShowFriendsDrawer(false)}
                              className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 transition-colors"
                              title="Chat in Communities"
                            >
                              <MessageCircle className="w-3.5 h-3.5" />
                            </Link>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      )}



      {/* =========================================================================
          COURSE DETAILS MODAL (when ⋮ clicked)
         ========================================================================= */}
      {activeCourseModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/40 backdrop-blur-xs" onClick={() => setActiveCourseModal(null)} />
          <div className="relative bg-white dark:bg-slate-800 rounded-3xl p-6 max-w-sm w-full shadow-2xl border border-slate-100 dark:border-slate-700 z-50 animate-in zoom-in-95 duration-150">
            {(() => {
              const c = popularCourses.find((x) => x.id === activeCourseModal);
              if (!c) return null;
              return (
                <div>
                  <div className="flex items-center space-x-3 mb-3">
                    <div className={`w-10 h-10 rounded-xl ${c.bgClass} text-white font-bold text-lg flex items-center justify-center`}>
                      {c.initial}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100">{c.title}</h4>
                      <p className="text-xs text-slate-400">{c.coursesCount}</p>
                    </div>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300 mb-4">{c.description}</p>
                  <div className="space-y-2 text-xs">
                    <Link
                      href={c.href}
                      onClick={() => setActiveCourseModal(null)}
                      className="w-full py-2 px-3 rounded-xl bg-blue-600 text-white font-bold text-center block hover:bg-blue-700 transition-colors"
                    >
                      Enroll & Explore Module
                    </Link>
                    <button
                      onClick={() => {
                        setActiveCourseModal(null);
                        showToast(`Bookmarked ${c.title} to your learning list!`);
                      }}
                      className="w-full py-2 px-3 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold hover:bg-slate-200 transition-colors"
                    >
                      Bookmark Course
                    </button>
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      )}
      {/* News Article Reader Modal */}
      {selectedNewsArticle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="relative bg-white dark:bg-slate-800 rounded-3xl p-6 md:p-7 max-w-xl w-full shadow-2xl border border-slate-100 dark:border-slate-700 z-50 animate-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-start justify-between gap-4 mb-4 pb-3 border-b border-slate-100 dark:border-slate-700/60">
              <div className="flex items-center space-x-3">
                {selectedNewsArticle.companyLogoText && (
                  <span
                    className={`w-9 h-9 rounded-xl ${selectedNewsArticle.companyLogoBg} font-black text-sm flex items-center justify-center flex-shrink-0 shadow-xs`}
                  >
                    {selectedNewsArticle.companyLogoText}
                  </span>
                )}
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                      {selectedNewsArticle.company}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${selectedNewsArticle.badgeColor}`}
                    >
                      {selectedNewsArticle.categoryLabel}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2 text-[11px] text-slate-400 mt-0.5">
                    <span>{selectedNewsArticle.date}</span>
                    <span>•</span>
                    <span>{selectedNewsArticle.readTime}</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setSelectedNewsArticle(null)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Title & Story */}
            <h3 className="text-base md:text-lg font-extrabold text-slate-900 dark:text-slate-100 leading-snug mb-3">
              {selectedNewsArticle.title}
            </h3>

            <p className="text-xs md:text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
              {selectedNewsArticle.fullStory}
            </p>

            {/* Key Takeaways */}
            <div className="p-4 rounded-2xl bg-blue-50/70 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/50 mb-5">
              <h4 className="text-xs font-bold text-blue-950 dark:text-blue-200 uppercase tracking-wider mb-2.5 flex items-center space-x-1.5">
                <CheckCircle2 className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <span>Key Highlights & Impact</span>
              </h4>
              <ul className="space-y-2 text-xs text-slate-700 dark:text-slate-300">
                {selectedNewsArticle.takeaways.map((point, idx) => (
                  <li key={idx} className="flex items-start space-x-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-600 dark:bg-blue-400 mt-1.5 flex-shrink-0" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-700/60">
              {selectedNewsArticle.actionUrl.startsWith("http") ? (
                <a
                  href={selectedNewsArticle.actionUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:flex-1 py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs text-center flex items-center justify-center space-x-2 shadow-xs transition-colors"
                >
                  <span>{selectedNewsArticle.actionLabel}</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              ) : (
                <Link
                  href={selectedNewsArticle.actionUrl}
                  onClick={() => setSelectedNewsArticle(null)}
                  className="w-full sm:flex-1 py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs text-center flex items-center justify-center space-x-2 shadow-xs transition-colors"
                >
                  <span>{selectedNewsArticle.actionLabel}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              )}
              <button
                onClick={() => {
                  showToast(`Bookmarked "${selectedNewsArticle.title.slice(0, 32)}..." to your saved news!`);
                  setSelectedNewsArticle(null);
                }}
                className="w-full sm:w-auto py-2.5 px-4 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-650 font-bold text-xs transition-colors flex items-center justify-center space-x-1.5"
              >
                <Bookmark className="w-3.5 h-3.5" />
                <span>Save Story</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
