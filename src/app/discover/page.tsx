import Container from "@/components/container/Container";
import DiscoverClient from "@/components/discover/DiscoverClient";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import { authClient } from "@/lib/auth-client";

// ✅ Prevent this page from being fully dynamic
export const dynamic = "force-static";
export const revalidate = 0;

export default async function DiscoverPage() {
  const session = await authClient.getSession({
    fetchOptions: { headers: await headers() },
  });

  let userId: string | null = null;

  if ("data" in session && session.data?.user) {
    userId = session.data.user.id;
  }

  let userCollections: string[] = [];

  if (userId) {
    try {
      const collections = await prisma.collection.findMany({
        where: { userId },
        select: { bookId: true },
      });
      userCollections = collections.map((c) => c.bookId);
    } catch (err) {
      console.error("Error fetching user collections:", err);
    }
  }

  return (
    <section className="min-h-screen w-full py-16 text-white bg-black">
      <Container>
        <DiscoverClient userCollections={userCollections} />
      </Container>
    </section>
  );
}
