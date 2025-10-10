import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import {prisma} from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const session = await auth.api.getSession({ headers: req.headers });

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id, title, author, cover, category } = await req.json();

    
    const bookId = String(id);

    // Check if book already exists in DB
    let book = await prisma.book.findUnique({ where: { id: bookId } });

    if (!book) {
      book = await prisma.book.create({
        data: { id: bookId, title, author, cover, category },
      });
    }

    // Check if already added
    const existing = await prisma.collection.findFirst({
      where: {
        userId: session.user.id,
        bookId: book.id,
      },
    });

    if (existing) {
      return NextResponse.json(
        { message: "Already in your library" },
        { status: 200 }
      );
    }

    await prisma.collection.create({
      data: {
        userId: session.user.id,
        bookId: book.id,
      },
    });

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    console.error("Add to library failed:", error);
    return NextResponse.json(
      { error: "Failed to add to library" },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  try {
    const session = await auth.api.getSession({ headers: req.headers });

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const collections = await prisma.collection.findMany({
      where: { userId: session.user.id },
      include: { book: true },
      orderBy: { createdAt: "desc" },
    });

    // Always return valid JSON — even if empty
    return NextResponse.json(collections ?? [], { status: 200 });
  } catch (error) {
    console.error("Error fetching collections:", error);
    return NextResponse.json(
      { error: "Failed to fetch collections" },
      { status: 500 }
    );
  }
}

