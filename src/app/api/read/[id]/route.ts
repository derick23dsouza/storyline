// app/api/read/[id]/route.ts (Next 13 app router)
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = req.nextUrl.pathname.split("/").pop();

  if (!id) {
    return NextResponse.json({ error: "Missing book ID" }, { status: 400 });
  }

  try {
    // Try the most common Gutenberg text formats
    const urls = [
      `https://www.gutenberg.org/files/${id}/${id}-0.txt`,
      `https://www.gutenberg.org/files/${id}/${id}-8.txt`,
      `https://www.gutenberg.org/files/${id}/${id}.txt`,
    ];

    let content: string | null = null;
    for (const url of urls) {
      const res = await fetch(url);
      if (res.ok) {
        content = await res.text();
        break;
      }
    }

    if (!content) {
      return NextResponse.json({ error: "Book not found" }, { status: 404 });
    }

    return NextResponse.json({
      book: { id },
      content,
    });
  } catch (err: any) {
    console.error("API error:", err);
    return NextResponse.json(
      { error: err.message || "Server error" },
      { status: 500 }
    );
  }
}
