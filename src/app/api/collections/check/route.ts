import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import {prisma} from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const bookId = searchParams.get("bookId");

    if (!bookId) {
      return NextResponse.json({ error: "Missing bookId" }, { status: 400 });
    }

    
    const session = await auth.api.getSession({ headers: req.headers });
    if (!session?.user?.id) {
      return NextResponse.json({ exists: false }, { status: 200 });
    }

    
    const exists = await prisma.collection.findFirst({
      where: {
        userId: session.user.id,
        bookId: String(bookId),
      },
    });

    return NextResponse.json({ exists: !!exists });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
