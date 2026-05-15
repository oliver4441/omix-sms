import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const schoolId = (session.user as any).schoolId;
    const where: Record<string, unknown> = {};
    if (schoolId) where.schoolId = schoolId;

    const [upcomingMeetings, totalMinutes, newSuggestions, boardMembers] =
      await Promise.all([
        prisma.boardMeeting.count({
          where: { ...where, status: { in: ["scheduled", "ongoing"] } },
        }),
        prisma.meetingMinute.count({ where }),
        prisma.boardSuggestion.count({
          where: { ...where, status: "submitted" },
        }),
        prisma.boardMember.count({ where: { ...where, isActive: true } }),
      ]);

    return NextResponse.json({
      upcomingMeetings,
      totalMinutes,
      newSuggestions,
      boardMembers,
    });
  } catch (error) {
    console.error("Error fetching board stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch board stats" },
      { status: 500 }
    );
  }
}
