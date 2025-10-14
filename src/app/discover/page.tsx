// import Container from "@/components/container/Container";
// import BookCard from "@/components/discover/BookCard"; 
// import Link from "next/link";
// import { Suspense } from "react";

// export default async function DiscoverPage(props: {
//   searchParams: Promise<{ q?: string; page?: string }>;
// }) {
  
//   const searchParams = await props.searchParams;
//   const query = searchParams.q || "";
//   const page = Number(searchParams.page) || 1;

//   const res = await fetch(
//     `https://gutendex.com/books?${query ? `search=${encodeURIComponent(query)}&` : ""}page=${page}`,
//     {next:{
//       revalidate: 60*60*24
//     }}
//   );

//   const data = await res.json();
//   const books = data.results || [];
//   const nextPage = data.next ? page + 1 : null;
//   const prevPage = data.previous ? page - 1 : null;

//   return (
//     <section className="min-h-screen w-full py-16 text-white bg-black">
//       <Container>
//         <div className="mb-10">
//           <h1 className="text-4xl font-semibold mb-2 text-lime-300">
//             Discover Books
//           </h1>
//           <p className="text-zinc-400">
//             Explore public-domain books from Project Gutenberg.
//           </p>
//         </div>

//         {/* Book Grid */}
//         {books.length > 0 ? (
//           <Suspense fallback={<p className="text-zinc-500">Loading books...</p>}>
            
//                 <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-8 px-4">
//                   {books.map((book: any) => (
//                     <Link key={book.id} href={`${process.env.NEXT_PUBLIC_API_URL}/book/${book.id}`}>
//                         <BookCard  book={book} />
//                     </Link>
//                   ))}
//                 </div>
            
//           </Suspense>
//         ) : (
//           <p className="text-zinc-400">No books found for “{query}”.</p>
//         )}

//         {/* Pagination */}
//         <div className="flex justify-center items-center gap-6 mt-12">
//           {prevPage && (
//             <Link
//               href={`/discover?q=${query}&page=${prevPage}`}
//               className="px-4 py-2 rounded-lg bg-zinc-900 border border-zinc-700 text-zinc-300 hover:text-lime-300 hover:border-lime-300 transition-all"
//             >
//               ← Previous
//             </Link>
//           )}

//           <span className="text-zinc-400">Page {page}</span>

//           {nextPage && (
//             <Link
//               href={`/discover?q=${query}&page=${nextPage}`}
//               className="px-4 py-2 rounded-lg bg-zinc-900 border border-zinc-700 text-zinc-300 hover:text-lime-300 hover:border-lime-300 transition-all"
//             >
//               Next →
//             </Link>
//           )}
//         </div>
//       </Container>
//     </section>
//   );
// }


// app/discover/page.tsx
import Container from "@/components/container/Container";
import DiscoverClient from "@/components/discover/DiscoverClient";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import { authClient } from "@/lib/auth-client";




export default async function DiscoverPage() {
  const session = await authClient.getSession({fetchOptions:{headers:await headers()}});
  
  let userId: string | null = null;

  if ("data" in session && session.data?.user) {
  userId = session.data.user.id;
  }

  let userCollections: string[] = [];
  if (userId) {
    const collections = await prisma.collection.findMany({
      where: { userId },
      select: { bookId: true },
    });
    userCollections = collections.map(c => c.bookId);
  }

  return (
    <section className="min-h-screen w-full py-16 text-white bg-black">
      <Container>
        

        <DiscoverClient
          
          userCollections={userCollections}
          
        />
      </Container>
    </section>
  );
}
