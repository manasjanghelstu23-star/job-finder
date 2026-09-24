import { NextRequest, NextResponse } from "next/server";
import { getChannelMessages, sendMessage } from "@/lib/mock-db";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { searchParams } = new URL(req.url);
    const channelId = searchParams.get("channelId") || "chan-1";

    const messages = await getChannelMessages(channelId);

    return NextResponse.json({
      success: true,
      messages: messages.map((m) => ({
        id: m.id,
        author: m.senderName || "Alex Morgan",
        authorRole: "Student",
        authorRoleColor: "text-purple-400 bg-purple-950/60 border-purple-800",
        avatarBg: "bg-purple-600 text-white",
        avatarInitials: (m.senderName || "AM").slice(0, 2).toUpperCase(),
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
    const body = await req.json().catch(() => ({}));
    const { channelId, content, replyToId } = body;

    if (!channelId || !content) {
      return NextResponse.json(
        { success: false, error: "channelId and content are required" },
        { status: 400 }
      );
    }

    const newMsg = await sendMessage(channelId, "usr-student-1", content, "Alex Morgan");

    return NextResponse.json({
      success: true,
      message: {
        id: newMsg.id,
        author: newMsg.senderName,
        authorRole: "Student",
        authorRoleColor: "text-fuchsia-400 bg-fuchsia-950/60 border-fuchsia-800",
        avatarBg: "bg-fuchsia-600 text-white",
        avatarInitials: "AM",
        timestamp: "Just now",
        content: newMsg.content,
        replyToId: replyToId || null,
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
