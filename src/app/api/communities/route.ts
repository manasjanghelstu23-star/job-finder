import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Pre-configured academic, tech, industry, news, jobs, and student communities
const DEFAULT_COMMUNITIES_SEED = [
  {
    name: "AI & Machine Learning Research Hub",
    shortName: "AI & ML",
    description: "Large language models, PyTorch benchmarks, GenAI agents, transformer pipelines, and academic research reading groups.",
    icon: "AI",
    banner: "/communities/techlab.jpg",
    category: "Tech",
    visibility: "PUBLIC",
    targetSkills: JSON.stringify(["Python", "PyTorch", "LLMs", "Transformers", "LangChain"]),
    channels: [
      { name: "announcements", type: "ANNOUNCEMENT", position: 1 },
      { name: "general-ai", type: "TEXT", position: 2 },
      { name: "paper-reviews", type: "TEXT", position: 3 },
      { name: "genai-agents", type: "TEXT", position: 4 },
      { name: "AI Research Lab", type: "VOICE", position: 5 },
    ],
    roles: [
      { name: "Lead Researcher", permissions: JSON.stringify(["ALL"]), color: "#d946ef", isDefault: false },
      { name: "Faculty Mentor", permissions: JSON.stringify(["MANAGE_MESSAGES"]), color: "#a855f7", isDefault: false },
      { name: "Student Fellow", permissions: JSON.stringify(["SEND_MESSAGES"]), color: "#818cf8", isDefault: true },
    ],
  },
  {
    name: "Full Stack & Cloud Architecture Guild",
    shortName: "Cloud & Web",
    description: "Distributed systems, React 19, Next.js 15, Kubernetes orchestration, Docker, microservices, and enterprise cloud infrastructure.",
    icon: "CL",
    banner: "/communities/hero.jpg",
    category: "Tech",
    visibility: "PUBLIC",
    targetSkills: JSON.stringify(["React", "Next.js", "TypeScript", "Node.js", "Kubernetes", "AWS"]),
    channels: [
      { name: "announcements", type: "ANNOUNCEMENT", position: 1 },
      { name: "web-architecture", type: "TEXT", position: 2 },
      { name: "backend-apis", type: "TEXT", position: 3 },
      { name: "system-design", type: "TEXT", position: 4 },
      { name: "Cloud War Room", type: "VOICE", position: 5 },
    ],
    roles: [
      { name: "Cloud Architect", permissions: JSON.stringify(["ALL"]), color: "#06b6d4", isDefault: false },
      { name: "Mentor", permissions: JSON.stringify(["MANAGE_CHANNELS"]), color: "#3b82f6", isDefault: false },
      { name: "Developer", permissions: JSON.stringify(["SEND_MESSAGES"]), color: "#a5b4fc", isDefault: true },
    ],
  },
  {
    name: "Industry Placement & Internship Hub",
    shortName: "Jobs & Careers",
    description: "Tier-1 placement drives, FAANG interview machines, verified campus hiring alerts, resume ATS scoring, and corporate referrals.",
    icon: "JB",
    banner: "/communities/jobs.jpg",
    category: "Jobs",
    visibility: "PUBLIC",
    targetSkills: JSON.stringify(["Data Structures", "Algorithms", "System Design", "Behavioral Prep", "Resume Building"]),
    channels: [
      { name: "job-alerts", type: "ANNOUNCEMENT", position: 1 },
      { name: "interview-experiences", type: "TEXT", position: 2 },
      { name: "resume-reviews", type: "TEXT", position: 3 },
      { name: "company-hiring", type: "TEXT", position: 4 },
      { name: "Mock Interview Room", type: "VOICE", position: 5 },
    ],
    roles: [
      { name: "Placement Officer", permissions: JSON.stringify(["ALL"]), color: "#10b981", isDefault: false },
      { name: "Industry Recruiter", permissions: JSON.stringify(["POST_JOBS"]), color: "#059669", isDefault: false },
      { name: "Student Candidate", permissions: JSON.stringify(["SEND_MESSAGES"]), color: "#6ee7b7", isDefault: true },
    ],
  },
  {
    name: "Smart India Hackathon & Innovation Labs",
    shortName: "Education & SIH",
    description: "National hackathon team formation, patent filing guidance, startup incubators, capstone mentoring, and government project grants.",
    icon: "SIH",
    banner: "/communities/techlab.jpg",
    category: "Education",
    visibility: "PUBLIC",
    targetSkills: JSON.stringify(["Rapid Prototyping", "IoT", "AI/ML", "Product Design", "Pitching"]),
    channels: [
      { name: "announcements", type: "ANNOUNCEMENT", position: 1 },
      { name: "team-formation", type: "TEXT", position: 2 },
      { name: "mentor-guidance", type: "TEXT", position: 3 },
      { name: "project-showcase", type: "TEXT", position: 4 },
      { name: "Hackathon War Room", type: "VOICE", position: 5 },
    ],
    roles: [
      { name: "Innovation Lead", permissions: JSON.stringify(["ALL"]), color: "#f59e0b", isDefault: false },
      { name: "Faculty Mentor", permissions: JSON.stringify(["MANAGE_MESSAGES"]), color: "#d97706", isDefault: false },
      { name: "Innovator", permissions: JSON.stringify(["SEND_MESSAGES"]), color: "#fbbf24", isDefault: true },
    ],
  },
  {
    name: "Global Industry Leaders & Mentors Guild",
    shortName: "Industry Connect",
    description: "Connect directly with engineering VPs, research scientists, and product leads across top multinational enterprises.",
    icon: "IND",
    banner: "/communities/jobs.jpg",
    category: "Industry",
    visibility: "PUBLIC",
    targetSkills: JSON.stringify(["Career Strategy", "Leadership", "Enterprise Systems", "Networking"]),
    channels: [
      { name: "executive-talks", type: "ANNOUNCEMENT", position: 1 },
      { name: "mentor-connect", type: "TEXT", position: 2 },
      { name: "ask-an-industry-expert", type: "TEXT", position: 3 },
      { name: "Executive Lounge", type: "VOICE", position: 4 },
    ],
    roles: [
      { name: "Executive Mentor", permissions: JSON.stringify(["ALL"]), color: "#8b5cf6", isDefault: false },
      { name: "Student Mentee", permissions: JSON.stringify(["SEND_MESSAGES"]), color: "#c084fc", isDefault: true },
    ],
  },
  {
    name: "Campus Tech News & Placements Bulletin",
    shortName: "Campus News",
    description: "Real-time updates on campus placement statistics, hiring trends, tech breakthroughs, conferences, and startup funding.",
    icon: "NEWS",
    banner: "/communities/hero.jpg",
    category: "News",
    visibility: "PUBLIC",
    targetSkills: JSON.stringify(["Industry Trends", "Tech News", "Placement Analytics"]),
    channels: [
      { name: "breaking-bulletins", type: "ANNOUNCEMENT", position: 1 },
      { name: "placement-statistics", type: "TEXT", position: 2 },
      { name: "tech-trends-2026", type: "TEXT", position: 3 },
      { name: "Daily News Brief", type: "VOICE", position: 4 },
    ],
    roles: [
      { name: "Chief Editor", permissions: JSON.stringify(["ALL"]), color: "#ec4899", isDefault: false },
      { name: "Student Reader", permissions: JSON.stringify(["SEND_MESSAGES"]), color: "#f472b6", isDefault: true },
    ],
  },
];

// Curated live academic and industry mentors for the right sidebar
const MODERATORS = [
  { id: "mod-1", name: "Dr. Vikram Rao", role: "Industry Lead • Google", status: "online", time: "Now", avatarBg: "from-blue-600 to-indigo-600" },
  { id: "mod-2", name: "Prof. Alok Sen", role: "Head of CS Labs", status: "online", time: "8m ago", avatarBg: "from-purple-600 to-fuchsia-600" },
  { id: "mod-3", name: "Neha Sharma", role: "Tier-1 Placement Mentor", status: "idle", time: "25m ago", avatarBg: "from-emerald-600 to-teal-600" },
  { id: "mod-4", name: "Campus Bot", role: "Verified System Admin", status: "online", time: "Now", avatarBg: "from-cyan-600 to-blue-600" },
];

const RECENT_ACTIVITY = [
  { id: "act-1", user: "Dr. Vikram Rao (Google)", action: "Posted 12 Cloud Internships in #job-alerts", detail: "Stipend: ₹45,000/mo • Hybrid Bengaluru", time: "2m ago" },
  { id: "act-2", user: "Ananya Sharma", action: "Published capstone project in #project-showcase", detail: "Autonomous Agent Multi-Node Mesh", time: "8m ago" },
  { id: "act-3", user: "Rohan Varma", action: "Received SDE Internship Offer from Microsoft", detail: "Tier-1 Campus Placement Drive 2026", time: "18m ago" },
  { id: "act-4", user: "Priya Patel", action: "Shared Google machine coding prep in #interview-experiences", detail: "15 DSA questions + dynamic programming notes", time: "31m ago" },
];

export async function GET(req: NextRequest) {
  try {
    // Check if communities exist in DB or if old gaming seed exists, resync to academic/industry if needed
    const existing = await prisma.community.findMany({
      include: {
        channels: { orderBy: { position: "asc" } },
        members: true,
        roles: true,
      },
      orderBy: { createdAt: "asc" },
    });

    const hasGaming = existing.some((c) => c.name.toLowerCase().includes("gaming") || c.name.toLowerCase().includes("cyberpunk"));

    if (existing.length === 0 || hasGaming) {
      // Clear out outdated gaming data
      if (hasGaming) {
        await prisma.community.deleteMany({});
      }

      let defaultUser = await prisma.user.findFirst();
      if (!defaultUser) {
        defaultUser = await prisma.user.create({
          data: {
            email: "system@community.internal",
            passwordHash: "system-seed-hash",
            role: "STUDENT",
            isVerified: true,
            profile: {
              create: {
                fullName: "Viktor Bateman",
                email: "system@community.internal",
                role: "STUDENT",
                bio: "Lead Creative Technologist & Mentor",
              },
            },
          },
        });
      }

      for (const c of DEFAULT_COMMUNITIES_SEED) {
        await prisma.community.create({
          data: {
            name: c.name,
            description: c.description,
            icon: c.icon,
            banner: c.banner,
            category: c.category,
            visibility: c.visibility,
            ownerId: defaultUser.id,
            targetSkills: c.targetSkills,
            channels: {
              create: c.channels.map((ch) => ({
                name: ch.name,
                type: ch.type,
                position: ch.position,
              })),
            },
            roles: {
              create: c.roles.map((r) => ({
                name: r.name,
                permissions: r.permissions,
                color: r.color,
                isDefault: r.isDefault,
              })),
            },
            members: {
              create: {
                userId: defaultUser.id,
              },
            },
          },
        });
      }
    }

    const dbCommunities = await prisma.community.findMany({
      include: {
        channels: { orderBy: { position: "asc" } },
        members: true,
        roles: true,
      },
      orderBy: { createdAt: "asc" },
    });

    const formatted = dbCommunities.map((c, index) => {
      const parsedSkills = c.targetSkills ? JSON.parse(c.targetSkills) : ["General"];
      const baseMembers = [184200, 240500, 160800, 115400, 78200, 52900][index % 6] || 45000;
      const baseOnline = [48200, 62400, 35800, 28500, 14200, 8900][index % 6] || 8200;

      return {
        id: c.id,
        name: c.name,
        shortName: c.name.split(" ")[0] === "AI" ? "AI & ML" : c.name.split(" ")[0],
        description: c.description,
        icon: c.icon || c.name.slice(0, 2).toUpperCase(),
        banner: c.banner || "/communities/hero.jpg",
        category: c.category || "Education",
        visibility: c.visibility,
        ownerId: c.ownerId,
        memberCount: baseMembers + c.members.length,
        onlineCount: baseOnline,
        isJoined: true,
        taggedSkills: parsedSkills,
        channels: c.channels.map((ch) => ({
          id: ch.id,
          name: ch.name,
          type: ch.type.toLowerCase(),
          position: ch.position,
        })),
        roles: c.roles.map((r) => ({
          id: r.id,
          name: r.name,
          color: r.color,
        })),
      };
    });

    const featured = formatted.slice(0, 2); // AI & ML, Cloud & Web
    const popular = formatted.slice(2, 4); // Jobs & Careers, Innovation & SIH
    const recent = formatted.slice(4); // Industry Connect, Campus News

    return NextResponse.json({
      success: true,
      communities: formatted,
      featured,
      popular,
      recent,
      moderators: MODERATORS,
      recentActivity: RECENT_ACTIVITY,
    });
  } catch (error) {
    console.error("Error fetching communities:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch communities" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, description, category, visibility, skills } = body;

    if (!name || typeof name !== "string") {
      return NextResponse.json(
        { success: false, error: "Community name is required" },
        { status: 400 }
      );
    }

    const user = await prisma.user.findFirst();
    const ownerId = user ? user.id : "demo-owner-id";

    const parsedSkills = Array.isArray(skills)
      ? skills
      : typeof skills === "string"
      ? skills.split(",").map((s) => s.trim()).filter(Boolean)
      : ["Collaboration", "Engineering"];

    const newCommunity = await prisma.community.create({
      data: {
        name,
        description: description || "Student and industry collaboration guild.",
        category: category || "Tech",
        visibility: visibility || "PUBLIC",
        icon: name.slice(0, 2).toUpperCase(),
        banner: "/communities/hero.jpg",
        ownerId,
        targetSkills: JSON.stringify(parsedSkills),
        channels: {
          create: [
            { name: "announcements", type: "ANNOUNCEMENT", position: 1 },
            { name: "general", type: "TEXT", position: 2 },
            { name: "projects", type: "TEXT", position: 3 },
            { name: "Voice Lounge", type: "VOICE", position: 4 },
          ],
        },
        roles: {
          create: [
            { name: "Lead Mentor", permissions: JSON.stringify(["ALL"]), color: "#a855f7", isDefault: false },
            { name: "Member", permissions: JSON.stringify(["SEND_MESSAGES"]), color: "#60a5fa", isDefault: true },
          ],
        },
      },
      include: {
        channels: true,
        roles: true,
      },
    });

    return NextResponse.json({
      success: true,
      community: {
        id: newCommunity.id,
        name: newCommunity.name,
        shortName: newCommunity.name.split(" ")[0],
        description: newCommunity.description,
        icon: newCommunity.icon,
        banner: newCommunity.banner,
        category: newCommunity.category,
        visibility: newCommunity.visibility,
        memberCount: 1,
        onlineCount: 1,
        isJoined: true,
        taggedSkills: parsedSkills,
        channels: newCommunity.channels.map((ch) => ({
          id: ch.id,
          name: ch.name,
          type: ch.type.toLowerCase(),
          position: ch.position,
        })),
        roles: newCommunity.roles,
      },
    });
  } catch (error) {
    console.error("Error creating community:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create community" },
      { status: 500 }
    );
  }
}
