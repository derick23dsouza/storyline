import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// PATCH /api/collection/updateProgress
export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const { userId, bookId, progress, lastPage } = body;

    if (!userId || !bookId) {
      return NextResponse.json({ error: "Missing userId or bookId" }, { status: 400 });
    }

    // Update collection entry
    const updatedCollection = await prisma.collection.updateMany({
      where: {
        userId,
        bookId,
      },
      data: {
        progress: progress ?? undefined,
        lastPage: lastPage ?? undefined,
        updatedAt: new Date(),
      },
    });

    return NextResponse.json({ success: true, updatedCollection });
  } catch (err: any) {
    console.error("Failed to update progress:", err);
    return NextResponse.json({ error: err.message || "Unknown error" }, { status: 500 });
  }
}
