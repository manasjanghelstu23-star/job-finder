export interface MockCommunity {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  banner?: string;
  ownerId: string;
  visibility: string;
  category?: string;
  targetSkills?: string;
  createdAt: string;
  updatedAt: string;
  members: {
    id: string;
    communityId: string;
    userId: string;
    joinedAt: string;
    user: {
      id: string;
      email: string;
      profile?: {
        fullName: string;
        profilePhoto?: string;
      };
    };
  }[];
  channels: {
    id: string;
    communityId: string;
    name: string;
    type: string;
    position: number;
  }[];
}

export interface MockMessage {
  id: string;
  channelId: string;
  senderId: string;
  content: string;
  replyToId?: string;
  createdAt: string;
  senderName: string;
  senderAvatar?: string;
}

export const initialCommunities: MockCommunity[] = [
  {
    id: "comm-1",
    name: "Full Stack Developers Circle",
    description: "Hub for modern web engineers building React, Next.js, Node.js, and Cloud applications.",
    icon: "💻",
    ownerId: "usr-student-1",
    visibility: "PUBLIC",
    category: "Software Engineering",
    targetSkills: JSON.stringify(["React", "TypeScript", "Node.js"]),
    createdAt: "2026-01-20T10:00:00.000Z",
    updatedAt: "2026-01-20T10:00:00.000Z",
    members: [
      {
        id: "cm-1",
        communityId: "comm-1",
        userId: "usr-student-1",
        joinedAt: "2026-01-20T10:00:00.000Z",
        user: {
          id: "usr-student-1",
          email: "student@demo.com",
          profile: { fullName: "Alex Morgan" },
        },
      },
    ],
    channels: [
      { id: "chan-1", communityId: "comm-1", name: "general-chat", type: "TEXT", position: 1 },
      { id: "chan-2", communityId: "comm-1", name: "project-showcase", type: "TEXT", position: 2 },
      { id: "chan-3", communityId: "comm-1", name: "interview-prep", type: "TEXT", position: 3 },
    ],
  },
  {
    id: "comm-2",
    name: "AI & Machine Learning Hub",
    description: "Explore Generative AI, PyTorch, Large Language Models, and Data Science benchmark projects.",
    icon: "🤖",
    ownerId: "usr-student-1",
    visibility: "PUBLIC",
    category: "Artificial Intelligence",
    targetSkills: JSON.stringify(["Python", "System Architecture"]),
    createdAt: "2026-02-01T10:00:00.000Z",
    updatedAt: "2026-02-01T10:00:00.000Z",
    members: [
      {
        id: "cm-2",
        communityId: "comm-2",
        userId: "usr-student-1",
        joinedAt: "2026-02-01T10:00:00.000Z",
        user: {
          id: "usr-student-1",
          email: "student@demo.com",
          profile: { fullName: "Alex Morgan" },
        },
      },
    ],
    channels: [
      { id: "chan-4", communityId: "comm-2", name: "research-papers", type: "TEXT", position: 1 },
      { id: "chan-5", communityId: "comm-2", name: "model-benchmarks", type: "TEXT", position: 2 },
    ],
  },
];

export const initialMessages: MockMessage[] = [
  {
    id: "msg-1",
    channelId: "chan-1",
    senderId: "usr-student-1",
    content: "Welcome everyone to the Full Stack Developers Circle! Feel free to share your capstone project repos.",
    createdAt: "2026-03-01T10:00:00.000Z",
    senderName: "Alex Morgan",
  },
  {
    id: "msg-2",
    channelId: "chan-1",
    senderId: "usr-company-1",
    content: "Hi Alex! TechCorp is reviewing internship applications this week for React/Node positions.",
    createdAt: "2026-03-01T11:15:00.000Z",
    senderName: "TechCorp Global Recruiter",
  },
];
