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

    const [totalBooks, availableBooks, checkedOut, overdueCount, activeCheckouts] =
      await Promise.all([
        prisma.libraryBook.aggregate({
          where,
          _sum: { quantity: true },
        }),
        prisma.libraryBook.aggregate({
          where,
          _sum: { available: true },
        }),
        prisma.bookCheckout.count({
          where: { ...where, status: { not: "returned" } },
        }),
        prisma.bookCheckout.count({
          where: { ...where, status: "overdue" },
        }),
        prisma.bookCheckout.count({
          where: { ...where, status: "active" },
        }),
      ]);

    return NextResponse.json({
      totalBooks: totalBooks._sum.quantity || 0,
      availableBooks: availableBooks._sum.available || 0,
      checkedOut,
      overdueCount,
      activeCheckouts,
    });
  } catch (error) {
    console.error("Error fetching library stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch library stats" },
      { status: 500 }
    );
  }
}
