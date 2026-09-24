import { NextRequest, NextResponse } from "next/server";
import { getCommunities, createCommunity } from "@/lib/mock-db";

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
    const list = await getCommunities();

    const formatted = list.map((c, index) => {
      const parsedSkills = c.targetSkills ? JSON.parse(c.targetSkills) : ["General"];
      const baseMembers = [184200, 240500, 160800, 115400][index % 4] || 45000;
      const baseOnline = [48200, 62400, 35800, 28500][index % 4] || 8200;

      return {
        id: c.id,
        name: c.name,
        shortName: c.name.split(" ")[0],
        description: c.description,
        icon: c.icon || "💻",
        banner: c.banner || "/communities/hero.jpg",
        category: c.category || "Education",
        visibility: c.visibility,
        ownerId: c.ownerId,
        memberCount: baseMembers + (c.members?.length || 0),
        onlineCount: baseOnline,
        isJoined: true,
        taggedSkills: parsedSkills,
        channels: (c.channels || []).map((ch) => ({
          id: ch.id,
          name: ch.name,
          type: ch.type.toLowerCase(),
          position: ch.position,
        })),
        roles: [
          { id: "r1", name: "Lead Mentor", color: "#a855f7" },
          { id: "r2", name: "Member", color: "#60a5fa" }
        ],
      };
    });

    return NextResponse.json({
      success: true,
      communities: formatted,
      featured: formatted.slice(0, 2),
      popular: formatted.slice(1, 3),
      recent: formatted.slice(0, 2),
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
    const body = await req.json().catch(() => ({}));
    const newCommunity = await createCommunity(body);

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
        taggedSkills: ["Software Engineering"],
        channels: newCommunity.channels.map((ch) => ({
          id: ch.id,
          name: ch.name,
          type: ch.type.toLowerCase(),
          position: ch.position,
        })),
        roles: [],
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
