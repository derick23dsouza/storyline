import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// Handle POST /api/collections
export async function POST(req: Request) {
  try {
    //  Pass `req` to getSession
    const session = await auth.api.getSession({ headers: req.headers });

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;
    const { id, title, author, cover, category } = await req.json();

    if (!id || !title) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    //  Check if book already exists in DB
    let book = await prisma.book.findUnique({ where: { id } });
    if (!book) {
      book = await prisma.book.create({
        data: { id, title, author, cover, category },
      });
    }

    //  Prevent duplicate collection entries
    const existing = await prisma.collection.findFirst({
      where: { userId, bookId: id },
    });

    if (existing) {
      return NextResponse.json(
        { message: "Book already in your collection" },
        { status: 200 }
      );
    }

    //  Add to user's collection
    const collection = await prisma.collection.create({
      data: {
        userId,
        bookId: id,
        status: "reading",
        progress: 0,
      },
    });

    return NextResponse.json({ success: true, collection });
  } catch (error) {
    console.error("Add to collection error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
