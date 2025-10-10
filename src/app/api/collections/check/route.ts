import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const bookId = searchParams.get("bookId");

    // 🔹 1. Ensure bookId is provided
    if (!bookId) {
      return NextResponse.json({ error: "Missing bookId" }, { status: 400 });
    }

    // 🔹 2. Get user session from BetterAuth
    const session = await auth.api.getSession({ headers: req.headers });

    // 🔹 3. If not logged in → treat as not in collection
    if (!session?.user?.id) {
      return NextResponse.json({ exists: false }, { status: 200 });
    }

    // 🔹 4. Check if book exists in user's collection
    const existingEntry = await prisma.collection.findFirst({
      where: {
        userId: session.user.id,
        bookId: bookId,
      },
    });

    // 🔹 5. Respond with boolean
    return NextResponse.json({ exists: !!existingEntry }, { status: 200 });
  } catch (error) {
    console.error("Error checking collection:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
