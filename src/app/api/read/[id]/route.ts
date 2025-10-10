import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const res = await fetch(`https://gutendex.com/books/${params.id}`);
    const book = await res.json();

    const textUrl =
      book.formats["text/plain; charset=us-ascii"] ||
      book.formats["text/plain"] ||
      book.formats["text/html"];

    if (!textUrl)
      return NextResponse.json({ error: "No readable format found" }, { status: 404 });

    
    const textRes = await fetch(textUrl);
    const content = await textRes.text();

    return NextResponse.json({ book, content });
  } catch (error) {
    console.error("Proxy fetch failed:", error);
    return NextResponse.json({ error: "Failed to load book" }, { status: 500 });
  }
}
