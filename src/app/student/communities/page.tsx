"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import {
  Users,
  MessageSquare,
  Search,
  Plus,
  Sparkles,
  TrendingUp,
  Award,
  Hash,
  ArrowRight,
  ExternalLink,
  Check,
  Send,
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  Compass,
  Code,
  Palette,
  Briefcase,
  Terminal,
  Cpu,
  Volume2,
  Mic,
  MicOff,
  Headphones,
  Settings,
  Smile,
  Paperclip,
  PhoneCall,
  PhoneOff,
  Radio,
  Monitor,
  MoreVertical,
  ShieldAlert,
  ShieldCheck,
  Pin,
  ChevronDown,
  ChevronRight,
  Bell,
  X,
  CheckCircle2,
  Globe,
  Lock,
  Flame,
  AtSign,
  Copy,
  ThumbsUp,
  Rocket,
  CheckCheck,
} from "lucide-react";

// ============================================================================
// DATA MODELS & PRE-CONFIGURED DISCORD-STYLE SERVERS
// ============================================================================

interface Reaction {
  emoji: string;
  count: number;
  reacted: boolean;
}

interface ChatMessage {
  id: string;
  author: string;
  authorRole: "Owner" | "Admin" | "Mentor" | "Industry Partner" | "Student";
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
  reactions: Reaction[];
  repliesCount?: number;
}

interface Channel {
  id: string;
  name: string;
  type: "text" | "voice";
  topic?: string;
  unreadCount?: number;
}

interface ChannelCategory {
  name: string;
  channels: Channel[];
}

interface CommunityServer {
  id: string;
  name: string;
  initials: string;
  badge: string;
  color: string;
  description: string;
  category: string;
  membersCount: number;
  onlineCount: number;
  isOwner?: boolean;
  isJoined: boolean;
  taggedSkills: string[];
  channelCategories: ChannelCategory[];
  members: Array<{
    id: string;
    name: string;
    role: "Owner" | "Admin" | "Mentor" | "Industry Partner" | "Student";
    status: "online" | "idle" | "offline";
    avatarBg: string;
  }>;
}

// Initial Mock Community Servers
const INITIAL_SERVERS: CommunityServer[] = [
  {
    id: "server-webdev",
    name: "Full Stack & Web Dev Guild",
    initials: "WD",
    badge: "Official",
    color: "from-blue-600 to-indigo-600",
    description: "Modern web architecture, React 19, Next.js 15, Node.js microservices, and distributed deployments.",
    category: "Engineering",
    membersCount: 2450,
    onlineCount: 48,
    isJoined: true,
    taggedSkills: ["React", "Next.js", "TypeScript", "Node.js", "Tailwind CSS"],
    channelCategories: [
      {
        name: "INFORMATION",
        channels: [
          { id: "welcome", name: "welcome", type: "text", topic: "Welcome to Web Dev Guild! Read community rules and introduce yourself." },
          { id: "announcements", name: "announcements", type: "text", topic: "Official campus hackathons, workshops, and cohort updates.", unreadCount: 2 },
          { id: "rules", name: "rules", type: "text", topic: "Code of conduct and collaboration guidelines." },
        ],
      },
      {
        name: "DISCUSSION",
        channels: [
          { id: "general", name: "general", type: "text", topic: "General web tech chatter, question help, and daily check-ins." },
          { id: "frontend-react", name: "frontend-react", type: "text", topic: "React Server Components, Next.js routing, and state management." },
          { id: "backend-apis", name: "backend-apis", type: "text", topic: "REST, GraphQL, Prisma ORM, and database indexing." },
          { id: "project-collab", name: "project-collab", type: "text", topic: "Find co-founders, collaborators, and contributors for capstones." },
        ],
      },
      {
        name: "CAREER & INDUSTRY",
        channels: [
          { id: "jobs-internships", name: "jobs-internships", type: "text", topic: "Verified campus placements and remote developer internships.", unreadCount: 5 },
          { id: "interview-prep", name: "interview-prep", type: "text", topic: "Frontend machine coding and full-stack behavioral prep." },
        ],
      },
      {
        name: "VOICE CHANNELS",
        channels: [
          { id: "voice-study-room", name: "Study Room (Lofi & Code)", type: "voice" },
          { id: "voice-project-collab", name: "Project Standup", type: "voice" },
          { id: "voice-lounge", name: "Watercooler Lounge", type: "voice" },
        ],
      },
    ],
    members: [
      { id: "m1", name: "Vikram Rathore", role: "Owner", status: "online", avatarBg: "bg-blue-600 text-white" },
      { id: "m2", name: "Neha Sharma", role: "Mentor", status: "online", avatarBg: "bg-emerald-600 text-white" },
      { id: "m3", name: "Kunal Gupta (Google)", role: "Industry Partner", status: "online", avatarBg: "bg-amber-600 text-white" },
      { id: "m4", name: "Ananya Sharma (You)", role: "Student", status: "online", avatarBg: "bg-indigo-600 text-white" },
      { id: "m5", name: "Rohan Varma", role: "Student", status: "idle", avatarBg: "bg-purple-600 text-white" },
      { id: "m6", name: "Priya Patel", role: "Student", status: "offline", avatarBg: "bg-slate-600 text-white" },
      { id: "m7", name: "Devansh Mehta", role: "Student", status: "offline", avatarBg: "bg-slate-600 text-white" },
    ],
  },
  {
    id: "server-aiml",
    name: "AI & Machine Learning Hub",
    initials: "AI",
    badge: "Research",
    color: "from-purple-600 to-pink-600",
    description: "Transformer pipelines, PyTorch benchmarks, GenAI agents, and collaborative Kaggle competitions.",
    category: "Data & AI",
    membersCount: 1890,
    onlineCount: 31,
    isJoined: true,
    taggedSkills: ["Python", "PyTorch", "LLMs", "LangChain", "Vector DBs"],
    channelCategories: [
      {
        name: "INFORMATION",
        channels: [
          { id: "ai-announcements", name: "ai-announcements", type: "text", topic: "Paper reading groups & GPU grants." },
        ],
      },
      {
        name: "RESEARCH & LABS",
        channels: [
          { id: "genai-agents", name: "genai-agents", type: "text", topic: "Building autonomous agents with Gemini and LangChain." },
          { id: "paper-reviews", name: "paper-reviews", type: "text", topic: "Weekly arXiv breakdown sessions." },
        ],
      },
      {
        name: "VOICE CHANNELS",
        channels: [
          { id: "voice-ai-lab", name: "AI Hack Room", type: "voice" },
        ],
      },
    ],
    members: [
      { id: "m20", name: "Dr. A. Sen", role: "Owner", status: "online", avatarBg: "bg-purple-700 text-white" },
      { id: "m21", name: "Tanmay B.", role: "Mentor", status: "online", avatarBg: "bg-emerald-600 text-white" },
    ],
  },
  {
    id: "server-cloud",
    name: "Cloud Architecture & DevOps",
    initials: "CL",
    badge: "Industry",
    color: "from-sky-600 to-cyan-600",
    description: "Kubernetes orchestration, Terraform CI/CD, AWS certifications, and enterprise cloud infrastructure.",
    category: "Cloud",
    membersCount: 940,
    onlineCount: 17,
    isJoined: true,
    taggedSkills: ["AWS", "Docker", "Kubernetes", "Terraform", "CI/CD"],
    channelCategories: [
      {
        name: "DISCUSSIONS",
        channels: [
          { id: "aws-certifications", name: "aws-certs", type: "text", topic: "Solutions Architect associate revision." },
          { id: "docker-k8s", name: "docker-k8s", type: "text", topic: "Cluster configurations & Helm charts." },
        ],
      },
      {
        name: "VOICE",
        channels: [
          { id: "voice-infra", name: "Infra War Room", type: "voice" },
        ],
      },
    ],
    members: [
      { id: "m30", name: "Sahil Khan", role: "Owner", status: "online", avatarBg: "bg-cyan-600 text-white" },
    ],
  },
  {
    id: "server-placements",
    name: "Placement & DSA Sprint 2026",
    initials: "DS",
    badge: "Placements",
    color: "from-emerald-600 to-teal-600",
    description: "Daily LeetCode patterns, system design mock interviews, campus recruiting debriefs, and salary negotiation.",
    category: "Career",
    membersCount: 4200,
    onlineCount: 78,
    isJoined: false,
    taggedSkills: ["DSA", "LeetCode", "System Design", "Java", "C++"],
    channelCategories: [
      {
        name: "INTERVIEW PREP",
        channels: [
          { id: "daily-problem", name: "daily-problem", type: "text", topic: "Daily LeetCode challenge discussion." },
          { id: "mock-interviews", name: "mock-interviews", type: "text", topic: "Schedule 1v1 mock interviews with peers." },
        ],
      },
    ],
    members: [
      { id: "m40", name: "Rishabh Malhotra", role: "Owner", status: "online", avatarBg: "bg-emerald-600 text-white" },
    ],
  },
];

// Initial Messages Map by Channel
const INITIAL_MESSAGES: Record<string, ChatMessage[]> = {
  general: [
    {
      id: "msg-1",
      author: "Vikram Rathore",
      authorRole: "Owner",
      authorRoleColor: "text-blue-600 bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800",
      avatarBg: "bg-blue-600 text-white",
      avatarInitials: "VR",
      timestamp: "Today at 10:14 AM",
      content: "Welcome to the Web Dev Guild everyone! Reminder that our weekly production architectures review is tomorrow at 5 PM IST.",
      reactions: [
        { emoji: "🚀", count: 12, reacted: false },
        { emoji: "👏", count: 7, reacted: true },
      ],
      repliesCount: 3,
    },
    {
      id: "msg-2",
      author: "Kunal Gupta (Google)",
      authorRole: "Industry Partner",
      authorRoleColor: "text-amber-700 bg-amber-50 dark:bg-amber-950 border-amber-200 dark:border-amber-800",
      avatarBg: "bg-amber-600 text-white",
      avatarInitials: "KG",
      timestamp: "Today at 10:28 AM",
      content: "Quick tip for candidates building full-stack capstone projects: Avoid storing JWT tokens in localStorage. Use HttpOnly cookies with CSRF protection, especially if you want your security architecture to stand out in interviews!",
      codeSnippet: {
        lang: "typescript",
        code: `// Recommended pattern in Next.js Server Actions\nimport { cookies } from 'next/headers';\n\nexport async function setAuthSession(token: string) {\n  const cookieStore = await cookies();\n  cookieStore.set('session', token, {\n    httpOnly: true,\n    secure: process.env.NODE_ENV === 'production',\n    sameSite: 'lax',\n    path: '/',\n  });\n}`,
      },
      reactions: [
        { emoji: "🔥", count: 18, reacted: true },
        { emoji: "💡", count: 15, reacted: false },
        { emoji: "❤️", count: 9, reacted: false },
      ],
      repliesCount: 6,
    },
    {
      id: "msg-3",
      author: "Neha Sharma",
      authorRole: "Mentor",
      authorRoleColor: "text-emerald-700 bg-emerald-50 dark:bg-emerald-950 border-emerald-200 dark:border-emerald-800",
      avatarBg: "bg-emerald-600 text-white",
      avatarInitials: "NS",
      timestamp: "Today at 10:35 AM",
      content: "Has anyone benchmarked Redis vs Memcached for session token invalidation in distributed environments?",
      reactions: [
        { emoji: "👍", count: 4, reacted: false },
      ],
    },
  ],
  "jobs-internships": [
    {
      id: "job-1",
      author: "EduLearn Placement Desk",
      authorRole: "Admin",
      authorRoleColor: "text-purple-700 bg-purple-50 dark:bg-purple-950 border-purple-200 dark:border-purple-800",
      avatarBg: "bg-purple-600 text-white",
      avatarInitials: "ED",
      timestamp: "Today at 9:00 AM",
      content: "📢 New Verified Off-Campus Internship Opportunity posted on the platform! Direct fast-track for guild members with verified React & Next.js skills.",
      jobCard: {
        company: "PixelCraft Interactive",
        title: "Frontend Engineering Intern (React 19 / TypeScript)",
        stipend: "₹35,000 / month",
        location: "Remote / Hybrid (Bangalore)",
        applyUrl: "/student/opportunities",
      },
      reactions: [
        { emoji: "🚀", count: 24, reacted: true },
        { emoji: "💼", count: 19, reacted: false },
      ],
      repliesCount: 4,
    },
  ],
  announcements: [
    {
      id: "ann-1",
      author: "Vikram Rathore",
      authorRole: "Owner",
      authorRoleColor: "text-blue-600 bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800",
      avatarBg: "bg-blue-600 text-white",
      avatarInitials: "VR",
      timestamp: "Yesterday at 6:00 PM",
      content: "🚨 Hackathon Registration Open: The 2026 Inter-College Web Innovation sprint begins next weekend. Teams of 2–4 can register under the #project-collab channel.",
      reactions: [
        { emoji: "🔥", count: 32, reacted: true },
        { emoji: "🎉", count: 28, reacted: false },
      ],
    },
  ],
};

export default function CommunitiesPage() {
  const [servers, setServers] = useState<CommunityServer[]>(INITIAL_SERVERS);
  const [activeServerId, setActiveServerId] = useState<string>("server-webdev");
  const [activeChannelId, setActiveChannelId] = useState<string>("general");
  const [currentView, setCurrentView] = useState<"server" | "discover">("server");
  const [showMembersList, setShowMembersList] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [discoverCategory, setDiscoverCategory] = useState("All");

  // Messaging State
  const [messages, setMessages] = useState<Record<string, ChatMessage[]>>(INITIAL_MESSAGES);
  const [chatInputText, setChatInputText] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const chatScrollRef = useRef<HTMLDivElement>(null);

  // Voice Channel State
  const [connectedVoiceChannel, setConnectedVoiceChannel] = useState<string | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isDeafened, setIsDeafened] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);

  // Create Community Modal State
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newCommunityName, setNewCommunityName] = useState("");
  const [newCommunityDesc, setNewCommunityDesc] = useState("");
  const [newCommunityCategory, setNewCommunityCategory] = useState("Engineering");
  const [newCommunityVisibility, setNewCommunityVisibility] = useState<"public" | "private">("public");
  const [newCommunitySkills, setNewCommunitySkills] = useState("");

  const activeServer = servers.find((s) => s.id === activeServerId) || servers[0];

  // Find active channel
  let activeChannel: Channel | undefined;
  activeServer.channelCategories.forEach((cat) => {
    const found = cat.channels.find((ch) => ch.id === activeChannelId);
    if (found) activeChannel = found;
  });

  // Auto-scroll chat to bottom
  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [messages, activeChannelId]);

  // Send Message
  const handleSendMessage = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!chatInputText.trim()) return;

    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      author: "Ananya Sharma (You)",
      authorRole: "Student",
      authorRoleColor: "text-indigo-600 bg-indigo-50 dark:bg-indigo-950 border-indigo-200 dark:border-indigo-800",
      avatarBg: "bg-indigo-600 text-white",
      avatarInitials: "AS",
      timestamp: "Just now",
      content: chatInputText,
      reactions: [],
    };

    setMessages((prev) => ({
      ...prev,
      [activeChannelId]: [...(prev[activeChannelId] || []), newMsg],
    }));

    setChatInputText("");
    setShowEmojiPicker(false);
  };

  // Toggle Reaction
  const handleToggleReaction = (messageId: string, emoji: string) => {
    setMessages((prev) => {
      const channelMsgs = prev[activeChannelId] || [];
      const updated = channelMsgs.map((msg) => {
        if (msg.id !== messageId) return msg;

        const existingReaction = msg.reactions.find((r) => r.emoji === emoji);
        let newReactions: Reaction[];

        if (existingReaction) {
          newReactions = msg.reactions
            .map((r) =>
              r.emoji === emoji
                ? {
                    ...r,
                    count: r.reacted ? r.count - 1 : r.count + 1,
                    reacted: !r.reacted,
                  }
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

  // Voice Channel Join / Leave
  const handleVoiceChannelClick = (channel: Channel) => {
    if (connectedVoiceChannel === channel.name) {
      setConnectedVoiceChannel(null);
    } else {
      setConnectedVoiceChannel(channel.name);
    }
  };

  // Join / Leave Community from Discover
  const handleToggleJoinServer = (serverId: string) => {
    setServers((prev) =>
      prev.map((s) =>
        s.id === serverId
          ? {
              ...s,
              isJoined: !s.isJoined,
              membersCount: s.isJoined ? s.membersCount - 1 : s.membersCount + 1,
            }
          : s
      )
    );
  };

  // Create New Community Handler
  const handleCreateCommunity = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommunityName.trim()) return;

    const skillsArray = newCommunitySkills
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    const newServer: CommunityServer = {
      id: `server-${Date.now()}`,
      name: newCommunityName,
      initials: newCommunityName.slice(0, 2).toUpperCase(),
      badge: "Community",
      color: "from-emerald-600 to-teal-600",
      description: newCommunityDesc || "Student-led learning guild.",
      category: newCommunityCategory,
      membersCount: 1,
      onlineCount: 1,
      isOwner: true,
      isJoined: true,
      taggedSkills: skillsArray.length ? skillsArray : ["General", "Collaboration"],
      channelCategories: [
        {
          name: "INFORMATION",
          channels: [
            { id: "welcome", name: "welcome", type: "text", topic: `Welcome to ${newCommunityName}!` },
            { id: "announcements", name: "announcements", type: "text", topic: "Community updates and news." },
          ],
        },
        {
          name: "DISCUSSION",
          channels: [
            { id: "general", name: "general", type: "text", topic: "General discussions and peer Q&A." },
          ],
        },
        {
          name: "VOICE",
          channels: [
            { id: "voice-general", name: "General Voice", type: "voice" },
          ],
        },
      ],
      members: [
        { id: "self", name: "Ananya Sharma (You)", role: "Owner", status: "online", avatarBg: "bg-emerald-600 text-white" },
      ],
    };

    setServers([newServer, ...servers]);
    setActiveServerId(newServer.id);
    setActiveChannelId("general");
    setCurrentView("server");
    setShowCreateModal(false);

    // Reset Form
    setNewCommunityName("");
    setNewCommunityDesc("");
    setNewCommunitySkills("");
  };

  const channelMessages = messages[activeChannelId] || [];

  return (
    <div className="h-[calc(100vh-130px)] min-h-[640px] max-w-7xl mx-auto rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl overflow-hidden flex flex-col font-sans select-none text-slate-200">
      {/* =====================================================================
          1. CREATE COMMUNITY MODAL
         ===================================================================== */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl max-w-lg w-full p-6 sm:p-7 space-y-5 animate-in fade-in-50 duration-200">
            <div className="flex justify-between items-center border-b border-slate-800 pb-4">
              <div>
                <h3 className="text-xl font-black text-white">Create a Community</h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Launch a new student learning circle, college club, or project team.
                </p>
              </div>
              <button
                onClick={() => setShowCreateModal(false)}
                className="w-8 h-8 rounded-full bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateCommunity} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-300 block mb-1.5 uppercase tracking-wider text-[11px]">
                  Community Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Distributed Systems Lab, UI/UX Guild"
                  value={newCommunityName}
                  onChange={(e) => setNewCommunityName(e.target.value)}
                  className="w-full rounded-2xl bg-slate-800 border border-slate-700 px-4 py-3 text-xs text-white placeholder-slate-500 focus:outline-hidden focus:border-blue-500"
                />
              </div>

              <div>
                <label className="font-bold text-slate-300 block mb-1.5 uppercase tracking-wider text-[11px]">
                  Description
                </label>
                <textarea
                  rows={2}
                  placeholder="What is this community about? Who should join?"
                  value={newCommunityDesc}
                  onChange={(e) => setNewCommunityDesc(e.target.value)}
                  className="w-full rounded-2xl bg-slate-800 border border-slate-700 p-3 text-xs text-white placeholder-slate-500 focus:outline-hidden focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-300 block mb-1.5 uppercase tracking-wider text-[11px]">
                    Category
                  </label>
                  <select
                    value={newCommunityCategory}
                    onChange={(e) => setNewCommunityCategory(e.target.value)}
                    className="w-full rounded-2xl bg-slate-800 border border-slate-700 p-3 text-xs text-white focus:outline-hidden focus:border-blue-500"
                  >
                    <option value="Engineering">Engineering &amp; Code</option>
                    <option value="Data & AI">Data &amp; AI</option>
                    <option value="Cloud">Cloud &amp; DevOps</option>
                    <option value="Career">Career &amp; Placements</option>
                    <option value="Design">Design &amp; Product</option>
                    <option value="Open Source">Open Source</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-300 block mb-1.5 uppercase tracking-wider text-[11px]">
                    Visibility
                  </label>
                  <div className="flex space-x-2 pt-1">
                    <button
                      type="button"
                      onClick={() => setNewCommunityVisibility("public")}
                      className={`flex-1 py-2 rounded-xl font-bold flex items-center justify-center space-x-1 border ${
                        newCommunityVisibility === "public"
                          ? "bg-blue-600 text-white border-blue-500"
                          : "bg-slate-800 text-slate-400 border-slate-700"
                      }`}
                    >
                      <Globe className="w-3.5 h-3.5" />
                      <span>Public</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setNewCommunityVisibility("private")}
                      className={`flex-1 py-2 rounded-xl font-bold flex items-center justify-center space-x-1 border ${
                        newCommunityVisibility === "private"
                          ? "bg-blue-600 text-white border-blue-500"
                          : "bg-slate-800 text-slate-400 border-slate-700"
                      }`}
                    >
                      <Lock className="w-3.5 h-3.5" />
                      <span>Private</span>
                    </button>
                  </div>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-300 block mb-1.5 uppercase tracking-wider text-[11px]">
                  Associated Skills (Comma separated)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Java, Spring Boot, Docker, PostgreSQL"
                  value={newCommunitySkills}
                  onChange={(e) => setNewCommunitySkills(e.target.value)}
                  className="w-full rounded-2xl bg-slate-800 border border-slate-700 px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-hidden focus:border-blue-500"
                />
              </div>

              <div className="pt-3 border-t border-slate-800 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 hover:text-white font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-black shadow-lg"
                >
                  Create Community (You will be Owner)
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =====================================================================
          2. MAIN DISCORD WORKSPACE CONTAINER
         ===================================================================== */}
      <div className="flex-1 flex overflow-hidden">
        {/* ===================================================================
            COLUMN 1: SERVERS RAIL (LEFTMOST BAR)
           =================================================================== */}
        <aside className="w-[72px] bg-slate-950/80 border-r border-slate-800/80 flex flex-col items-center py-3.5 space-y-2.5 shrink-0 z-20">
          {/* Discover / Home Icon */}
          <button
            onClick={() => setCurrentView("discover")}
            className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all group relative cursor-pointer ${
              currentView === "discover"
                ? "bg-blue-600 text-white rounded-2xl shadow-lg shadow-blue-600/30"
                : "bg-slate-850 hover:bg-blue-600 hover:text-white text-slate-300 rounded-3xl hover:rounded-2xl"
            }`}
            title="Discover Communities"
          >
            {/* Active Pill Indicator */}
            <span
              className={`absolute -left-1 w-1 bg-white rounded-r-full transition-all ${
                currentView === "discover" ? "h-8" : "h-0 group-hover:h-4"
              }`}
            />
            <Compass className="w-6 h-6" />
          </button>

          <div className="w-8 h-0.5 bg-slate-800 rounded-full" />

          {/* Joined Server Icons */}
          <div className="flex-1 w-full space-y-2.5 overflow-y-auto no-scrollbar flex flex-col items-center">
            {servers
              .filter((s) => s.isJoined)
              .map((server) => {
                const isActive = currentView === "server" && activeServerId === server.id;
                return (
                  <button
                    key={server.id}
                    onClick={() => {
                      setActiveServerId(server.id);
                      setActiveChannelId(server.channelCategories[0]?.channels[0]?.id || "general");
                      setCurrentView("server");
                    }}
                    className={`w-12 h-12 flex items-center justify-center font-black text-sm transition-all group relative cursor-pointer ${
                      isActive
                        ? "bg-gradient-to-tr from-blue-600 to-indigo-600 text-white rounded-2xl shadow-lg shadow-blue-500/25 scale-105"
                        : "bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-3xl hover:rounded-2xl"
                    }`}
                    title={server.name}
                  >
                    {/* Active Pill Indicator */}
                    <span
                      className={`absolute -left-1 w-1 bg-white rounded-r-full transition-all ${
                        isActive ? "h-10" : "h-0 group-hover:h-5"
                      }`}
                    />
                    <span>{server.initials}</span>

                    {/* Unread Badge Mock */}
                    {server.id === "server-webdev" && (
                      <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center border-2 border-slate-950">
                        3
                      </span>
                    )}
                  </button>
                );
              })}

            {/* + Create Community Button */}
            <button
              onClick={() => setShowCreateModal(true)}
              className="w-12 h-12 rounded-3xl hover:rounded-2xl bg-slate-800 hover:bg-emerald-600 text-emerald-400 hover:text-white flex items-center justify-center transition-all cursor-pointer group"
              title="Create a Community"
            >
              <Plus className="w-6 h-6 group-hover:rotate-90 transition-transform" />
            </button>
          </div>
        </aside>

        {/* ===================================================================
            VIEW A: DISCOVER COMMUNITIES VIEW
           =================================================================== */}
        {currentView === "discover" ? (
          <div className="flex-1 bg-slate-900 overflow-y-auto p-6 sm:p-8 space-y-6">
            {/* Discover Header */}
            <div className="relative rounded-3xl bg-gradient-to-r from-blue-900 via-indigo-950 to-slate-900 p-8 border border-slate-700/60 shadow-xl overflow-hidden">
              <div className="max-w-2xl relative z-10 space-y-3">
                <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-bold border border-blue-400/30">
                  <Compass className="w-3.5 h-3.5" />
                  <span>Discover Campus &amp; Industry Guilds</span>
                </span>
                <h2 className="text-3xl font-black text-white tracking-tight">
                  Find Your Technical Community
                </h2>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  Join student-led study circles, industry-partnered research guilds, and placement sprint squads.
                </p>

                {/* Search Bar */}
                <div className="pt-2 relative max-w-lg">
                  <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Explore Web Dev, AI, Cloud, Placement Prep..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full rounded-2xl bg-slate-800/90 border border-slate-700 pl-11 pr-4 py-3 text-xs text-white placeholder-slate-400 focus:outline-hidden focus:border-blue-500 shadow-md"
                  />
                </div>
              </div>
            </div>

            {/* Category Filter Chips */}
            <div className="flex flex-wrap gap-2 pt-2">
              {["All", "Engineering", "Data & AI", "Cloud", "Career", "Design"].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setDiscoverCategory(cat)}
                  className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                    discoverCategory === cat
                      ? "bg-blue-600 text-white shadow-md"
                      : "bg-slate-800 hover:bg-slate-750 text-slate-300"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Communities Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {servers
                .filter((s) => discoverCategory === "All" || s.category === discoverCategory)
                .filter(
                  (s) =>
                    s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    s.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    s.taggedSkills.some((sk) => sk.toLowerCase().includes(searchQuery.toLowerCase()))
                )
                .map((server) => (
                  <div
                    key={server.id}
                    className="bg-slate-850 border border-slate-750 rounded-3xl p-5 hover:border-slate-650 transition-all flex flex-col justify-between group shadow-md"
                  >
                    <div>
                      <div className="flex items-start justify-between mb-3">
                        <div
                          className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${server.color} text-white font-black flex items-center justify-center text-lg shadow-md`}
                        >
                          {server.initials}
                        </div>
                        <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                          {server.badge}
                        </span>
                      </div>

                      <h3 className="font-extrabold text-base text-white group-hover:text-blue-400 transition-colors">
                        {server.name}
                      </h3>
                      <p className="text-xs text-slate-400 mt-1 leading-relaxed line-clamp-2">
                        {server.description}
                      </p>

                      <div className="mt-3.5 flex flex-wrap gap-1">
                        {server.taggedSkills.map((sk) => (
                          <span
                            key={sk}
                            className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700"
                          >
                            {sk}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="mt-5 pt-3.5 border-t border-slate-800 flex items-center justify-between text-xs">
                      <div className="flex items-center space-x-3 text-slate-400 text-[11px]">
                        <span>{server.membersCount.toLocaleString()} members</span>
                        <span>•</span>
                        <span className="text-emerald-400 font-bold">{server.onlineCount} online</span>
                      </div>

                      {server.isJoined ? (
                        <button
                          onClick={() => {
                            setActiveServerId(server.id);
                            setCurrentView("server");
                          }}
                          className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold transition-colors cursor-pointer"
                        >
                          Open Guild
                        </button>
                      ) : (
                        <button
                          onClick={() => handleToggleJoinServer(server.id)}
                          className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-emerald-600 hover:text-white text-emerald-400 font-bold border border-slate-700 transition-all cursor-pointer"
                        >
                          Join Guild
                        </button>
                      )}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        ) : (
          /* ===================================================================
              VIEW B: ACTIVE DISCORD SERVER WORKSPACE
             =================================================================== */
          <>
            {/* =================================================================
                COLUMN 2: CHANNELS SIDEBAR
               ================================================================= */}
            <div className="w-60 bg-slate-900 border-r border-slate-800 flex flex-col justify-between shrink-0">
              {/* Server Title & Dropdown Header */}
              <div>
                <div className="p-4 border-b border-slate-800 flex items-center justify-between shadow-xs">
                  <div className="flex items-center space-x-2 min-w-0">
                    <h2 className="font-extrabold text-sm text-white truncate" title={activeServer.name}>
                      {activeServer.name}
                    </h2>
                    <ShieldCheck className="w-4 h-4 text-blue-400 shrink-0" />
                  </div>
                  <ChevronDown className="w-4 h-4 text-slate-400 hover:text-white cursor-pointer" />
                </div>

                {/* Channels List */}
                <div className="p-3 space-y-4 overflow-y-auto max-h-[calc(100vh-270px)]">
                  {activeServer.channelCategories.map((cat, idx) => (
                    <div key={idx} className="space-y-1">
                      <div className="flex items-center justify-between text-[11px] font-bold text-slate-400 px-2 py-1 tracking-wider uppercase">
                        <span>{cat.name}</span>
                        <Plus className="w-3.5 h-3.5 hover:text-white cursor-pointer" />
                      </div>

                      <div className="space-y-0.5">
                        {cat.channels.map((channel) => {
                          const isChannelActive = activeChannelId === channel.id;
                          const isVoice = channel.type === "voice";
                          const isConnectedVoice = connectedVoiceChannel === channel.name;

                          return (
                            <button
                              key={channel.id}
                              onClick={() => {
                                if (isVoice) {
                                  handleVoiceChannelClick(channel);
                                } else {
                                  setActiveChannelId(channel.id);
                                }
                              }}
                              className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                                isChannelActive
                                  ? "bg-slate-800 text-white font-bold"
                                  : isConnectedVoice
                                  ? "bg-emerald-950/60 text-emerald-300 font-bold border border-emerald-800/60"
                                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-850"
                              }`}
                            >
                              <div className="flex items-center space-x-2 min-w-0">
                                {isVoice ? (
                                  <Volume2
                                    className={`w-4 h-4 shrink-0 ${
                                      isConnectedVoice ? "text-emerald-400 animate-pulse" : "text-slate-400"
                                    }`}
                                  />
                                ) : (
                                  <Hash className="w-4 h-4 shrink-0 text-slate-500" />
                                )}
                                <span className="truncate">{channel.name}</span>
                              </div>

                              {/* Unread Count or Voice Ping */}
                              {channel.unreadCount ? (
                                <span className="bg-blue-600 text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full">
                                  {channel.unreadCount}
                                </span>
                              ) : isConnectedVoice ? (
                                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                              ) : null}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bottom Sticky Footers: Voice Connection HUD + User Profile */}
              <div className="border-t border-slate-800 bg-slate-950">
                {/* Voice Connected Banner (Shows when joined to voice) */}
                {connectedVoiceChannel && (
                  <div className="p-3 bg-emerald-950/80 border-b border-emerald-900/60 flex items-center justify-between text-xs">
                    <div className="flex items-center space-x-2">
                      <Radio className="w-4 h-4 text-emerald-400 animate-pulse" />
                      <div>
                        <p className="font-bold text-emerald-300 text-[11px]">Voice Connected</p>
                        <p className="text-[10px] text-emerald-400/80 truncate max-w-[110px]">{connectedVoiceChannel}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-1">
                      <button
                        onClick={() => setIsScreenSharing(!isScreenSharing)}
                        className={`p-1.5 rounded-lg ${isScreenSharing ? "bg-emerald-600 text-white" : "text-emerald-400 hover:bg-emerald-900"}`}
                        title="Screen Share"
                      >
                        <Monitor className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setConnectedVoiceChannel(null)}
                        className="p-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white cursor-pointer"
                        title="Disconnect Voice"
                      >
                        <PhoneOff className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                )}

                {/* User Status Bar */}
                <div className="p-2.5 flex items-center justify-between">
                  <div className="flex items-center space-x-2 min-w-0">
                    <div className="relative shrink-0">
                      <div className="w-8 h-8 rounded-full bg-indigo-600 text-white text-xs font-bold flex items-center justify-center">
                        AS
                      </div>
                      <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-slate-950" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-white truncate">Ananya Sharma</p>
                      <p className="text-[10px] text-slate-400 truncate">#2026 Student</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-0.5 text-slate-400">
                    <button
                      onClick={() => setIsMuted(!isMuted)}
                      className={`p-1.5 rounded-lg hover:text-white hover:bg-slate-800 ${isMuted ? "text-rose-500" : ""}`}
                      title={isMuted ? "Unmute Mic" : "Mute Mic"}
                    >
                      {isMuted ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
                    </button>
                    <button
                      onClick={() => setIsDeafened(!isDeafened)}
                      className={`p-1.5 rounded-lg hover:text-white hover:bg-slate-800 ${isDeafened ? "text-rose-500" : ""}`}
                      title={isDeafened ? "Undeafen" : "Deafen"}
                    >
                      <Headphones className="w-3.5 h-3.5" />
                    </button>
                    <button className="p-1.5 rounded-lg hover:text-white hover:bg-slate-800" title="User Settings">
                      <Settings className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* =================================================================
                COLUMN 3: MAIN CHAT & REAL-TIME INTERACTION STREAM
               ================================================================= */}
            <div className="flex-1 bg-slate-900/90 flex flex-col justify-between overflow-hidden">
              {/* Channel Top Header */}
              <div className="h-14 px-5 border-b border-slate-800 flex items-center justify-between shrink-0 bg-slate-900/95 backdrop-blur-xs">
                <div className="flex items-center space-x-3 min-w-0">
                  <Hash className="w-5 h-5 text-slate-400" />
                  <span className="font-extrabold text-sm text-white">{activeChannel?.name || "general"}</span>
                  <span className="text-slate-600 hidden sm:inline">|</span>
                  <span className="text-xs text-slate-400 truncate hidden sm:inline max-w-md">
                    {activeChannel?.topic || "Discussion & peer learning"}
                  </span>
                </div>

                <div className="flex items-center space-x-2 text-slate-400">
                  <button className="p-1.5 rounded-lg hover:text-white hover:bg-slate-800" title="Pinned Messages">
                    <Pin className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setShowMembersList(!showMembersList)}
                    className={`p-1.5 rounded-lg hover:text-white hover:bg-slate-800 ${
                      showMembersList ? "text-blue-400 bg-slate-800" : ""
                    }`}
                    title="Toggle Member List"
                  >
                    <Users className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Chat Message Stream */}
              <div ref={chatScrollRef} className="flex-1 overflow-y-auto p-5 space-y-5">
                {/* Channel Welcome Banner */}
                <div className="pt-4 pb-2 border-b border-slate-800 space-y-1">
                  <div className="w-12 h-12 rounded-full bg-slate-800 text-blue-400 flex items-center justify-center text-xl font-bold mb-2">
                    #
                  </div>
                  <h3 className="text-xl font-black text-white">Welcome to #{activeChannel?.name}!</h3>
                  <p className="text-xs text-slate-400">
                    This is the start of the #{activeChannel?.name} channel in {activeServer.name}.
                  </p>
                </div>

                {/* Messages List */}
                {channelMessages.length === 0 ? (
                  <div className="p-12 text-center text-slate-500 text-xs italic">
                    No messages yet in this channel. Start the conversation!
                  </div>
                ) : (
                  channelMessages.map((msg) => (
                    <div key={msg.id} className="flex items-start space-x-3.5 group hover:bg-slate-850/40 -mx-3 px-3 py-2 rounded-2xl transition-colors">
                      {/* Avatar */}
                      <div className={`w-10 h-10 rounded-2xl ${msg.avatarBg} font-black text-xs flex items-center justify-center shrink-0 shadow-md`}>
                        {msg.avatarInitials}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0 space-y-1.5">
                        <div className="flex items-center space-x-2">
                          <span className="font-extrabold text-sm text-white">{msg.author}</span>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${msg.authorRoleColor}`}>
                            {msg.authorRole}
                          </span>
                          <span className="text-[11px] text-slate-500">{msg.timestamp}</span>
                        </div>

                        {/* Text */}
                        <p className="text-xs text-slate-200 leading-relaxed font-normal">
                          {msg.content}
                        </p>

                        {/* Optional Code Block */}
                        {msg.codeSnippet && (
                          <div className="rounded-2xl bg-slate-950 border border-slate-800 p-3.5 font-mono text-xs overflow-x-auto text-blue-300">
                            <div className="flex justify-between items-center text-[10px] text-slate-500 pb-2 mb-2 border-b border-slate-850 font-sans">
                              <span>{msg.codeSnippet.lang.toUpperCase()}</span>
                              <button
                                onClick={() => navigator.clipboard.writeText(msg.codeSnippet!.code)}
                                className="hover:text-white flex items-center space-x-1"
                              >
                                <Copy className="w-3 h-3" />
                                <span>Copy Code</span>
                              </button>
                            </div>
                            <pre className="whitespace-pre-wrap">{msg.codeSnippet.code}</pre>
                          </div>
                        )}

                        {/* Optional Job / Internship Opportunity Embed */}
                        {msg.jobCard && (
                          <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-950/60 to-indigo-950/60 border border-blue-800/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-lg">
                            <div>
                              <div className="flex items-center space-x-2 mb-1">
                                <span className="font-bold text-xs text-blue-300">{msg.jobCard.company}</span>
                                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800">
                                  Verified
                                </span>
                              </div>
                              <h4 className="font-black text-sm text-white">{msg.jobCard.title}</h4>
                              <p className="text-xs text-slate-400 mt-0.5">
                                {msg.jobCard.stipend} • {msg.jobCard.location}
                              </p>
                            </div>
                            <Link
                              href={msg.jobCard.applyUrl}
                              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md transition-colors flex items-center space-x-1.5 self-start sm:self-auto"
                            >
                              <span>Apply via Platform</span>
                              <ArrowRight className="w-3.5 h-3.5" />
                            </Link>
                          </div>
                        )}

                        {/* Reactions Bar */}
                        <div className="flex flex-wrap items-center gap-1.5 pt-1">
                          {msg.reactions.map((r, rIdx) => (
                            <button
                              key={rIdx}
                              onClick={() => handleToggleReaction(msg.id, r.emoji)}
                              className={`px-2.5 py-1 rounded-xl text-xs font-bold border transition-all flex items-center space-x-1 cursor-pointer ${
                                r.reacted
                                  ? "bg-blue-950/90 border-blue-500 text-blue-300"
                                  : "bg-slate-800/80 border-slate-700/80 text-slate-400 hover:bg-slate-750"
                              }`}
                            >
                              <span>{r.emoji}</span>
                              <span className="text-[11px]">{r.count}</span>
                            </button>
                          ))}

                          {/* Quick Emoji adders */}
                          <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center space-x-1 ml-2">
                            {["👍", "❤️", "🚀", "🔥"].map((emoji) => (
                              <button
                                key={emoji}
                                onClick={() => handleToggleReaction(msg.id, emoji)}
                                className="w-6 h-6 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs flex items-center justify-center cursor-pointer"
                              >
                                {emoji}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Message Input Box */}
              <div className="p-4 bg-slate-900 border-t border-slate-800">
                {/* Quick Emoji Popover */}
                {showEmojiPicker && (
                  <div className="mb-2 p-2 rounded-2xl bg-slate-800 border border-slate-700 flex items-center space-x-2 w-fit animate-in fade-in-50">
                    {["👍", "❤️", "🚀", "🔥", "💡", "🎉", "👏", "💻", "✨"].map((emoji) => (
                      <button
                        key={emoji}
                        onClick={() => {
                          setChatInputText((prev) => prev + " " + emoji);
                          setShowEmojiPicker(false);
                        }}
                        className="text-base p-1 rounded-lg hover:bg-slate-700 transition-colors"
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                )}

                <form
                  onSubmit={handleSendMessage}
                  className="rounded-2xl bg-slate-800/90 border border-slate-700 p-2 flex items-center space-x-2 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 transition-all"
                >
                  <button
                    type="button"
                    onClick={() => alert("Upload file or code snippet attachment")}
                    className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
                    title="Attach File / Code"
                  >
                    <Plus className="w-4 h-4" />
                  </button>

                  <input
                    type="text"
                    value={chatInputText}
                    onChange={(e) => setChatInputText(e.target.value)}
                    placeholder={`Message #${activeChannel?.name || "general"}...`}
                    className="flex-1 bg-transparent border-0 text-xs text-white placeholder-slate-400 focus:outline-hidden"
                  />

                  <button
                    type="button"
                    onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                    className="p-2 rounded-xl text-slate-400 hover:text-amber-400 hover:bg-slate-700 transition-colors"
                    title="Add Emoji"
                  >
                    <Smile className="w-4 h-4" />
                  </button>

                  <button
                    type="submit"
                    disabled={!chatInputText.trim()}
                    className="p-2 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white font-bold transition-all"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              </div>
            </div>

            {/* =================================================================
                COLUMN 4: MEMBER LIST (RIGHT PANEL)
               ================================================================= */}
            {showMembersList && (
              <aside className="w-56 bg-slate-900 border-l border-slate-800 p-4 space-y-4 overflow-y-auto shrink-0 hidden lg:block">
                <div>
                  <h4 className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider mb-2">
                    Members — {activeServer.members.length}
                  </h4>

                  {/* Online Members */}
                  <div className="space-y-1">
                    {activeServer.members.map((member) => (
                      <div
                        key={member.id}
                        className="flex items-center space-x-2.5 p-2 rounded-xl hover:bg-slate-800 transition-colors cursor-pointer"
                      >
                        <div className="relative shrink-0">
                          <div className={`w-8 h-8 rounded-full ${member.avatarBg} text-xs font-bold flex items-center justify-center`}>
                            {member.name.split(" ").map((n) => n[0]).slice(0, 2).join("")}
                          </div>
                          <span
                            className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-slate-900 ${
                              member.status === "online"
                                ? "bg-emerald-500"
                                : member.status === "idle"
                                ? "bg-amber-500"
                                : "bg-slate-500"
                            }`}
                          />
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-slate-200 truncate">{member.name}</p>
                          <span
                            className={`text-[9px] font-bold px-1.5 py-0.2 rounded-full ${
                              member.role === "Owner"
                                ? "text-blue-400 bg-blue-950"
                                : member.role === "Industry Partner"
                                ? "text-amber-400 bg-amber-950"
                                : member.role === "Mentor"
                                ? "text-emerald-400 bg-emerald-950"
                                : "text-slate-400 bg-slate-800"
                            }`}
                          >
                            {member.role}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Tagged Skills Platform Integration */}
                <div className="pt-4 border-t border-slate-800 space-y-2">
                  <h4 className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">
                    Community Skills
                  </h4>
                  <div className="flex flex-wrap gap-1">
                    {activeServer.taggedSkills.map((sk) => (
                      <Link
                        key={sk}
                        href="/student/skills"
                        className="text-[10px] font-semibold px-2 py-0.5 rounded-lg bg-slate-800 hover:bg-blue-600 hover:text-white text-slate-300 border border-slate-700 transition-colors"
                      >
                        {sk}
                      </Link>
                    ))}
                  </div>
                </div>
              </aside>
            )}
          </>
        )}
      </div>
    </div>
  );
}
