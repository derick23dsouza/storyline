import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function DELETE(
  req: Request,
  context: { params: Promise<{ id: string }>  }
) {
  try {
    const session = await auth.api.getSession({ headers: req.headers });
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { params } = await context;

    const bookId = ( await params).id;

    const deleted = await prisma.collection.deleteMany({
      where: {
        userId: session.user.id,
        bookId,
      },
    });

    if (deleted.count === 0) {
      return NextResponse.json(
        { message: "Book not found in your library" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Remove from library failed:", error);
    return NextResponse.json(
      { error: "Failed to remove from library" },
      { status: 500 }
    );
  }
}
