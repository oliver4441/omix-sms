import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { auth } from "@/lib/auth";

const updateBookSchema = z.object({
  title: z.string().min(1).optional(),
  author: z.string().min(1).optional(),
  isbn: z.string().optional(),
  publisher: z.string().optional(),
  year: z.number().int().optional(),
  quantity: z.number().int().positive().optional(),
  shelf: z.string().optional(),
  category: z.string().optional(),
});

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
    const body = await request.json();
    const data = updateBookSchema.parse(body);

    const existing = await prisma.libraryBook.findFirst({
      where: { id, ...(schoolId ? { schoolId } : {}) },
    });
    if (!existing) {
      return NextResponse.json({ error: "Book not found" }, { status: 404 });
    }

    const updateData: Record<string, unknown> = {};
    if (data.title !== undefined) updateData.title = data.title;
    if (data.author !== undefined) updateData.author = data.author;
    if (data.isbn !== undefined) updateData.isbn = data.isbn;
    if (data.publisher !== undefined) updateData.publisher = data.publisher;
    if (data.year !== undefined) updateData.year = data.year;
    if (data.shelf !== undefined) updateData.shelf = data.shelf;
    if (data.category !== undefined) updateData.category = data.category;

    if (data.quantity !== undefined) {
      const diff = data.quantity - existing.quantity;
      updateData.quantity = data.quantity;
      updateData.available = existing.available + diff;
      if ((updateData.available as number) < 0) {
        return NextResponse.json(
          { error: "Not enough available copies to reduce quantity" },
          { status: 400 }
        );
      }
    }

    const book = await prisma.libraryBook.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({ book });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation error", details: error.errors },
        { status: 400 }
      );
    }
    console.error("Error updating book:", error);
    return NextResponse.json(
      { error: "Failed to update book" },
      { status: 500 }
    );
  }
}

export async function DELETE(
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

    const existing = await prisma.libraryBook.findFirst({
      where: { id, ...(schoolId ? { schoolId } : {}) },
    });
    if (!existing) {
      return NextResponse.json({ error: "Book not found" }, { status: 404 });
    }

    await prisma.libraryBook.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting book:", error);
    return NextResponse.json(
      { error: "Failed to delete book" },
      { status: 500 }
    );
  }
}
