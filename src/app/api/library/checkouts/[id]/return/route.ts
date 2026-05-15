import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const schoolId = (session.user as any).schoolId;
    const { id } = await params;

    const existing = await prisma.bookCheckout.findFirst({
      where: { id, ...(schoolId ? { schoolId } : {}) },
    });
    if (!existing) {
      return NextResponse.json(
        { error: "Checkout not found" },
        { status: 404 }
      );
    }
    if (existing.status === "returned") {
      return NextResponse.json(
        { error: "Book already returned" },
        { status: 400 }
      );
    }

    const result = await prisma.$transaction(async (tx) => {
      const checkout = await tx.bookCheckout.update({
        where: { id },
        data: {
          returnDate: new Date(),
          status: "returned",
        },
      });

      await tx.libraryBook.update({
        where: { id: existing.bookId },
        data: { available: { increment: 1 } },
      });

      return checkout;
    });

    return NextResponse.json({ checkout: result });
  } catch (error) {
    console.error("Error returning book:", error);
    return NextResponse.json(
      { error: "Failed to return book" },
      { status: 500 }
    );
  }
}
