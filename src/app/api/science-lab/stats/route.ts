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

    const [totalAgg, lowStockItems] = await Promise.all([
      prisma.scienceApparatus.aggregate({
        where,
        _sum: {
          totalQuantity: true,
          available: true,
          broken: true,
          lost: true,
        },
        _count: { id: true },
      }),
      prisma.scienceApparatus.findMany({
        where: { ...where, available: { lt: 3 } },
        select: { id: true, name: true, available: true, totalQuantity: true },
        orderBy: { available: "asc" },
      }),
    ]);

    return NextResponse.json({
      totalApparatus: totalAgg._count.id,
      totalAvailable: totalAgg._sum.available || 0,
      totalBroken: totalAgg._sum.broken || 0,
      totalLost: totalAgg._sum.lost || 0,
      lowStockItems,
    });
  } catch (error) {
    console.error("Error fetching lab stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch lab stats" },
      { status: 500 }
    );
  }
}
