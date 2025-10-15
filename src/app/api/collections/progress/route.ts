import { prisma } from "@/lib/prisma";

import { auth } from "@/lib/auth";

export async function POST(req: Request) {
  const session = await auth.api.getSession({headers:req.headers});
  if (!session?.user?.id) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
  }

  const body = await req.json();
  const { bookId, lastPage, progress } = body;

  if (!bookId) {
    return new Response(JSON.stringify({ error: "Missing bookId" }), { status: 400 });
  }

  try {
    const updated = await prisma.collection.updateMany({
      where: {
        userId: session.user.id,
        bookId: bookId,
      },
      data: {
        lastPage,
        progress,
      },
    });

    if (updated.count === 0) {
      return new Response(JSON.stringify({ error: "Book not in library" }), { status: 404 });
    }

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (err) {
    console.error("Error updating progress:", err);
    return new Response(JSON.stringify({ error: "Failed to update progress" }), { status: 500 });
  }
}
