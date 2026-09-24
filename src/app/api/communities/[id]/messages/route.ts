import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(req.url);
    const channelId = searchParams.get("channelId");

    // Query messages for channel or community
    let whereClause: any = {};
    if (channelId) {
      whereClause.channelId = channelId;
    } else {
      whereClause.channel = { communityId: id };
    }

    const messages = await prisma.message.findMany({
      where: whereClause,
      include: {
        sender: {
          include: { profile: true },
        },
      },
      orderBy: { createdAt: "asc" },
      take: 50,
    });

    return NextResponse.json({
      success: true,
      messages: messages.map((m) => ({
        id: m.id,
        author: m.sender?.profile?.fullName || m.sender?.email || "Community Member",
        authorRole: "Student",
        authorRoleColor: "text-purple-400 bg-purple-950/60 border-purple-800",
        avatarBg: "bg-purple-600 text-white",
        avatarInitials: (m.sender?.profile?.fullName || "CM").slice(0, 2).toUpperCase(),
        timestamp: new Date(m.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        content: m.content,
        replyToId: m.replyToId,
        reactions: [],
      })),
    });
  } catch (error) {
    console.error("Error fetching messages:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch messages" },
      { status: 500 }
    );
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { channelId, content, replyToId } = body;

    if (!channelId || !content) {
      return NextResponse.json(
        { success: false, error: "channelId and content are required" },
        { status: 400 }
      );
    }

    // Default to first user or fallback
    const user = await prisma.user.findFirst();
    const senderId = user ? user.id : "demo-sender-id";

    const newMsg = await prisma.message.create({
      data: {
        channelId,
        senderId,
        content,
        replyToId: replyToId || null,
      },
      include: {
        sender: {
          include: { profile: true },
        },
      },
    });

    return NextResponse.json({
      success: true,
      message: {
        id: newMsg.id,
        author: newMsg.sender?.profile?.fullName || "Viktor Bateman",
        authorRole: "Mentor",
        authorRoleColor: "text-fuchsia-400 bg-fuchsia-950/60 border-fuchsia-800",
        avatarBg: "bg-fuchsia-600 text-white",
        avatarInitials: "VB",
        timestamp: "Just now",
        content: newMsg.content,
        replyToId: newMsg.replyToId,
        reactions: [],
      },
    });
  } catch (error) {
    console.error("Error creating message:", error);
    return NextResponse.json(
      { success: false, error: "Failed to post message" },
      { status: 500 }
    );
  }
}
