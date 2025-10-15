import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }>  }
) {
  try {
    const session = await auth.api.getSession({ headers: req.headers });
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // const { params } = await context;

    // const bookId = ( await params).id;
    const { id: bookId } = await context.params;

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





export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }>  }
) {
  const session = await auth.api.getSession({headers:req.headers})
  if (!session?.user?.id) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
  }

  const { id: bookId } = await context.params;

  try {
    const collection = await prisma.collection.findFirst({
      where: {
        userId: session.user.id,
        bookId: bookId, // assuming this is a string column in your schema
      },
      select: {
        id: true,
        bookId: true,
        lastPage: true,
        progress: true,
      },
    });

    if (!collection) {
      return new Response(JSON.stringify({ inLibrary: false }), { status: 200 });
    }

    return new Response(
      JSON.stringify({ inLibrary: true, ...collection }),
      { status: 200 }
    );
  } catch (err) {
    console.error("Error fetching collection:", err);
    return new Response(JSON.stringify({ error: "Failed to fetch progress" }), { status: 500 });
  }
}


