import { NextRequest, NextResponse } from "next/server";
import { getCommunityById, joinCommunity } from "@/lib/mock-db";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json().catch(() => ({}));
    const { join } = body;

    const community = await getCommunityById(id);

    if (!community) {
      return NextResponse.json(
        { success: false, error: "Community not found" },
        { status: 404 }
      );
    }

    if (join !== false) {
      await joinCommunity(id, "usr-student-1");
    }

    return NextResponse.json({
      success: true,
      communityId: id,
      isJoined: typeof join === "boolean" ? join : true,
      message: join ? `Joined ${community.name}` : `Left ${community.name}`,
    });
  } catch (error) {
    console.error("Error toggling community join:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update membership" },
      { status: 500 }
    );
  }
}
