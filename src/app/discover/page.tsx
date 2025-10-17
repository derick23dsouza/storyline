import Container from "@/components/container/Container";
import DiscoverClient from "@/components/discover/DiscoverClient";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";



export default async function DiscoverPage() {
  // const session = await authClient.getSession({
  //   fetchOptions: { headers: await headers() },
  // });

  const session= await auth.api.getSession({
    headers: await headers()
  })

  let userId: string | null = null;

  if (session){
    userId= session.user.id;
  }

  let userCollections: string[] = [];

  console.log(userId);

  if (userId) {
    try {
      const collections = await prisma.collection.findMany({
        where: { userId },
        select: { bookId: true },
      });
      userCollections = collections.map((c) => c.bookId);

      console.log(userCollections);
      console.log(userId);
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
