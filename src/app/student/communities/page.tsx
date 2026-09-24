"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Search,
  Bell,
  Settings,
  Mic,
  MicOff,
  Headphones,
  Volume2,
  Plus,
  X,
  Hash,
  ChevronDown,
  MessageSquare,
  Send,
  Smile,
  Paperclip,
  Check,
  Copy,
  Flame,
  Sparkles,
  Compass,
  GraduationCap,
  Cpu,
  Briefcase,
  TrendingUp,
  Radio,
  Users,
  Shield,
  ArrowLeft,
  Bookmark,
  User,
  ExternalLink,
  Code,
  PhoneOff,
} from "lucide-react";

// ============================================================================
// TYPES & DATA STRUCTURES
// ============================================================================

interface Channel {
  id: string;
  name: string;
  type: string;
  position?: number;
}

interface Community {
  id: string;
  name: string;
  shortName: string;
  description: string;
  icon: string;
  banner: string;
  category: string;
  visibility: string;
  memberCount: number;
  onlineCount: number;
  isJoined: boolean;
  taggedSkills: string[];
  channels: Channel[];
}

interface Moderator {
  id: string;
  name: string;
  role: string;
  status: "online" | "idle" | "offline";
  time: string;
  avatarBg: string;
}

interface Activity {
  id: string;
  user: string;
  action: string;
  detail: string;
  time: string;
}

interface ChatMessage {
  id: string;
  author: string;
  authorRole: string;
  authorRoleColor: string;
  avatarBg: string;
  avatarInitials: string;
  timestamp: string;
  content: string;
  codeSnippet?: {
    lang: string;
    code: string;
  };
  jobCard?: {
    company: string;
    title: string;
    stipend: string;
    location: string;
    applyUrl: string;
  };
  reactions: Array<{ emoji: string; count: number; reacted: boolean }>;
}

// ============================================================================
// ACADEMIC, TECH, INDUSTRY, NEWS, JOBS & STUDENT SEED DATA
// ============================================================================

const INITIAL_COMMUNITIES: Community[] = [
  {
    id: "comm-ai-ml",
    name: "AI & Machine Learning Research Hub",
    shortName: "AI & ML",
    description: "Large language models, PyTorch benchmarks, GenAI agents, transformer pipelines, and academic research reading groups.",
    icon: "AI",
    banner: "/communities/techlab.jpg",
    category: "Tech",
    visibility: "PUBLIC",
    memberCount: 184200,
    onlineCount: 48200,
    isJoined: true,
    taggedSkills: ["Python", "PyTorch", "LLMs", "Transformers", "LangChain"],
    channels: [
      { id: "ch-ai-1", name: "announcements", type: "announcement" },
      { id: "ch-ai-2", name: "general-ai", type: "text" },
      { id: "ch-ai-3", name: "paper-reviews", type: "text" },
      { id: "ch-ai-4", name: "genai-agents", type: "text" },
      { id: "ch-ai-5", name: "AI Research Lab", type: "voice" },
    ],
  },
  {
    id: "comm-cloud-web",
    name: "Full Stack & Cloud Architecture Guild",
    shortName: "Cloud & Web",
    description: "Distributed systems, React 19, Next.js 15, Kubernetes orchestration, Docker, microservices, and enterprise cloud infrastructure.",
    icon: "CL",
    banner: "/communities/hero.jpg",
    category: "Tech",
    visibility: "PUBLIC",
    memberCount: 240500,
    onlineCount: 62400,
    isJoined: true,
    taggedSkills: ["React", "Next.js", "TypeScript", "Node.js", "Kubernetes", "AWS"],
    channels: [
      { id: "ch-cl-1", name: "announcements", type: "announcement" },
      { id: "ch-cl-2", name: "web-architecture", type: "text" },
      { id: "ch-cl-3", name: "backend-apis", type: "text" },
      { id: "ch-cl-4", name: "system-design", type: "text" },
      { id: "ch-cl-5", name: "Cloud War Room", type: "voice" },
    ],
  },
  {
    id: "comm-jobs-hub",
    name: "Industry Placement & Internship Hub",
    shortName: "Jobs & Careers",
    description: "Tier-1 placement drives, FAANG interview machines, verified campus hiring alerts, resume ATS scoring, and corporate referrals.",
    icon: "JB",
    banner: "/communities/jobs.jpg",
    category: "Jobs",
    visibility: "PUBLIC",
    memberCount: 160800,
    onlineCount: 35800,
    isJoined: true,
    taggedSkills: ["Data Structures", "Algorithms", "System Design", "Behavioral Prep", "Resume Building"],
    channels: [
      { id: "ch-jb-1", name: "job-alerts", type: "announcement" },
      { id: "ch-jb-2", name: "interview-experiences", type: "text" },
      { id: "ch-jb-3", name: "resume-reviews", type: "text" },
      { id: "ch-jb-4", name: "company-hiring", type: "text" },
      { id: "ch-jb-5", name: "Mock Interview Room", type: "voice" },
    ],
  },
  {
    id: "comm-sih-labs",
    name: "Smart India Hackathon & Innovation Labs",
    shortName: "Education & SIH",
    description: "National hackathon team formation, patent filing guidance, startup incubators, capstone mentoring, and government project grants.",
    icon: "SIH",
    banner: "/communities/techlab.jpg",
    category: "Education",
    visibility: "PUBLIC",
    memberCount: 115400,
    onlineCount: 28500,
    isJoined: true,
    taggedSkills: ["Rapid Prototyping", "IoT", "AI/ML", "Product Design", "Pitching"],
    channels: [
      { id: "ch-sh-1", name: "announcements", type: "announcement" },
      { id: "ch-sh-2", name: "team-formation", type: "text" },
      { id: "ch-sh-3", name: "mentor-guidance", type: "text" },
      { id: "ch-sh-4", name: "project-showcase", type: "text" },
      { id: "ch-sh-5", name: "Hackathon War Room", type: "voice" },
    ],
  },
  {
    id: "comm-industry-mentors",
    name: "Global Industry Leaders & Mentors Guild",
    shortName: "Industry Connect",
    description: "Connect directly with engineering VPs, research scientists, and product leads across top multinational enterprises.",
    icon: "IND",
    banner: "/communities/jobs.jpg",
    category: "Industry",
    visibility: "PUBLIC",
    memberCount: 78200,
    onlineCount: 14200,
    isJoined: true,
    taggedSkills: ["Career Strategy", "Leadership", "Enterprise Systems", "Networking"],
    channels: [
      { id: "ch-in-1", name: "executive-talks", type: "announcement" },
      { id: "ch-in-2", name: "mentor-connect", type: "text" },
      { id: "ch-in-3", name: "ask-an-industry-expert", type: "text" },
      { id: "ch-in-4", name: "Executive Lounge", type: "voice" },
    ],
  },
  {
    id: "comm-campus-news",
    name: "Campus Tech News & Placements Bulletin",
    shortName: "Campus News",
    description: "Real-time updates on campus placement statistics, hiring trends, tech breakthroughs, conferences, and startup funding.",
    icon: "NEWS",
    banner: "/communities/hero.jpg",
    category: "News",
    visibility: "PUBLIC",
    memberCount: 52900,
    onlineCount: 8900,
    isJoined: true,
    taggedSkills: ["Industry Trends", "Tech News", "Placement Analytics"],
    channels: [
      { id: "ch-nw-1", name: "breaking-bulletins", type: "announcement" },
      { id: "ch-nw-2", name: "placement-statistics", type: "text" },
      { id: "ch-nw-3", name: "tech-trends-2026", type: "text" },
      { id: "ch-nw-4", name: "Daily News Brief", type: "voice" },
    ],
  },
];

const INITIAL_MODERATORS: Moderator[] = [
  { id: "mod-1", name: "Dr. Vikram Rao", role: "Industry Lead • Google", status: "online", time: "Now", avatarBg: "from-blue-600 to-indigo-600" },
  { id: "mod-2", name: "Prof. Alok Sen", role: "Head of CS Labs", status: "online", time: "8m ago", avatarBg: "from-purple-600 to-fuchsia-600" },
  { id: "mod-3", name: "Neha Sharma", role: "Tier-1 Placement Mentor", status: "idle", time: "25m ago", avatarBg: "from-emerald-600 to-teal-600" },
  { id: "mod-4", name: "Campus Placement Bot", role: "Verified System Admin", status: "online", time: "Now", avatarBg: "from-cyan-600 to-blue-600" },
];

const INITIAL_RECENT_ACTIVITY: Activity[] = [
  { id: "act-1", user: "Dr. Vikram Rao (Google)", action: "Posted 12 Cloud Internships in #job-alerts", detail: "Stipend: ₹45,000/mo • Hybrid Bengaluru", time: "2m ago" },
  { id: "act-2", user: "Ananya Sharma", action: "Published capstone project in #project-showcase", detail: "Autonomous Agent Multi-Node Mesh", time: "8m ago" },
  { id: "act-3", user: "Rohan Varma", action: "Received SDE Internship Offer from Microsoft", detail: "Tier-1 Campus Placement Drive 2026", time: "18m ago" },
  { id: "act-4", user: "Priya Patel", action: "Shared Google machine coding prep in #interview-experiences", detail: "15 DSA questions + dynamic programming notes", time: "31m ago" },
];

const INITIAL_CHANNEL_MESSAGES: Record<string, ChatMessage[]> = {
  general: [
    {
      id: "msg-1",
      author: "Dr. Vikram Rao",
      authorRole: "Industry Lead • Google",
      authorRoleColor: "text-blue-400 bg-blue-950/70 border-blue-700/60",
      avatarBg: "bg-blue-600 text-white",
      avatarInitials: "VR",
      timestamp: "Today at 10:14 AM",
      content: "Welcome to the AI & Machine Learning Research Hub! Our engineering team at Google is reviewing student capstone models this semester for direct summer internship tracks. Check the verified posting below:",
      jobCard: {
        company: "Google Enterprise Partner",
        title: "Autonomous Systems & ML Research Intern",
        stipend: "₹45,000/month",
        location: "Hybrid / Bengaluru (or Remote)",
        applyUrl: "/student/opportunities",
      },
      reactions: [
        { emoji: "⚡", count: 24, reacted: true },
        { emoji: "🚀", count: 38, reacted: false },
        { emoji: "🙌", count: 19, reacted: true },
      ],
    },
    {
      id: "msg-2",
      author: "Prof. Alok Sen",
      authorRole: "Head of CS Labs",
      authorRoleColor: "text-purple-300 bg-purple-950/70 border-purple-700/60",
      avatarBg: "bg-purple-600 text-white",
      avatarInitials: "AS",
      timestamp: "Today at 11:30 AM",
      content: "Here is the PyTorch distributed transformer training script for our Smart India Hackathon research cohort:",
      codeSnippet: {
        lang: "python",
        code: `import torch\nimport torch.distributed as dist\nfrom torch.nn.parallel import DistributedDataParallel as DDP\n\ndef init_cluster_node(rank, world_size):\n    dist.init_process_group("nccl", rank=rank, world_size=world_size)\n    torch.cuda.set_device(rank)\n    print(f"[Node {rank}] Multi-GPU distributed tensor backend ready.")`,
      },
      reactions: [
        { emoji: "❤️", count: 15, reacted: false },
        { emoji: "💻", count: 29, reacted: true },
      ],
    },
  ],
};

export default function StudentCommunitiesPage() {
  // Navigation & View States
  const [currentView, setCurrentView] = useState<"explore" | "server">("explore");
  const [activeCategory, setActiveCategory] = useState<string>("Home");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Communities State initialized with academic & industry default data
  const [communities, setCommunities] = useState<Community[]>(INITIAL_COMMUNITIES);
  const [featured, setFeatured] = useState<Community[]>(INITIAL_COMMUNITIES.slice(0, 2));
  const [popular, setPopular] = useState<Community[]>(INITIAL_COMMUNITIES.slice(2, 4));
  const [recent, setRecent] = useState<Community[]>(INITIAL_COMMUNITIES.slice(4));
  const [moderators, setModerators] = useState<Moderator[]>(INITIAL_MODERATORS);
  const [recentActivity, setRecentActivity] = useState<Activity[]>(INITIAL_RECENT_ACTIVITY);

  // Active Server & Channel Chat State
  const [activeServer, setActiveServer] = useState<Community | null>(INITIAL_COMMUNITIES[0]);
  const [activeChannelId, setActiveChannelId] = useState<string>("general");
  const [chatMessages, setChatMessages] = useState<Record<string, ChatMessage[]>>(INITIAL_CHANNEL_MESSAGES);
  const [inputMessage, setInputMessage] = useState<string>("");
  const [showEmojiPicker, setShowEmojiPicker] = useState<boolean>(false);
  const [copiedCodeId, setCopiedCodeId] = useState<string | null>(null);

  // Audio / User Controls State
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isDeafened, setIsDeafened] = useState<boolean>(false);
  const [connectedVoice, setConnectedVoice] = useState<string | null>(null);

  // Create Community Modal State
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);
  const [newCommunityName, setNewCommunityName] = useState<string>("");
  const [newCommunityDesc, setNewCommunityDesc] = useState<string>("");
  const [newCommunityCategory, setNewCommunityCategory] = useState<string>("Tech");
  const [newCommunitySkills, setNewCommunitySkills] = useState<string>("");

  const chatBottomRef = useRef<HTMLDivElement>(null);

  // ============================================================================
  // LOAD LIVE DATA FROM BACKEND API
  // ============================================================================

  useEffect(() => {
    async function loadCommunities() {
      try {
        const res = await fetch("/api/communities");
        const data = await res.json();
        if (data.success && data.communities && data.communities.length > 0) {
          setCommunities(data.communities);
          setFeatured(data.featured || data.communities.slice(0, 2));
          setPopular(data.popular || data.communities.slice(2, 4));
          setRecent(data.recent || data.communities.slice(4));
          if (data.moderators) setModerators(data.moderators);
          if (data.recentActivity) setRecentActivity(data.recentActivity);

          if (!activeServer && data.communities.length > 0) {
            setActiveServer(data.communities[0]);
          }
        }
      } catch (err) {
        console.error("Failed to sync communities from backend:", err);
      }
    }
    loadCommunities();
  }, []);

  useEffect(() => {
    if (currentView === "server") {
      chatBottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatMessages, activeChannelId, currentView]);

  // ============================================================================
  // HANDLERS
  // ============================================================================

  const handleOpenServer = (server: Community) => {
    setActiveServer(server);
    const firstTextChannel = server.channels.find((ch) => ch.type === "text") || server.channels[0];
    setActiveChannelId(firstTextChannel?.id || "general");
    setCurrentView("server");
  };

  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputMessage.trim() || !activeServer) return;

    const messageText = inputMessage.trim();
    setInputMessage("");
    setShowEmojiPicker(false);

    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      author: "Viktor Bateman",
      authorRole: "Student Mentor",
      authorRoleColor: "text-fuchsia-400 bg-fuchsia-950/70 border-fuchsia-700/60",
      avatarBg: "bg-fuchsia-600 text-white",
      avatarInitials: "VB",
      timestamp: "Just now",
      content: messageText,
      reactions: [],
    };

    // Optimistic UI update
    setChatMessages((prev) => ({
      ...prev,
      [activeChannelId]: [...(prev[activeChannelId] || []), newMsg],
    }));

    // Post to backend database
    try {
      await fetch(`/api/communities/${activeServer.id}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          channelId: activeChannelId,
          content: messageText,
        }),
      });
    } catch (err) {
      console.error("Failed to save message to backend:", err);
    }
  };

  const handleToggleReaction = (messageId: string, emoji: string) => {
    setChatMessages((prev) => {
      const channelMsgs = prev[activeChannelId] || [];
      const updated = channelMsgs.map((msg) => {
        if (msg.id !== messageId) return msg;
        const exists = msg.reactions.find((r) => r.emoji === emoji);
        let newReactions;
        if (exists) {
          newReactions = msg.reactions
            .map((r) =>
              r.emoji === emoji
                ? { ...r, count: r.reacted ? r.count - 1 : r.count + 1, reacted: !r.reacted }
                : r
            )
            .filter((r) => r.count > 0);
        } else {
          newReactions = [...msg.reactions, { emoji, count: 1, reacted: true }];
        }
        return { ...msg, reactions: newReactions };
      });
      return { ...prev, [activeChannelId]: updated };
    });
  };

  const handleCreateCommunitySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommunityName.trim()) return;

    try {
      const res = await fetch("/api/communities", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newCommunityName,
          description: newCommunityDesc,
          category: newCommunityCategory,
          skills: newCommunitySkills,
        }),
      });
      const data = await res.json();
      if (data.success && data.community) {
        setCommunities((prev) => [data.community, ...prev]);
        setShowCreateModal(false);
        setNewCommunityName("");
        setNewCommunityDesc("");
        setNewCommunitySkills("");
        handleOpenServer(data.community);
      }
    } catch (err) {
      console.error("Failed to create community:", err);
    }
  };

  const copyCode = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCodeId(id);
    setTimeout(() => setCopiedCodeId(null), 2000);
  };

  // Filter explore cards strictly based on Education, Tech, Industry, News, Jobs, Students
  const filteredCommunities = communities.filter((c) => {
    const catLower = c.category.toLowerCase();
    const matchesCategory =
      activeCategory === "Home" ||
      (activeCategory === "Education" && catLower.includes("education")) ||
      (activeCategory === "Tech" && (catLower.includes("tech") || catLower.includes("engineering"))) ||
      (activeCategory === "Industry" && catLower.includes("industry")) ||
      (activeCategory === "Jobs" && catLower.includes("jobs")) ||
      (activeCategory === "News" && catLower.includes("news")) ||
      (activeCategory === "Students" && (catLower.includes("student") || catLower.includes("education") || catLower.includes("tech")));

    const matchesSearch =
      !searchQuery.trim() ||
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.taggedSkills.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#0d0519] text-slate-100 flex flex-col font-sans select-none antialiased relative overflow-hidden">
      {/* Background Ambient Glow Orbs */}
      <div className="absolute top-[-150px] left-[15%] w-[600px] h-[600px] rounded-full bg-purple-700/20 blur-[130px] pointer-events-none" />
      <div className="absolute bottom-[-150px] right-[10%] w-[550px] h-[550px] rounded-full bg-fuchsia-600/15 blur-[140px] pointer-events-none" />
      <div className="absolute top-[40%] right-[35%] w-[450px] h-[450px] rounded-full bg-indigo-600/10 blur-[120px] pointer-events-none" />

      {/* =====================================================================
          TOP APP WINDOW BAR (macOS dots, Search pill, Quick actions)
         ===================================================================== */}
      <header className="h-14 bg-[#140a24]/90 backdrop-blur-md border-b border-white/10 px-5 flex items-center justify-between shrink-0 z-30">
        {/* Left Window Dots & Brand Title */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <span className="w-3 h-3 rounded-full bg-[#ff5f56] border border-[#e0443e]/40 shadow-xs inline-block" />
            <span className="w-3 h-3 rounded-full bg-[#ffbd2e] border border-[#dea123]/40 shadow-xs inline-block" />
            <span className="w-3 h-3 rounded-full bg-[#27c93f] border border-[#1aab29]/40 shadow-xs inline-block" />
          </div>
          <span className="text-white/40 text-xs font-semibold">|</span>
          <div className="flex items-center space-x-2">
            <h1 className="text-sm font-bold tracking-wide text-white">
              {currentView === "explore" ? "Explore Communities" : activeServer?.name || "Server"}
            </h1>
            {currentView === "server" && (
              <button
                onClick={() => setCurrentView("explore")}
                className="flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/15 text-xs text-purple-200 transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-3 h-3" />
                <span>Back to Explore</span>
              </button>
            )}
          </div>
        </div>

        {/* Center Search Pill */}
        <div className="relative w-full max-w-md mx-6">
          <Search className="w-3.5 h-3.5 absolute left-3.5 top-1/2 -translate-y-1/2 text-purple-300/60" />
          <input
            type="text"
            placeholder="Search Education, Tech, Industry, Jobs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-full bg-[#1e1136]/90 border border-white/10 pl-9 pr-4 py-1.5 text-xs text-white placeholder-purple-300/50 focus:outline-hidden focus:border-purple-500/80 focus:ring-1 focus:ring-purple-500/50 transition-all shadow-inner"
          />
        </div>

        {/* Right Utility Icons */}
        <div className="flex items-center space-x-3.5 text-purple-200/70">
          <button
            title="Bookmarked Threads"
            className="hover:text-white transition-colors cursor-pointer"
          >
            <Bookmark className="w-4 h-4" />
          </button>
          <button
            title="Notifications"
            className="relative hover:text-white transition-colors cursor-pointer"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-fuchsia-500 animate-pulse" />
          </button>
          <button
            title="Direct Messages"
            className="hover:text-white transition-colors cursor-pointer"
          >
            <User className="w-4 h-4" />
          </button>
          <button
            title="Settings"
            className="hover:text-white transition-colors cursor-pointer"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* =====================================================================
          MAIN 4-COLUMN WORKSPACE BODY
         ===================================================================== */}
      <div className="flex-1 flex overflow-hidden">
        {/* ===================================================================
            COLUMN 1: SERVERS RAIL (LEFTMOST)
           =================================================================== */}
        <aside className="w-[74px] bg-[#120722]/95 border-r border-white/10 flex flex-col items-center py-3.5 justify-between shrink-0 z-20 shadow-2xl">
          {/* Top: Discord/Compass Logo & Server List */}
          <div className="w-full flex flex-col items-center space-y-3 overflow-y-auto no-scrollbar">
            {/* Discord Explore Master Button */}
            <button
              onClick={() => setCurrentView("explore")}
              title="Explore Communities"
              className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all group relative cursor-pointer ${
                currentView === "explore"
                  ? "bg-gradient-to-tr from-purple-600 to-fuchsia-600 text-white shadow-lg shadow-purple-600/40 rounded-2xl scale-105"
                  : "bg-[#1f113a] text-purple-300 hover:bg-purple-600 hover:text-white rounded-3xl hover:rounded-2xl"
              }`}
            >
              {/* Active Indicator Pill */}
              <span
                className={`absolute -left-1 w-1 bg-white rounded-r-full transition-all ${
                  currentView === "explore" ? "h-9" : "h-0 group-hover:h-4"
                }`}
              />
              <Compass className="w-6 h-6" />
            </button>

            <div className="w-8 h-[1px] bg-white/10 rounded-full" />

            {/* Server Icons List */}
            {communities.map((comm) => {
              const isActive = currentView === "server" && activeServer?.id === comm.id;
              return (
                <button
                  key={comm.id}
                  onClick={() => handleOpenServer(comm)}
                  title={comm.name}
                  className={`w-12 h-12 flex items-center justify-center font-black text-xs transition-all group relative cursor-pointer ${
                    isActive
                      ? "bg-gradient-to-tr from-fuchsia-600 to-purple-600 text-white rounded-2xl shadow-lg shadow-fuchsia-600/40 scale-105"
                      : "bg-[#1f103b] hover:bg-[#2b1750] text-purple-200 rounded-3xl hover:rounded-2xl border border-white/5"
                  }`}
                >
                  {/* Indicator */}
                  <span
                    className={`absolute -left-1 w-1 bg-white rounded-r-full transition-all ${
                      isActive ? "h-9" : "h-0 group-hover:h-3.5"
                    }`}
                  />
                  {comm.icon ? (
                    <span className="tracking-tighter font-extrabold">{comm.icon}</span>
                  ) : (
                    <span>{comm.name.slice(0, 2).toUpperCase()}</span>
                  )}
                </button>
              );
            })}

            {/* Add New Community (+) Button */}
            <button
              onClick={() => setShowCreateModal(true)}
              title="Create a Community Guild"
              className="w-12 h-12 rounded-3xl hover:rounded-2xl bg-[#1f103b] hover:bg-emerald-600 text-emerald-400 hover:text-white flex items-center justify-center transition-all cursor-pointer border border-emerald-500/20 group"
            >
              <Plus className="w-5 h-5 transition-transform group-hover:rotate-90" />
            </button>
          </div>

          {/* Bottom: Animated Voice Equalizer & User Controls */}
          <div className="w-full flex flex-col items-center space-y-3 pt-3 border-t border-white/10">
            {/* Animated Soundwave Frequency Bars */}
            <div
              title={connectedVoice ? `Connected to ${connectedVoice}` : "Voice Ready"}
              className="flex items-center justify-center space-x-[2.5px] h-6 px-2 py-1 rounded-full bg-[#1b0d33] border border-white/5"
            >
              <span className="w-1 bg-fuchsia-400 rounded-full animate-bounce [animation-delay:-0.3s] h-3" />
              <span className="w-1 bg-purple-400 rounded-full animate-bounce [animation-delay:-0.1s] h-4" />
              <span className="w-1 bg-cyan-400 rounded-full animate-bounce [animation-delay:-0.4s] h-2.5" />
              <span className="w-1 bg-pink-400 rounded-full animate-bounce [animation-delay:-0.2s] h-5" />
              <span className="w-1 bg-indigo-400 rounded-full animate-bounce [animation-delay:-0.35s] h-3.5" />
            </div>

            {/* User Mini Avatar & Controls */}
            <div className="w-full flex flex-col items-center space-y-1.5 px-2">
              <div
                title="Viktor Bateman (@viktorbateman)"
                className="relative w-9 h-9 rounded-full overflow-hidden border-2 border-fuchsia-500/80 shadow-md cursor-pointer hover:scale-105 transition-transform"
              >
                <Image
                  src="/communities/viktor.jpg"
                  alt="Viktor Bateman"
                  fill
                  className="object-cover"
                />
              </div>

              {/* Quick Audio Toggles */}
              <div className="flex items-center space-x-1 text-purple-300">
                <button
                  onClick={() => setIsMuted(!isMuted)}
                  title={isMuted ? "Unmute Mic" : "Mute Mic"}
                  className={`p-1 rounded hover:bg-white/10 cursor-pointer ${
                    isMuted ? "text-red-400" : "hover:text-white"
                  }`}
                >
                  {isMuted ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
                </button>
                <button
                  onClick={() => setIsDeafened(!isDeafened)}
                  title={isDeafened ? "Undeafen" : "Deafen"}
                  className={`p-1 rounded hover:bg-white/10 cursor-pointer ${
                    isDeafened ? "text-red-400" : "hover:text-white"
                  }`}
                >
                  <Headphones className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </aside>

        {/* ===================================================================
            EXPLORE VIEW: 3 COLUMNS (Nav + Feed + Profile/Activity)
           =================================================================== */}
        {currentView === "explore" ? (
          <div className="flex-1 flex overflow-hidden">
            {/* ===============================================================
                COLUMN 2: EXPLORE NAVIGATION SIDEBAR (EDUCATION, TECH, INDUSTRY, NEWS, STUDENTS, JOBS)
               =============================================================== */}
            <aside className="w-56 bg-[#160b29]/80 backdrop-blur-md border-r border-white/10 flex flex-col p-4 shrink-0">
              <div className="mb-4">
                <h2 className="text-xs font-bold uppercase tracking-wider text-purple-300/70 mb-3 px-2">
                  Discover Categories
                </h2>
                <nav className="space-y-1">
                  {[
                    { name: "Home", icon: Compass },
                    { name: "Education", icon: GraduationCap },
                    { name: "Tech", icon: Cpu },
                    { name: "Industry", icon: Briefcase },
                    { name: "Jobs", icon: TrendingUp },
                    { name: "News", icon: Radio },
                    { name: "Students", icon: Users },
                  ].map((cat) => {
                    const Icon = cat.icon;
                    const isActive = activeCategory === cat.name;
                    return (
                      <button
                        key={cat.name}
                        onClick={() => setActiveCategory(cat.name)}
                        className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                          isActive
                            ? "bg-gradient-to-r from-purple-600/90 to-fuchsia-600/90 text-white shadow-md shadow-purple-900/40 font-bold"
                            : "text-purple-200/70 hover:text-white hover:bg-white/5"
                        }`}
                      >
                        <Icon className={`w-4 h-4 ${isActive ? "text-white" : "text-purple-400"}`} />
                        <span>{cat.name}</span>
                      </button>
                    );
                  })}
                </nav>
              </div>

              {/* Quick Info Box in Sidebar */}
              <div className="mt-auto p-3.5 rounded-2xl bg-[#1d0e37]/70 border border-white/10 text-xs">
                <div className="flex items-center space-x-2 text-fuchsia-400 font-bold mb-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Academia-Industry</span>
                </div>
                <p className="text-[11px] text-purple-200/60 leading-relaxed">
                  Join verified campus engineering hubs, tier-1 placement networks, and industry research circles.
                </p>
              </div>
            </aside>

            {/* ===============================================================
                COLUMN 3: MAIN EXPLORE FEED (Center Banner + Grids)
               =============================================================== */}
            <main className="flex-1 overflow-y-auto p-6 space-y-7 custom-scrollbar">
              {/* Cosmic Nebula Hero Banner */}
              <div className="relative rounded-3xl overflow-hidden border border-white/15 shadow-2xl h-52 flex items-center justify-center p-8 group">
                <Image
                  src="/communities/hero.jpg"
                  alt="Cosmic Community Nebula"
                  fill
                  priority
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-purple-950/80 via-black/40 to-fuchsia-950/80 backdrop-blur-[2px]" />
                <div className="relative z-10 text-center max-w-xl space-y-2">
                  <div className="inline-flex items-center space-x-1.5 px-3 py-0.5 rounded-full bg-white/10 border border-white/20 text-[11px] font-semibold text-purple-200 mb-1 backdrop-blur-md">
                    <Sparkles className="w-3 h-3 text-fuchsia-400" />
                    <span>Verified Academic & Industry Guilds</span>
                  </div>
                  <h2 className="text-3xl font-black tracking-tight text-white drop-shadow-md">
                    Find Your Community <span className="text-purple-300">on CampusBridge</span>
                  </h2>
                  <p className="text-xs text-purple-200/80 leading-relaxed max-w-md mx-auto">
                    Collaborate on AI research, hackathons, and placement drives directly with faculty mentors and industry partners.
                  </p>
                </div>
              </div>

              {/* =============================================================
                  FEATURED COMMUNITY (AI & ML, Cloud & Web)
                 ============================================================= */}
              <section className="space-y-3.5">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-extrabold text-white tracking-wide flex items-center space-x-2">
                    <span>Featured Community</span>
                    <span className="w-2 h-2 rounded-full bg-fuchsia-500 animate-ping" />
                  </h3>
                  <button
                    onClick={() => setActiveCategory("Tech")}
                    className="text-xs text-purple-400 hover:text-purple-300 font-semibold cursor-pointer"
                  >
                    See all
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {featured.map((comm) => (
                    <div
                      key={comm.id}
                      className="group relative rounded-3xl overflow-hidden bg-[#1c0e38]/70 border border-white/10 hover:border-fuchsia-500/50 transition-all duration-300 shadow-xl flex flex-col justify-between"
                    >
                      {/* Card Banner */}
                      <div className="relative h-36 w-full overflow-hidden">
                        <Image
                          src={comm.banner}
                          alt={comm.name}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#1c0e38] via-transparent to-black/30" />
                        <div className="absolute -bottom-4 left-6 w-12 h-12 rounded-2xl bg-gradient-to-tr from-fuchsia-600 to-purple-600 border-2 border-[#1c0e38] flex items-center justify-center font-black text-sm text-white shadow-xl">
                          {comm.icon}
                        </div>
                      </div>

                      {/* Card Body */}
                      <div className="p-5 pt-6 flex-1 flex flex-col justify-between space-y-3">
                        <div>
                          <div className="flex items-center justify-between">
                            <h4 className="text-lg font-black text-white group-hover:text-fuchsia-300 transition-colors">
                              {comm.name}
                            </h4>
                            <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-purple-900/60 border border-purple-700/50 text-purple-300">
                              {comm.category}
                            </span>
                          </div>
                          <p className="text-xs text-purple-200/70 mt-1 line-clamp-2 leading-relaxed">
                            {comm.description}
                          </p>
                        </div>

                        {/* Footer Stats & Open Button */}
                        <div className="pt-3 border-t border-white/10 flex items-center justify-between">
                          <div className="flex items-center space-x-2 text-[11px] text-purple-300/80">
                            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400" />
                            <span>{comm.onlineCount.toLocaleString()} Online</span>
                            <span>•</span>
                            <span>{comm.memberCount.toLocaleString()} Members</span>
                          </div>

                          <button
                            onClick={() => handleOpenServer(comm)}
                            className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-500 hover:to-fuchsia-500 text-white font-bold text-xs shadow-md shadow-purple-900/40 transition-all cursor-pointer"
                          >
                            Open Community
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* =============================================================
                  POPULAR RIGHT NOW (Jobs & Careers, Education & SIH)
                 ============================================================= */}
              <section className="space-y-3.5">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-extrabold text-white tracking-wide">
                    Popular Right now
                  </h3>
                  <button
                    onClick={() => setActiveCategory("Jobs")}
                    className="text-xs text-purple-400 hover:text-purple-300 font-semibold cursor-pointer"
                  >
                    See all
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {popular.map((comm) => (
                    <div
                      key={comm.id}
                      className="group relative rounded-3xl overflow-hidden bg-[#1c0e38]/70 border border-white/10 hover:border-purple-500/50 transition-all duration-300 shadow-xl flex flex-col justify-between"
                    >
                      {/* Card Banner */}
                      <div className="relative h-32 w-full overflow-hidden">
                        <Image
                          src={comm.banner}
                          alt={comm.name}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#1c0e38] via-transparent to-black/30" />
                        <div className="absolute -bottom-4 left-6 w-11 h-11 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 border-2 border-[#1c0e38] flex items-center justify-center font-black text-xs text-white shadow-xl">
                          {comm.icon}
                        </div>
                      </div>

                      {/* Card Body */}
                      <div className="p-5 pt-6 flex-1 flex flex-col justify-between space-y-3">
                        <div>
                          <div className="flex items-center justify-between">
                            <h4 className="text-lg font-black text-white group-hover:text-purple-300 transition-colors">
                              {comm.name}
                            </h4>
                            <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-purple-900/60 border border-purple-700/50 text-purple-300">
                              {comm.category}
                            </span>
                          </div>
                          <p className="text-xs text-purple-200/70 mt-1 line-clamp-2 leading-relaxed">
                            {comm.description}
                          </p>
                        </div>

                        {/* Footer Stats & Open Button */}
                        <div className="pt-3 border-t border-white/10 flex items-center justify-between">
                          <div className="flex items-center space-x-2 text-[11px] text-purple-300/80">
                            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400" />
                            <span>{comm.onlineCount.toLocaleString()} Online</span>
                            <span>•</span>
                            <span>{comm.memberCount.toLocaleString()} Members</span>
                          </div>

                          <button
                            onClick={() => handleOpenServer(comm)}
                            className="px-4 py-1.5 rounded-xl bg-white/10 hover:bg-purple-600 text-white font-bold text-xs border border-white/15 transition-all cursor-pointer"
                          >
                            Open Community
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* =============================================================
                  RECENTLY ADDED (Industry Connect & Campus News)
                 ============================================================= */}
              <section className="space-y-3.5">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-extrabold text-white tracking-wide">
                    Recently Added
                  </h3>
                  <span className="text-xs text-purple-400/80">Newly launched hubs</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {recent.map((comm) => (
                    <div
                      key={comm.id}
                      onClick={() => handleOpenServer(comm)}
                      className="p-4 rounded-2xl bg-[#1c0e38]/50 hover:bg-[#1c0e38]/80 border border-white/10 hover:border-purple-500/40 transition-all cursor-pointer flex items-center space-x-3.5"
                    >
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white font-black text-xs shrink-0 shadow-md">
                        {comm.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h5 className="text-sm font-bold text-white truncate">{comm.name}</h5>
                        <p className="text-xs text-purple-200/60 truncate">{comm.description}</p>
                        <div className="text-[10px] text-purple-300/70 mt-1 flex items-center space-x-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                          <span>{comm.onlineCount.toLocaleString()} online</span>
                          <span className="text-purple-400">• {comm.category}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </main>

            {/* ===============================================================
                COLUMN 4: PROFILE & ACTIVITY SIDEBAR (RIGHT)
               =============================================================== */}
            <aside className="w-64 bg-[#140a25]/90 backdrop-blur-md border-l border-white/10 p-5 flex flex-col space-y-6 overflow-y-auto shrink-0 custom-scrollbar">
              {/* Profile Card with Concentric Glowing Aura Rings */}
              <div className="flex flex-col items-center text-center space-y-3 pt-2">
                <div className="relative flex items-center justify-center w-28 h-28">
                  <div className="absolute inset-0 rounded-full border border-fuchsia-500/20 animate-ping [animation-duration:3s]" />
                  <div className="absolute inset-2 rounded-full border border-purple-500/40 shadow-[0_0_15px_rgba(168,85,247,0.3)]" />
                  <div className="absolute inset-4 rounded-full border border-fuchsia-400/60" />

                  <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-fuchsia-400 shadow-xl">
                    <Image
                      src="/communities/viktor.jpg"
                      alt="Viktor Bateman"
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-black text-white tracking-wide">
                    Viktor Bateman
                  </h3>
                  <p className="text-[11px] text-fuchsia-300/80 font-medium">
                    @viktorbateman
                  </p>
                  <span className="inline-block mt-1 text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-purple-900/60 text-purple-300 border border-purple-700/50">
                    Lead Mentor • AI Research
                  </span>
                </div>
              </div>

              {/* Academic & Industry Moderators List */}
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-purple-300/70">
                  <span>Mentors & Leads</span>
                  <span className="text-[10px] font-normal text-purple-400">4 active</span>
                </div>

                <div className="space-y-2">
                  {moderators.map((mod) => (
                    <div
                      key={mod.id}
                      className="flex items-center justify-between p-2 rounded-xl hover:bg-white/5 transition-colors cursor-pointer group"
                    >
                      <div className="flex items-center space-x-2.5">
                        <div className="relative">
                          <div
                            className={`w-7 h-7 rounded-full bg-gradient-to-tr ${mod.avatarBg} text-[10px] font-bold text-white flex items-center justify-center shadow-xs`}
                          >
                            {mod.name.slice(0, 2).toUpperCase()}
                          </div>
                          <span
                            className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-[#140a25] ${
                              mod.status === "online" ? "bg-emerald-400" : "bg-amber-400"
                            }`}
                          />
                        </div>
                        <div>
                          <div className="text-xs font-bold text-white group-hover:text-purple-300 transition-colors">
                            {mod.name}
                          </div>
                          <div className="text-[10px] text-purple-300/60">{mod.role}</div>
                        </div>
                      </div>
                      <span className="text-[10px] text-purple-400/60">{mod.time}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Activity Feed (Research, Projects & Placement News) */}
              <div className="space-y-3 pt-2 border-t border-white/10">
                <div className="text-xs font-bold uppercase tracking-wider text-purple-300/70">
                  Campus & Industry Feed
                </div>

                <div className="space-y-2.5">
                  {recentActivity.map((act) => (
                    <div
                      key={act.id}
                      className="p-2.5 rounded-xl bg-[#1b0d33]/60 border border-white/5 space-y-1 hover:border-purple-500/30 transition-all text-xs"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-white text-[11px]">{act.user}</span>
                        <span className="text-[10px] text-purple-400/60">{act.time}</span>
                      </div>
                      <p className="text-[11px] text-fuchsia-300/90 leading-tight">
                        {act.action}
                      </p>
                      <p className="text-[10px] text-purple-200/50 truncate">{act.detail}</p>
                    </div>
                  ))}
                </div>
              </div>
            </aside>
          </div>
        ) : (
          /* ===================================================================
              SERVER WORKSPACE VIEW: CHANNELS SIDEBAR + INTERACTIVE CHAT STREAM
             =================================================================== */
          activeServer && (
            <div className="flex-1 flex overflow-hidden">
              {/* ===============================================================
                  CHANNELS SIDEBAR
                 =============================================================== */}
              <aside className="w-60 bg-[#160b2b]/90 border-r border-white/10 flex flex-col justify-between shrink-0">
                <div>
                  {/* Guild Header Dropdown */}
                  <div className="p-4 border-b border-white/10 flex items-center justify-between shadow-xs">
                    <div className="flex items-center space-x-2 min-w-0">
                      <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-fuchsia-600 to-purple-600 flex items-center justify-center text-xs font-black text-white shrink-0">
                        {activeServer.icon}
                      </div>
                      <h2 className="font-extrabold text-sm text-white truncate">
                        {activeServer.name}
                      </h2>
                    </div>
                    <ChevronDown className="w-4 h-4 text-purple-300 cursor-pointer" />
                  </div>

                  {/* Channels List */}
                  <div className="p-3 space-y-4 overflow-y-auto max-h-[calc(100vh-230px)] custom-scrollbar">
                    {/* Text Channels */}
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-[11px] font-bold text-purple-300/60 px-2 py-1 tracking-wider uppercase">
                        <span>Text Channels</span>
                        <Plus className="w-3.5 h-3.5 hover:text-white cursor-pointer" />
                      </div>
                      {activeServer.channels
                        .filter((ch) => ch.type !== "voice")
                        .map((channel) => {
                          const isChannelActive = activeChannelId === channel.id;
                          return (
                            <button
                              key={channel.id}
                              onClick={() => setActiveChannelId(channel.id)}
                              className={`w-full flex items-center space-x-2 px-2.5 py-1.5 rounded-xl text-xs font-medium transition-colors cursor-pointer ${
                                isChannelActive
                                  ? "bg-purple-600/80 text-white font-bold"
                                  : "text-purple-200/70 hover:bg-white/5 hover:text-white"
                              }`}
                            >
                              <Hash className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                              <span className="truncate">{channel.name}</span>
                            </button>
                          );
                        })}
                    </div>

                    {/* Voice Channels */}
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-[11px] font-bold text-purple-300/60 px-2 py-1 tracking-wider uppercase">
                        <span>Voice Channels</span>
                        <Volume2 className="w-3.5 h-3.5 hover:text-white cursor-pointer" />
                      </div>
                      {activeServer.channels
                        .filter((ch) => ch.type === "voice")
                        .map((channel) => {
                          const isConnected = connectedVoice === channel.name;
                          return (
                            <button
                              key={channel.id}
                              onClick={() =>
                                setConnectedVoice(isConnected ? null : channel.name)
                              }
                              className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-xl text-xs font-medium transition-colors cursor-pointer ${
                                isConnected
                                  ? "bg-emerald-600/80 text-white font-bold"
                                  : "text-purple-200/70 hover:bg-white/5 hover:text-white"
                              }`}
                            >
                              <div className="flex items-center space-x-2 truncate">
                                <Volume2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                                <span className="truncate">{channel.name}</span>
                              </div>
                              {isConnected && (
                                <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-700">
                                  Live
                                </span>
                              )}
                            </button>
                          );
                        })}
                    </div>
                  </div>
                </div>

                {/* Return to Explore Pill */}
                <div className="p-3 border-t border-white/10">
                  <button
                    onClick={() => setCurrentView("explore")}
                    className="w-full py-2 px-3 rounded-xl bg-white/10 hover:bg-white/15 text-xs text-purple-200 font-bold flex items-center justify-center space-x-2 transition-colors cursor-pointer"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Explore Dashboard</span>
                  </button>
                </div>
              </aside>

              {/* ===============================================================
                  INTERACTIVE CHAT STREAM (Main Feed)
                 =============================================================== */}
              <div className="flex-1 flex flex-col bg-[#110620]/95 overflow-hidden">
                {/* Channel Header Bar */}
                <div className="h-12 border-b border-white/10 px-5 flex items-center justify-between bg-[#150a27]/60 backdrop-blur-xs shrink-0">
                  <div className="flex items-center space-x-2.5">
                    <Hash className="w-4 h-4 text-purple-400" />
                    <span className="font-extrabold text-sm text-white">
                      {activeServer.channels.find((c) => c.id === activeChannelId)?.name ||
                        activeChannelId}
                    </span>
                    <span className="text-white/20 text-xs">|</span>
                    <span className="text-xs text-purple-300/60 hidden sm:inline truncate max-w-md">
                      {activeServer.description}
                    </span>
                  </div>

                  <div className="flex items-center space-x-2 text-xs text-purple-300/80">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block" />
                    <span>{activeServer.onlineCount.toLocaleString()} online</span>
                  </div>
                </div>

                {/* Live Voice Room Bar if connected */}
                {connectedVoice && (
                  <div className="bg-emerald-950/40 border-b border-emerald-500/30 px-5 py-2.5 flex items-center justify-between animate-in fade-in duration-200">
                    <div className="flex items-center space-x-3">
                      <Radio className="w-4 h-4 text-emerald-400 animate-pulse" />
                      <div>
                        <div className="text-xs font-bold text-white flex items-center space-x-2">
                          <span>Connected to {connectedVoice}</span>
                          <span className="text-[10px] text-emerald-300 bg-emerald-900/60 px-1.5 rounded">
                            Ultra Low Latency Audio Lab
                          </span>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => setConnectedVoice(null)}
                      className="px-3 py-1 rounded-lg bg-red-600 hover:bg-red-700 text-white font-bold text-xs flex items-center space-x-1.5 transition-colors cursor-pointer"
                    >
                      <PhoneOff className="w-3 h-3" />
                      <span>Disconnect</span>
                    </button>
                  </div>
                )}

                {/* Messages Stream */}
                <div className="flex-1 overflow-y-auto p-5 space-y-4 custom-scrollbar">
                  {/* Channel Welcome Banner */}
                  <div className="p-5 rounded-3xl bg-[#1b0d35]/60 border border-white/10 mb-4 space-y-1">
                    <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-600 to-fuchsia-600 flex items-center justify-center text-white mb-2">
                      <Hash className="w-5 h-5" />
                    </div>
                    <h3 className="text-lg font-black text-white">
                      Welcome to #{activeServer.channels.find((c) => c.id === activeChannelId)?.name || activeChannelId}!
                    </h3>
                    <p className="text-xs text-purple-200/70">
                      This is the start of the #{activeServer.channels.find((c) => c.id === activeChannelId)?.name || activeChannelId} channel in {activeServer.name}.
                    </p>
                  </div>

                  {/* Messages Feed */}
                  {(chatMessages[activeChannelId] || []).map((msg) => (
                    <div
                      key={msg.id}
                      className="flex space-x-3 group hover:bg-white/[0.02] p-2.5 rounded-2xl transition-colors"
                    >
                      {/* Avatar */}
                      <div
                        className={`w-9 h-9 rounded-full ${msg.avatarBg} text-xs font-black flex items-center justify-center shrink-0 shadow-md`}
                      >
                        {msg.avatarInitials}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0 space-y-1.5">
                        <div className="flex items-center space-x-2">
                          <span className="font-extrabold text-xs text-white">
                            {msg.author}
                          </span>
                          <span
                            className={`text-[9px] font-bold px-1.5 py-0.5 rounded-md border ${msg.authorRoleColor}`}
                          >
                            {msg.authorRole}
                          </span>
                          <span className="text-[10px] text-purple-300/50">
                            {msg.timestamp}
                          </span>
                        </div>

                        <p className="text-xs text-purple-100 leading-relaxed break-words">
                          {msg.content}
                        </p>

                        {/* Code Snippet if present */}
                        {msg.codeSnippet && (
                          <div className="rounded-xl overflow-hidden bg-black/60 border border-white/10 my-2 text-xs">
                            <div className="flex items-center justify-between px-3 py-1.5 bg-white/5 border-b border-white/10 text-[10px] text-purple-300/70">
                              <span>{msg.codeSnippet.lang.toUpperCase()}</span>
                              <button
                                onClick={() => copyCode(msg.codeSnippet!.code, msg.id)}
                                className="flex items-center space-x-1 hover:text-white cursor-pointer"
                              >
                                {copiedCodeId === msg.id ? (
                                  <>
                                    <Check className="w-3 h-3 text-emerald-400" />
                                    <span className="text-emerald-400">Copied</span>
                                  </>
                                ) : (
                                  <>
                                    <Copy className="w-3 h-3" />
                                    <span>Copy</span>
                                  </>
                                )}
                              </button>
                            </div>
                            <pre className="p-3 text-[11px] font-mono text-purple-200 overflow-x-auto">
                              <code>{msg.codeSnippet.code}</code>
                            </pre>
                          </div>
                        )}

                        {/* Job Card if present */}
                        {msg.jobCard && (
                          <div className="p-3.5 rounded-2xl bg-gradient-to-r from-purple-950/60 to-indigo-950/60 border border-purple-500/30 my-2 max-w-md space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-900/60 text-emerald-300 border border-emerald-700/50">
                                Verified Placement Opportunity
                              </span>
                              <span className="text-xs font-black text-fuchsia-300">
                                {msg.jobCard.stipend}
                              </span>
                            </div>
                            <div>
                              <div className="text-xs font-bold text-white">{msg.jobCard.title}</div>
                              <div className="text-[11px] text-purple-300/80">{msg.jobCard.company} • {msg.jobCard.location}</div>
                            </div>
                            <Link
                              href={msg.jobCard.applyUrl}
                              className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition-colors"
                            >
                              <span>Apply via Portal</span>
                              <ExternalLink className="w-3 h-3" />
                            </Link>
                          </div>
                        )}

                        {/* Reactions Bar */}
                        <div className="flex items-center space-x-1.5 pt-1">
                          {msg.reactions.map((r, idx) => (
                            <button
                              key={idx}
                              onClick={() => handleToggleReaction(msg.id, r.emoji)}
                              className={`flex items-center space-x-1 px-2 py-0.5 rounded-lg text-[11px] border transition-all cursor-pointer ${
                                r.reacted
                                  ? "bg-purple-600/30 border-purple-500 text-white"
                                  : "bg-white/5 border-white/10 text-purple-200/70 hover:bg-white/10"
                              }`}
                            >
                              <span>{r.emoji}</span>
                              <span className="font-bold">{r.count}</span>
                            </button>
                          ))}
                          <button
                            onClick={() => handleToggleReaction(msg.id, "⚡")}
                            className="p-1 rounded-lg text-purple-300/50 hover:text-white hover:bg-white/10 text-xs cursor-pointer"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                  <div ref={chatBottomRef} />
                </div>

                {/* Message Input Box */}
                <div className="p-4 border-t border-white/10 bg-[#160b2b]/70 shrink-0">
                  <form onSubmit={handleSendMessage} className="relative flex items-center">
                    <button
                      type="button"
                      title="Attach File / Capstone Code"
                      className="absolute left-3 text-purple-300/60 hover:text-white transition-colors cursor-pointer"
                    >
                      <Paperclip className="w-4 h-4" />
                    </button>

                    <input
                      type="text"
                      placeholder={`Message #${activeServer.channels.find((c) => c.id === activeChannelId)?.name || activeChannelId}`}
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      className="w-full rounded-2xl bg-[#1b0d35] border border-white/10 pl-10 pr-20 py-3 text-xs text-white placeholder-purple-300/40 focus:outline-hidden focus:border-purple-500 shadow-inner"
                    />

                    <div className="absolute right-3 flex items-center space-x-1.5">
                      <button
                        type="button"
                        onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                        className="p-1 text-purple-300/60 hover:text-white transition-colors cursor-pointer"
                      >
                        <Smile className="w-4 h-4" />
                      </button>
                      <button
                        type="submit"
                        disabled={!inputMessage.trim()}
                        className="p-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:opacity-30 text-white transition-all cursor-pointer shadow-md"
                      >
                        <Send className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          )
        )}
      </div>

      {/* =====================================================================
          CREATE COMMUNITY MODAL (ACADEMIA & INDUSTRY ONLY)
         ===================================================================== */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-[#180b2e] border border-white/15 rounded-3xl shadow-2xl max-w-md w-full p-6 space-y-5 animate-in fade-in-50 duration-200">
            <div className="flex justify-between items-center border-b border-white/10 pb-4">
              <div>
                <h3 className="text-lg font-black text-white">Create an Academic or Tech Guild</h3>
                <p className="text-xs text-purple-200/60 mt-0.5">
                  Launch a new student learning circle, research lab, or placement team.
                </p>
              </div>
              <button
                onClick={() => setShowCreateModal(false)}
                className="w-8 h-8 rounded-full bg-white/10 text-purple-300 hover:text-white flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateCommunitySubmit} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-purple-200 block mb-1 uppercase tracking-wider text-[11px]">
                  Guild Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Distributed AI Systems, Tier-1 Placement Cohort"
                  value={newCommunityName}
                  onChange={(e) => setNewCommunityName(e.target.value)}
                  className="w-full rounded-xl bg-[#21113f] border border-white/10 px-3.5 py-2.5 text-xs text-white placeholder-purple-300/40 focus:outline-hidden focus:border-purple-500"
                />
              </div>

              <div>
                <label className="font-bold text-purple-200 block mb-1 uppercase tracking-wider text-[11px]">
                  Mission & Objectives
                </label>
                <textarea
                  rows={2}
                  placeholder="Describe your research, placement, or hackathon focus..."
                  value={newCommunityDesc}
                  onChange={(e) => setNewCommunityDesc(e.target.value)}
                  className="w-full rounded-xl bg-[#21113f] border border-white/10 px-3.5 py-2 text-xs text-white placeholder-purple-300/40 focus:outline-hidden focus:border-purple-500"
                />
              </div>

              <div>
                <label className="font-bold text-purple-200 block mb-1 uppercase tracking-wider text-[11px]">
                  Category
                </label>
                <select
                  value={newCommunityCategory}
                  onChange={(e) => setNewCommunityCategory(e.target.value)}
                  className="w-full rounded-xl bg-[#21113f] border border-white/10 px-3.5 py-2 text-xs text-white focus:outline-hidden focus:border-purple-500"
                >
                  <option value="Education">Education</option>
                  <option value="Tech">Tech</option>
                  <option value="Industry">Industry</option>
                  <option value="Jobs">Jobs</option>
                  <option value="News">News</option>
                  <option value="Students">Students</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-purple-200 block mb-1 uppercase tracking-wider text-[11px]">
                  Associated Skills (Comma separated)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Python, PyTorch, Kubernetes, System Design"
                  value={newCommunitySkills}
                  onChange={(e) => setNewCommunitySkills(e.target.value)}
                  className="w-full rounded-xl bg-[#21113f] border border-white/10 px-3.5 py-2.5 text-xs text-white placeholder-purple-300/40 focus:outline-hidden focus:border-purple-500"
                />
              </div>

              <div className="pt-3 border-t border-white/10 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 rounded-xl bg-white/10 text-purple-200 hover:text-white font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-500 hover:to-fuchsia-500 text-white font-black shadow-lg cursor-pointer"
                >
                  Create Community
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
